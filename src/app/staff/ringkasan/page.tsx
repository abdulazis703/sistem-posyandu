"use client";

import React from "react";
import Link from "next/link";
import useChildrenData from "@/app/hooks/useChildrenData";

export default function RingkasanPosyanduPage() {
  const { children } = useChildrenData();

  const totalBalita = children.length;
  const hadirCount = children.filter((c) => c.weight > 0 || c.lastExamDate).length;
  const persenHadir = totalBalita > 0 ? ((hadirCount / totalBalita) * 100).toFixed(1) : "0";
  const belumHadir = Math.max(0, totalBalita - hadirCount);

  const getPosStats = (posKeyword: string, fallbackRatio: number) => {
    const matched = children.filter((c) => c.posyandu.toLowerCase().includes(posKeyword.toLowerCase()));
    const total = matched.length > 0 ? matched.length : Math.max(1, Math.round(totalBalita * fallbackRatio));
    const tertimbang = matched.length > 0 ? matched.filter((c) => c.weight > 0 || c.lastExamDate).length : Math.round(total * 0.85);
    const stunting = matched.length > 0 ? matched.filter((c) => c.stuntingStatus.includes("Pendek")).length : 2;
    const persen = total > 0 ? Math.round((tertimbang / total) * 1000) / 10 : 85;
    return { total, tertimbang, stunting, persen };
  };

  const pos1 = getPosStats("01", 0.28);
  const pos2 = getPosStats("02", 0.25);
  const pos3 = getPosStats("03", 0.23);
  const pos4 = getPosStats("04", 0.24);

  const posyanduData = [
    {
      id: "melati-1",
      name: "Posyandu Melati 01",
      location: "RW 01, Kel. Sukamaju",
      kader: "Ibu Siti Aminah (5 Kader)",
      totalBalita: pos1.total,
      hadir: pos1.tertimbang,
      persenHadir: pos1.persen,
      stuntingCount: pos1.stunting,
      jadwal: "Senin, 11 Nov 2026",
    },
    {
      id: "melati-2",
      name: "Posyandu Melati 02",
      location: "RW 02, Kel. Sukamaju",
      kader: "Ibu Rina Lestari (4 Kader)",
      totalBalita: pos2.total,
      hadir: pos2.tertimbang,
      persenHadir: pos2.persen,
      stuntingCount: pos2.stunting,
      jadwal: "Selasa, 12 Nov 2026",
    },
    {
      id: "melati-3",
      name: "Posyandu Melati 03",
      location: "RW 03, Kel. Sukamaju",
      kader: "Ibu Nurul Hidayah (5 Kader)",
      totalBalita: pos3.total,
      hadir: pos3.tertimbang,
      persenHadir: pos3.persen,
      stuntingCount: pos3.stunting,
      jadwal: "Rabu, 13 Nov 2026",
    },
    {
      id: "melati-4",
      name: "Posyandu Melati 04",
      location: "RW 04, Kel. Sukamaju",
      kader: "Bidan Sri Wahyuni (6 Kader)",
      totalBalita: pos4.total,
      hadir: pos4.tertimbang,
      persenHadir: pos4.persen,
      stuntingCount: pos4.stunting,
      jadwal: "Kamis, 14 Nov 2026",
    },
  ];

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Sistem e-PPGBM Terintegrasi
            </span>
            <span className="text-xs text-slate-500">Pembaruan data 15 menit lalu</span>
          </div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Ringkasan Posyandu & Wilayah Kerja
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Wilayah Binaan Kelurahan Sukamaju • Pemantauan 4 Pos Layanan Posyandu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/staff/laporan"
            className="px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 shadow-xs transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">print</span>
            <span>Cetak Rekap Wilayah</span>
          </Link>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-emerald-50/80 p-5 sm:p-6 shadow-xs border border-emerald-200/70">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h2 className="font-heading text-xl font-bold text-emerald-900">
              Ringkasan Capaian Penimbangan SKDN Bulanan 🌱
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Total sasaran balita di 4 Posyandu binaan berjumlah{" "}
              <strong className="text-emerald-950 font-bold">{totalBalita} anak</strong>, dengan{" "}
              <strong className="text-emerald-950 font-bold">{hadirCount} anak ({persenHadir}%)</strong> telah tercatat pada periode November 2026.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-xs border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="text-xs font-medium text-emerald-900">
                  Cakupan Rata-rata: <strong className="text-emerald-700">{persenHadir}%</strong> (Target Nasional 90%)
                </span>
              </div>
              <span className="text-xs text-slate-500">{belumHadir} balita belum hadir</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/staff/pemeriksaan"
              className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>+ Catat Pengukuran Baru</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Posyandu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {posyanduData.map((pos) => (
          <div
            key={pos.id}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-bold text-slate-900">
                      {pos.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                      Aktif
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                    {pos.location}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Jadwal Sesi</span>
                  <span className="text-xs font-bold text-slate-900">{pos.jadwal}</span>
                </div>
              </div>

              {/* Progress Bar Penimbangan */}
              <div className="my-4">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">Cakupan Penimbangan (D/S):</span>
                  <span className="font-bold text-slate-900">
                    {pos.hadir} / {pos.totalBalita} Anak ({pos.persenHadir}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${pos.persenHadir}%` }}
                  ></div>
                </div>
              </div>

              {/* Detail Metrics */}
              <div className="grid grid-cols-3 gap-3 my-3">
                <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-200/70">
                  <span className="text-xs text-slate-500 block font-medium">Sasaran Balita</span>
                  <span className="font-heading text-lg font-bold text-slate-900 mt-0.5 block">
                    {pos.totalBalita}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-200/70">
                  <span className="text-xs text-slate-500 block font-medium">Tertimbang</span>
                  <span className="font-heading text-lg font-bold text-emerald-700 mt-0.5 block">
                    {pos.hadir}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-200/70">
                  <span className="text-xs text-slate-500 block font-medium">Atensi Stunting</span>
                  <span className="font-heading text-lg font-bold text-rose-700 mt-0.5 block">
                    {pos.stuntingCount}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Koordinator: <strong className="text-slate-800 font-semibold">{pos.kader}</strong>
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/staff/balita"
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700"
              >
                Lihat Daftar Balita Pos
              </Link>
              <Link
                href="/staff/pemeriksaan"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1"
              >
                <span>Input Pemeriksaan</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
