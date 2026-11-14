"use client";

import React, { useState } from "react";
import Link from "next/link";
import useChildrenData from "@/app/hooks/useChildrenData";
import { mockChildren } from "@/lib/mockData";

export default function CatatPemeriksaanPage() {
  const { children, setChildren } = useChildrenData();
  const [selectedChildId, setSelectedChildId] = useState("");
  const [examDate, setExamDate] = useState("2026-10-24");
  const [weight, setWeight] = useState("10.8");
  const [height, setHeight] = useState("82.5");
  const [headCirc, setHeadCirc] = useState("46.5");
  const [lila, setLila] = useState("14.5");
  const [method, setMethod] = useState<"terlentang" | "berdiri">("terlentang");
  const [notes, setNotes] = useState("Anak aktif, nafsu makan baik.");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const effectiveId = selectedChildId || (children[0]?.id ?? mockChildren[0].id);
  const selectedChild =
    children.find((c) => c.id === effectiveId) || children[0] || mockChildren[0];

  // Dynamic preview calculation based on input
  const numWeight = parseFloat(weight) || 0;
  const numHeight = parseFloat(height) || 0;
  const isStuntedPreview = numHeight < 80;

  const handleSubmit = (status: "validated" | "draft") => {
    setLoading(true);
    setTimeout(() => {
      // Update data balita terpilih agar hasil pemeriksaan tersinkron ke dashboard & balita
      if (numWeight > 0 || numHeight > 0) {
        setChildren((prev) =>
          prev.map((c) =>
            c.id === selectedChild.id
              ? {
                  ...c,
                  weight: numWeight || c.weight,
                  height: numHeight || c.height,
                  headCircumference: parseFloat(headCirc) || c.headCircumference,
                  lila: parseFloat(lila) || c.lila,
                  lastExamDate: examDate,
                  stuntingStatus: isStuntedPreview ? "Pendek (Stunted)" : "Normal",
                  riskFlag: isStuntedPreview ? "MODERATE_RISK" : "NORMAL",
                  examStatus: status,
                }
              : c
          )
        );
      }
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 700);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/staff/dashboard" className="hover:text-emerald-700">Beranda</Link>
            <span>/</span>
            <span className="text-emerald-800 font-semibold">Pemeriksaan</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-heading text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
              Catat Pemeriksaan & Pengukuran Balita
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Mode Sesi Cepat Aktif
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Formulir cepat pencatatan antropometri bulanan balita di pos layanan Posyandu terintegrasi standar WHO & Kemenkes RI.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-xs text-slate-700 shadow-xs">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">event_available</span>
            <span>Kamis, 24 Okt 2026</span>
          </div>
          <Link
            href="/staff/balita"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-200/90 text-xs font-semibold shadow-xs hover:bg-slate-50 hover:text-emerald-700 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">groups</span>
            <span>Lihat Antrean Balita (18 Menunggu)</span>
          </Link>
        </div>
      </div>

      {/* Context Badges Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <span className="material-symbols-outlined text-[20px]">location_on</span>
          </div>
          <div className="min-w-0">
            <span className="text-xs text-slate-500 block uppercase font-medium">Lokasi</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">Posyandu Melati 04</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <span className="material-symbols-outlined text-[20px]">badge</span>
          </div>
          <div className="min-w-0">
            <span className="text-xs text-slate-500 block uppercase font-medium">Petugas</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">Bidan Sri Wahyuni</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/70">
            <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
          </div>
          <div className="min-w-0">
            <span className="text-xs text-slate-500 block uppercase font-medium">Capaian Sesi</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900">41 Terlayani / 59 Target</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </div>
          <div className="min-w-0">
            <span className="text-xs text-slate-500 block uppercase font-medium">Kalibrasi Alat</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-700">Terverifikasi Kemenkes</span>
          </div>
        </div>
      </div>

      {submitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center gap-3 text-emerald-900 shadow-xs">
          <span className="material-symbols-outlined text-[24px] text-emerald-600">check_circle</span>
          <div>
            <p className="font-bold text-sm">Pemeriksaan Berhasil Disimpan & Divalidasi!</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Hasil pengukuran otomatis tersinkronisasi ke grafik pertumbuhan balita dan akun orang tua.
            </p>
          </div>
        </div>
      )}

      {/* Main Form & Real-time Diagnosis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column (8 cols): Input Fields */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
            {/* Step 1: Balita Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Balita yang Ditimbang *
              </label>
              <select
                value={effectiveId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {children.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.gender === "L" ? "Laki-laki" : "Perempuan"}, {c.ageMonths} Bulan) - Ibu: {c.parentName}
                  </option>
                ))}
              </select>
            </div>

            {/* Child Selected Mini Profile */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                  {selectedChild.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedChild.name}</h4>
                  <p className="text-xs text-slate-500">
                    NIK: {selectedChild.nik} • Lahir: {selectedChild.birthDate} ({selectedChild.ageMonths} Bulan)
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-200/70 shadow-xs">
                {selectedChild.posyandu}
              </span>
            </div>

            {/* Step 2: Tanggal & Metode Pengukuran */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tanggal Pengukuran *
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Metode Pengukuran Panjang/Tinggi *
                </label>
                <div className="grid grid-cols-2 gap-2 h-11 items-center">
                  <button
                    type="button"
                    onClick={() => setMethod("terlentang")}
                    className={`h-full rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      method === "terlentang"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Terlentang (&lt; 24 bln)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("berdiri")}
                    className={`h-full rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      method === "berdiri"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Berdiri (≥ 24 bln)
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Pengukuran Antropometri Inti */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Berat Badan (BB) *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.05"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Contoh: 10.8"
                    className="w-full h-11 pl-3.5 pr-14 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-3.5 text-xs font-bold text-slate-500">kg</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Panjang / Tinggi Badan (PB/TB) *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Contoh: 82.5"
                    className="w-full h-11 pl-3.5 pr-14 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-3.5 text-xs font-bold text-slate-500">cm</span>
                </div>
              </div>
            </div>

            {/* Step 4: Lingkar Kepala & LiLA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Lingkar Kepala (Opsional)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    value={headCirc}
                    onChange={(e) => setHeadCirc(e.target.value)}
                    placeholder="Contoh: 46.5"
                    className="w-full h-11 pl-3.5 pr-14 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-3.5 text-xs font-semibold text-slate-500">cm</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Lingkar Lengan Atas (LiLA)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    value={lila}
                    onChange={(e) => setLila(e.target.value)}
                    placeholder="Contoh: 14.5"
                    className="w-full h-11 pl-3.5 pr-14 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-3.5 text-xs font-semibold text-slate-500">cm</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Catatan Petugas / Kondisi Anak
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Nafsu makan baik, tidak demam, sudah imunisasi lanjutan..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Simpan Sebagai Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("validated")}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Validasi & Terbitkan Hasil</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Real-Time Clinical Assessment Preview */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">analytics</span>
                </div>
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  Kalkulasi Otomatis Z-Score
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200/60">
                WHO 2006
              </span>
            </div>

            {/* Calculated Z-Scores */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">TB/U (Tinggi Badan/Umur)</span>
                  <span className="text-xs text-slate-500">Deteksi Risiko Stunting</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 block">
                    {isStuntedPreview ? "-2.45 SD" : "-0.80 SD"}
                  </span>
                  <span className={`text-xs font-semibold ${isStuntedPreview ? "text-rose-700" : "text-emerald-700"}`}>
                    {isStuntedPreview ? "Pendek (Stunted)" : "Normal"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">BB/U (Berat Badan/Umur)</span>
                  <span className="text-xs text-slate-500">Status Berat Badan</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 block">+0.15 SD</span>
                  <span className="text-xs font-semibold text-emerald-700">Berat Badan Normal</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">BB/TB (Berat per Tinggi)</span>
                  <span className="text-xs text-slate-500">Deteksi Wasting / Kurus</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 block">+0.40 SD</span>
                  <span className="text-xs font-semibold text-emerald-700">Gizi Baik</span>
                </div>
              </div>
            </div>

            {/* Alert Status */}
            <div className={`p-4 rounded-xl border ${isStuntedPreview ? "bg-rose-50 border-rose-200/80 text-rose-900" : "bg-emerald-50 border-emerald-200/70 text-emerald-900"}`}>
              <div className="flex items-center gap-2 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">
                  {isStuntedPreview ? "warning" : "verified"}
                </span>
                <span>{isStuntedPreview ? "Atensi Klinis: Indikasi Stunting" : "Pertumbuhan Sesuai Usia"}</span>
              </div>
              <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                {isStuntedPreview
                  ? "Tinggi anak berada di bawah ambang batas rujukan (-2 SD). Dianjurkan konseling gizi dan evaluasi PMT oleh Bidan."
                  : "Semua indikator pertumbuhan berada dalam rentang deviasi baku normal WHO."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
