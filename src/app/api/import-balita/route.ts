// src/app/api/import-balita/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// ID Posyandu Melati 01 dari seed SQL. Dipakai bila nama posyandu di file tidak ada di tabel posyandus.
const DEFAULT_POSYANDU_ID = "11111111-1111-1111-1111-111111111111";
const CHUNK = 200; // jumlah baris per sekali insert
const MAX_ROWS = 2000; // batas pengaman

interface ImportRow {
  name: string;
  nik: string;
  gender: "L" | "P";
  birthDate: string;
  posyandu: string;
  ageMonths: number;
  weight: number;
  height: number;
  lastExamDate: string;
  zScoreTbU: number;
  zScoreBbU: number;
  zScoreBbTb: number;
  stuntingStatus: string;
  wastingStatus: string;
  riskFlag: string;
}

interface ExistingChild {
  nik: string | null;
  child_name: string;
  birth_date: string;
}

// Kunci pembanding duplikat: nama + tanggal lahir
const keyOf = (name: string, birthDate: string) =>
  `${name.trim().toLowerCase()}|${birthDate}`;

// NIK hanya disimpan kalau benar-benar angka 10-16 digit.
// Kode cadangan "REG-..." dari halaman import TIDAK disimpan (jadi null).
const cleanNik = (nik: string) => (/^\d{10,16}$/.test(String(nik ?? "").trim()) ? nik.trim() : null);

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// Supabase membatasi 1000 baris per request, jadi ambil bertahap
async function fetchAllChildren(admin: ReturnType<typeof getSupabaseAdmin>): Promise<ExistingChild[]> {
  const all: ExistingChild[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await admin
      .from("children")
      .select("nik, child_name, birth_date")
      .range(from, from + 999);
    if (error) throw new Error(`Gagal membaca data balita yang sudah ada: ${error.message}`);
    all.push(...((data ?? []) as ExistingChild[]));
    if (!data || data.length < 1000) break;
  }
  return all;
}

export async function POST(req: Request) {
  try {
    const admin = getSupabaseAdmin();

    // 1. Pastikan pemanggil sudah login dengan sesi Supabase yang valid
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) {
      return NextResponse.json(
        { error: "Belum login dengan akun Supabase asli. Login ulang memakai akun staff." },
        { status: 401 }
      );
    }
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Sesi login tidak valid atau sudah kedaluwarsa." }, { status: 401 });
    }
    const userId = userData.user.id;

    // 2. Hanya staff yang boleh import. ASUMSI: akun orang tua punya baris di parent_profiles
    //    dengan id = id user auth. Kalau kolomnya bernama lain (mis. user_id), ganti "id" di .eq()
    //    ATAU ganti blok ini dengan pengecekan role milikmu sendiri.
    //    Kalau pengecekan error, request DITOLAK (fail-closed), bukan diloloskan.
    const { data: parentRow, error: roleError } = await admin
      .from("parent_profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    if (roleError) {
      return NextResponse.json({ error: `Gagal memeriksa peran akun: ${roleError.message}` }, { status: 500 });
    }
    if (parentRow) {
      return NextResponse.json({ error: "Akun orang tua tidak boleh mengimpor data." }, { status: 403 });
    }

    // 3. Validasi isi request
    const body = await req.json();
    const rows: ImportRow[] = Array.isArray(body?.rows) ? body.rows : [];
    if (rows.length === 0) {
      return NextResponse.json({ error: "Tidak ada data untuk diimpor." }, { status: 400 });
    }
    if (rows.length > MAX_ROWS) {
      return NextResponse.json({ error: `Maksimal ${MAX_ROWS} baris per import.` }, { status: 400 });
    }

    // 4. Cocokkan nama posyandu di file dengan tabel posyandus
    const { data: posyandus, error: pError } = await admin.from("posyandus").select("id, name");
    if (pError) throw new Error(`Gagal membaca tabel posyandus: ${pError.message}`);
    const posyanduByName = new Map(
      (posyandus ?? []).map((p) => [String(p.name).trim().toLowerCase(), p.id as string])
    );
    const resolvePosyandu = (name: string) =>
      posyanduByName.get(String(name).trim().toLowerCase()) ?? DEFAULT_POSYANDU_ID;

    // 5. Buang duplikat (yang sudah ada di database & yang dobel di dalam file)
    const existing = await fetchAllChildren(admin);
    const seenNik = new Set(existing.map((c) => c.nik).filter(Boolean) as string[]);
    const seenKey = new Set(existing.map((c) => keyOf(c.child_name, c.birth_date)));

    const fresh: { row: ImportRow; posyanduId: string; nik: string | null }[] = [];
    let skippedDuplicates = 0;

    for (const row of rows) {
      const nik = cleanNik(row.nik);
      const key = keyOf(row.name, row.birthDate);
      if ((nik && seenNik.has(nik)) || seenKey.has(key)) {
        skippedDuplicates++;
        continue;
      }
      if (nik) seenNik.add(nik);
      seenKey.add(key);
      fresh.push({ row, posyanduId: resolvePosyandu(row.posyandu), nik });
    }

    // 6. Simpan balita
    //    parent_id = null karena file import tidak punya akun orang tua.
    const idByKey = new Map<string, string>();
    for (const part of chunk(fresh, CHUNK)) {
      const { data, error } = await admin
        .from("children")
        .insert(
          part.map(({ row, posyanduId, nik }) => ({
            child_name: row.name,
            nik,
            gender: row.gender,
            birth_date: row.birthDate,
            parent_id: null,
            posyandu_id: posyanduId,
            is_prematur: false,
          }))
        )
        .select("id, child_name, birth_date");
      if (error) throw new Error(`Gagal menyimpan data balita: ${error.message}`);
      for (const c of data ?? []) idByKey.set(keyOf(c.child_name, c.birth_date), c.id);
    }

    // 7. Simpan pengukuran + penilaian untuk baris yang punya BB & TB.
    //    Kegagalan di tahap ini hanya jadi peringatan, balitanya sudah tersimpan.
    const warnings: string[] = [];
    let measurementsSaved = 0;
    const today = new Date().toISOString().split("T")[0];

    const measurable = fresh
      .filter(({ row }) => row.weight > 0 && row.height > 0 && idByKey.has(keyOf(row.name, row.birthDate)))
      .map(({ row, posyanduId }) => ({
        row,
        posyanduId,
        childId: idByKey.get(keyOf(row.name, row.birthDate)) as string,
      }));

    for (const part of chunk(measurable, CHUNK)) {
      const { data: ms, error: mError } = await admin
        .from("growth_measurements")
        .insert(
          part.map(({ row, posyanduId, childId }) => ({
            child_id: childId,
            posyandu_id: posyanduId,
            exam_date: row.lastExamDate || today,
            age_in_months: row.ageMonths,
            weight_kg: row.weight,
            height_cm: row.height,
            measurement_method: row.ageMonths < 24 ? "terlentang" : "berdiri",
            recorded_by: userId,
            status: "validated",
          }))
        )
        .select("id, child_id");

      if (mError) {
        warnings.push(`Pengukuran gagal disimpan: ${mError.message}`);
        continue;
      }
      measurementsSaved += ms?.length ?? 0;

      const measurementByChild = new Map((ms ?? []).map((m) => [m.child_id, m.id]));
      const assessments = part.flatMap(({ row, childId }) => {
        const measurementId = measurementByChild.get(childId);
        return measurementId
          ? [
              {
                measurement_id: measurementId,
                z_score_tb_u: row.zScoreTbU,
                z_score_bb_u: row.zScoreBbU,
                z_score_bb_tb: row.zScoreBbTb,
                stunting_status: row.stuntingStatus,
                wasting_status: row.wastingStatus,
                risk_flag: row.riskFlag,
                action_advice: "Data hasil impor (estimasi sederhana). Perlu pengukuran ulang oleh petugas.",
                algorithm_version: "IMPORT-ESTIMASI-v1", // penanda: BUKAN hitungan Z-score WHO
              },
            ]
          : [];
      });

      const { error: aError } = await admin.from("growth_assessments").insert(assessments);
      if (aError) warnings.push(`Penilaian gizi gagal disimpan: ${aError.message}`);
    }

    return NextResponse.json({
      inserted: fresh.length,
      skippedDuplicates,
      measurementsSaved,
      warnings,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan di server.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}