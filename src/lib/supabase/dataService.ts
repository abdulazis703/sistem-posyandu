import { supabase } from "./client";
import { mockAnnouncements, Child, Announcement, ExamRecord, Parent } from "@/lib/mockData";

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
  child_id?: string;
  exam_date?: string;
  age_in_months?: number;
  weight_kg?: number;
  height_cm?: number;
  measurement_method?: "terlentang" | "berdiri";
  head_circumference_cm?: number;
  lila_cm?: number;
  notes?: string;
  photo_url?: string | null;
  status?: "validated" | "draft" | "corrected";
  recorded_by?: string;
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
  posyandus?: { name?: string } | null;
  growth_measurements?: SupabaseMeasurement[];
}

interface SupabaseParentProfileRow {
  user_id: string;
  full_name?: string;
  nik?: string;
  address?: string;
  created_at?: string;
}

interface SupabaseParentUserRow {
  id: string;
  email?: string;
  phone?: string;
  role: "parent" | "staff" | "admin";
  is_active?: boolean;
  created_at?: string;
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

function mapChildRow(
  item: SupabaseChildRow,
  parentNameMap: Map<string, string>
): Child {
  // Ambil pemeriksaan TERBARU berdasarkan exam_date
  const latestExam = [...(item.growth_measurements ?? [])].sort((a, b) =>
    (b.exam_date ?? "").localeCompare(a.exam_date ?? "")
  )[0];

  const rawAssess = latestExam?.growth_assessments;
  const latestAssess = Array.isArray(rawAssess) ? rawAssess[0] : rawAssess;

  const birthDate = new Date(item.birth_date);
  const now = new Date();
  const ageMonths = Math.max(
    0,
    (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth())
  );

  const parentId = item.parent_id ?? "";
  const resolvedParentName = parentNameMap.get(parentId) || "Orang Tua";

  return {
    id: item.id,
    name: item.child_name,
    nik: item.nik || "-",
    gender: item.gender,
    birthDate: item.birth_date,
    ageMonths,
    parentName: resolvedParentName,
    parentId,
    posyandu: item.posyandus?.name || "Posyandu Melati 01",
    posyanduId: item.posyandu_id ?? "",
    lastExamDate: latestExam?.exam_date ?? item.birth_date,
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
}

/* ------------------------------------------------------------------ */
/* Data balita                                                          */
/* ------------------------------------------------------------------ */

/**
 * Mengambil daftar data balita aktual dari Supabase (tabel public.children).
 * Jika filter parentId diberikan, query wajib difilter dengan .eq('parent_id', parentId).
 * Tidak pernah mengembalikan data dummy/mock.
 */
export async function getChildrenList(options?: { parentId?: string }): Promise<Child[]> {
  try {
    let query = supabase
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

    if (options?.parentId) {
      query = query.eq("parent_id", options.parentId);
    }

    const parentProfilesQuery = options?.parentId
      ? supabase
          .from("parent_profiles")
          .select("user_id, full_name")
          .eq("user_id", options.parentId)
      : supabase.from("parent_profiles").select("user_id, full_name");

    const [{ data, error }, { data: profilesData }] = await Promise.all([
      query,
      parentProfilesQuery,
    ]);

    if (error) {
      console.error("getChildrenList error:", error.message);
      return [];
    }

    const parentNameMap = new Map<string, string>();
    ((profilesData ?? []) as SupabaseParentProfileRow[]).forEach((prof) => {
      if (prof.user_id && prof.full_name) {
        parentNameMap.set(prof.user_id, prof.full_name);
      }
    });

    const rows = (data ?? []) as unknown as SupabaseChildRow[];
    return rows.map((item) => mapChildRow(item, parentNameMap));
  } catch (err) {
    console.error("getChildrenList error:", err);
    return [];
  }
}

/**
 * Mengambil 1 data balita berdasarkan ID dari Supabase.
 */
export async function getChildById(childId: string): Promise<Child | null> {
  if (!childId) return null;
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
      .eq("id", childId)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("getChildById error:", error.message);
      return null;
    }

    const row = data as unknown as SupabaseChildRow;
    const parentNameMap = new Map<string, string>();
    if (row.parent_id) {
      const { data: prof } = await supabase
        .from("parent_profiles")
        .select("user_id, full_name")
        .eq("user_id", row.parent_id)
        .maybeSingle();
      if (prof?.user_id && prof.full_name) {
        parentNameMap.set(prof.user_id, prof.full_name);
      }
    }

    return mapChildRow(row, parentNameMap);
  } catch (err) {
    console.error("getChildById error:", err);
    return null;
  }
}

/**
 * Mengambil riwayat pemeriksaan aktual balita dari tabel growth_measurements & growth_assessments.
 */
export async function getChildExamRecords(
  childId: string,
  childMeta?: { name: string; parentName: string }
): Promise<ExamRecord[]> {
  if (!childId) return [];
  try {
    const baseColumns = `
        id,
        child_id,
        exam_date,
        age_in_months,
        weight_kg,
        height_cm,
        measurement_method,
        head_circumference_cm,
        lila_cm,
        status,
        recorded_by,
        notes,
        growth_assessments (
          z_score_tb_u,
          z_score_bb_u,
          z_score_bb_tb,
          stunting_status,
          wasting_status,
          risk_flag
        )
    `;

    let { data, error } = await supabase
      .from("growth_measurements")
      .select(`${baseColumns}, photo_url`)
      .eq("child_id", childId)
      .order("exam_date", { ascending: false });

    // Null-safe fallback jika kolom photo_url belum ditambahkan ke tabel growth_measurements
    if (error && error.message.toLowerCase().includes("photo_url")) {
      const retry = await supabase
        .from("growth_measurements")
        .select(baseColumns)
        .eq("child_id", childId)
        .order("exam_date", { ascending: false });
      data = retry.data as typeof data;
      error = retry.error;
    }

    if (error) {
      console.error("getChildExamRecords error:", error.message);
      return [];
    }

    const rows = (data ?? []) as unknown as SupabaseMeasurement[];

    // Resolve staff names for recorded_by if accessible
    const recorderIds = Array.from(
      new Set(rows.map((r) => r.recorded_by).filter((id): id is string => Boolean(id)))
    );
    const staffNameMap = new Map<string, string>();
    if (recorderIds.length > 0) {
      const { data: staffRows } = await supabase
        .from("staff_profiles")
        .select("user_id, full_name")
        .in("user_id", recorderIds);
      (staffRows ?? []).forEach((s: { user_id: string; full_name: string }) => {
        if (s.user_id && s.full_name) staffNameMap.set(s.user_id, s.full_name);
      });
    }

    return rows.map((m, idx) => {
      const rawAssess = m.growth_assessments;
      const assess = Array.isArray(rawAssess) ? rawAssess[0] : rawAssess;

      return {
        id: m.id || `exam-${childId}-${idx}`,
        childId,
        childName: childMeta?.name || "Balita",
        examDate: m.exam_date || "",
        ageMonths: m.age_in_months ?? 0,
        weight: m.weight_kg ?? 0,
        height: m.height_cm ?? 0,
        headCircumference: m.head_circumference_cm ?? undefined,
        lila: m.lila_cm ?? undefined,
        method: m.measurement_method || "terlentang",
        recordedBy: (m.recorded_by && staffNameMap.get(m.recorded_by)) || "Petugas Posyandu",
        companionName: childMeta?.parentName || "Orang Tua",
        companionRelation: "Orang Tua / Wali",
        zScoreTbU: assess?.z_score_tb_u ?? 0,
        zScoreBbU: assess?.z_score_bb_u ?? 0,
        zScoreBbTb: assess?.z_score_bb_tb ?? 0,
        stuntingStatus: assess?.stunting_status || "Normal",
        wastingStatus: assess?.wasting_status || "Gizi Baik (Normal)",
        riskFlag: assess?.risk_flag || "NORMAL",
        notes: m.notes || undefined,
        photoUrl: m.photo_url ?? null,
        status: m.status === "draft" ? "draft" : "validated",
      };
    });
  } catch (err) {
    console.error("getChildExamRecords error:", err);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Akun Orang Tua (untuk Portal Kader /staff/orang-tua)                 */
/* ------------------------------------------------------------------ */

/**
 * Mengambil seluruh akun orang tua aktual dari public.users (role = 'parent') + parent_profiles,
 * lalu menghitung jumlah balita masing-masing berdasarkan children.parent_id === user.id.
 */
export async function getParentAccountsList(): Promise<Parent[]> {
  try {
    const [usersRes, profilesRes, childrenList] = await Promise.all([
      supabase
        .from("users")
        .select("id, email, phone, role, is_active, created_at")
        .eq("role", "parent")
        .order("created_at", { ascending: false }),
      supabase
        .from("parent_profiles")
        .select("user_id, full_name, nik, address, created_at"),
      getChildrenList(),
    ]);

    if (usersRes.error) {
      console.error("getParentAccountsList error:", usersRes.error.message);
      return [];
    }

    const users = (usersRes.data ?? []) as SupabaseParentUserRow[];
    const profiles = (profilesRes.data ?? []) as SupabaseParentProfileRow[];
    const profileMap = new Map<string, SupabaseParentProfileRow>();
    profiles.forEach((p) => {
      if (p.user_id) profileMap.set(p.user_id, p);
    });

    return users.map((u) => {
      const prof = profileMap.get(u.id);
      const userChildren = childrenList.filter((c) => c.parentId === u.id);
      const displayName =
        prof?.full_name || u.email?.split("@")[0] || "Orang Tua";
      const mainPosyandu =
        userChildren[0]?.posyandu || "Posyandu Melati 01";

      return {
        id: u.id,
        name: displayName,
        roleInFamily: "Wali",
        phone: u.phone || "-",
        email: u.email || "-",
        nik: prof?.nik || "-",
        address: prof?.address || "-",
        posyandu: mainPosyandu,
        childrenCount: userChildren.length,
        children: userChildren.map((ch) => ({
          id: ch.id,
          name: ch.name,
          age: `${ch.ageMonths} Bulan`,
          status: ch.stuntingStatus,
        })),
        joinDate: (prof?.created_at || u.created_at || "").split("T")[0] || "-",
      };
    });
  } catch (err) {
    console.error("getParentAccountsList error:", err);
    return [];
  }
}

/**
 * Mengambil detail 1 akun orang tua berdasarkan UUID user dari Supabase beserta daftar balitanya.
 */
export async function getParentAccountById(
  parentUserId: string
): Promise<{ parent: Parent | null; children: Child[] }> {
  if (!parentUserId) return { parent: null, children: [] };
  try {
    const [userRes, profRes, childrenList] = await Promise.all([
      supabase
        .from("users")
        .select("id, email, phone, role, is_active, created_at")
        .eq("id", parentUserId)
        .maybeSingle(),
      supabase
        .from("parent_profiles")
        .select("user_id, full_name, nik, address, created_at")
        .eq("user_id", parentUserId)
        .maybeSingle(),
      getChildrenList({ parentId: parentUserId }),
    ]);

    if (userRes.error || !userRes.data) {
      if (userRes.error) console.error("getParentAccountById error:", userRes.error.message);
      return { parent: null, children: [] };
    }

    const u = userRes.data as SupabaseParentUserRow;
    const prof = profRes.data as SupabaseParentProfileRow | null;
    const displayName =
      prof?.full_name || u.email?.split("@")[0] || "Orang Tua";

    const parent: Parent = {
      id: u.id,
      name: displayName,
      roleInFamily: "Wali",
      phone: u.phone || "-",
      email: u.email || "-",
      nik: prof?.nik || "-",
      address: prof?.address || "-",
      posyandu: childrenList[0]?.posyandu || "Posyandu Melati 01",
      childrenCount: childrenList.length,
      children: childrenList.map((ch) => ({
        id: ch.id,
        name: ch.name,
        age: `${ch.ageMonths} Bulan`,
        status: ch.stuntingStatus,
      })),
      joinDate: (prof?.created_at || u.created_at || "").split("T")[0] || "-",
    };

    return { parent, children: childrenList };
  } catch (err) {
    console.error("getParentAccountById error:", err);
    return { parent: null, children: [] };
  }
}

/**
 * Memperbarui profil orang tua pada tabel parent_profiles & users.
 */
export async function updateParentProfile(
  userId: string,
  payload: { fullName: string; nik: string; phone: string; address: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: existingProf } = await supabase
      .from("parent_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingProf) {
      const { error: profErr } = await supabase
        .from("parent_profiles")
        .update({
          full_name: payload.fullName.trim(),
          nik: payload.nik.trim() || null,
          address: payload.address.trim() || null,
        })
        .eq("user_id", userId);
      if (profErr) return { success: false, error: profErr.message };
    } else {
      const { error: insertErr } = await supabase
        .from("parent_profiles")
        .insert({
          user_id: userId,
          full_name: payload.fullName.trim(),
          nik: payload.nik.trim() || null,
          address: payload.address.trim() || null,
        });
      if (insertErr) return { success: false, error: insertErr.message };
    }

    if (payload.phone.trim()) {
      const { error: userErr } = await supabase
        .from("users")
        .update({ phone: payload.phone.trim() })
        .eq("id", userId);
      if (userErr) return { success: false, error: userErr.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal menyimpan profil.",
    };
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
 * Mengunggah foto pemeriksaan balita ke Supabase Storage (bucket: examination-photos).
 * Jika bucket belum tersedia / upload gagal, mengembalikan warning informatif tanpa melempar error
 * agar penyimpanan angka antropometri tetap berjalan.
 */
export async function uploadExaminationPhoto(
  childId: string,
  fileBlob: Blob
): Promise<{ publicUrl: string | null; warning?: string }> {
  try {
    const filePath = `${childId}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("examination-photos")
      .upload(filePath, fileBlob, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      const msg = uploadError.message || "Gagal mengunggah foto.";
      return {
        publicUrl: null,
        warning: msg.toLowerCase().includes("bucket")
          ? 'Bucket penyimpanan "examination-photos" belum tersedia di Supabase Storage. Data angka antropometri tetap disimpan.'
          : `Foto gagal diunggah (${msg}). Data angka antropometri tetap disimpan.`,
      };
    }

    const { data: urlData } = supabase.storage
      .from("examination-photos")
      .getPublicUrl(filePath);

    return { publicUrl: urlData?.publicUrl || null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Kesalahan jaringan saat unggah foto";
    return {
      publicUrl: null,
      warning: `Foto gagal diunggah (${msg}). Data angka antropometri tetap disimpan.`,
    };
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
  photoUrl?: string | null;
  status?: "validated" | "draft";
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
}): Promise<{ measurement: Record<string, unknown> | null; photoWarning?: string; error?: string }> {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = payload.recordedBy || authData.user?.id;

    if (!userId) {
      return { measurement: null, error: "Sesi petugas tidak ditemukan." };
    }

    const baseRow = {
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
      status: payload.status || "validated",
    };

    let photoWarning: string | undefined;

    // 1. Insert Measurement (coba sertakan photo_url jika ada, fallback aman bila kolom belum ada)
    const initialRow = payload.photoUrl
      ? { ...baseRow, photo_url: payload.photoUrl }
      : baseRow;

    let { data: measurement, error: mError } = await supabase
      .from("growth_measurements")
      .insert(initialRow)
      .select()
      .single();

    if (mError && payload.photoUrl && mError.message.toLowerCase().includes("photo_url")) {
      photoWarning =
        'Kolom "photo_url" belum ditambahkan pada tabel growth_measurements. Data angka antropometri tetap tersimpan.';
      const retry = await supabase
        .from("growth_measurements")
        .insert(baseRow)
        .select()
        .single();
      measurement = retry.data;
      mError = retry.error;
    }

    if (mError || !measurement) {
      throw mError || new Error("Failed to create measurement");
    }

    // 2. Insert Assessment
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
    if (aError) throw aError;

    return { measurement: measurement as Record<string, unknown>, photoWarning };
  } catch (err) {
    console.warn("recordMeasurement error:", err);
    return {
      measurement: null,
      error: err instanceof Error ? err.message : "Gagal menyimpan pemeriksaan.",
    };
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
 */
export async function importChildrenBulk(rows: Child[]): Promise<ImportResult> {
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
