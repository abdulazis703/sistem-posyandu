# Seed Data SQL (Mock Data Development)

Gunakan file SQL ini untuk mengisi data awal ke Supabase agar kamu bisa langsung mencoba UI Dashboard, Grafik Pertumbuhan, dan Deteksi Stunting tanpa input manual satu per satu.

```sql
-- 1. Insert Data Posyandu
INSERT INTO posyandus (id, name, address, village, district, regency, province)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Posyandu Mawar 01', 'Jl. Merdeka No. 12', 'Pemuda', 'Kecamatan Kota', 'Kabupaten Madiun', 'Jawa Timur');

-- 2. Insert Dummy User & Parent Profile (Orang Tua)
INSERT INTO users (id, email, phone, role)
VALUES ('22222222-2222-2222-2222-222222222222', 'ibu.siti@example.com', '081234567890', 'parent');

INSERT INTO parent_profiles (user_id, full_name, nik, address)
VALUES ('22222222-2222-2222-2222-222222222222', 'Siti Aminah', '3515012345670001', 'Jl. Merdeka No. 12');

-- 3. Insert Dummy User & Staff Profile (Petugas)
INSERT INTO users (id, email, phone, role)
VALUES ('33333333-3333-3333-3333-333333333333', 'kader.budi@example.com', '089876543210', 'staff');

INSERT INTO staff_profiles (user_id, full_name, posyandu_id, position)
VALUES ('33333333-3333-3333-3333-333333333333', 'Budi Santoso', '11111111-1111-1111-1111-111111111111', 'Kader Utama');

-- 4. Insert Data Balita (Contoh 2 Anak: Normal & Stunted)
-- Balita 1: Normal
INSERT INTO children (id, parent_id, posyandu_id, child_name, gender, birth_date, is_prematur)
VALUES 
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Aditya Pratama', 'L', '2025-05-10', false);

-- Balita 2: Indikasi Stunted
INSERT INTO children (id, parent_id, posyandu_id, child_name, gender, birth_date, is_prematur)
VALUES 
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Bina Putri', 'P', '2024-11-15', false);

-- 5. Insert Riwayat Pengukuran Balita Stunted (Bina Putri - Umur 24 Bulan)
INSERT INTO growth_measurements (id, child_id, posyandu_id, exam_date, age_in_months, weight_kg, height_cm, measurement_method, recorded_by)
VALUES 
('66666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '2026-11-01', 24, 9.1, 79.5, 'berdiri', '33333333-3333-3333-3333-333333333333');

INSERT INTO growth_assessments (measurement_id, z_score_tb_u, z_score_bb_u, z_score_bb_tb, stunting_status, wasting_status, risk_flag, action_advice)
VALUES 
('66666666-6666-6666-6666-666666666666', -2.45, -2.10, 0.05, 'Pendek (Stunted)', 'Gizi Baik (Normal)', 'MODERATE_RISK', 'Indikasi panjang/tinggi badan anak berada di bawah kurva pertumbuhan standar. Disarankan untuk berkonsultasi dengan petugas gizi Posyandu/Puskesmas.');
```