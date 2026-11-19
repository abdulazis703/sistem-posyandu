# Logika Bisnis & Perhitungan Deteksi Dini Stunting

Dokumen ini mendefinisikan aturan logika matematika dan medis yang digunakan dalam Sistem Informasi Pertumbuhan Balita. Seluruh algoritma mengacu pada **Standar Antropometri Anak Kementerian Kesehatan RI** dan **WHO Child Growth Standards**.

---

## 1. Variabel Input Utama

Untuk memproses evaluasi status pertumbuhan, sistem membutuhkan input data berikut:

| Variabel | Tipe Data | Satuan | Prosedur / Penjelasan |
| :--- | :--- | :--- | :--- |
| `tanggal_lahir` | Date | YYYY-MM-DD | Digunakan untuk menghitung umur presisi. |
| `tanggal_ukur` | Date | YYYY-MM-DD | Tanggal dilakukannya pengukuran. |
| `jenis_kelamin` | Enum | `L` / `P` | Laki-laki (`L`) atau Perempuan (`P`). |
| `berat_badan` | Float | kg | Presisi hingga 2 desimal (contoh: 8.45). |
| `tinggi_badan` | Float | cm | Presisi hingga 1 desimal (contoh: 75.5). |
| `metode_ukur` | Enum | `terlentang` / `berdiri` | Cara pengukuran panjang/tinggi badan. |
| `is_prematur` | Boolean | true/false | Apakah lahir < 37 minggu usia kandungan. |
| `usia_gestasi_minggu` | Integer | minggu | Wajib diisi jika `is_prematur = true` (contoh: 34). |

---

## 2. Perhitungan Umur Balita & Koreksi Usia

### 2.1 Umur Kronologis (Dalam Bulan)
Umur dihitung berdasarkan selisih hari antara `tanggal_lahir` dan `tanggal_ukur`:

$$\text{Usia (Hari)} = \text{tanggal\_ukur} - \text{tanggal\_lahir}$$

$$\text{Usia (Bulan Penuh)} = \lfloor \frac{\text{Usia (Hari)}}{30.4375} \rfloor$$

*Catatan: Selalu bulatkan ke bawah untuk menentukan indeks bulan pada tabel referensi WHO (0 s/d 60 bulan).*

### 2.2 Koreksi Usia Prematur (Corrected Age)
Jika `is_prematur == true` DAN `Usia Kronologis < 24 bulan`:
1. Menghitung prematuritas dalam minggu: $\text{Prematur (Minggu)} = 40 - \text{usia\_gestasi\_minggu}$.
2. Menghitung koreksi hari: $\text{Koreksi (Hari)} = \text{Prematur (Minggu)} \times 7$.
3. Menghitung usia koreksi:

$$\text{Usia Koreksi (Hari)} = \text{Usia Kronologis (Hari)} - \text{Koreksi (Hari)}$$

$$\text{Usia Efektif (Bulan)} = \lfloor \frac{\text{Usia Koreksi (Hari)}}{30.4375} \rfloor$$

*Gunakan `Usia Efektif (Bulan)` untuk mencari nilai acuan Z-score WHO jika syarat prematur terpenuhi.*

---

## 3. Koreksi Metode Pengukuran (Terlentang vs Berdiri)

Sesuai standar WHO/Kemenkes:
- Balita **< 24 bulan** idealnya diukur **Terlentang (Panjang Badan / PB)**.
- Balita **≥ 24 bulan** idealnya diukur **Berdiri (Tinggi Badan / TB)**.

Jika metode pengukuran di lapangan tidak sesuai standar usia, nilai pengukuran harus dikoreksi terlebih dahulu sebelum menghitung Z-score:

```
IF Usia < 24 bulan AND metode_ukur == 'berdiri' THEN
    tinggi_badan_koreksi = tinggi_badan + 0.7
ELSE IF Usia >= 24 bulan AND metode_ukur == 'terlentang' THEN
    tinggi_badan_koreksi = tinggi_badan - 0.7
ELSE
    tinggi_badan_koreksi = tinggi_badan
END IF
```

---

## 4. Rumus Perhitungan Z-Score

Perhitungan Z-Score menggunakan nilai Median ($\mu$), $-1\text{SD}$, $+1\text{SD}$ dari tabel referensi WHO (sesuai `jenis_kelamin` dan `Usia Bulan`):

$$Z\text{-Score} = \begin{cases} 
\frac{y - \mu}{\mu - (-1\text{SD})} & \text{jika } y < \mu \\
0 & \text{jika } y = \mu \\
\frac{y - \mu}{(+1\text{SD}) - \mu} & \text{jika } y > \mu 
\end{cases}$$

*Keterangan:*
- $y$ = `tinggi_badan_koreksi` atau `berat_badan` hasil pengukuran.
- $\mu$ = Nilai Median (0 SD) pada tabel WHO.
- $(-1\text{SD})$ = Nilai Standar Deviasi -1 pada tabel WHO.
- $(+1\text{SD})$ = Nilai Standar Deviasi +1 pada tabel WHO.

---

## 5. Klasifikasi Status Growth Assessment

### 5.1 Indikator PB/U atau TB/U (Stunting) — *Primary Indicator*
Dipakai untuk menentukan kondisi stunting pada balita:

| Rentang Z-Score (PB/U atau TB/U) | Kategori Status | Flag Risiko |
| :--- | :--- | :--- |
| $Z < -3.0$ | Sangat Pendek (*Severely Stunted*) | **HIGH_RISK** |
| $-3.0 \le Z < -2.0$ | Pendek (*Stunted*) | **MODERATE_RISK** |
| $-2.0 \le Z \le +3.0$ | Normal | **NORMAL** |
| $Z > +3.0$ | Tinggi | **NOTICE** |

### 5.2 Indikator BB/U (Berat Badan menurut Umur)
Dipakai untuk pemantauan berat badan:

| Rentang Z-Score (BB/U) | Kategori Status |
| :--- | :--- |
| $Z < -3.0$ | Berat Badan Sangat Kurang (*Severely Underweight*) |
| $-3.0 \le Z < -2.0$ | Berat Badan Kurang (*Underweight*) |
| $-2.0 \le Z \le +1.0$ | Berat Badan Normal |
| $Z > +1.0$ | Risiko Berat Badan Lebih |

### 5.3 Indikator BB/PB atau BB/TB (Wasting / Gizi)
Dipakai untuk menentukan tingkat gizi akut:

| Rentang Z-Score (BB/PB atau BB/TB) | Kategori Status | Flag Risiko |
| :--- | :--- | :--- |
| $Z < -3.0$ | Gizi Buruk (*Severely Wasted*) | **CRITICAL** |
| $-3.0 \le Z < -2.0$ | Gizi Kurang (*Wasted*) | **HIGH_RISK** |
| $-2.0 \le Z \le +2.0$ | Gizi Baik (*Normal*) | **NORMAL** |
| $+2.0 < Z \le +3.0$ | Berisiko Gizi Lebih (*Risk of Overweight*) | **NOTICE** |
| $Z > +3.0$ | Obesitas (*Obese*) | **MODERATE_RISK** |

---

## 6. Pesan Edukasi & Rekomendasi (Automated Actionable Advice)

Sistem akan menghasilkan saran otomatis berdasarkan kombinasi Z-Score:

1. **Jika Stunted / Severely Stunted:**
   > *"Indikasi panjang/tinggi badan anak berada di bawah kurva pertumbuhan standar. Disarankan untuk berkonsultasi dengan petugas gizi Posyandu/Puskesmas untuk evaluasi asupan MP-ASI dan sanitasi lingkungan."*

2. **Jika Wasted / Severely Wasted:**
   > *"Perhatian: Berat badan anak tidak seimbang dengan tinggi badannya. Perlu pemeriksaan segera oleh tenaga kesehatan untuk mencegah penurunan daya tahan tubuh."*

3. **Jika Normal:**
   > *"Pertumbuhan anak berada dalam rentang normal. Pertahankan pola makan bergizi seimbang dan lanjutkan penimbangan rutin bulan depan."*