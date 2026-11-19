# Spesifikasi API & Server Actions

Dokumen ini menjelaskan daftar kontrak interface API/Server Actions utama yang digunakan oleh frontend.

---

## 1. Modul Balita (Children Management)

### `createChild(payload: CreateChildDTO)`
* **Akses:** Petugas (`staff`, `admin`)
* **Deskripsi:** Menambahkan data balita baru dan mengaitkannya secara langsung ke akun orang tua.

**Input Payload:**
```json
{
  "parent_id": "uuid-user-parent",
  "posyandu_id": "uuid-posyandu",
  "child_name": "Ahmad Rayhan",
  "nik": "3515012345670001",
  "gender": "L",
  "birth_date": "2024-05-12",
  "birth_weight_kg": 3.2,
  "birth_height_cm": 49.0,
  "is_prematur": false,
  "gestational_age_weeks": 40
}
```

---

## 2. Modul Pengukuran (Growth Measurement & Assessment)

### `submitMeasurement(payload: MeasurementDTO)`
* **Akses:** Petugas (`staff`)
* **Deskripsi:** Mencatat data pengukuran baru, otomatis menghitung Z-Score dan menyimpan hasil interpretasi stunting.

**Input Payload:**
```json
{
  "child_id": "uuid-child",
  "posyandu_id": "uuid-posyandu",
  "exam_date": "2026-11-03",
  "weight_kg": 9.5,
  "height_cm": 78.2,
  "measurement_method": "terlentang",
  "head_circumference_cm": 44.5,
  "lila_cm": 13.0,
  "notes": "Anak sehat, nafsu makan baik."
}
```

**Output Response (Success):**
```json
{
  "success": true,
  "measurement_id": "uuid-measurement",
  "assessment": {
    "age_in_months": 18,
    "z_score_tb_u": -2.35,
    "stunting_status": "Pendek (Stunted)",
    "z_score_bb_tb": 0.12,
    "wasting_status": "Gizi Baik (Normal)",
    "risk_flag": "MODERATE_RISK",
    "action_advice": "Indikasi panjang/tinggi badan anak berada di bawah kurva pertumbuhan standar. Disarankan untuk berkonsultasi dengan petugas gizi Posyandu/Puskesmas."
  }
}
```

---

## 3. Modul Laporan & Rekapitulasi (Reports)

### `exportMonthlyReport(posyandu_id: string, month: number, year: number)`
* **Akses:** Petugas (`staff`, `admin`)
* **Deskripsi:** Mengembalikan stream data file `.xlsx` berisi rekapitulasi penimbangan bulanan Posyandu.