# Arsitektur Aplikasi & Teknologi

Dokumen ini menjelaskan gambaran umum arsitektur teknis aplikasi, pilihan *tech stack*, struktur repositori, dan alur pemrosesan data.

---

## 1. Pilihan Tech Stack (Rekomendasi Vibe Coding)

* **Framework Frontend/Backend:** Next.js (App Router, Server Actions)
* **Bahasa:** TypeScript
* **Styling & UI:** Tailwind CSS + Shadcn UI
* **Database & Auth:** Supabase (PostgreSQL + Auth RLS)
* **Data Visualization (Grafik):** Recharts
* **Excel Export:** `xlsx` (SheetJS)
* **Date Utilities:** `date-fns`

---

## 2. Struktur Repositori Project

```
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── parent/            # Area Dashboard Orang Tua
│   │   │   ├── children/
│   │   │   └── graphs/
│   │   └── staff/             # Area Dashboard Petugas/Posyandu
│   │       ├── balita/
│   │       ├── pemeriksaan/
│   │       └── laporan/
│   ├── api/                   # API Routes (jika dibutuhkan REST endpoint)
│   └── layout.tsx
├── components/
│   ├── ui/                    # Komponen Shadcn UI
│   ├── charts/                # Komponen Grafik Recharts (BB/U, TB/U)
│   └── forms/                 # Form Input Pengukuran & Balita
├── lib/
│   ├── supabase/              # Client & Server Supabase Instance
│   ├── logic/
│   │   ├── zscore-calculator.ts # Implementasi Logika dari LOGIC_STUNTING.md
│   │   └── who-tables/        # Data Lookup Tabel Standard WHO (.json)
│   └── utils.ts
├── types/
│   └── index.ts               # Type Definitions TypeScript
└── public/
    └── standards/             # File rujukan WHO
```

---

## 3. Alur Eksekusi Pemrosesan Pengukuran Balita

```
[Form Pengukuran (Client)]
       │
       ▼ (Submit Input Data)
[Server Action: saveMeasurement()]
       │
       ├─► 1. Hitung Usia Kronologis / Koreksi Prematur
       ├─► 2. Terapkan Koreksi Metode Ukur (+0.7 / -0.7 cm)
       ├─► 3. Ambil Median & SD dari JSON Table WHO
       ├─► 4. Kalkulasi Z-Score (TB/U, BB/U, BB/TB)
       ├─► 5. Evaluasi Risk Flag & Buat Action Advice
       │
       ▼ (Simpan Data & Transaksi DB)
[PostgreSQL Database (Supabase)]
       ├─► Insert into `growth_measurements`
       └─► Insert into `growth_assessments`
```

---

## 4. Strategi Pengujian & Keamanan Data (Security & Testing)

1. **Server-Side Authorization:** Otorisasi data tidak boleh hanya bergantung pada UI hiding. Setiap Server Action/API wajib memeriksa JWT claim dan `user_role`.
2. **Deterministic Calculator Test:** Fungsi `zscore-calculator.ts` wajib menyertakan Unit Test (Jest/Vitest) untuk memastikan kalkulasi Z-score 100% presisi sesuai tabel Kemenkes.