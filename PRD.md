# Product Requirements Document (PRD)

## Sistem Informasi Pencatatan Pertumbuhan Balita dan Deteksi Dini Risiko Stunting

**Versi:** 1.0\
**Tanggal:** 3 November 2026\
**Status:** Draft untuk pengembangan MVP\
**Platform awal:** Aplikasi web responsif

------------------------------------------------------------------------

## 1. Ringkasan Produk

Sistem Informasi Pencatatan Pertumbuhan Balita dan Deteksi Dini Risiko
Stunting adalah aplikasi untuk membantu Posyandu mencatat hasil
pemeriksaan antropometri balita, memantau perkembangan pertumbuhan dari
waktu ke waktu, mengenali indikasi risiko lebih awal, serta menyediakan
akses informasi pertumbuhan kepada orang tua.

Aplikasi memiliki dua peran utama:

1.  **Orang Tua (Parent):** melihat data balita yang sudah tercatat dan
    terhubung ke akun orang tua, memantau hasil pemeriksaan, grafik
    pertumbuhan, status pertumbuhan, serta informasi Posyandu.
2.  **Superadmin/Petugas:** mengelola data balita, akun orang tua,
    pemeriksaan, Posyandu, wilayah kerja, laporan, pengumuman, dan
    edukasi sesuai kewenangan aksesnya.

### Ketentuan utama hubungan akun orang tua dan balita

**Data balita langsung tersedia di akun orang tua. Tidak ada proses
sambungkan akun, kode undangan, klaim data, atau persetujuan pengaitan
dari sisi orang tua.**

Petugas memilih akun orang tua ketika membuat atau mengubah data balita.
Setelah data disimpan, balita otomatis tampil di akun orang tua
tersebut. Satu akun orang tua dapat memiliki lebih dari satu balita.
Orang tua hanya dapat melihat balita yang memang telah ditetapkan ke
akunnya oleh petugas.

------------------------------------------------------------------------

## 2. Latar Belakang dan Masalah

Pencatatan pemeriksaan balita di Posyandu perlu dilakukan secara
konsisten agar perkembangan anak dapat dipantau dari bulan ke bulan.
Pencatatan yang tersebar atau masih manual dapat menyulitkan petugas
ketika mencari riwayat pemeriksaan, menyusun laporan, dan mengetahui
balita yang belum datang ke Posyandu.

Di sisi lain, orang tua membutuhkan akses yang mudah untuk melihat hasil
pengukuran dan memahami perkembangan anaknya. Sistem ini ditujukan
untuk:

-   Memusatkan data identitas balita dan riwayat pemeriksaan.
-   Mempermudah petugas mencatat hasil pemeriksaan.
-   Menampilkan perkembangan antropometri dalam bentuk grafik dan
    ringkasan.
-   Membantu menemukan indikasi risiko pertumbuhan lebih dini.
-   Memberikan akses informasi yang mudah dipahami oleh orang tua.
-   Mempermudah rekapitulasi pemeriksaan berdasarkan periode, Posyandu,
    dan balita.

------------------------------------------------------------------------

## 3. Tujuan Produk

### 3.1 Tujuan utama

-   Menyediakan sistem pencatatan pertumbuhan balita yang terstruktur.
-   Memudahkan pemantauan pertumbuhan berdasarkan riwayat pengukuran.
-   Menyediakan perhitungan dan interpretasi antropometri berdasarkan
    standar yang ditetapkan.
-   Memberikan informasi indikasi risiko kepada petugas dan orang tua
    secara bertanggung jawab.
-   Menyediakan laporan pemeriksaan yang dapat difilter dan diekspor.

### 3.2 Indikator keberhasilan

-   Petugas dapat menambahkan data balita dan langsung menetapkan akun
    orang tuanya.
-   Data balita yang telah ditetapkan otomatis muncul di akun orang tua
    tanpa proses pengaitan tambahan.
-   Petugas dapat mencatat dan menemukan kembali riwayat pemeriksaan.
-   Orang tua dapat melihat grafik dan hasil pemeriksaan balitanya.
-   Sistem dapat menandai data yang belum lengkap, tidak wajar, atau
    membutuhkan perhatian.
-   Petugas dapat menghasilkan rekap pemeriksaan berdasarkan bulan,
    tahun, Posyandu, dan balita.

------------------------------------------------------------------------

## 4. Ruang Lingkup

### 4.1 Fitur dalam MVP

1.  Autentikasi dan profil orang tua.
2.  Autentikasi dan profil petugas.
3.  Dashboard sesuai peran.
4.  Manajemen akun orang tua oleh petugas.
5.  Manajemen data balita dan penetapan akun orang tua.
6.  Pencatatan dan pengelolaan pemeriksaan antropometri.
7.  Perhitungan IMT dan indikator antropometri sesuai standar yang
    dikonfigurasi.
8.  Grafik dan riwayat pertumbuhan.
9.  Ringkasan indikasi risiko dan notifikasi informasi.
10. Manajemen Posyandu dan wilayah akses.
11. Laporan dan ekspor Excel.
12. Pengumuman, jadwal kegiatan, dan informasi imunisasi.

### 4.2 Di luar ruang lingkup MVP

-   Diagnosis medis otomatis.
-   Rekomendasi obat atau tindakan medis otomatis.
-   Konsultasi langsung dengan dokter melalui aplikasi.
-   Integrasi otomatis dengan sistem pemerintah atau rekam medis
    eksternal.
-   Pengaitan akun balita secara mandiri oleh orang tua.
-   Pembayaran atau transaksi.
-   Aplikasi mobile native Android/iOS (MVP menggunakan web responsif).

------------------------------------------------------------------------

## 5. Pengguna dan Hak Akses

### 5.1 Orang Tua (Parent)

Pengguna yang dapat melihat data balita yang sudah ditetapkan oleh
petugas ke akun miliknya.

Hak akses: - Mengelola profil akun sendiri. - Melihat daftar balita yang
terdaftar pada akunnya. - Melihat identitas, hasil pemeriksaan, grafik,
dan riwayat pertumbuhan balita tersebut. - Melihat pengumuman, jadwal
Posyandu, dan informasi imunisasi. - Tidak dapat menambah, mengedit,
atau menghapus data balita maupun hasil pemeriksaan. - Tidak dapat
melihat data balita milik akun orang tua lain.

### 5.2 Superadmin/Petugas

Pengguna internal yang mengelola data sesuai wilayah dan kewenangan yang
diberikan.

Hak akses: - Mengelola data balita dan akun orang tua. - Menetapkan akun
orang tua untuk setiap balita. - Mencatat, mengedit, dan memvalidasi
pemeriksaan. - Melihat hasil perhitungan dan indikasi risiko. -
Mengelola informasi Posyandu sesuai hak akses. - Melihat dan mengekspor
laporan sesuai wilayah akses. - Mengelola pengumuman dan jadwal.

**Catatan otorisasi:** Istilah "Superadmin" pada kebutuhan awal
digunakan untuk peran petugas internal. Sistem tetap harus menerapkan
pembatasan wilayah/Posyandu. Petugas hanya dapat mengakses data sesuai
penugasan. Jika nantinya dibutuhkan administrator tingkat kabupaten/kota
dan kader tingkat Posyandu, peran tersebut dapat dipisahkan pada
pengembangan berikutnya.

------------------------------------------------------------------------

## 6. Alur Utama Sistem

### 6.1 Alur pendaftaran dan penetapan akun orang tua

1.  Orang tua membuat akun menggunakan nama, nomor HP/email, dan
    password.
2.  Sistem menyimpan akun orang tua dengan status aktif.
3.  Petugas membuka menu data balita.
4.  Petugas menambahkan data balita dan memilih akun orang tua dari
    daftar akun yang tersedia.
5.  Petugas menyimpan data balita.
6.  Sistem otomatis menetapkan hubungan balita dengan akun orang tua
    yang dipilih.
7.  Balita langsung muncul di dashboard orang tua tanpa perlu tindakan
    lanjutan.

Jika akun orang tua belum tersedia, petugas dapat membuat akun orang tua
terlebih dahulu atau meminta orang tua melakukan registrasi. Petugas
kemudian memilih akun tersebut saat memasukkan data balita.

### 6.2 Alur pemeriksaan balita

1.  Petugas memilih Posyandu dan balita.
2.  Petugas memasukkan tanggal pemeriksaan dan hasil pengukuran.
3.  Sistem memeriksa kelengkapan serta kewajaran nilai.
4.  Sistem menghitung indikator antropometri yang didukung.
5.  Petugas meninjau hasil, memperbaiki jika ada kesalahan, lalu
    menyimpan/memvalidasi pemeriksaan.
6.  Data masuk ke riwayat balita dan grafik pertumbuhan.
7.  Orang tua dapat melihat hasil pemeriksaan setelah data tersimpan dan
    dipublikasikan/berstatus valid.

### 6.3 Alur pemantauan orang tua

1.  Orang tua login.
2.  Dashboard menampilkan seluruh balita yang ditetapkan ke akunnya.
3.  Orang tua memilih salah satu balita.
4.  Sistem menampilkan profil, ringkasan status, grafik, dan riwayat
    pemeriksaan.
5.  Jika belum ada pemeriksaan pada bulan berjalan, sistem menampilkan
    status "Belum ada pemeriksaan bulan ini".

------------------------------------------------------------------------

## 7. Kebutuhan Fungsional

### 7.1 Modul Orang Tua (Parent)

#### A. Autentikasi dan Profil

-   **FR-P01:** Orang tua dapat melakukan registrasi akun.
-   **FR-P02:** Orang tua dapat login menggunakan kredensial terdaftar.
-   **FR-P03:** Orang tua dapat logout.
-   **FR-P04:** Orang tua dapat melihat dan mengubah profil akun.
-   **FR-P05:** Orang tua dapat mengubah password dengan verifikasi
    password saat ini atau mekanisme verifikasi yang aman.

#### B. Dashboard Orang Tua

-   **FR-P06:** Sistem menampilkan dashboard orang tua setelah login.
-   **FR-P07:** Sistem menampilkan daftar seluruh balita yang ditetapkan
    ke akun orang tua.
-   **FR-P08:** Sistem menampilkan jumlah balita pada akun.
-   **FR-P09:** Sistem menampilkan ringkasan pemeriksaan pada bulan
    berjalan.
-   **FR-P10:** Sistem menampilkan ringkasan status pertumbuhan
    masing-masing balita.
-   **FR-P11:** Jika belum ada pemeriksaan pada bulan berjalan, sistem
    menampilkan "Belum ada pemeriksaan bulan ini".
-   **FR-P12:** Orang tua dapat memilih balita untuk membuka halaman
    detail.

#### C. Data Balita

-   **FR-P13:** Orang tua dapat melihat profil dan informasi dasar
    balita.
-   **FR-P14:** Orang tua dapat melihat riwayat pemeriksaan balita.
-   **FR-P15:** Orang tua dapat berpindah melihat balita lain yang
    terdaftar dalam akun yang sama.
-   **FR-P16:** Sistem hanya menampilkan data balita yang terhubung ke
    akun orang tua yang sedang login.

#### D. Monitoring Pertumbuhan

-   **FR-P17:** Orang tua dapat melihat perkembangan berat badan (BB).
-   **FR-P18:** Orang tua dapat melihat perkembangan panjang/tinggi
    badan (PB/TB).
-   **FR-P19:** Orang tua dapat melihat perkembangan lingkar kepala.
-   **FR-P20:** Orang tua dapat melihat perkembangan lingkar lengan atas
    (LiLA), jika datanya tersedia.
-   **FR-P21:** Sistem menampilkan grafik perkembangan berdasarkan
    tanggal pemeriksaan.
-   **FR-P22:** Sistem menampilkan IMT berdasarkan data berat dan
    panjang/tinggi badan yang valid.
-   **FR-P23:** Sistem menampilkan interpretasi indikator pertumbuhan
    berdasarkan standar antropometri yang digunakan.
-   **FR-P24:** Sistem menampilkan ringkasan indikasi risiko pertumbuhan
    dengan bahasa yang mudah dipahami.
-   **FR-P25:** Sistem menampilkan riwayat perubahan hasil/status
    indikator.
-   **FR-P26:** Sistem menampilkan pemberitahuan apabila hasil
    pengukuran menunjukkan indikator yang perlu diperhatikan.
-   **FR-P27:** Sistem menampilkan tanggal pemeriksaan terakhir dan
    status kelengkapan data.

#### E. Pengumuman dan Edukasi

-   **FR-P28:** Orang tua dapat melihat pengumuman Posyandu.
-   **FR-P29:** Orang tua dapat melihat jadwal kegiatan Posyandu.
-   **FR-P30:** Orang tua dapat melihat informasi jadwal imunisasi yang
    dipublikasikan petugas.

### 7.2 Modul Superadmin/Petugas

#### A. Autentikasi dan Profil

-   **FR-A01:** Petugas dapat login.
-   **FR-A02:** Petugas dapat logout.
-   **FR-A03:** Petugas dapat melihat dan mengubah profil.
-   **FR-A04:** Petugas dapat mengubah password.

#### B. Dashboard Petugas

-   **FR-A05:** Sistem menampilkan dashboard petugas.
-   **FR-A06:** Sistem menampilkan jumlah balita dalam wilayah akses.
-   **FR-A07:** Sistem menampilkan jumlah pemeriksaan pada bulan
    berjalan.
-   **FR-A08:** Sistem menampilkan ringkasan status indikator
    pertumbuhan.
-   **FR-A09:** Sistem menampilkan daftar balita yang belum diperiksa
    pada bulan berjalan.
-   **FR-A10:** Sistem menampilkan ringkasan indikasi risiko yang
    membutuhkan tindak lanjut.
-   **FR-A11:** Sistem menampilkan jumlah Posyandu dalam wilayah akses.
-   **FR-A12:** Seluruh ringkasan dashboard mengikuti batas
    wilayah/Posyandu yang dimiliki petugas.

#### C. Manajemen Akun Orang Tua dan Data Balita

-   **FR-A13:** Petugas dapat melihat dan mencari akun orang tua.
-   **FR-A14:** Petugas dapat membuat akun orang tua jika diperlukan dan
    memiliki kewenangan.
-   **FR-A15:** Petugas dapat menambahkan data balita.
-   **FR-A16:** Petugas dapat mengedit data balita.
-   **FR-A17:** Petugas dapat menghapus atau menonaktifkan data balita
    sesuai kebijakan pengelolaan data.
-   **FR-A18:** Petugas dapat mencari data balita berdasarkan nama,
    identitas internal, orang tua, atau Posyandu.
-   **FR-A19:** Petugas dapat melihat detail profil balita.
-   **FR-A20:** Saat menambahkan atau mengedit data balita, petugas
    wajib memilih akun orang tua yang bertanggung jawab.
-   **FR-A21:** Setelah disimpan, sistem otomatis menampilkan balita
    pada akun orang tua yang dipilih.
-   **FR-A22:** Satu akun orang tua dapat memiliki beberapa balita.
-   **FR-A23:** Petugas yang berwenang dapat mengubah penetapan akun
    orang tua dengan mencatat riwayat perubahan.
-   **FR-A24:** Sistem mencegah balita yang sama tercatat ganda
    berdasarkan identitas yang tersedia dan proses pemeriksaan
    duplikasi.

#### D. Pencatatan Pertumbuhan

-   **FR-A25:** Petugas dapat memilih balita dan memasukkan hasil
    pemeriksaan.
-   **FR-A26:** Petugas dapat menginput berat badan (kg).
-   **FR-A27:** Petugas dapat menginput panjang/tinggi badan (cm).
-   **FR-A28:** Petugas dapat menginput lingkar kepala (cm).
-   **FR-A29:** Petugas dapat menginput LiLA (cm), jika diukur.
-   **FR-A30:** Petugas dapat memasukkan tanggal pemeriksaan.
-   **FR-A31:** Petugas dapat memilih posisi pengukuran panjang/tinggi
    badan sesuai prosedur.
-   **FR-A32:** Petugas dapat menyimpan pemeriksaan sebagai draft atau
    memvalidasinya sesuai alur kerja.
-   **FR-A33:** Petugas dapat mengedit data pemeriksaan dengan alasan
    perubahan.
-   **FR-A34:** Petugas dapat melihat riwayat pemeriksaan balita.
-   **FR-A35:** Sistem memvalidasi kelengkapan, format, satuan, dan
    kewajaran data sebelum pemeriksaan disahkan.
-   **FR-A36:** Sistem mencatat petugas yang melakukan input dan
    perubahan data.

#### E. Monitoring Pertumbuhan

-   **FR-A37:** Sistem menghitung IMT jika data yang dibutuhkan tersedia
    dan valid.
-   **FR-A38:** Sistem menampilkan indikator antropometri dan
    interpretasinya berdasarkan standar yang dikonfigurasi.
-   **FR-A39:** Sistem menampilkan indikator yang perlu mendapat
    perhatian petugas.
-   **FR-A40:** Sistem menampilkan grafik perkembangan balita.
-   **FR-A41:** Sistem menampilkan riwayat perubahan status indikator.
-   **FR-A42:** Sistem menampilkan kelengkapan riwayat pemeriksaan.
-   **FR-A43:** Petugas dapat meninjau hasil perhitungan dan memperbaiki
    data sumber jika terdapat kesalahan.
-   **FR-A44:** Sistem membedakan data belum lengkap, data tidak valid,
    dan hasil yang menunjukkan indikasi risiko.

#### F. Manajemen Posyandu dan Wilayah Kerja

-   **FR-A45:** Petugas dapat melihat daftar Posyandu dalam wilayah
    akses.
-   **FR-A46:** Petugas dapat melihat detail informasi Posyandu.
-   **FR-A47:** Petugas dapat melihat data kader/petugas yang bertugas
    jika tersedia.
-   **FR-A48:** Petugas dapat memantau aktivitas pemeriksaan Posyandu.
-   **FR-A49:** Petugas dapat melihat data balita berdasarkan Posyandu.
-   **FR-A50:** Petugas dapat membandingkan rekap pemeriksaan
    antar-Posyandu dalam wilayah akses.
-   **FR-A51:** Sistem membatasi data Posyandu dan balita sesuai wilayah
    akses petugas.

#### G. Laporan

-   **FR-A52:** Petugas dapat melihat laporan pemeriksaan balita.
-   **FR-A53:** Petugas dapat memfilter laporan berdasarkan bulan dan
    tahun.
-   **FR-A54:** Petugas dapat memfilter laporan berdasarkan Posyandu.
-   **FR-A55:** Petugas dapat memfilter laporan berdasarkan balita.
-   **FR-A56:** Sistem menampilkan rekapitulasi jumlah pemeriksaan dan
    status kelengkapan.
-   **FR-A57:** Petugas dapat mengekspor laporan ke format Excel
    (.xlsx).
-   **FR-A58:** Ekspor laporan hanya memuat data dalam wilayah akses
    petugas.

#### H. Pengumuman dan Edukasi

-   **FR-A59:** Petugas dapat membuat pengumuman Posyandu.
-   **FR-A60:** Petugas dapat mengedit pengumuman.
-   **FR-A61:** Petugas dapat menghapus atau mengarsipkan pengumuman.
-   **FR-A62:** Petugas dapat mengelola jadwal kegiatan Posyandu.
-   **FR-A63:** Petugas dapat mengelola informasi jadwal imunisasi.
-   **FR-A64:** Petugas dapat menentukan status publikasi pengumuman.

------------------------------------------------------------------------

## 8. Aturan Bisnis

1.  Setiap akun orang tua memiliki identitas akun yang unik, misalnya
    nomor HP atau email.
2.  Data balita harus ditetapkan ke satu akun orang tua utama agar
    kepemilikan data jelas. Jika kelak satu balita perlu diakses oleh
    dua wali, fitur wali tambahan harus dirancang secara khusus.
3.  Penetapan balita ke akun dilakukan oleh petugas, bukan melalui
    proses sambungkan akun oleh orang tua.
4.  Satu akun orang tua dapat memiliki lebih dari satu balita.
5.  Orang tua hanya dapat membaca data balita yang telah ditetapkan pada
    akunnya.
6.  Setiap pemeriksaan harus terkait dengan satu balita, tanggal
    pemeriksaan, dan petugas pencatat.
7.  Pemeriksaan yang belum lengkap tidak boleh menghasilkan interpretasi
    seolah-olah hasilnya normal.
8.  Data yang belum divalidasi harus diberi penanda dan tidak
    ditampilkan sebagai hasil final kepada orang tua.
9.  Pengeditan atau penghapusan pemeriksaan harus meninggalkan catatan
    audit.
10. Pemeriksaan bulanan dihitung berdasarkan bulan dan tahun kalender
    pada tanggal pemeriksaan.
11. "Belum ada pemeriksaan bulan ini" berarti tidak ditemukan
    pemeriksaan valid pada balita tersebut dalam bulan berjalan.
12. Status risiko bukan diagnosis stunting atau diagnosis penyakit.
13. Standar antropometri, tabel referensi, rentang usia, dan metode
    perhitungan harus dapat diperbarui melalui konfigurasi yang dikelola
    pihak berwenang.
14. Semua waktu disimpan secara konsisten dan ditampilkan mengikuti zona
    waktu operasional, yaitu WIB (Asia/Jakarta), kecuali kebijakan
    implementasi menetapkan lain.

------------------------------------------------------------------------

## 9. Aturan Perhitungan dan Deteksi Dini

Bagian ini merupakan komponen penting dan harus ditinjau tenaga
kesehatan yang berwenang sebelum digunakan dalam operasional Posyandu.

### 9.1 Data yang diperlukan

-   Tanggal lahir balita.
-   Jenis kelamin.
-   Tanggal pemeriksaan.
-   Berat badan (kg).
-   Panjang/tinggi badan (cm).
-   Jenis pengukuran: panjang badan terlentang atau tinggi badan
    berdiri.
-   Lingkar kepala (cm), jika diukur.
-   LiLA (cm), jika diukur.

Umur balita pada tanggal pemeriksaan dihitung dari tanggal lahir dan
tanggal pemeriksaan, bukan dari perkiraan umur yang diketik manual.

### 9.2 Indikator yang ditampilkan

Aplikasi sebaiknya tidak hanya mengandalkan IMT. Untuk pemantauan
pertumbuhan dan indikasi stunting, sistem perlu mendukung indikator
antropometri yang sesuai standar resmi, antara lain:

-   **BB/U (Berat Badan menurut Umur):** membantu menilai berat badan
    berdasarkan umur.
-   **PB/U atau TB/U (Panjang/Tinggi Badan menurut Umur):** indikator
    penting untuk menilai panjang/tinggi badan menurut umur dan indikasi
    pendek/sangat pendek.
-   **BB/PB atau BB/TB:** menilai berat badan relatif terhadap
    panjang/tinggi badan.
-   **IMT/U:** indeks massa tubuh menurut umur.
-   **Lingkar kepala dan LiLA:** ditampilkan sebagai hasil pengukuran
    dan ditafsirkan hanya jika tersedia standar serta rentang usia yang
    sesuai.

### 9.3 Perhitungan

-   IMT dihitung dengan rumus berat badan (kg) dibagi kuadrat
    tinggi/panjang badan (meter).
-   Interpretasi status pertumbuhan tidak boleh ditentukan dengan ambang
    IMT dewasa.
-   Z-score dan kategori antropometri harus dihitung menggunakan standar
    resmi yang dipilih, termasuk tabel referensi sesuai jenis kelamin
    dan umur.
-   Sistem harus menangani perbedaan pengukuran panjang badan terlentang
    dan tinggi badan berdiri sesuai pedoman resmi.
-   Jika data wajib tidak tersedia atau tidak valid, hasil indikator
    terkait ditampilkan sebagai "Belum dapat dihitung".

### 9.4 Deteksi dini dan tindak lanjut

-   Sistem menandai indikator yang berada di luar kategori rujukan
    sebagai **indikasi yang perlu diperhatikan**, bukan diagnosis.
-   Sistem menampilkan indikator yang memicu penanda, tanggal
    pengukuran, dan pesan tindak lanjut yang telah disetujui tenaga
    kesehatan.
-   Petugas menjadi pihak yang meninjau hasil dan menentukan tindak
    lanjut sesuai prosedur Posyandu.
-   Orang tua menerima informasi dengan bahasa netral, tidak
    menakut-nakuti, serta diarahkan untuk berkonsultasi dengan petugas
    kesehatan.
-   Sistem tidak boleh menyimpulkan "normal" jika data tidak cukup.
-   Perubahan standar atau algoritma perhitungan harus memiliki versi,
    tanggal berlaku, dan catatan perubahan agar hasil historis dapat
    ditelusuri.

**Catatan keselamatan:** Sebelum rilis, validasikan algoritma, tabel
rujukan, kategori, dan pesan tindak lanjut dengan ahli gizi/tenaga
kesehatan serta pedoman resmi Kementerian Kesehatan/WHO yang berlaku.
Jangan membuat ambang batas sendiri hanya berdasarkan asumsi pengembang.

------------------------------------------------------------------------

## 10. Kebutuhan Data dan Entitas Utama

Rancangan berikut merupakan model konseptual awal. Struktur database
final dapat disesuaikan dengan teknologi yang dipilih.

### 10.1 User

Menyimpan akun login seluruh pengguna.

Field inti: - `id` - `name` - `email` atau `phone` - `password_hash` -
`role` (parent, staff/superadmin) - `status` - `created_at` -
`updated_at`

### 10.2 ParentProfile

Menyimpan informasi tambahan orang tua.

Field inti: - `id` - `user_id` - `full_name` - `phone` - `address` -
`created_at` - `updated_at`

### 10.3 StaffProfile

Menyimpan informasi petugas.

Field inti: - `id` - `user_id` - `full_name` - `phone` - `position` -
`created_at` - `updated_at`

### 10.4 Posyandu

Field inti: - `id` - `name` - `address` - `village` - `district` -
`regency` - `province` - `schedule` - `status`

### 10.5 StaffPosyanduAccess

Mengatur wilayah/Posyandu yang dapat diakses petugas.

Field inti: - `id` - `staff_user_id` - `posyandu_id` - `access_level`

### 10.6 Child

Menyimpan identitas balita.

Field inti: - `id` - `parent_user_id` (relasi langsung ke akun orang
tua) - `posyandu_id` - `child_name` - `nik` (opsional; akses sangat
dibatasi dan hanya dikumpulkan jika benar-benar diperlukan) - `gender` -
`birth_date` - `birth_weight` (opsional) - `address` - `status` -
`created_at` - `updated_at`

### 10.7 GrowthMeasurement

Menyimpan pemeriksaan pertumbuhan.

Field inti: - `id` - `child_id` - `posyandu_id` - `exam_date` -
`weight_kg` - `height_cm` - `height_measurement_type`
(length/standing_height) - `head_circumference_cm` (nullable) -
`muac_cm` (nullable) - `bmi` (hasil turunan) - `record_status` (draft,
validated, corrected) - `recorded_by` - `validated_by` -
`validated_at` - `notes` - `created_at` - `updated_at`

### 10.8 GrowthAssessment

Menyimpan hasil interpretasi indikator pada saat pemeriksaan.

Field inti: - `id` - `measurement_id` - `indicator_code` - `z_score`
(jika relevan) - `category` - `risk_flag` - `reference_standard` -
`algorithm_version` - `assessed_at`

### 10.9 Announcement

Field inti: - `id` - `posyandu_id` atau cakupan wilayah - `title` -
`content` - `type` (announcement, schedule, immunization) - `event_date`
(nullable) - `published_at` - `status` - `created_by`

### 10.10 AuditLog

Mencatat aktivitas penting.

Field inti: - `id` - `actor_user_id` - `action` - `entity_type` -
`entity_id` - `before_data` (dibatasi dan diamankan) - `after_data`
(dibatasi dan diamankan) - `created_at`

### 10.11 Relasi inti

-   Satu `User` dengan role parent memiliki satu `ParentProfile`.
-   Satu akun orang tua dapat memiliki banyak `Child`.
-   Satu `Child` memiliki banyak `GrowthMeasurement`.
-   Satu `GrowthMeasurement` dapat memiliki beberapa `GrowthAssessment`.
-   Satu `Posyandu` memiliki banyak `Child` dan `GrowthMeasurement`.
-   Satu petugas dapat memiliki akses ke satu atau lebih Posyandu
    melalui `StaffPosyanduAccess`.
-   Satu akun petugas dapat membuat banyak pemeriksaan dan pengumuman.

------------------------------------------------------------------------

## 11. Kebutuhan Nonfungsional

### 11.1 Keamanan dan privasi

-   Password harus disimpan menggunakan hashing yang aman, bukan teks
    biasa.
-   Terapkan kontrol akses berbasis peran dan wilayah (RBAC).
-   Validasi akses dilakukan di sisi server/API, bukan hanya
    menyembunyikan menu di frontend.
-   Orang tua tidak boleh dapat menebak ID balita lalu mengakses data
    milik akun lain.
-   Gunakan HTTPS pada lingkungan produksi.
-   Batasi akses terhadap NIK dan informasi pribadi; hindari
    mengumpulkan NIK jika tidak diperlukan.
-   Sediakan mekanisme backup dan pemulihan data.
-   Catat aktivitas penting seperti login, perubahan data balita,
    perubahan penetapan orang tua, dan perubahan pemeriksaan.
-   Terapkan kebijakan retensi dan penghapusan data sesuai ketentuan
    yang berlaku.
-   Patuhi ketentuan perlindungan data pribadi dan kebijakan pengelolaan
    data kesehatan yang relevan.

### 11.2 Kemudahan penggunaan

-   Antarmuka menggunakan Bahasa Indonesia yang sederhana.
-   Tampilan responsif untuk HP, tablet, dan desktop.
-   Form pemeriksaan dibuat ringkas dan mudah digunakan saat kegiatan
    Posyandu.
-   Satuan pengukuran ditampilkan dengan jelas.
-   Pesan kesalahan harus menjelaskan bagian yang perlu diperbaiki.
-   Gunakan warna dan label yang tidak hanya mengandalkan warna untuk
    menyampaikan status.

### 11.3 Kinerja dan keandalan

-   Halaman utama dan daftar data harus tetap nyaman digunakan pada
    koneksi internet yang terbatas.
-   Tampilkan indikator loading dan pesan jika proses gagal.
-   Cegah pengiriman pemeriksaan ganda akibat klik berulang.
-   Terapkan pagination atau pencarian server-side untuk data yang
    banyak.
-   Lakukan backup database secara terjadwal.

### 11.4 Kompatibilitas

-   Mendukung browser modern pada Android, iOS, Windows, dan macOS.
-   Desain mobile-first karena petugas dan orang tua kemungkinan besar
    mengakses melalui ponsel.

------------------------------------------------------------------------

## 12. Rancangan Halaman

### 12.1 Halaman publik

-   Landing page sederhana.
-   Registrasi orang tua.
-   Login.
-   Lupa password.

### 12.2 Area Orang Tua

1.  **Dashboard**
    -   Sapaan dan ringkasan akun.
    -   Jumlah balita.
    -   Kartu balita.
    -   Status pemeriksaan bulan ini.
    -   Ringkasan informasi/pengumuman terbaru.
2.  **Detail Balita**
    -   Identitas balita.
    -   Tanggal lahir dan umur saat ini.
    -   Posyandu terdaftar.
    -   Tanggal pemeriksaan terakhir.
    -   Ringkasan indikator pertumbuhan.
3.  **Grafik Pertumbuhan**
    -   Grafik BB berdasarkan waktu.
    -   Grafik PB/TB berdasarkan waktu.
    -   Grafik indikator lain jika data tersedia.
    -   Pilihan rentang waktu.
    -   Keterangan hasil yang mudah dipahami.
4.  **Riwayat Pemeriksaan**
    -   Daftar tanggal pemeriksaan.
    -   Hasil pengukuran.
    -   Status validasi.
    -   Detail hasil per pemeriksaan.
5.  **Pengumuman dan Jadwal**
    -   Daftar pengumuman.
    -   Jadwal Posyandu.
    -   Informasi imunisasi.
6.  **Profil**
    -   Data akun orang tua.
    -   Ubah password.
    -   Logout.

### 12.3 Area Petugas

1.  **Dashboard**
    -   Statistik balita dan pemeriksaan.
    -   Ringkasan indikator.
    -   Daftar balita belum diperiksa.
    -   Daftar indikasi yang perlu ditinjau.
2.  **Data Balita**
    -   Tabel data balita.
    -   Pencarian dan filter.
    -   Tambah/edit/detail balita.
    -   Pemilihan akun orang tua.
    -   Pemilihan Posyandu.
3.  **Akun Orang Tua**
    -   Daftar akun.
    -   Pencarian akun.
    -   Tambah akun jika berwenang.
    -   Detail akun dan daftar balita yang dimiliki.
4.  **Pemeriksaan**
    -   Pilih Posyandu.
    -   Pilih balita.
    -   Form pengukuran.
    -   Validasi dan simpan.
    -   Riwayat pemeriksaan.
5.  **Monitoring**
    -   Detail pertumbuhan balita.
    -   Grafik.
    -   Hasil indikator.
    -   Daftar indikasi yang perlu ditinjau.
6.  **Posyandu dan Wilayah**
    -   Daftar Posyandu.
    -   Detail Posyandu.
    -   Data balita per Posyandu.
    -   Rekap aktivitas.
7.  **Laporan**
    -   Filter periode.
    -   Filter Posyandu.
    -   Filter balita.
    -   Tabel rekap.
    -   Ekspor Excel.
8.  **Pengumuman dan Jadwal**
    -   Daftar konten.
    -   Buat/edit/publikasi.
    -   Pengelolaan jadwal kegiatan dan imunisasi.
9.  **Profil Petugas**
    -   Profil.
    -   Ubah password.
    -   Logout.

------------------------------------------------------------------------

## 13. Kriteria Penerimaan (Acceptance Criteria)

### 13.1 Penetapan balita ke akun orang tua

-   Ketika petugas membuat data balita dan memilih akun orang tua,
    balita langsung muncul di akun orang tua tersebut.
-   Orang tua tidak diminta memasukkan kode, mengirim permintaan, atau
    melakukan proses pengaitan.
-   Jika satu orang tua memiliki tiga balita, ketiganya tampil pada
    dashboard akun yang sama.
-   Orang tua tidak dapat melihat balita yang ditetapkan ke akun lain.
-   Perubahan penetapan akun hanya dapat dilakukan petugas berwenang dan
    tercatat pada audit log.

### 13.2 Pemeriksaan

-   Petugas dapat menyimpan hasil pengukuran untuk balita yang dipilih.
-   Sistem menolak atau meminta konfirmasi untuk nilai yang tidak masuk
    akal berdasarkan aturan validasi yang dikonfigurasi.
-   Data draft tidak ditampilkan sebagai hasil final.
-   Setelah pemeriksaan divalidasi, data muncul pada riwayat dan grafik
    balita.
-   Perubahan data pemeriksaan menyimpan informasi siapa yang mengubah
    dan kapan perubahan dilakukan.

### 13.3 Monitoring

-   Grafik hanya menggunakan data pemeriksaan yang valid.
-   Sistem menampilkan satuan dan tanggal pengukuran.
-   Sistem tidak menampilkan hasil interpretasi jika data yang
    dibutuhkan belum lengkap.
-   Kategori indikator menggunakan standar antropometri yang telah
    disetujui dan dikonfigurasi.
-   Pesan risiko menyebutkan bahwa hasil merupakan indikasi awal dan
    perlu ditinjau petugas kesehatan.

### 13.4 Laporan

-   Filter bulan, tahun, Posyandu, dan balita menghasilkan data sesuai
    filter.
-   Ekspor Excel sesuai dengan hasil filter.
-   Petugas tidak dapat mengekspor data di luar wilayah aksesnya.

------------------------------------------------------------------------

## 14. Prioritas Pengembangan

  -----------------------------------------------------------------------
  Prioritas               Modul                   Alasan
  ----------------------- ----------------------- -----------------------
  P0                      Login, registrasi, dan  Fondasi keamanan sistem
                          hak akses               

  P0                      Data akun orang tua dan Menjamin balita
                          balita                  otomatis muncul pada
                                                  akun orang tua

  P0                      Pencatatan pemeriksaan  Fungsi inti Posyandu

  P0                      Validasi dan riwayat    Menjaga kualitas data
                          pemeriksaan             

  P0                      Perhitungan             Dasar monitoring dan
                          antropometri            indikasi risiko
                          tervalidasi             

  P0                      Dashboard dan detail    Akses informasi kedua
                          balita                  peran

  P1                      Grafik pertumbuhan      Memudahkan pemantauan
                                                  berkala

  P1                      Daftar belum diperiksa  Mendukung tindak lanjut
                          dan ringkasan risiko    petugas

  P1                      Laporan dan ekspor      Mendukung administrasi
                          Excel                   Posyandu

  P1                      Pengumuman dan jadwal   Komunikasi kepada orang
                                                  tua

  P2                      Informasi imunisasi     Pengembangan edukasi
                          lebih lengkap           

  P2                      Notifikasi pengingat    Dapat ditambahkan
                                                  setelah kanal
                                                  notifikasi dipilih

  P2                      Multi-wali untuk satu   Memerlukan aturan
                          balita                  persetujuan dan privasi
                                                  tambahan
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 15. Asumsi dan Keputusan Produk

1.  MVP dibuat sebagai aplikasi web responsif.
2.  Registrasi mandiri tersedia untuk orang tua.
3.  Akun petugas dibuat oleh administrator/pihak berwenang, bukan
    registrasi publik.
4.  Petugas memilih akun orang tua saat membuat data balita.
5.  Balita otomatis muncul pada akun orang tua setelah penetapan oleh
    petugas.
6.  Satu balita memiliki satu akun orang tua utama pada MVP.
7.  Satu akun orang tua dapat mengelola tampilan beberapa balita, tetapi
    tidak dapat mengubah data medis/pemeriksaan.
8.  Petugas memiliki batas wilayah atau Posyandu yang dapat diakses.
9.  Hasil pemeriksaan yang terlihat oleh orang tua adalah hasil yang
    telah divalidasi.
10. Algoritma antropometri harus ditetapkan bersama tenaga kesehatan dan
    mengacu pada standar resmi.
11. Notifikasi pada MVP dapat berupa penanda di dalam aplikasi; push
    notification/WhatsApp/email merupakan pengembangan lanjutan.
12. Penghapusan data penting sebaiknya menggunakan soft delete atau
    penonaktifan dan tetap menyimpan jejak audit.

------------------------------------------------------------------------

## 16. Risiko dan Mitigasi

  -----------------------------------------------------------------------
  Risiko                  Dampak                  Mitigasi
  ----------------------- ----------------------- -----------------------
  Salah memasukkan        Interpretasi            Validasi input dan
  tanggal lahir atau      antropometri keliru     konfirmasi data
  jenis kelamin                                   identitas

  Salah memasukkan satuan Hasil perhitungan tidak Label satuan, batas
  atau angka pengukuran   akurat                  kewajaran, dan
                                                  konfirmasi

  Data balita ditetapkan  Kebocoran data pribadi  Pencarian akun yang
  ke akun orang tua yang                          jelas, konfirmasi
  salah                                           sebelum simpan, audit
                                                  log

  Standar perhitungan     Indikasi risiko keliru  Validasi tenaga
  tidak sesuai                                    kesehatan dan
                                                  versioning algoritma

  Koneksi internet tidak  Pemeriksaan gagal       Indikator status simpan
  stabil                  tersimpan               dan pencegahan
                                                  duplikasi

  Akses petugas melewati  Akses data tanpa        Validasi otorisasi di
  wilayah tugas           kewenangan              backend pada setiap
                                                  permintaan

  Orang tua menganggap    Kekhawatiran atau       Bahasa edukatif dan
  penanda sebagai         tindakan yang tidak     arahan konsultasi
  diagnosis               tepat                   dengan petugas
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 17. Rekomendasi Teknologi untuk Vibe Coding

Pilihan stack dapat disesuaikan dengan kemampuan tim dan platform coding
yang digunakan. Rekomendasi awal:

-   **Frontend:** Next.js atau React.
-   **Styling/UI:** Tailwind CSS dan komponen UI yang konsisten.
-   **Backend dan database:** Supabase (PostgreSQL, Auth, Row Level
    Security) atau backend API setara.
-   **Chart:** Recharts atau library grafik sejenis.
-   **Ekspor Excel:** library XLSX di sisi server.
-   **Deployment:** platform hosting yang mendukung aplikasi web dan
    database terkelola.

### Catatan implementasi penting

-   Jangan hanya mengandalkan filter frontend untuk memisahkan data
    orang tua. Terapkan Row Level Security/pemeriksaan otorisasi
    backend.
-   Relasi `Child.parent_user_id` menjadi dasar agar data balita
    otomatis muncul pada akun orang tua.
-   Pastikan petugas hanya dapat mengakses data Posyandu yang menjadi
    kewenangannya.
-   Pisahkan data pengukuran mentah dari hasil perhitungan agar hasil
    dapat dihitung ulang ketika standar diperbarui.
-   Simpan versi standar dan algoritma pada hasil penilaian.
-   Buat seed data khusus development; jangan menggunakan data pribadi
    balita sungguhan untuk demo tanpa dasar dan izin yang sesuai.

------------------------------------------------------------------------

## 18. Rencana Tahapan Pengerjaan

### Tahap 1 --- Fondasi

-   Setup project dan database.
-   Autentikasi parent dan petugas.
-   Role dan pembatasan akses.
-   Profil pengguna.

### Tahap 2 --- Data Induk

-   CRUD akun orang tua.
-   CRUD data balita.
-   Penetapan langsung balita ke akun orang tua.
-   Data Posyandu dan akses wilayah.

### Tahap 3 --- Pemeriksaan

-   Form pemeriksaan.
-   Validasi input.
-   Riwayat pemeriksaan.
-   Status draft dan validasi.

### Tahap 4 --- Monitoring

-   Perhitungan IMT.
-   Integrasi standar antropometri yang telah divalidasi.
-   Ringkasan status dan indikasi risiko.
-   Grafik pertumbuhan.

### Tahap 5 --- Administrasi dan Komunikasi

-   Dashboard kedua peran.
-   Laporan dan ekspor Excel.
-   Pengumuman, jadwal Posyandu, dan informasi imunisasi.

### Tahap 6 --- Pengujian dan Rilis

-   Uji akses antar-akun orang tua.
-   Uji batas wilayah petugas.
-   Uji akurasi perhitungan dengan contoh yang diverifikasi tenaga
    kesehatan.
-   Uji tampilan mobile.
-   Uji backup, pemulihan, dan audit log.
-   Uji penerimaan bersama calon pengguna Posyandu.

------------------------------------------------------------------------

## 19. Hal yang Perlu Diputuskan Sebelum Produksi

1.  Standar antropometri dan versi pedoman yang akan digunakan.
2.  Siapa tenaga kesehatan yang memvalidasi rumus, kategori, dan pesan
    tindak lanjut.
3.  Apakah NIK balita benar-benar diperlukan atau cukup menggunakan ID
    internal.
4.  Struktur wilayah dan tingkat kewenangan petugas.
5.  Apakah satu balita hanya boleh memiliki satu akun orang tua atau
    dapat memiliki wali tambahan.
6.  Mekanisme verifikasi akun orang tua (OTP SMS, email, atau verifikasi
    manual).
7.  Kebijakan persetujuan, retensi, koreksi, dan penghapusan data.
8.  Apakah data pemeriksaan dapat langsung dipublikasikan setelah input
    atau harus melalui validasi petugas lain.

------------------------------------------------------------------------

**Akhir dokumen PRD --- Versi 1.0**
