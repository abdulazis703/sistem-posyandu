"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockChildren, mockParents } from "@/lib/mockData";
import { StuntingBadge } from "@/components/ui/badge";

export default function StaffDashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const unexaminedChildren = [
    { name: "Dimas Nugraha", parent: "Rini W.", age: "14 Bulan", rt: "RT 02", phone: "081234567891" },
    { name: "Siti Rahma", parent: "Dewi K.", age: "22 Bulan", rt: "RT 01", phone: "081234567892" },
    { name: "Kenzo Pratama", parent: "Lina M.", age: "8 Bulan", rt: "RT 04", phone: "081234567893" },
    { name: "Zahra Fitria", parent: "Hana S.", age: "31 Bulan", rt: "RT 03", phone: "081234567894" },
  ];

  const atRiskChildren = mockChildren.filter((c) => c.riskFlag !== "NORMAL");

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Top Greeting & Operational Header */}
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6 pb-2">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200/60">
              <span className="material-symbols-outlined text-[16px] text-emerald-700">verified</span>
              Sistem Pemantauan Rutin SKDN
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Sinkronisasi Terakhir: 10 Menit Lalu</span>
          </div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Dasbor Operasional Petugas & Kader Posyandu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Pantau kelengkapan penimbangan balita bulanan, tren pertumbuhan, dan deteksi dini risiko stunting secara terpadu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/70 shadow-xs text-xs font-semibold">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">location_on</span>
            <span>Posyandu Melati 1 s/d 4</span>
          </div>
          <Link
            href="/staff/laporan"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-all text-xs font-semibold shadow-xs border border-slate-200/90"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">download</span>
            <span>Unduh Rekap SKDN</span>
          </Link>
          <Link
            href="/staff/pemeriksaan"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-xs font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Catat Pemeriksaan</span>
          </Link>
        </div>
      </header>

      {/* 4 Stat Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Balita */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-sm transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-600">Total Balita Terdaftar</span>
              <span className="text-xs text-slate-500">Sasaran Wilayah Binaan (S)</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0 border border-emerald-100">
              <span className="material-symbols-outlined text-[26px]">child_care</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">348</span>
              <span className="text-xs text-slate-500 font-medium">Jiwa</span>
            </div>
            <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+12 anak baru bulan ini</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pemeriksaan Bulan Ini */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-sm transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-600">Pemeriksaan Bulan Ini</span>
              <span className="text-xs text-slate-500">Cakupan Penimbangan (D/S)</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0 border border-emerald-100">
              <span className="material-symbols-outlined text-[26px]">fact_check</span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">286</span>
                <span className="text-sm text-slate-500 font-medium">/ 348</span>
              </div>
              <span className="text-xs font-bold text-emerald-700">82.2%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: "82.2%" }}></div>
            </div>
            <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/60">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>Target 90% tercapai dlm 6 hari</span>
            </div>
          </div>
        </div>

        {/* Card 3: Balita Perlu Ditinjau */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-sm transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-600">Balita Perlu Ditinjau</span>
              <span className="text-xs text-slate-500">Atensi Klinis & Konfirmasi</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700 shrink-0 border border-rose-100">
              <span className="material-symbols-outlined text-[26px]">warning</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-rose-700 tracking-tight">3</span>
              <span className="text-xs text-slate-500 font-medium">Balita</span>
            </div>
            <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-medium border border-rose-200/70">
              <span className="material-symbols-outlined text-[14px]">priority_high</span>
              <span>2 Sangat Pendek, 1 Gizi Kurang</span>
            </div>
          </div>
        </div>

        {/* Card 4: Posyandu Binaan */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-sm transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-600">Pos Layanan Terbuka</span>
              <span className="text-xs text-slate-500">Kelurahan Sukamaju</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 border border-slate-200/80">
              <span className="material-symbols-outlined text-[26px]">location_city</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">4</span>
              <span className="text-xs text-slate-500 font-medium">Posyandu Aktif</span>
            </div>
            <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200/60">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>100% Pos Terkoneksi Real-time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Left Analytics + Right Actionable Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">
          {/* Growth Status Breakdown Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Distribusi Status Pertumbuhan & Risiko Stunting (TB/U)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Berdasarkan standar antropometri WHO 2006 & Kemenkes RI 2024
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">Wilayah:</span>
                <select className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-emerald-500">
                  <option>Semua Posyandu Melati</option>
                  <option>Posyandu Melati 01</option>
                  <option>Posyandu Melati 02</option>
                  <option>Posyandu Melati 03</option>
                  <option>Posyandu Melati 04</option>
                </select>
              </div>
            </div>

            {/* Distribution Bar visual */}
            <div className="my-6">
              <div className="flex h-5 w-full rounded-full overflow-hidden shadow-xs gap-0.5 bg-slate-100">
                <div style={{ width: "78%" }} className="bg-emerald-600" title="Normal (78%)"></div>
                <div style={{ width: "12%" }} className="bg-amber-500" title="Perlu Dipantau (12%)"></div>
                <div style={{ width: "7%" }} className="bg-rose-500" title="Pendek/Stunted (7%)"></div>
                <div style={{ width: "3%" }} className="bg-rose-800" title="Sangat Pendek (3%)"></div>
              </div>

              {/* Legend & Count */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span className="text-xs font-semibold text-slate-800">Normal</span>
                  </div>
                  <p className="font-heading text-xl font-bold text-emerald-700 mt-2">
                    223 <span className="text-xs font-normal text-slate-500">anak</span>
                  </p>
                  <span className="text-xs text-slate-500">78.0% dari sasaran</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="text-xs font-semibold text-slate-800">Perlu Dipantau</span>
                  </div>
                  <p className="font-heading text-xl font-bold text-amber-700 mt-2">
                    34 <span className="text-xs font-normal text-slate-500">anak</span>
                  </p>
                  <span className="text-xs text-slate-500">12.0% garis mendatar</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="text-xs font-semibold text-slate-800">Pendek (Stunted)</span>
                  </div>
                  <p className="font-heading text-xl font-bold text-rose-700 mt-2">
                    20 <span className="text-xs font-normal text-slate-500">anak</span>
                  </p>
                  <span className="text-xs text-slate-500">Z-Score -2 s/d -3 SD</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-800"></span>
                    <span className="text-xs font-semibold text-slate-800">Sangat Pendek</span>
                  </div>
                  <p className="font-heading text-xl font-bold text-rose-900 mt-2">
                    9 <span className="text-xs font-normal text-slate-500">anak</span>
                  </p>
                  <span className="text-xs text-slate-500">Z-Score &lt; -3 SD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Children Needing Review Table */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Balita Membutuhkan Perhatian & Tindak Lanjut Klinis
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Daftar balita dengan indikator antropometri di luar batas rujukan normal atau faltering growth.
                </p>
              </div>
              <Link
                href="/staff/monitoring"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>Lihat Seluruh Kasus</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 uppercase text-xs font-semibold border-b border-slate-100">
                    <th className="py-3.5 px-5">Nama Balita & Umur</th>
                    <th className="py-3.5 px-4">Orang Tua / Wali</th>
                    <th className="py-3.5 px-4">BB / TB Terakhir</th>
                    <th className="py-3.5 px-4">Z-Score (TB/U)</th>
                    <th className="py-3.5 px-4">Status / Indikasi</th>
                    <th className="py-3.5 px-5 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {atRiskChildren.map((child) => (
                    <tr key={child.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center shrink-0 text-xs">
                            {child.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{child.name}</p>
                            <span className="text-xs text-slate-500">
                              {child.ageMonths} Bulan • {child.gender === "L" ? "Laki-laki" : "Perempuan"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800">{child.parentName}</p>
                        <span className="text-xs text-slate-500">{child.posyandu}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900">{child.weight} kg</span> /{" "}
                        <span className="font-semibold text-slate-900">{child.height} cm</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-rose-700">{child.zScoreTbU} SD</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StuntingBadge status={child.stuntingStatus} />
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href={`/staff/balita/${child.id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs transition-all inline-flex items-center gap-1 shadow-xs"
                        >
                          <span>Tinjau</span>
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Balita Belum Hadir Bulan Ini */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  Belum Ditimbang Bulan Ini
                </h3>
                <p className="text-xs text-slate-500">Periode November 2026</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
                {unexaminedChildren.length} Balita
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {unexaminedChildren.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                    <span className="text-xs text-slate-500 mt-0.5">
                      {item.age} • Ibu {item.parent} ({item.rt})
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Mengirim pesan WhatsApp pengingat posyandu ke Ibu ${item.parent} (${item.phone})...`)}
                    className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors shrink-0"
                    title="Kirim Pengingat WhatsApp"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert("Mengirim pesan siaran (broadcast WhatsApp) ke 4 orang tua balita yang belum hadir...")}
              className="w-full mt-4 py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
              <span>Kirim Pengingat Serentak (WA)</span>
            </button>
          </div>

          {/* Quick Schedule Widget */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-slate-900">
                Jadwal Posyandu Terdekat
              </h3>
              <Link href="/staff/pengumuman" className="text-xs font-semibold text-emerald-700 hover:underline">
                Kelola
              </Link>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  Posyandu Melati 04
                </span>
                <span className="text-xs font-semibold text-slate-600">Kamis, 14 Nov</span>
              </div>
              <p className="text-xs font-semibold text-slate-800">
                Penimbangan Rutin & Pemberian Vitamin A
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                Balai RW 04, Kelurahan Sukamaju
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
