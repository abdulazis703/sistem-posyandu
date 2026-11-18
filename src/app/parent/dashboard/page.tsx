"use client";

import React from "react";
import Link from "next/link";
import useChildrenData from "@/app/hooks/useChildrenData";
import { mockChildren } from "@/lib/mockData";
import { StuntingBadge } from "@/components/ui/badge";
import { calculateDetailedAge } from "@/lib/ageHelper";

export default function ParentDashboardPage() {
  const { children } = useChildrenData();
  const matched = children.filter(
    (c) => c.parentId === "parent-1" || c.parentName.toLowerCase().includes("sari")
  );
  const myChildren = matched.length > 0 ? matched : (children.length > 0 ? children.slice(0, 2) : mockChildren.slice(0, 2));

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Subtle Disclaimer Banner */}
      <div className="w-full bg-emerald-50/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs border border-emerald-200/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
            <span className="material-symbols-outlined text-[20px]">info</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-900">
              Hasil ini adalah indikasi awal dan perlu ditinjau petugas kesehatan.
            </span>
            <span className="text-xs text-slate-500">
              Data bersumber dari penimbangan resmi kader Posyandu Melati.
            </span>
          </div>
        </div>
        <span className="text-xs font-semibold text-emerald-800 bg-white px-3 py-1 rounded-full shrink-0 border border-emerald-200/70 shadow-xs">
          Buku KIA Digital
        </span>
      </div>

      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Selamat datang, Bu Sari <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pantau perkembangan dan jadwal pemeriksaan rutin buah hati Anda di{" "}
            <strong className="text-slate-800 font-semibold">Posyandu Melati RW 04</strong>.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <button
            onClick={() => alert("Mengunduh rangkuman catatan KMS digital dalam format PDF...")}
            className="inline-flex items-center gap-2 bg-white text-slate-700 hover:text-emerald-700 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-50 border border-slate-200/90 shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">download</span>
            <span>Unduh Rangkuman KMS (PDF)</span>
          </button>
          <Link
            href="/parent/grafik"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-emerald-700 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">show_chart</span>
            <span>Buka Kurva Pertumbuhan</span>
          </Link>
        </div>
      </div>

      {/* Row of 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex items-start justify-between hover:shadow-sm transition-shadow">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Jumlah Balita Terdaftar
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-slate-900">
                {myChildren.length}
              </span>
              <span className="text-xs text-slate-500 font-medium">Anak</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-xs text-emerald-800 font-medium">Semua aktif terpantau</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <span className="material-symbols-outlined text-[28px]">family_restroom</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Pemeriksaan Bulan Ini
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-heading text-2xl lg:text-3xl font-extrabold text-slate-900">
                  1 <span className="text-xs text-slate-500 font-normal">dari {myChildren.length} Selesai</span>
                </span>
                <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  50%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <span className="material-symbols-outlined text-[26px]">event_available</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: "50%" }}></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
              <span>Periode: November 2026</span>
              <span className="font-semibold text-slate-800">Aisyah menunggu jadwal</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex items-start justify-between hover:shadow-sm transition-shadow">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Status Pertumbuhan
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-emerald-700">100%</span>
              <span className="text-xs text-slate-500 font-medium">Zona Hijau</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
              <span className="text-xs text-emerald-800 font-medium">Tumbuh Kembang Baik</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <span className="material-symbols-outlined text-[28px]">sentiment_very_satisfied</span>
          </div>
        </div>
      </div>

      {/* Children Cards List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold text-slate-900">
            Kartu Balita Saya ({myChildren.length} Anak)
          </h2>
          <span className="text-xs text-slate-500">
            Otomatis terhubung dari data Posyandu
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {myChildren.map((child) => (
            <div
              key={child.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-lg flex items-center justify-center border border-emerald-200">
                      {child.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-slate-900">
                        {child.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {calculateDetailedAge(child.birthDate).textLong} ({child.ageMonths} Bulan) • {child.gender === "L" ? "Laki-laki" : "Perempuan"}
                      </p>
                    </div>
                  </div>

                  <StuntingBadge status={child.stuntingStatus} />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 my-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-200/70">
                    <span className="text-xs text-slate-500 block">Berat Badan</span>
                    <span className="font-heading text-lg font-bold text-slate-900 mt-0.5 block">
                      {child.weight} <span className="text-xs font-normal text-slate-500">kg</span>
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold">Normal</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-200/70">
                    <span className="text-xs text-slate-500 block">Panjang/Tinggi</span>
                    <span className="font-heading text-lg font-bold text-slate-900 mt-0.5 block">
                      {child.height} <span className="text-xs font-normal text-slate-500">cm</span>
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold">Normal</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-200/70">
                    <span className="text-xs text-slate-500 block">Z-Score TB/U</span>
                    <span className="font-heading text-lg font-bold text-emerald-700 mt-0.5 block">
                      {child.zScoreTbU} <span className="text-xs font-normal text-slate-500">SD</span>
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold">Sesuai Usia</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <p>Terakhir ditimbang: <strong className="text-slate-800">{child.lastExamDate}</strong></p>
                  <p>Posyandu: <strong className="text-slate-800">{child.posyandu}</strong></p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/parent/riwayat"
                  className="text-xs font-semibold text-slate-600 hover:text-emerald-700"
                >
                  Riwayat Pengukuran
                </Link>
                <Link
                  href="/parent/grafik"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>Lihat Grafik</span>
                  <span className="material-symbols-outlined text-[16px]">show_chart</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
