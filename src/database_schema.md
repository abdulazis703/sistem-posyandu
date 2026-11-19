# Definisi Skema Database (Supabase / PostgreSQL)

Dokumen ini berisi struktur tabel, tipe data, relasi, serta batasan akses keamanan berbasis *Row Level Security* (RLS).

---

## 1. Diagram Relasi Entitas (ERD Overview)

```
[users] 
  ├── [parent_profiles] ────< [children] ────< [growth_measurements] ────< [growth_assessments]
  └── [staff_profiles]        │                     │
                              └───> [posyandus] <───┘
                                        │
                               [vaccine_records]
```

---

## 2. Struktur Tabel SQL

```sql
-- Enums
CREATE TYPE user_role AS ENUM ('parent', 'staff', 'admin');
CREATE TYPE gender_type AS ENUM ('L', 'P');
CREATE TYPE measurement_method AS ENUM ('terlentang', 'berdiri');
CREATE TYPE record_status AS ENUM ('draft', 'validated', 'corrected');
CREATE TYPE risk_level AS ENUM ('NORMAL', 'NOTICE', 'MODERATE_RISK', 'HIGH_RISK', 'CRITICAL');

-- 1. Table: Users (Sync dengan Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    role user_role NOT NULL DEFAULT 'parent',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: Posyandu & Wilayah
CREATE TABLE posyandus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    address TEXT,
    rt_rw VARCHAR(10),
    village VARCHAR(100) NOT NULL,    -- Desa/Kelurahan
    district VARCHAR(100) NOT NULL,   -- Kecamatan
    regency VARCHAR(100) NOT NULL,    -- Kabupaten/Kota
    province VARCHAR(100) NOT NULL DEFAULT 'Jawa Timur',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: Parent Profiles
CREATE TABLE parent_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    nik VARCHAR(16) UNIQUE,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table: Staff Profiles & Access
CREATE TABLE staff_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    posyandu_id UUID REFERENCES posyandus(id) ON DELETE SET NULL,
    position VARCHAR(50) DEFAULT 'Kader',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table: Children (Data Balita)
CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    posyandu_id UUID NOT NULL REFERENCES posyandus(id) ON DELETE RESTRICT,
    nik VARCHAR(16) UNIQUE,
    child_name VARCHAR(150) NOT NULL,
    gender gender_type NOT NULL,
    birth_date DATE NOT NULL,
    birth_weight_kg NUMERIC(4,2),
    birth_height_cm NUMERIC(4,1),
    is_prematur BOOLEAN DEFAULT false,
    gestational_age_weeks INT DEFAULT 40,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table: Growth Measurements (Pemeriksaan)
CREATE TABLE growth_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    posyandu_id UUID NOT NULL REFERENCES posyandus(id),
    exam_date DATE NOT NULL,
    age_in_months INT NOT NULL,
    weight_kg NUMERIC(4,2) NOT NULL,
    height_cm NUMERIC(4,1) NOT NULL,
    measurement_method measurement_method NOT NULL,
    head_circumference_cm NUMERIC(4,1),
    lila_cm NUMERIC(4,1),
    status record_status DEFAULT 'validated',
    recorded_by UUID NOT NULL REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Table: Growth Assessments (Hasil Interpretasi Medis)
CREATE TABLE growth_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    measurement_id UUID NOT NULL REFERENCES growth_measurements(id) ON DELETE CASCADE,
    z_score_tb_u NUMERIC(4,2),
    z_score_bb_u NUMERIC(4,2),
    z_score_bb_tb NUMERIC(4,2),
    stunting_status VARCHAR(50) NOT NULL, -- Sangat Pendek, Pendek, Normal, Tinggi
    wasting_status VARCHAR(50) NOT NULL,  -- Gizi Buruk, Gizi Kurang, Normal, Gizi Lebih
    risk_flag risk_level DEFAULT 'NORMAL',
    action_advice TEXT,
    algorithm_version VARCHAR(20) DEFAULT 'WHO-2006-v1.0',
    assessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Table: Master Immunization & Vaccine Records
CREATE TABLE vaccine_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vaccine_name VARCHAR(100) NOT NULL,
    min_age_months INT NOT NULL,
    description TEXT
);

CREATE TABLE child_vaccinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    vaccine_id UUID NOT NULL REFERENCES vaccine_master(id),
    given_date DATE NOT NULL,
    given_by UUID REFERENCES users(id),
    notes TEXT
);

-- 9. Table: Announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    posyandu_id UUID REFERENCES posyandus(id) ON DELETE CASCADE, -- NULL = Global
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    event_date DATE,
    is_published BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Policy Keamanan Data (Row Level Security - RLS)

### Policy untuk Orang Tua (`parent`)
1. **Dilarang menambah/mengedit data balita.**
2. **Hanya dapat membaca data balita yang miliknya:**
   ```sql
   CREATE POLICY parent_read_own_children ON children
   FOR SELECT USING (auth.uid() = parent_id);
   ```
3. **Hanya dapat membaca hasil pengukuran dari balitanya:**
   ```sql
   CREATE POLICY parent_read_own_measurements ON growth_measurements
   FOR SELECT USING (
     child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
   );
   ```

### Policy untuk Petugas Posyandu (`staff`)
1. **Dapat membaca dan mencatat data balita di Posyandu tempatnya bertugas:**
   ```sql
   CREATE POLICY staff_manage_assigned_posyandu ON children
   FOR ALL USING (
     posyandu_id IN (
       SELECT posyandu_id FROM staff_profiles WHERE user_id = auth.uid()
     )
   );
   ```