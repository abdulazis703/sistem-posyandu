"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { mockAnnouncements } from "@/lib/mockData";

export default function LandingPage() {
  const [announcementFilter, setAnnouncementFilter] = useState("all");
  const [activeSection, setActiveSection] = useState("beranda");
  const heroVideoRef = React.useRef<HTMLVideoElement>(null);

  // Pastikan audio video 100% bisu/mati dan autoplay berjalan lancar di semua browser
  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = true;
      heroVideoRef.current.defaultMuted = true;
      heroVideoRef.current.volume = 0;
      heroVideoRef.current.play().catch(() => {});
    }
  }, []);

  // Scroll spy untuk sinkronisasi warna menu aktif saat pengguna scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["beranda", "jadwal-kegiatan", "fitur", "cara-kerja", "kontak"];
      const scrollPos = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredAnnouncements = mockAnnouncements.filter((item) => {
    if (announcementFilter === "all") return true;
    if (announcementFilter === "jadwal") return item.category === "Jadwal Posyandu";
    if (announcementFilter === "imunisasi") return item.category === "Imunisasi";
    if (announcementFilter === "edukasi") return item.category === "Edukasi Gizi" || item.category === "Pemberitahuan";
    return true;
  });
  return (
    <div className="min-h-screen flex flex-col antialiased bg-[#f7faf8] text-[#1f2937]">
      {/* 1. STICKY NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2ebe5]">
        <div className="max-w-[1240px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#15803d] flex items-center justify-center text-white shadow-sm shadow-[#15803d]/20 group-hover:scale-105 transition-transform">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22v-9" />
                <path d="M12 13C8.5 13 4 9.5 4 4c5.5 0 8 4.5 8 9z" fill="rgba(255,255,255,0.2)" />
                <path d="M12 9c3.5 0 8-3.5 8-7-4.5 0-7 3.5-8 7z" fill="rgba(255,255,255,0.2)" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#14532d] block font-heading leading-tight">
                TumbuhKu
              </span>
              <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider block">
                Posyandu Digital KMS
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-[15px]">
            <a
              href="#beranda"
              onClick={() => setActiveSection("beranda")}
              className={`transition-all py-1 ${
                activeSection === "beranda"
                  ? "text-[#15803d] font-bold border-b-2 border-[#15803d]"
                  : "text-gray-600 font-medium hover:text-[#15803d]"
              }`}
            >
              Beranda
            </a>
            <a
              href="#jadwal-kegiatan"
              onClick={() => setActiveSection("jadwal-kegiatan")}
              className={`transition-all py-1 ${
                activeSection === "jadwal-kegiatan"
                  ? "text-[#15803d] font-bold border-b-2 border-[#15803d]"
                  : "text-gray-600 font-medium hover:text-[#15803d]"
              }`}
            >
              Jadwal & Pengumuman
            </a>
            <a
              href="#fitur"
              onClick={() => setActiveSection("fitur")}
              className={`transition-all py-1 ${
                activeSection === "fitur"
                  ? "text-[#15803d] font-bold border-b-2 border-[#15803d]"
                  : "text-gray-600 font-medium hover:text-[#15803d]"
              }`}
            >
              Fitur Utama
            </a>
            <a
              href="#cara-kerja"
              onClick={() => setActiveSection("cara-kerja")}
              className={`transition-all py-1 ${
                activeSection === "cara-kerja"
                  ? "text-[#15803d] font-bold border-b-2 border-[#15803d]"
                  : "text-gray-600 font-medium hover:text-[#15803d]"
              }`}
            >
              Cara Kerja
            </a>
            <a
              href="#kontak"
              onClick={() => setActiveSection("kontak")}
              className={`transition-all py-1 ${
                activeSection === "kontak"
                  ? "text-[#15803d] font-bold border-b-2 border-[#15803d]"
                  : "text-gray-600 font-medium hover:text-[#15803d]"
              }`}
            >
              Kontak
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2.5 text-sm font-semibold text-[#14532d] hover:text-[#15803d] hover:bg-[#f0fdf4] rounded-xl transition-all"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d] shadow-sm shadow-[#15803d]/25 rounded-xl transition-all flex items-center gap-2"
            >
              <span>Daftar Orang Tua</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="beranda" className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-slate-900">
        {/* Background Video Penuh Tanpa Suara */}
        <video
          ref={heroVideoRef}
          src="/video/baby beranda.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Readability & Overlay Gradasi Lembut agar Seluruh Teks Tetap Kontras & Jelas Terbaca */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30 z-0 pointer-events-none" />

        <div className="relative z-10 max-w-[1240px] mx-auto px-6 py-6 lg:py-10">
          {/* Hero Content - Terfokus di Sisi Kiri agar Background Video Ibu & Anak Terlihat Luas & Bersih */}
          <div className="max-w-2xl lg:max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#dcfce7]/95 backdrop-blur-xs border border-[#bbf7d0] text-[#166534] text-xs font-semibold tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></span>
              <span className="font-bold">Posyandu Digital & KMS Terintegrasi</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#14532d] leading-[1.15] tracking-tight font-heading">
              Pantau Tumbuh Kembang Si Kecil,{" "}
              <span className="text-[#15803d] underline decoration-[#bbf7d0] decoration-wavy decoration-2">
                Lebih Ceria
              </span>{" "}
              dan Sehat Optimal
            </h1>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-xl font-medium">
              Pencatatan penimbangan ceria, visualisasi grafik KMS WHO otomatis, serta panduan nutrisi interaktif untuk keluarga Indonesia bebas stunting.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="px-7 py-3.5 bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d] text-white font-semibold text-base rounded-xl shadow-md shadow-[#15803d]/20 transition-all flex items-center gap-2.5 group"
              >
                <span>Daftar Sekarang</span>
                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="px-6 py-3.5 bg-white/95 hover:bg-white border border-[#e2ebe5] text-[#14532d] font-semibold text-base rounded-xl shadow-sm transition-all flex items-center gap-2 backdrop-blur-xs"
              >
                <svg className="w-5 h-5 text-[#15803d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Masuk Petugas & Kader</span>
              </Link>
            </div>

            {/* Social Proof & Cheerful Community Badge */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center -space-x-2">
                <div className="w-7 h-7 rounded-full bg-emerald-200 border-2 border-white flex items-center justify-center text-xs font-bold text-emerald-800">RW</div>
                <div className="w-7 h-7 rounded-full bg-[#bbf7d0] border-2 border-white flex items-center justify-center text-xs font-bold text-[#166534]">04</div>
                <div className="w-7 h-7 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center text-xs font-bold text-amber-800">ID</div>
              </div>
              <span className="bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-2xs">
                Dipercaya ribuan kader Posyandu Melati & Puskesmas Sukamaju
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST CARDS */}
      <section className="py-14 bg-white border-y border-[#e2ebe5]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#f7faf8] rounded-2xl overflow-hidden border border-[#e2ebe5] hover:border-emerald-200 hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-emerald-100">
                <img
                  src="/foto/Pencatatan%20Terpusat.jpg"
                  alt="Pencatatan Terpusat"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[20px] text-[#15803d]">folder_shared</span>
                    <h3 className="text-base font-bold text-[#14532d] font-heading">Pencatatan Terpusat</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Data penimbangan tersimpan aman dan terintegrasi standar formulir e-PPGBM Kemenkes RI.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#15803d]">
                  <span>Standar Formulir e-PPGBM</span>
                </div>
              </div>
            </div>

            <div className="bg-[#f7faf8] rounded-2xl overflow-hidden border border-[#e2ebe5] hover:border-emerald-200 hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-emerald-100">
                <img
                  src="/foto/Grafik%20Mudah%20Dipahami.jpg"
                  alt="Grafik Mudah Dipahami"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[20px] text-[#15803d]">monitoring</span>
                    <h3 className="text-base font-bold text-[#14532d] font-heading">Grafik Mudah Dipahami</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Visualisasi kurva KMS otomatis memudahkan orang tua memantau zona tumbuh kembang anak.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#15803d]">
                  <span>Rujukan Kurva Baku WHO</span>
                </div>
              </div>
            </div>

            <div className="bg-[#f7faf8] rounded-2xl overflow-hidden border border-[#e2ebe5] hover:border-emerald-200 hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-emerald-100">
                <img
                  src="/foto/Deteksi%20Dini%20Risiko.jpg"
                  alt="Deteksi Dini Risiko"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[20px] text-[#15803d]">verified_user</span>
                    <h3 className="text-base font-bold text-[#14532d] font-heading">Deteksi Dini Risiko</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Peringatan dini faltering growth dan indikasi stunting untuk respons cepat bidan desa.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#15803d]">
                  <span>Peringatan Cepat & Rujukan Puskesmas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FITUR UTAMA */}
      <section id="fitur" className="py-20 bg-[#f7faf8]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 bg-[#dcfce7] text-[#166534] text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
              Fitur Utama
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#14532d] font-heading">
              Teknologi Ramah untuk Posyandu Digital
            </h2>
            <p className="text-slate-500 mt-2 text-xs sm:text-sm">
              Alat bantu terpadu untuk pencatatan kader posyandu dan pemantauan mandiri orang tua.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Fitur 1: Buku KMS Digital */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#e2ebe5] shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-emerald-100">
                <img
                  src="/foto/Buku%20KMS.jpg"
                  alt="Buku KMS Digital"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[20px] text-[#15803d]">menu_book</span>
                    <h3 className="text-base font-bold text-[#14532d] font-heading">Buku KMS Digital</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Buku KIA/KMS digital yang selalu tersimpan rapi dan dapat diakses kapan saja dari ponsel.
                  </p>
                </div>
                <span className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#15803d] flex items-center gap-1">Akses Mandiri Ibu & Ayah →</span>
              </div>
            </div>

            {/* Fitur 2: Kalkulator Z-Score Otomatis */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#e2ebe5] shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-emerald-100">
                <img
                  src="/foto/Kalkulator.jpg"
                  alt="Kalkulator Z-Score Otomatis"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[20px] text-[#15803d]">calculate</span>
                    <h3 className="text-base font-bold text-[#14532d] font-heading">Kalkulator Z-Score Otomatis</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Kalkulasi instan antropometri BB/U, TB/U, dan BB/TB sesuai standar baku WHO & Kemenkes.
                  </p>
                </div>
                <span className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#15803d] flex items-center gap-1">Presisi Standar WHO →</span>
              </div>
            </div>

            {/* Fitur 3: Peringatan Dini Stunting */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#e2ebe5] shadow-xs hover:shadow-md hover:border-amber-200 transition-all flex flex-col justify-between group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-amber-50">
                <img
                  src="/foto/Peringatan%20dini.jpg"
                  alt="Peringatan Dini Stunting"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[20px] text-amber-600">warning</span>
                    <h3 className="text-base font-bold text-[#14532d] font-heading">Peringatan Dini Stunting</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Deteksi awal indikasi stunting dan gizi kurang untuk penanganan cepat puskesmas.
                  </p>
                </div>
                <span className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-amber-700 flex items-center gap-1">Pencegahan Intervensi Cepat →</span>
              </div>
            </div>

            {/* Fitur 4: Pengingat Jadwal Posyandu */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#e2ebe5] shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-emerald-100">
                <img
                  src="/foto/Pengingat%20Jadwal.jpg"
                  alt="Pengingat Jadwal Posyandu"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[20px] text-[#15803d]">notifications_active</span>
                    <h3 className="text-base font-bold text-[#14532d] font-heading">Pengingat Jadwal Posyandu</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Notifikasi jadwal penimbangan, imunisasi, dan vitamin A agar balita tidak terlewat.
                  </p>
                </div>
                <span className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#15803d] flex items-center gap-1">Pengingat WhatsApp & Web →</span>
              </div>
            </div>

            {/* Fitur 5: Edukasi Gizi & MP-ASI */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#e2ebe5] shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-emerald-100">
                <img
                  src="/foto/Edukasi%20Gizi.jpg"
                  alt="Edukasi Gizi & MP-ASI"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[20px] text-[#15803d]">nutrition</span>
                    <h3 className="text-base font-bold text-[#14532d] font-heading">Edukasi Gizi & MP-ASI</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Panduan nutrisi seimbang, resep protein hewani, dan konsultasi kesehatan balita terpercaya.
                  </p>
                </div>
                <span className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#15803d] flex items-center gap-1">Materi Terverifikasi Bidan →</span>
              </div>
            </div>

            {/* Fitur 6: Ekspor Rekap SKDN & Laporan */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#e2ebe5] shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-emerald-100">
                <img
                  src="/foto/Laporan.jpg"
                  alt="Ekspor Rekap SKDN & Laporan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[20px] text-[#15803d]">description</span>
                    <h3 className="text-base font-bold text-[#14532d] font-heading">Ekspor Rekap SKDN & Laporan</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Cetak dan unduh rekapitulasi SKDN bulanan format PDF atau Excel sekali klik.
                  </p>
                </div>
                <span className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#15803d] flex items-center gap-1">Otomasi Rekapitulasi RW/Desa →</span>
              </div>
            </div>
          </div>

          {/* Section Edukasi Video Kemenkes RI */}
          <div className="mt-16 bg-white rounded-2xl border border-[#e2ebe5] p-6 sm:p-8 lg:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full uppercase tracking-wider border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  Video Edukasi Resmi Kemenkes RI
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#14532d] font-heading leading-tight">
                  Pencegahan Stunting Dimulai dari 1000 Hari Pertama Kehidupan
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Panduan edukasi nutrisi seimbang, ASI eksklusif, dan rutin menimbang balita di Posyandu setiap bulan.
                </p>
                <div className="pt-2 flex flex-col gap-2 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                    <span>Rutin pantau BB & TB di Posyandu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                    <span>Protein hewani harian untuk cegah stunting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                    <span>Kenali gejala perlambatan tumbuh kembang sedini mungkin</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-900">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/y1Qw-GxfGkE"
                    title="Edukasi Pencegahan Stunting Kemenkes RI"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full object-cover border-0"
                  ></iframe>
                </div>
                <p className="text-xs text-slate-500 text-center mt-2.5">
                  Sumber: Kampanye Nasional Cegah Stunting — Kementerian Kesehatan RI
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* JADWAL KEGIATAN & PENGUMUMAN PUBLIK (SEBELUM LOGIN) */}
      <section id="jadwal-kegiatan" className="py-20 bg-white border-t border-[#e2ebe5]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#dcfce7] text-[#166534] text-xs font-semibold rounded-full uppercase tracking-wider mb-2 border border-emerald-200">
                <span className="material-symbols-outlined text-[15px]">event</span>
                Informasi & Jadwal Publik
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#14532d] font-heading tracking-tight">
                Jadwal Kegiatan & Berita Posyandu
              </h2>
              <p className="text-slate-500 mt-2 text-xs sm:text-sm">
                Informasi jadwal penimbangan, imunisasi rutin, dan edukasi nutrisi wilayah posyandu.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
              {[
                { key: "all", label: "Semua" },
                { key: "jadwal", label: "Jadwal Posyandu" },
                { key: "imunisasi", label: "Imunisasi" },
                { key: "edukasi", label: "Edukasi Gizi" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setAnnouncementFilter(f.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    announcementFilter === f.key
                      ? "bg-white text-emerald-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredAnnouncements.map((item) => {
              // Menggunakan file foto lokal dari folder /foto/ sesuai instruksi pengguna
              let imgUrl = "/foto/bayi%20ditimbang.jpg";

              const lowerTitle = item.title.toLowerCase();
              const lowerContent = (item.content || "").toLowerCase();

              if (lowerTitle.includes("penimbangan") || lowerTitle.includes("vitamin a")) {
                // Foto bayi sedang ditimbang
                imgUrl = "/foto/bayi%20ditimbang.jpg";
              } else if (lowerTitle.includes("imunisasi") || lowerTitle.includes("polio")) {
                // Foto bayi sedang diimunisasi / suntik
                imgUrl = "/foto/bayi%20imunisasi.jpg";
              } else if (lowerTitle.includes("protein") || lowerTitle.includes("mp-asi") || (lowerTitle.includes("gizi") && !lowerTitle.includes("konsultasi") && !lowerTitle.includes("pojok gizi"))) {
                // Foto makanan MPASI
                imgUrl = "/foto/mpasi.jpg";
              } else if (lowerTitle.includes("konsultasi") || lowerTitle.includes("pojok gizi") || lowerContent.includes("konsultasi")) {
                // Foto konsultasi orang tua dan balita
                imgUrl = "/foto/konsultasi%20ortu%20balita.jpg";
              }

              return (
                <div
                  key={item.id}
                  className="bg-[#f8faf9] rounded-2xl overflow-hidden border border-[#e2ebe5] hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-emerald-100">
                    <img
                      src={imgUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs ${
                          item.category === "Jadwal Posyandu"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.category === "Imunisasi"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                    {item.isImportant && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="flex items-center gap-1 text-xs font-bold bg-white/95 text-rose-600 px-2.5 py-0.5 rounded-xl shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                          Penting
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-[#0b1c30] text-base leading-snug line-clamp-2 mb-2">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                        {item.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200/70 space-y-2 text-xs text-slate-500">
                      {item.eventDate && (
                        <div className="flex items-center gap-1.5 font-medium text-emerald-800">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">calendar_month</span>
                          <span>{item.eventDate}</span>
                        </div>
                      )}

                      {item.location && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                          <span className="truncate">{item.location}</span>
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs text-slate-400">{item.publishedBy}</span>
                        <Link
                          href={`/login?redirect=/parent/pengumuman&reason=jadwal&tab=${
                            item.category === "Jadwal Posyandu"
                              ? "jadwal-posyandu"
                              : item.category === "Imunisasi"
                              ? "jadwal-imunisasi"
                              : "edukasi-gizi"
                          }`}
                          title="Masuk untuk membaca info lengkap"
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 group/btn"
                        >
                          <span>Baca Info</span>
                          <span className="material-symbols-outlined text-[14px] group-hover/btn:translate-x-0.5 transition-transform">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Info Strip */}
          <div className="mt-10 p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-emerald-950">
                  Ingin menerima pengingat otomatis jadwal penimbangan wilayah Anda?
                </p>
                <p className="text-xs text-emerald-800">
                  Daftarkan balita Anda atau masuk dengan akun orang tua untuk mengaktifkan notifikasi SMS & WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/register"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
              >
                Daftar Akun Gratis
              </Link>
              <Link
                href="/login?redirect=/parent/pengumuman&reason=jadwal"
                className="px-4 py-2 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px] text-emerald-700">lock</span>
                <span>Lihat Semua Jadwal</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CARA KERJA */}
      <section id="cara-kerja" className="py-20 bg-white border-t border-[#e2ebe5]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-[#dcfce7] text-[#166534] text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
              Alur Mudah
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#14532d] font-heading">
              Cara Kerja TumbuhKu
            </h2>
            <p className="text-slate-500 mt-2 text-xs sm:text-sm">
              Tiga langkah mudah menghubungkan meja penimbangan Posyandu langsung ke ponsel keluarga.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-[#15803d] shadow-sm flex items-center justify-center text-[#15803d] mb-6 group transition-transform hover:scale-105 relative">
                <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-[#15803d] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span className="material-symbols-outlined text-[32px]">edit_calendar</span>
              </div>
              <h3 className="text-base font-bold text-[#14532d] font-heading mb-1.5">Petugas Mencatat Pemeriksaan</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Kader memasukkan data BB, TB, dan lingkar kepala balita secara cepat pada hari buka Posyandu.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-[#15803d] shadow-sm flex items-center justify-center text-[#15803d] mb-6 group transition-transform hover:scale-105 relative">
                <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-[#15803d] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span className="material-symbols-outlined text-[32px]">sync_alt</span>
              </div>
              <h3 className="text-base font-bold text-[#14532d] font-heading mb-1.5">Data Sinkron ke Akun Orang Tua</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Hasil penimbangan otomatis tampil di dasbor orang tua tanpa perlu memasukkan kode klaim manual.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-[#15803d] shadow-sm flex items-center justify-center text-[#15803d] mb-6 group transition-transform hover:scale-105 relative">
                <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-[#15803d] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span className="material-symbols-outlined text-[32px]">query_stats</span>
              </div>
              <h3 className="text-base font-bold text-[#14532d] font-heading mb-1.5">Pantau Grafik & Gizi Balita</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Orang tua dapat memantau tren kurva KMS, status stunting, dan rekomendasi nutrisi secara berkala.
              </p>
            </div>
          </div>

          <div className="mt-14 p-6 bg-[#f0fdf4] rounded-2xl border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[#15803d] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#14532d] font-heading">Siap mendigitalisasi Posyandu wilayah Anda?</p>
                <p className="text-xs text-slate-500">Dukungan teknis dan panduan untuk seluruh kader RW dan desa.</p>
              </div>
            </div>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold rounded-xl whitespace-nowrap shadow-xs transition-all"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* 6. MEDICAL DISCLAIMER */}
      <section className="py-6 bg-[#f7faf8] border-t border-[#e2ebe5]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="bg-white/80 rounded-2xl p-4 border border-[#e2ebe5] flex items-center justify-center gap-3 text-center">
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[16px]">info</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              <strong className="text-slate-800 font-semibold">Pemberitahuan Kesehatan:</strong> Hasil penimbangan dan analisis grafik pada TumbuhKu bersifat indikasi awal dan bukan diagnosis medis. Konsultasikan selalu perkembangan anak Anda dengan dokter atau tenaga kesehatan di Puskesmas terdekat.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer id="kontak" className="bg-[#14532d] text-white pt-16 pb-12 mt-auto border-t border-[#166534]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#166534]/80">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#15803d] flex items-center justify-center text-white border border-[#16a34a]">
                  <span className="material-symbols-outlined text-[24px]">potted_plant</span>
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-white font-heading">TumbuhKu</span>
                  <span className="text-[11px] font-medium text-emerald-300 uppercase tracking-wider block">
                    Sistem Pantau Gizi & KMS Posyandu
                  </span>
                </div>
              </div>
              <p className="text-sm text-emerald-100/80 leading-relaxed max-w-sm">
                Platform pemantauan tumbuh kembang balita berbasis komunitas untuk percepatan pencegahan stunting di tingkat Posyandu, Puskesmas, dan keluarga Indonesia.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading mb-4">Navigasi</h4>
              <ul className="space-y-2.5 text-sm text-emerald-100/75">
                <li><a href="#beranda" className="hover:text-white transition-colors">Beranda</a></li>
                <li><a href="#fitur" className="hover:text-white transition-colors">Fitur Utama</a></li>
                <li><a href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Masuk Petugas / Orang Tua</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading mb-4">Akses Cepat</h4>
              <ul className="space-y-2.5 text-sm text-emerald-100/75">
                <li><Link href="/staff/dashboard" className="hover:text-white transition-colors">Portal Kader</Link></li>
                <li><Link href="/parent/dashboard" className="hover:text-white transition-colors">Dasbor Orang Tua</Link></li>
                <li><Link href="/staff/balita" className="hover:text-white transition-colors">Data Balita</Link></li>
                <li><Link href="/staff/pemeriksaan" className="hover:text-white transition-colors">Catat Pemeriksaan</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading mb-4">Pusat Bantuan</h4>
              <ul className="space-y-2.5 text-sm text-emerald-100/75">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-300">mail</span>
                  <span>halo@tumbuhku.id</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-300">phone</span>
                  <span>(021) 8920-1924</span>
                </li>
                <li className="text-xs text-emerald-200/70 pt-2 leading-relaxed">
                  Posyandu Melati RW 04, Kel. Sukamaju, Kec. Cibeunying
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/70 gap-4">
            <p>© 2024 TumbuhKu (Sistem Pantau Gizi & KMS). Seluruh hak cipta dilindungi.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-white transition-colors cursor-pointer">Kebijakan Privasi</span>
              <span className="hover:text-white transition-colors cursor-pointer">Syarat & Ketentuan</span>
              <span className="hover:text-white transition-colors cursor-pointer">Standar WHO & Kemenkes</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
