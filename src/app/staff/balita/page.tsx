"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockChildren, Child } from "@/lib/mockData";
import { StuntingBadge } from "@/components/ui/badge";

export default function DataBalitaPage() {
  const [children, setChildren] = useState<Child[]>(mockChildren);
  const [search, setSearch] = useState("");
  const [selectedPosyandu, setSelectedPosyandu] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredChildren = children.filter((child) => {
    const matchSearch =
      child.name.toLowerCase().includes(search.toLowerCase()) ||
      child.nik.includes(search) ||
      child.parentName.toLowerCase().includes(search.toLowerCase());

    const matchPosyandu =
      selectedPosyandu === "all" || child.posyandu === selectedPosyandu;

    const matchStatus =
      selectedStatus === "all" ||
      (selectedStatus === "normal" && child.stuntingStatus === "Normal") ||
      (selectedStatus === "stunted" && child.stuntingStatus.includes("Pendek"));

    return matchSearch && matchPosyandu && matchStatus;
  });

  return (
    <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Header Area */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Data Balita
            </h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200/60">
              KMS & e-PPGBM Terintegrasi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Kelola data registrasi balita, status gizi tumbuh kembang, dan penugasan akun orang tua wilayah binaan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => alert("Mengekspor data seluruh balita ke Excel/CSV...")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-700 hover:text-emerald-700 text-xs font-semibold hover:bg-slate-50 transition-all border border-slate-200/90 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">file_download</span>
            <span>Ekspor Data (Excel/CSV)</span>
          </button>
          <Link
            href="/staff/balita/tambah"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Tambah Balita</span>
          </Link>
        </div>
      </header>

      {/* Top Summary Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Total Balita Terdaftar</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-slate-900">348</span>
              <span className="text-xs text-slate-500 font-medium">Anak</span>
            </div>
            <span className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +12 bulan ini
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <span className="material-symbols-outlined text-[24px]">child_care</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Status Gizi Normal</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-emerald-700">289</span>
              <span className="text-xs text-slate-500 font-medium">Anak</span>
            </div>
            <span className="text-xs text-emerald-700 font-medium mt-1">83.0% dari total balita</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Risiko Stunting (TB/U)</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-amber-700">30</span>
              <span className="text-xs text-slate-500 font-medium">Anak</span>
            </div>
            <span className="text-xs text-amber-700 font-medium mt-1">8.6% dalam pemantauan</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
            <span className="material-symbols-outlined text-[24px]">monitoring</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Perlu Tinjauan Gizi</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-rose-700">29</span>
              <span className="text-xs text-slate-500 font-medium">Anak</span>
            </div>
            <span className="text-xs text-rose-700 font-medium mt-1">Prioritas Intervensi</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari balita berdasarkan nama, NIK, atau nama orang tua..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedPosyandu}
            onChange={(e) => setSelectedPosyandu(e.target.value)}
            className="text-xs sm:text-sm py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Posyandu</option>
            <option value="Posyandu Melati 01">Posyandu Melati 01</option>
            <option value="Posyandu Melati 02">Posyandu Melati 02</option>
            <option value="Posyandu Melati 03">Posyandu Melati 03</option>
            <option value="Posyandu Melati 04">Posyandu Melati 04</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs sm:text-sm py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Status Gizi</option>
            <option value="normal">Gizi Normal</option>
            <option value="stunted">Risiko Stunted / Pendek</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 uppercase text-xs font-semibold border-b border-slate-100">
                <th className="py-3.5 px-5">Nama Balita</th>
                <th className="py-3.5 px-4">NIK & Gender</th>
                <th className="py-3.5 px-4">Usia</th>
                <th className="py-3.5 px-4">Orang Tua / Wali</th>
                <th className="py-3.5 px-4">Posyandu</th>
                <th className="py-3.5 px-4">BB / TB Terakhir</th>
                <th className="py-3.5 px-4">Status Stunting (TB/U)</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredChildren.map((child) => (
                <tr key={child.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                        {child.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Link
                          href={`/staff/balita/${child.id}`}
                          className="font-semibold text-slate-900 hover:text-emerald-700 transition-colors block"
                        >
                          {child.name}
                        </Link>
                        <span className="text-xs text-slate-500">
                          Lahir: {child.birthDate}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <p className="font-mono text-xs">{child.nik}</p>
                    <span className="text-xs text-slate-500">
                      {child.gender === "L" ? "Laki-laki" : "Perempuan"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {child.ageMonths} Bulan
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <p className="font-medium text-slate-800">{child.parentName}</p>
                    <span className="text-xs text-emerald-700 font-medium">Terhubung Otomatis</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {child.posyandu}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900">{child.weight} kg</span> /{" "}
                    <span className="font-semibold text-slate-900">{child.height} cm</span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {child.lastExamDate}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StuntingBadge status={child.stuntingStatus} />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/staff/balita/${child.id}`}
                        className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Lihat Detail Balita"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </Link>
                      <Link
                        href="/staff/pemeriksaan"
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        title="Catat Pemeriksaan Balita Ini"
                      >
                        <span className="material-symbols-outlined text-[18px]">add_chart</span>
                      </Link>
                    </div>
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
