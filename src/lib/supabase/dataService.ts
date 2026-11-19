import { supabase } from "./client";
import { mockChildren, mockAnnouncements, Child, Announcement } from "@/lib/mockData";

/* ------------------------------------------------------------------ */
/* Tipe data baris dari Supabase                                        */
/* ------------------------------------------------------------------ */

// Hasil penilaian gizi (tabel growth_assessments)
interface SupabaseAssessment {
  z_score_tb_u?: number;
  z_score_bb_u?: number;
  z_score_bb_tb?: number;
  stunting_status?: "Normal" | "Pendek (Stunted)" | "Sangat Pendek" | "Tinggi";
  wasting_status?: "Gizi Baik (Normal)" | "Gizi Kurang" | "Gizi Buruk" | "Berisiko Gizi Lebih";
  risk_flag?: "NORMAL" | "NOTICE" | "MODERATE_RISK" | "HIGH_RISK" | "CRITICAL";
}

// Hasil pengukuran (tabel growth_measurements)
interface SupabaseMeasurement {
  id?: string;
  exam_date?: string;
  weight_kg?: number;
  height_cm?: number;
  head_circumference_cm?: number;
  lila_cm?: number;
  // Supabase bisa mengembalikan objek tunggal ATAU array, jadi dua-duanya diizinkan
  growth_assessments?: SupabaseAssessment | SupabaseAssessment[] | null;
}

// Satu baris balita (tabel children) beserta relasinya
interface SupabaseChildRow {
  id: string;
  child_name: string;
  nik?: string;
  gender: "L" | "P";
  birth_date: string;
  parent_id?: string;
  posyandu_id?: string;
  birth_weight_kg?: number;
  birth_height_cm?: number;
  is_prematur?: boolean;
  posyandus?: { name?: string };
  parent_profiles?: { full_name?: string };
  growth_measurements?: SupabaseMeasurement[];
}

interface SupabaseAnnouncementRow {
  id: string;
  title: string;
  category?: Announcement["category"];
  content: string;
  created_at?: string;
  event_date?: string;
  location?: string;
  is_important?: boolean;
}

/* ------------------------------------------------------------------ */
/* Data balita                                                          */
/* ------------------------------------------------------------------ */

/**
 * Mengambil daftar data balita dari Supabase.
 * Mock hanya dipakai kalau query ERROR, bukan kalau tabel kosong.
 */
export async function getChildrenList(): Promise<Child[]> {
  try {
    const { data, error } = await supabase
      .from("children")
      .select(`
        id,
        child_name,
        nik,
        gender,
        birth_date,
        parent_id,
        posyandu_id,
        birth_weight_kg,
        birth_height_cm,
        is_prematur,
        posyandus ( name ),
        parent_profiles ( full_name ),
        growth_measurements (
          id,
          exam_date,
          weight_kg,
          height_cm,
          head_circumference_cm,
          lila_cm,
          growth_assessments (
            z_score_tb_u,
            z_score_bb_u,
            z_score_bb_tb,
            stunting_status,
            wasting_status,
            risk_flag
          )
        )
      `)
      .order("created_at", { ascending: false });

    // Error nyata: tampilkan jelas di console, baru fallback ke mock
    if (error) {
      console.error("getChildrenList gagal, memakai data mock:", error.message);
      return mockChildren;
    }

    // Query sukses: pakai data asli, MESKIPUN kosong (tidak lagi diganti mock)
    const rows = (data ?? []) as unknown as SupabaseChildRow[];
    if (rows.length === 0) {
      console.warn("Tabel children kosong, atau pembacaannya diblokir RLS untuk akun ini.");
    }

    return rows.map((item) => {
      // Ambil pemeriksaan TERBARU berdasarkan exam_date (bukan sekadar elemen pertama)
      const latestExam = [...(item.growth_measurements ?? [])].sort((a, b) =>
        (b.exam_date ?? "").localeCompare(a.exam_date ?? "")
      )[0];

      // growth_assessments bisa datang sebagai objek atau array, samakan jadi satu objek
      const rawAssess = latestExam?.growth_assessments;
      const latestAssess = Array.isArray(rawAssess) ? rawAssess[0] : rawAssess;

      const birthDate = new Date(item.birth_date);
      const now = new Date();
      const ageMonths = Math.max(
        0,
        (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth())
      );

      return {
        id: item.id,
        name: item.child_name,
        nik: item.nik || "-",
        gender: item.gender,
        birthDate: item.birth_date,
        ageMonths,
        parentName: item.parent_profiles?.full_name || "Orang Tua",
        parentId: item.parent_id ?? "",
        posyandu: item.posyandus?.name || "Posyandu Melati 01",
        posyanduId: item.posyandu_id ?? "",
        lastExamDate: latestExam?.exam_date ?? item.birth_date,
        // ?? (bukan ||) supaya nilai 0 yang sah tidak dianggap kosong
        weight: latestExam?.weight_kg ?? item.birth_weight_kg ?? 0,
        height: latestExam?.height_cm ?? item.birth_height_cm ?? 0,
        headCircumference: latestExam?.head_circumference_cm,
        lila: latestExam?.lila_cm,
        zScoreTbU: latestAssess?.z_score_tb_u ?? 0,
        zScoreBbU: latestAssess?.z_score_bb_u ?? 0,
        zScoreBbTb: latestAssess?.z_score_bb_tb ?? 0,
        stuntingStatus: latestAssess?.stunting_status || "Normal",
        wastingStatus: latestAssess?.wasting_status || "Gizi Baik (Normal)",
        riskFlag: latestAssess?.risk_flag || "NORMAL",
        isPrematur: item.is_prematur,
      };
    });
  } catch (err) {
    console.error("getChildrenList error, memakai data mock:", err);
    return mockChildren;
  }
}

/**
 * Menambahkan data balita baru ke Supabase
 */
export async function createChildRecord(payload: {
  childName: string;
  nik?: string;
  birthDate: string;
  gender: "L" | "P";
  parentId: string;
  posyanduId: string;
  birthWeightKg?: number;
  birthHeightCm?: number;
  isPrematur?: boolean;
  gestationalAgeWeeks?: number;
}) {
  try {
    const { data, error } = await supabase
      .from("children")
      .insert({
        child_name: payload.childName,
        nik: payload.nik || null,
        birth_date: payload.birthDate,
        gender: payload.gender,
        parent_id: payload.parentId,
        posyandu_id: payload.posyanduId,
        birth_weight_kg: payload.birthWeightKg,
        birth_height_cm: payload.birthHeightCm,
        is_prematur: payload.isPrematur ?? false,
        gestational_age_weeks: payload.gestationalAgeWeeks ?? 40,
      })
      .select()
      .single();

    if (error) {
      console.warn("createChildRecord error:", error.message);
    }
    return data;
  } catch (err) {
    console.warn("createChildRecord catch error:", err);
    return null;
  }
}

/**
 * Mencatat hasil pengukuran antropometri & interpretasi Z-Score
 */
export async function recordMeasurement(payload: {
  childId: string;
  posyanduId: string;
  examDate: string;
  ageInMonths: number;
  weightKg: number;
  heightCm: number;
  measurementMethod: "terlentang" | "berdiri";
  headCircumferenceCm?: number;
  lilaCm?: number;
  notes?: string;
  recordedBy?: string;
  assessment: {
    zScoreTbU: number;
    zScoreBbU: number;
    zScoreBbTb: number;
    stuntingStatus: string;
    wastingStatus: string;
    riskFlag: "NORMAL" | "NOTICE" | "MODERATE_RISK" | "HIGH_RISK" | "CRITICAL";
    actionAdvice: string;
  };
}) {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = payload.recordedBy || authData.user?.id;

    if (!userId) return null;

    // 1. Insert Measurement
    const { data: measurement, error: mError } = await supabase
      .from("growth_measurements")
      .insert({
        child_id: payload.childId,
        posyandu_id: payload.posyanduId,
        exam_date: payload.examDate,
        age_in_months: payload.ageInMonths,
        weight_kg: payload.weightKg,
        height_cm: payload.heightCm,
        measurement_method: payload.measurementMethod,
        head_circumference_cm: payload.headCircumferenceCm,
        lila_cm: payload.lilaCm,
        notes: payload.notes,
        recorded_by: userId,
        status: "validated",
      })
      .select()
      .single();

    if (mError || !measurement) {
      throw mError || new Error("Failed to create measurement");
    }

    // 2. Insert Assessment (error sekarang dicek, tidak lagi diam-diam hilang)
    const { error: aError } = await supabase.from("growth_assessments").insert({
      measurement_id: measurement.id,
      z_score_tb_u: payload.assessment.zScoreTbU,
      z_score_bb_u: payload.assessment.zScoreBbU,
      z_score_bb_tb: payload.assessment.zScoreBbTb,
      stunting_status: payload.assessment.stuntingStatus,
      wasting_status: payload.assessment.wastingStatus,
      risk_flag: payload.assessment.riskFlag,
      action_advice: payload.assessment.actionAdvice,
      algorithm_version: "WHO-2006-v1.0",
    });
    if (aError) throw aError; // masuk ke catch di bawah

    return measurement;
  } catch (err) {
    console.warn("recordMeasurement error:", err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Pengumuman                                                           */
/* ------------------------------------------------------------------ */

/**
 * Mengambil daftar pengumuman jadwal Posyandu
 */
export async function getAnnouncementsList(): Promise<Announcement[]> {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return (data as unknown as SupabaseAnnouncementRow[]).map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category || "Pemberitahuan",
        content: item.content,
        date: item.created_at ? item.created_at.split("T")[0] : "2026-11-01",
        eventDate: item.event_date,
        location: item.location || "Posyandu",
        publishedBy: "Petugas Posyandu",
        isImportant: item.is_important,
      }));
    }
  } catch (err) {
    console.warn("Fallback to mock announcements:", err);
  }

  return mockAnnouncements;
}

/* ------------------------------------------------------------------ */
/* Import massal (XLSX / CSV)                                           */
/* ------------------------------------------------------------------ */

export interface ImportResult {
  inserted: number;
  skippedDuplicates: number;
  measurementsSaved: number;
  warnings: string[];
}

/**
 * Mengirim hasil parse XLSX/CSV ke API route supaya disimpan ke Supabase.
 * Penyimpanan dilakukan di server (service role key tidak pernah sampai ke browser).
 */
export async function importChildrenBulk(rows: Child[]): Promise<ImportResult> {
  // Token sesi dipakai server untuk memastikan pengimpor adalah staff yang sudah login
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) {
    throw new Error(
      "Kamu belum login dengan akun Supabase asli (mode demo tidak punya sesi). Login ulang memakai akun staff yang terdaftar di Authentication > Users."
    );
  }

  const res = await fetch("/api/import-balita", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // Kirim hanya field yang dibutuhkan server
    body: JSON.stringify({
      rows: rows.map((c) => ({
        name: c.name,
        nik: c.nik,
        gender: c.gender,
        birthDate: c.birthDate,
        posyandu: c.posyandu,
        ageMonths: c.ageMonths,
        weight: c.weight,
        height: c.height,
        lastExamDate: c.lastExamDate,
        zScoreTbU: c.zScoreTbU,
        zScoreBbU: c.zScoreBbU,
        zScoreBbTb: c.zScoreBbTb,
        stuntingStatus: c.stuntingStatus,
        wastingStatus: c.wastingStatus,
        riskFlag: c.riskFlag,
      })),
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Import gagal (HTTP ${res.status})`);
  return json as ImportResult;
}