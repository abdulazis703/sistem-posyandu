"use client";

import React, { useState } from "react";
import Link from "next/link";
import useChildrenData from "@/app/hooks/useChildrenData";
import { StuntingBadge } from "@/components/ui/badge";

export default function MonitoringTindakLanjutPage() {
  const { children } = useChildrenData();
  const [activeTab, setActiveTab] = useState<"urgent" | "pmt" | "rujukan">("urgent");

  const atRiskChildren = children.filter(
    (c) => c.riskFlag !== "NORMAL" || c.stuntingStatus.includes("Pendek") || c.wastingStatus.includes("Kurang") || c.wastingStatus.includes("Buruk")
  );

  const pmtCount = Math.max(1, atRiskChildren.filter((c) => c.wastingStatus.includes("Kurang") || c.stuntingStatus.includes("Pendek")).length);
  const rujukanCount = atRiskChildren.filter((c) => c.riskFlag === "HIGH_RISK" || c.riskFlag === "CRITICAL" || c.stuntingStatus.includes("Sangat")).length;

  return (
    <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Monitoring & Tindak Lanjut Stunting
            </h1>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold border border-rose-200/70">
              Prioritas Intervensi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau balita dengan risiko gagal tumbuh, pemberian makanan tambahan (PMT), dan rujukan Puskesmas.
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

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Kasus Butuh Tindak Lanjut</span>
            <p className="font-heading text-3xl lg:text-4xl font-extrabold text-rose-700 mt-1">{atRiskChildren.length}</p>
            <span className="text-xs text-rose-700 font-medium">Z-Score &lt; -2.0 SD</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100">
            <span className="material-symbols-outlined text-[24px]">priority_high</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Dalam Program PMT</span>
            <p className="font-heading text-3xl lg:text-4xl font-extrabold text-emerald-700 mt-1">{pmtCount}</p>
            <span className="text-xs text-emerald-800 font-medium">Intervensi Gizi & Biskuit</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <span className="material-symbols-outlined text-[24px]">restaurant</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Dirujuk ke Puskesmas</span>
            <p className="font-heading text-3xl lg:text-4xl font-extrabold text-slate-900 mt-1">{rujukanCount}</p>
            <span className="text-xs text-slate-500 font-medium">Konsultasi Dokter Anak</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200/80">
            <span className="material-symbols-outlined text-[24px]">local_hospital</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab("urgent")}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
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
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === "pmt"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">lunch_dining</span>
          <span>Intervensi PMT Berjalan</span>
        </button>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 uppercase text-xs font-semibold border-b border-slate-100">
                <th className="py-3.5 px-5">Nama Balita & NIK</th>
                <th className="py-3.5 px-4">Usia</th>
                <th className="py-3.5 px-4">Orang Tua / Kontak</th>
                <th className="py-3.5 px-4">Hasil Antropometri</th>
                <th className="py-3.5 px-4">Status & Klasifikasi</th>
                <th className="py-3.5 px-4">Rencana Tindak Lanjut</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {atRiskChildren.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center shrink-0 text-xs">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{c.name}</p>
                        <span className="text-xs text-slate-500">NIK: {c.nik}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{c.ageMonths} Bulan</td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <p className="font-medium text-slate-800">{c.parentName}</p>
                    <span className="text-xs text-slate-500">{c.posyandu}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <p className="font-semibold text-slate-900">{c.weight} kg / {c.height} cm</p>
                    <span className="text-xs text-rose-700 font-semibold">Z-Score: {c.zScoreTbU} SD</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StuntingBadge status={c.stuntingStatus} />
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    Konseling PMT Biskuit 90 Hari + Evaluasi Puskesmas
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <Link
                      href={`/staff/balita/${c.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold inline-flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <span>Evaluasi</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
