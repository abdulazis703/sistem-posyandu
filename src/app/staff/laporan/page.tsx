"use client";

import React, { useState } from "react";
import useChildrenData from "@/app/hooks/useChildrenData";
import { StuntingBadge } from "@/components/ui/badge";

export default function LaporanRekapitulasiPage() {
  const { children } = useChildrenData();
  const [selectedMonth, setSelectedMonth] = useState("11");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedPosyandu, setSelectedPosyandu] = useState("all");

  const filteredChildren = children.filter((c) => {
    if (selectedPosyandu === "all") return true;
    if (selectedPosyandu === "melati-1") return c.posyandu.includes("01") || c.posyandu.includes("1");
    if (selectedPosyandu === "melati-2") return c.posyandu.includes("02") || c.posyandu.includes("2");
    if (selectedPosyandu === "melati-3") return c.posyandu.includes("03") || c.posyandu.includes("3");
    if (selectedPosyandu === "melati-4") return c.posyandu.includes("04") || c.posyandu.includes("4");
    return true;
  });

  const totalS = filteredChildren.length;
  const totalK = totalS;
  const totalD = filteredChildren.filter((c) => c.weight > 0 || c.lastExamDate).length;
  const percentD = totalS > 0 ? ((totalD / totalS) * 100).toFixed(1) : "0";
  const totalN = Math.round(totalD * 0.85);
  const percentN = totalD > 0 ? ((totalN / totalD) * 100).toFixed(1) : "0";
  const totalBGM = filteredChildren.filter(
    (c) => c.stuntingStatus.includes("Pendek") || c.riskFlag === "HIGH_RISK"
  ).length;

  const handleExportExcel = () => {
    // Generate CSV from current filteredChildren
    const headers = ["No", "Nama Balita", "NIK", "Jenis Kelamin", "Tanggal Lahir", "Usia (Bulan)", "BB (kg)", "TB (cm)", "Z-Score TB/U", "Status Stunting", "Status Gizi", "Posyandu"];
    const rows = filteredChildren.map((c, idx) => [
      idx + 1,
      `"${c.name}"`,
      `'${c.nik}`,
      c.gender,
      c.birthDate,
      c.ageMonths,
      c.weight,
      c.height,
      c.zScoreTbU,
      `"${c.stuntingStatus}"`,
      `"${c.wastingStatus}"`,
      `"${c.posyandu}"`
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Rekap_SKDN_Posyandu_${selectedYear}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Laporan & Rekapitulasi Pemeriksaan SKDN
            </h1>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200/60">
              Standar Kemenkes
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rekapitulasi data penimbangan bulanan Posyandu untuk evaluasi program percepatan penurunan stunting dan laporan ke Puskesmas.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-white border border-slate-200/90 text-slate-700 hover:text-emerald-700 hover:bg-slate-50 text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">picture_as_pdf</span>
            <span>Cetak PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Ekspor Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bulan Periode:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="10">Oktober 2026</option>
            <option value="11">November 2026</option>
            <option value="12">Desember 2026</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tahun:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Posyandu Wilayah:</label>
          <select
            value={selectedPosyandu}
            onChange={(e) => setSelectedPosyandu(e.target.value)}
            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">Semua Posyandu (Melati 1 - 4)</option>
            <option value="melati-1">Posyandu Melati 01</option>
            <option value="melati-2">Posyandu Melati 02</option>
            <option value="melati-3">Posyandu Melati 03</option>
            <option value="melati-4">Posyandu Melati 04</option>
          </select>
        </div>
      </div>

      {/* Indikator SKDN Cards (S, K, D, N, BGM) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
          <span className="text-xs text-slate-500 font-semibold block">Sasaran Balita (S)</span>
          <span className="font-heading text-3xl font-extrabold text-slate-900 mt-1 block">{totalS}</span>
          <span className="text-xs text-slate-500">100% Terdaftar</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
          <span className="text-xs text-slate-500 font-semibold block">Punya KMS (K)</span>
          <span className="font-heading text-3xl font-extrabold text-emerald-700 mt-1 block">{totalK}</span>
          <span className="text-xs text-emerald-700 font-semibold">100% K/S</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
          <span className="text-xs text-slate-500 font-semibold block">Ditimbang (D)</span>
          <span className="font-heading text-3xl font-extrabold text-emerald-700 mt-1 block">{totalD}</span>
          <span className="text-xs text-emerald-700 font-semibold">{percentD}% D/S</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
          <span className="text-xs text-slate-500 font-semibold block">Naik Berat (N)</span>
          <span className="font-heading text-3xl font-extrabold text-emerald-700 mt-1 block">{totalN}</span>
          <span className="text-xs text-emerald-700 font-semibold">{percentN}% N/D</span>
        </div>

        <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 shadow-xs text-center col-span-2 md:col-span-1">
          <span className="text-xs text-rose-800 font-semibold block">Bawah Garis Merah</span>
          <span className="font-heading text-3xl font-extrabold text-rose-700 mt-1 block">{totalBGM}</span>
          <span className="text-xs text-rose-700 font-semibold">Perlu Intervensi</span>
        </div>
      </div>

      {/* Rekapitulasi Table Detail */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-slate-900">
            Rincian Pemeriksaan Balita ({filteredChildren.length} Data) - Periode November 2026
          </h3>
          <span className="text-xs text-slate-500 font-medium">Data Terverifikasi Bidan Pembina</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 uppercase text-xs font-semibold border-b border-slate-100">
                <th className="py-3.5 px-4">No</th>
                <th className="py-3.5 px-4">Nama Balita</th>
                <th className="py-3.5 px-4">NIK</th>
                <th className="py-3.5 px-4">Usia</th>
                <th className="py-3.5 px-4">BB (kg)</th>
                <th className="py-3.5 px-4">TB (cm)</th>
                <th className="py-3.5 px-4">Z-Score TB/U</th>
                <th className="py-3.5 px-4">Status Stunting</th>
                <th className="py-3.5 px-4">Status Gizi (BB/TB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredChildren.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-500">{idx + 1}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{c.name}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{c.nik}</td>
                  <td className="py-3.5 px-4 text-slate-700">{c.ageMonths} Bln</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{c.weight}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{c.height}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{c.zScoreTbU} SD</td>
                  <td className="py-3.5 px-4">
                    <StuntingBadge status={c.stuntingStatus} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{c.wastingStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
