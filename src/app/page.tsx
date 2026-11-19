"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { mockAnnouncements } from "@/lib/mockData";

export default function LandingPage() {
  const [announcementFilter, setAnnouncementFilter] = useState("all");
  const [activeSection, setActiveSection] = useState("beranda");

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
          <nav className="hidden md:flex items-center gap-8 text-[15px]">
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
              className="px-4 py-2.5 text-sm font-semibold text-[#14532d] hover:text-[#15803d] hover:bg-[#f0fdf4] rounded-[10px] transition-all"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d] shadow-sm shadow-[#15803d]/25 rounded-[10px] transition-all flex items-center gap-2"
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
      <section id="beranda" className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden blob-bg">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#dcfce7] border border-[#bbf7d0] text-[#166534] text-xs font-semibold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></span>
              <span>Sistem e-PPGBM & KMS Digital Posyandu Terintegrasi</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#14532d] leading-[1.15] tracking-tight font-heading">
              Pantau Tumbuh Kembang Si Kecil,{" "}
              <span className="text-[#15803d] underline decoration-[#bbf7d0] decoration-wavy decoration-2">
                Lebih Mudah
              </span>{" "}
              dan Lebih Dini
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Solusi pencatatan penimbangan digital Posyandu untuk orang tua dan kader. Pantau kurva berat badan, tinggi badan, serta deteksi risiko stunting secara transparan dan akurat.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="px-7 py-3.5 bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d] text-white font-semibold text-base rounded-[10px] shadow-md shadow-[#15803d]/20 transition-all flex items-center gap-2.5 group"
              >
                <span>Daftar Sekarang</span>
                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="px-6 py-3.5 bg-white hover:bg-[#f0fdf4] border border-[#e2ebe5] text-[#14532d] font-semibold text-base rounded-[10px] shadow-sm transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5 text-[#15803d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Masuk Petugas</span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-4 flex items-center gap-4 text-xs font-medium text-gray-500">
              <div className="flex items-center -space-x-2">
                <div className="w-7 h-7 rounded-full bg-emerald-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-800">RW</div>
                <div className="w-7 h-7 rounded-full bg-[#bbf7d0] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#166534]">04</div>
                <div className="w-7 h-7 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-amber-800">ID</div>
              </div>
              <span>Digunakan oleh ribuan kader Posyandu & Puskesmas binaan</span>
            </div>
          </div>

          {/* Right Dashboard Illustrated Preview Card */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#bbf7d0]/50 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-8 -left-8 w-60 h-60 bg-emerald-100 rounded-full blur-2xl -z-10"></div>

            {/* Main Card */}
            <div className="bg-white rounded-[16px] border border-[#e2ebe5] shadow-xl shadow-gray-200/50 p-6 md:p-7 relative transition-transform hover:-translate-y-1 duration-300">
              {/* Card Header */}
              <div className="flex items-start justify-between pb-5 border-b border-gray-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#dcfce7] text-[#166534] flex items-center justify-center font-bold text-base border border-[#bbf7d0]">
                    RA
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#14532d] font-heading">
                        Rayhan Al-Ghifari
                      </h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-[#15803d] border border-emerald-200">
                        Laki-laki
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      18 Bulan • Terakhir Timbang: 24 Okt 2024 (Posyandu Melati)
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-[#bbf7d0] text-[#15803d] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#15803d]"></span>
                  <span>Gizi Baik (Normal)</span>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-3 my-5">
                <div className="p-3 bg-[#f7faf8] rounded-xl border border-[#e2ebe5]">
                  <p className="text-[11px] font-medium text-gray-500">Berat Badan</p>
                  <p className="text-lg font-bold text-[#14532d] font-heading mt-0.5">
                    10.8 <span className="text-xs font-normal text-gray-500">kg</span>
                  </p>
                  <span className="text-[10px] text-[#15803d] font-medium">↑ +0.3 kg dr bln lalu</span>
                </div>
                <div className="p-3 bg-[#f7faf8] rounded-xl border border-[#e2ebe5]">
                  <p className="text-[11px] font-medium text-gray-500">Tinggi Badan</p>
                  <p className="text-lg font-bold text-[#14532d] font-heading mt-0.5">
                    82.5 <span className="text-xs font-normal text-gray-500">cm</span>
                  </p>
                  <span className="text-[10px] text-[#15803d] font-medium">↑ +1.2 cm dr bln lalu</span>
                </div>
                <div className="p-3 bg-[#f7faf8] rounded-xl border border-[#e2ebe5]">
                  <p className="text-[11px] font-medium text-gray-500">Z-Score (TB/U)</p>
                  <p className="text-lg font-bold text-[#15803d] font-heading mt-0.5">
                    -0.8 <span className="text-xs font-normal text-gray-500">SD</span>
                  </p>
                  <span className="text-[10px] text-emerald-600 font-medium">Standar Kemenkes RI</span>
                </div>
              </div>

              {/* Illustrated KMS Growth Chart */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[#14532d] font-heading">
                    Kurva Pertumbuhan KMS / Standar WHO
                  </span>
                  <span className="text-gray-500">Rentang 0 - 24 Bulan</span>
                </div>

                <div className="bg-gradient-to-b from-[#f0fdf4] to-white rounded-xl p-3 border border-emerald-100">
                  <svg viewBox="0 0 460 170" className="w-full h-36 overflow-visible" fill="none">
                    <line x1="30" y1="20" x2="440" y2="20" stroke="#E2EBE5" strokeDasharray="3 3" strokeWidth="1" />
                    <line x1="30" y1="60" x2="440" y2="60" stroke="#E2EBE5" strokeDasharray="3 3" strokeWidth="1" />
                    <line x1="30" y1="100" x2="440" y2="100" stroke="#E2EBE5" strokeDasharray="3 3" strokeWidth="1" />
                    <line x1="30" y1="140" x2="440" y2="140" stroke="#E2EBE5" strokeWidth="1" />

                    <path
                      d="M 30,120 Q 150,90 280,60 T 440,30 L 440,110 Q 300,125 150,140 T 30,150 Z"
                      fill="#DCFCE7"
                      fillOpacity="0.5"
                    />

                    <path d="M 30,120 Q 150,90 280,60 T 440,30" stroke="#86EFAC" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
                    <path d="M 30,150 Q 150,140 300,125 T 440,110" stroke="#86EFAC" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />

                    <path
                      d="M 30,138 L 90,125 L 160,112 L 230,95 L 300,82 L 350,72 L 350,140 L 30,140 Z"
                      fill="#15803d"
                      fillOpacity="0.1"
                    />

                    <path
                      d="M 30,138 L 90,125 L 160,112 L 230,95 L 300,82 L 350,72"
                      stroke="#15803D"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <circle cx="30" cy="138" r="3.5" fill="#FFFFFF" stroke="#15803D" strokeWidth="2.5" />
                    <circle cx="90" cy="125" r="3.5" fill="#FFFFFF" stroke="#15803D" strokeWidth="2.5" />
                    <circle cx="160" cy="112" r="3.5" fill="#FFFFFF" stroke="#15803D" strokeWidth="2.5" />
                    <circle cx="230" cy="95" r="3.5" fill="#FFFFFF" stroke="#15803D" strokeWidth="2.5" />
                    <circle cx="300" cy="82" r="3.5" fill="#FFFFFF" stroke="#15803D" strokeWidth="2.5" />
                    <circle cx="350" cy="72" r="7" fill="#15803D" fillOpacity="0.2" />
                    <circle cx="350" cy="72" r="4.5" fill="#15803D" />

                    <g transform="translate(285, 30)">
                      <rect width="115" height="28" rx="6" fill="#14532D" />
                      <text x="57" y="18" fill="#FFFFFF" fontSize="10" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600" textAnchor="middle">
                        18 Bln: 10.8 kg (Normal)
                      </text>
                    </g>

                    <text x="30" y="155" fill="#9CA3AF" fontSize="9" textAnchor="middle">0 Bln</text>
                    <text x="90" y="155" fill="#9CA3AF" fontSize="9" textAnchor="middle">3 Bln</text>
                    <text x="160" y="155" fill="#9CA3AF" fontSize="9" textAnchor="middle">6 Bln</text>
                    <text x="230" y="155" fill="#9CA3AF" fontSize="9" textAnchor="middle">9 Bln</text>
                    <text x="300" y="155" fill="#9CA3AF" fontSize="9" textAnchor="middle">12 Bln</text>
                    <text x="350" y="155" fill="#15803D" fontWeight="bold" fontSize="9" textAnchor="middle">18 Bln</text>
                    <text x="430" y="155" fill="#9CA3AF" fontSize="9" textAnchor="middle">24 Bln</text>
                  </svg>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-[#15803d] rounded"></span>
                      Garis Tumbuh Rayhan
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-2 bg-[#dcfce7] border border-[#bbf7d0] rounded"></span>
                      Rentang Normal WHO
                    </span>
                  </div>
                  <Link href="/parent/grafik" className="text-[#15803d] font-semibold hover:underline">
                    Lihat Buku KMS →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST CARDS */}
      <section className="py-14 bg-white border-y border-[#e2ebe5]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f7faf8] p-6 rounded-[16px] border border-[#e2ebe5] hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[24px]">folder_shared</span>
              </div>
              <h3 className="text-lg font-bold text-[#14532d] font-heading mb-1.5">Pencatatan Terpusat</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Data antropometri dari timbangan Posyandu tersimpan rapi secara digital, terhindar dari risiko buku KMS fisik hilang atau rusak.
              </p>
              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#15803d]">
                <span>Standar Formulir e-PPGBM</span>
              </div>
            </div>

            <div className="bg-[#f7faf8] p-6 rounded-[16px] border border-[#e2ebe5] hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[24px]">monitoring</span>
              </div>
              <h3 className="text-lg font-bold text-[#14532d] font-heading mb-1.5">Grafik Mudah Dipahami</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Visualisasi kurva KMS otomatis dan jelas. Orang tua dapat langsung memahami apakah berat dan tinggi anak berada di zona hijau ideal.
              </p>
              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#15803d]">
                <span>Rujukan Kurva Baku WHO</span>
              </div>
            </div>

            <div className="bg-[#f7faf8] p-6 rounded-[16px] border border-[#e2ebe5] hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <h3 className="text-lg font-bold text-[#14532d] font-heading mb-1.5">Deteksi Dini Risiko</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sistem otomatis menandai anak yang mengalami perlambatan tumbuh atau risiko stunting untuk segera mendapat tindak lanjut bidan desa.
              </p>
              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#15803d]">
                <span>Peringatan Cepat & Rujukan Puskesmas</span>
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
              Teknologi Ramah untuk Masa Depan Sehat Generasi Bangsa
            </h2>
            <p className="text-gray-600 mt-3 text-base">
              Dirancang spesifik untuk alur kerja kader di lapangan dan kemudahan akses bagi orang tua balita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-[16px] border border-[#e2ebe5] shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] text-[#15803d] border border-emerald-100 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[24px]">menu_book</span>
                </div>
                <h3 className="text-lg font-bold text-[#14532d] font-heading mb-2">Buku KMS Digital</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Konversi otomatis buku kesehatan ibu dan anak (KIA/KMS) menjadi arsip digital yang selalu ada di genggaman orang tua kapan saja.
                </p>
              </div>
              <span className="mt-4 text-xs font-semibold text-[#15803d] flex items-center gap-1">Akses Mandiri Ibu & Ayah →</span>
            </div>

            <div className="bg-white p-7 rounded-[16px] border border-[#e2ebe5] shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] text-[#15803d] border border-emerald-100 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[24px]">calculate</span>
                </div>
                <h3 className="text-lg font-bold text-[#14532d] font-heading mb-2">Kalkulator Z-Score Otomatis</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Kader tidak perlu lagi menghitung manual indeks antropometri BB/U, TB/U, dan BB/TB sesuai pedoman baku Kemenkes RI.
                </p>
              </div>
              <span className="mt-4 text-xs font-semibold text-[#15803d] flex items-center gap-1">Presisi Standar WHO →</span>
            </div>

            <div className="bg-white p-7 rounded-[16px] border border-[#e2ebe5] shadow-sm hover:shadow-md hover:border-amber-200 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[24px]">warning</span>
                </div>
                <h3 className="text-lg font-bold text-[#14532d] font-heading mb-2">Peringatan Dini Stunting</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Status warna berkategori halus (&ldquo;Perlu Dipantau&rdquo;, &ldquo;Perlu Ditinjau Petugas&rdquo;) tanpa menimbulkan kepanikan berlebih pada orang tua.
                </p>
              </div>
              <span className="mt-4 text-xs font-semibold text-amber-700 flex items-center gap-1">Pencegahan Intervensi Cepat →</span>
            </div>

            <div className="bg-white p-7 rounded-[16px] border border-[#e2ebe5] shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] text-[#15803d] border border-emerald-100 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[24px]">notifications_active</span>
                </div>
                <h3 className="text-lg font-bold text-[#14532d] font-heading mb-2">Pengingat Jadwal Posyandu</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Notifikasi otomatis jadwal sesi penimbangan bulanan, pemberian vitamin A, dan obat cacing agar balita tidak terlewat.
                </p>
              </div>
              <span className="mt-4 text-xs font-semibold text-[#15803d] flex items-center gap-1">Pengingat WhatsApp & Web →</span>
            </div>

            <div className="bg-white p-7 rounded-[16px] border border-[#e2ebe5] shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] text-[#15803d] border border-emerald-100 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[24px]">nutrition</span>
                </div>
                <h3 className="text-lg font-bold text-[#14532d] font-heading mb-2">Edukasi Gizi & MP-ASI</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Panduan menu gizi seimbang, ragam pangan lokal kaya protein hewani, dan kiat mengatasi anak sulit makan (GTM) dari ahli gizi.
                </p>
              </div>
              <span className="mt-4 text-xs font-semibold text-[#15803d] flex items-center gap-1">Materi Terverifikasi Bidan →</span>
            </div>

            <div className="bg-white p-7 rounded-[16px] border border-[#e2ebe5] shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] text-[#15803d] border border-emerald-100 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[24px]">description</span>
                </div>
                <h3 className="text-lg font-bold text-[#14532d] font-heading mb-2">Ekspor Rekap SKDN & Laporan</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Mudahkan kader Posyandu menyusun laporan bulanan SKDN dan rujukan Puskesmas dalam format PDF maupun Excel dengan satu kali klik.
                </p>
              </div>
              <span className="mt-4 text-xs font-semibold text-[#15803d] flex items-center gap-1">Otomasi Rekapitulasi RW/Desa →</span>
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
                Jadwal Kegiatan & Berita Posyandu Terkini
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base leading-relaxed">
                Warga dan orang tua dapat memantau ringkasan jadwal penimbangan posyandu, pekan imunisasi balita, dan edukasi gizi. Masuk ke akun Anda untuk membaca rincian lengkap.
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
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className="bg-[#f8faf9] rounded-2xl p-6 border border-[#e2ebe5] hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.category === "Jadwal Posyandu"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.category === "Imunisasi"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.category}
                    </span>

                    {item.isImportant && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                        Penting
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-[#0b1c30] text-base leading-snug line-clamp-2 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {item.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200/70 space-y-2 text-xs text-gray-500">
                  {item.eventDate && (
                    <div className="flex items-center gap-1.5 font-medium text-emerald-800">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">calendar_month</span>
                      <span>{item.eventDate}</span>
                    </div>
                  )}

                  {item.location && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <span className="material-symbols-outlined text-[16px] text-gray-400">location_on</span>
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">{item.publishedBy}</span>
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
            ))}
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
            <p className="text-gray-600 mt-3 text-base">
              Tiga langkah terpadu menghubungkan penimbangan di meja Posyandu langsung ke ponsel orang tua.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-[#15803d] shadow-md flex items-center justify-center text-[#15803d] mb-6 group transition-transform hover:scale-105 relative">
                <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-[#15803d] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span className="material-symbols-outlined text-[32px]">edit_calendar</span>
              </div>
              <h3 className="text-xl font-bold text-[#14532d] font-heading mb-2">Petugas Mencatat Pemeriksaan</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                Saat hari buka Posyandu, kader memasukkan data berat badan, tinggi/panjang badan, dan lingkar kepala balita ke aplikasi TumbuhKu.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-[#15803d] shadow-md flex items-center justify-center text-[#15803d] mb-6 group transition-transform hover:scale-105 relative">
                <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-[#15803d] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span className="material-symbols-outlined text-[32px]">sync_alt</span>
              </div>
              <h3 className="text-xl font-bold text-[#14532d] font-heading mb-2">Data Otomatis Muncul di Akun Orang Tua</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                Hasil penimbangan langsung tersinkronisasi secara real-time ke akun orang tua tanpa perlu proses klaim atau input kode tambahan.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-[#15803d] shadow-md flex items-center justify-center text-[#15803d] mb-6 group transition-transform hover:scale-105 relative">
                <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-[#15803d] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span className="material-symbols-outlined text-[32px]">query_stats</span>
              </div>
              <h3 className="text-xl font-bold text-[#14532d] font-heading mb-2">Pantau Grafik Pertumbuhan</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                Ibu & ayah melihat tren kurva KMS, status gizi balita, serta rekomendasi nutrisi untuk memastikan pertumbuhan anak optimal.
              </p>
            </div>
          </div>

          <div className="mt-14 p-6 bg-[#f0fdf4] rounded-[16px] border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[#15803d] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#14532d] font-heading">Siap mendigitalisasi Posyandu wilayah Anda?</p>
                <p className="text-xs text-gray-600">Dukungan teknis dan panduan untuk seluruh kader RW dan desa.</p>
              </div>
            </div>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold rounded-[10px] whitespace-nowrap shadow-sm transition-all"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* 6. MEDICAL DISCLAIMER */}
      <section className="py-6 bg-[#f7faf8] border-t border-[#e2ebe5]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="bg-white/80 rounded-xl p-4 border border-[#e2ebe5] flex items-center justify-center gap-3 text-center">
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[16px]">info</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              <strong className="text-gray-800 font-semibold">Pemberitahuan Kesehatan:</strong> Hasil penimbangan dan analisis grafik pada TumbuhKu bersifat indikasi awal dan bukan diagnosis medis. Konsultasikan selalu perkembangan anak Anda dengan dokter atau tenaga kesehatan di Puskesmas terdekat.
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
