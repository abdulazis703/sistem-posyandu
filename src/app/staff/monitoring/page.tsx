"use client";

import React, { useState } from "react";
import Link from "next/link";
import useChildrenData from "@/app/hooks/useChildrenData";
import { StuntingBadge } from "@/components/ui/badge";
import { calculateDetailedAge } from "@/lib/ageHelper";

export default function MonitoringTindakLanjutPage() {
  const { children, loading } = useChildrenData();
  const [activeTab, setActiveTab] = useState<"urgent" | "pmt">("urgent");

  const atRiskChildren = children.filter(
    (c) =>
      c.riskFlag !== "NORMAL" ||
      c.stuntingStatus.includes("Pendek") ||
      c.wastingStatus.includes("Kurang") ||
      c.wastingStatus.includes("Buruk")
  );

  const pmtChildren = atRiskChildren.filter(
    (c) =>
      c.wastingStatus.includes("Kurang") ||
      c.wastingStatus.includes("Buruk") ||
      c.stuntingStatus.includes("Pendek")
  );
  const pmtCount = pmtChildren.length;

  const displayedRows = activeTab === "pmt" ? pmtChildren : atRiskChildren;

  return (
    <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Monitoring &amp; Tindak Lanjut Stunting
            </h1>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold border border-rose-200/70">
              Prioritas Intervensi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau balita dengan risiko gagal tumbuh, pemberian makanan tambahan (PMT), dan tindak lanjut Puskesmas.
          </p>
        </div>

        <button
          onClick={() => alert("Mengunduh form rekapitulasi monitoring stunting...")}
          className="px-4 py-2.5 bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-slate-500">download</span>
          <span>Unduh Form Monitoring</span>
        </button>
      </div>

      {/* 2 Balanced Metric Cards (Centered) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">
            Kasus Butuh Tindak Lanjut
          </span>
          <p className="font-heading text-3xl lg:text-4xl font-extrabold text-rose-700">
            {loading ? "..." : atRiskChildren.length}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">
            Dalam Program PMT
          </span>
          <p className="font-heading text-3xl lg:text-4xl font-extrabold text-emerald-700">
            {loading ? "..." : pmtCount}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("urgent")}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === "urgent"
              ? "border-rose-600 text-rose-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>Perlu Konfirmasi Klinis ({atRiskChildren.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("pmt")}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === "pmt"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">lunch_dining</span>
          <span>Intervensi PMT Berjalan ({pmtCount})</span>
        </button>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 uppercase text-xs font-semibold border-b border-slate-100">
                <th className="py-3.5 px-5 align-middle whitespace-nowrap min-w-[200px]">Nama Balita &amp; NIK</th>
                <th className="py-3.5 px-4 align-middle whitespace-nowrap min-w-[120px]">Usia</th>
                <th className="py-3.5 px-4 align-middle whitespace-nowrap min-w-[170px]">Orang Tua / Kontak</th>
                <th className="py-3.5 px-4 align-middle whitespace-nowrap min-w-[160px]">Hasil Antropometri</th>
                <th className="py-3.5 px-4 align-middle whitespace-nowrap min-w-[150px]">Status &amp; Klasifikasi</th>
                <th className="py-3.5 px-4 align-middle min-w-[220px]">Rencana Tindak Lanjut</th>
                <th className="py-3.5 px-5 align-middle whitespace-nowrap text-right min-w-[120px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 px-5 text-center text-xs text-slate-500">
                    Memuat data monitoring balita dari Supabase...
                  </td>
                </tr>
              ) : displayedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 px-5 text-center text-xs text-slate-500">
                    Tidak ada kasus balita yang memerlukan tindak lanjut khusus saat ini.
                  </td>
                </tr>
              ) : (
                displayedRows.map((c) => {
                  const ageDetail = calculateDetailedAge(c.birthDate);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center shrink-0 text-xs">
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{c.name}</p>
                            <span className="text-xs text-slate-500 block">NIK: {c.nik}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <span className="font-semibold text-slate-900 text-sm block">{c.ageMonths} Bulan</span>
                        <span className="text-xs text-slate-500 block">{ageDetail.textBadge}</span>
                      </td>
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <p className="font-medium text-slate-900 text-sm">{c.parentName}</p>
                        <span className="text-xs text-slate-500 block">{c.posyandu}</span>
                      </td>
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <p className="font-semibold text-slate-900 text-sm">
                          {c.weight} kg / {c.height} cm
                        </p>
                        <span className="text-xs text-rose-700 font-medium block">
                          Z-Score: {c.zScoreTbU} SD
                        </span>
                      </td>
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <StuntingBadge status={c.stuntingStatus} />
                      </td>
                      <td className="py-3.5 px-4 align-middle text-xs text-slate-600 leading-relaxed">
                        Konseling PMT Biskuit 90 Hari + Evaluasi Puskesmas
                      </td>
                      <td className="py-3.5 px-5 align-middle whitespace-nowrap text-right">
                        <Link
                          href={`/staff/balita/${c.id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold inline-flex items-center gap-1 shadow-xs transition-colors whitespace-nowrap"
                        >
                          <span>Evaluasi</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
