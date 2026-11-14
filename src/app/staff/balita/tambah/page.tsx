"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useChildrenData from "@/app/hooks/useChildrenData";
import { mockParents, Child } from "@/lib/mockData";

function generateChildId(): string {
  return `child-${Date.now()}`;
}

function generateDefaultNik(): string {
  return `3201${Date.now().toString().slice(-11)}`;
}

function getTodayIsoDate(): string {
  return new Date().toISOString().split("T")[0];
}

export default function TambahBalitaPage() {
  const router = useRouter();
  const { setChildren } = useChildrenData();
  const [childName, setChildName] = useState("");
  const [nik, setNik] = useState("");
  const [birthDate, setBirthDate] = useState("2023-04-12");
  const [gender, setGender] = useState<"L" | "P">("L");
  const [posyandu, setPosyandu] = useState("Posyandu Melati 04 (RW 04)");
  const [birthWeight, setBirthWeight] = useState("3.2");
  const [birthHeight, setBirthHeight] = useState("49.5");
  const [isPrematur, setIsPrematur] = useState(false);
  const [gestationalWeeks, setGestationalWeeks] = useState(36);
  const [selectedParentId, setSelectedParentId] = useState(mockParents[0].id);
  const [relation, setRelation] = useState("ibu");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedParent =
    mockParents.find((p) => p.id === selectedParentId) || mockParents[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newChild: Child = {
      id: generateChildId(),
      name: childName.trim() || "Balita Baru",
      nik: nik.trim() || generateDefaultNik(),
      gender,
      birthDate,
      ageMonths: 12,
      parentName: selectedParent.name,
      parentId: selectedParent.id,
      posyandu,
      posyanduId: "posyandu-4",
      lastExamDate: getTodayIsoDate(),
      weight: parseFloat(birthWeight) || 3.2,
      height: parseFloat(birthHeight) || 49.5,
      zScoreTbU: 0.1,
      zScoreBbU: 0.1,
      zScoreBbTb: 0.2,
      stuntingStatus: "Normal",
      wastingStatus: "Gizi Baik (Normal)",
      riskFlag: "NORMAL",
      isPrematur,
    };

    setChildren((prev) => [newChild, ...prev]);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/staff/balita");
      }, 1000);
    }, 600);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 max-w-[1280px] mx-auto w-full">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/staff/balita" className="hover:text-emerald-700 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">child_care</span>
            <span>Data Balita</span>
          </Link>
          <span>/</span>
          <span className="text-emerald-800 font-semibold">Tambah Balita Baru</span>
        </div>
        <Link
          href="/staff/balita"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Data Balita</span>
        </Link>
      </div>

      {/* Title Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
            <span className="material-symbols-outlined text-[28px]">person_add</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
                Tambah Data Balita Baru
              </h1>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200/60">
                Formulir e-KMS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Daftarkan identitas balita baru ke sistem Posyandu dan tetapkan akun orang tua yang bertanggung jawab.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/70 shrink-0">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Wilayah Tugas</span>
            <span className="text-xs font-bold text-emerald-700">Melati 01 s/d 04</span>
          </div>
          <div className="w-2 h-7 rounded-full bg-emerald-600"></div>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-[#dcfce7] border border-[#86efac] rounded-xl flex items-center gap-3 text-[#14532d]">
          <span className="material-symbols-outlined text-[24px]">check_circle</span>
          <div>
            <p className="font-bold text-sm">Balita berhasil didaftarkan!</p>
            <p className="text-xs">
              Data otomatis terhubung ke akun <strong>{selectedParent.name}</strong> dan tampil di dashboard orang tua.
            </p>
          </div>
        </div>
      )}

      {/* Two Column Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Identitas Balita */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#e2ebe5] shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#15803d] text-[20px]">badge</span>
                <h3 className="font-heading text-sm font-bold text-[#0b1c30]">
                  Identitas & Data Pribadi Balita
                </h3>
              </div>
              <span className="text-[11px] bg-[#f8f9ff] px-2 py-0.5 rounded text-[#6f7a6e]">
                Bagian 1 dari 2
              </span>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                Nama Lengkap Balita <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="text"
                required
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Contoh: Muhammad Rayhan Al-Ghifari"
                className="w-full h-11 px-3.5 bg-[#f8f9ff] border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#15803d] focus:outline-none"
              />
            </div>

            {/* NIK */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#0b1c30]">
                  NIK Balita (16 Digit) <span className="text-[#ba1a1a]">*</span>
                </label>
                <span className="text-[11px] text-[#6f7a6e]">Bisa gunakan no. KK jika belum ada</span>
              </div>
              <input
                type="text"
                required
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="Contoh: 320129482934021"
                className="w-full h-11 px-3.5 bg-[#f8f9ff] border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] font-mono focus:ring-2 focus:ring-[#15803d] focus:outline-none"
              />
            </div>

            {/* Tanggal Lahir & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                  Tanggal Lahir <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#f8f9ff] border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#15803d] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                  Jenis Kelamin <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#f8f9ff] rounded-xl border border-[#cbd5e1] h-11 items-center">
                  <button
                    type="button"
                    onClick={() => setGender("L")}
                    className={`h-9 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                      gender === "L"
                        ? "bg-[#15803d] text-white shadow-sm"
                        : "text-[#6f7a6e] hover:text-[#0b1c30]"
                    }`}
                  >
                    <span>👦</span>
                    <span>Laki-laki</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("P")}
                    className={`h-9 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                      gender === "P"
                        ? "bg-[#15803d] text-white shadow-sm"
                        : "text-[#6f7a6e] hover:text-[#0b1c30]"
                    }`}
                  >
                    <span>👧</span>
                    <span>Perempuan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Posyandu Binaan */}
            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                Posyandu Binaan <span className="text-[#ba1a1a]">*</span>
              </label>
              <select
                value={posyandu}
                onChange={(e) => setPosyandu(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#f8f9ff] border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#15803d] focus:outline-none"
              >
                <option>Posyandu Melati 01 (RW 01, Kel. Sukamaju)</option>
                <option>Posyandu Melati 02 (RW 02, Kel. Sukamaju)</option>
                <option>Posyandu Melati 03 (RW 03, Kel. Sukamaju)</option>
                <option>Posyandu Melati 04 (RW 04, Kel. Sukamaju)</option>
              </select>
            </div>

            {/* Berat & Panjang Lahir */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                  Berat Lahir (BBL) *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={birthWeight}
                    onChange={(e) => setBirthWeight(e.target.value)}
                    placeholder="3.2"
                    className="w-full h-11 pl-3.5 pr-12 bg-[#f8f9ff] border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#15803d] focus:outline-none"
                  />
                  <span className="absolute right-3 text-xs text-[#6f7a6e] font-semibold">
                    kg
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                  Panjang Lahir (PBL) *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={birthHeight}
                    onChange={(e) => setBirthHeight(e.target.value)}
                    placeholder="49.5"
                    className="w-full h-11 pl-3.5 pr-12 bg-[#f8f9ff] border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#15803d] focus:outline-none"
                  />
                  <span className="absolute right-3 text-xs text-[#6f7a6e] font-semibold">
                    cm
                  </span>
                </div>
              </div>
            </div>

            {/* Prematur Checkbox */}
            <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#becabc]/30 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrematur}
                  onChange={(e) => setIsPrematur(e.target.checked)}
                  className="rounded text-[#15803d] focus:ring-[#15803d]"
                />
                <span className="text-xs font-semibold text-[#0b1c30]">
                  Lahir Prematur (&lt; 37 minggu usia gestasi)
                </span>
              </label>

              {isPrematur && (
                <div className="pl-6 pt-1">
                  <label className="block text-[11px] font-semibold text-[#3f493f] mb-1">
                    Usia Kandungan Saat Lahir (Minggu):
                  </label>
                  <input
                    type="number"
                    min={24}
                    max={36}
                    value={gestationalWeeks}
                    onChange={(e) => setGestationalWeeks(Number(e.target.value))}
                    className="w-32 h-9 px-3 bg-white border border-[#cbd5e1] rounded-lg text-xs"
                  />
                  <span className="text-[10px] text-[#6f7a6e] block mt-1">
                    Koreksi usia (Corrected Age) akan otomatis dihitung untuk Z-Score WHO.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Penetapan Akun Orang Tua */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#eff4ff] rounded-2xl p-6 border border-[#becabc]/40 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#becabc]/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#15803d] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                </div>
                <h3 className="font-heading text-sm font-bold text-[#0b1c30]">
                  Tetapkan Akun Orang Tua
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#15803d] text-white text-[10px] font-bold">
                Otomatis Sync
              </span>
            </div>

            <p className="text-xs text-[#3f493f] leading-relaxed">
              Pilih akun orang tua yang bertanggung jawab. Balita akan langsung muncul di akun orang tua tanpa perlu persetujuan atau kode undangan.
            </p>

            {/* Parent Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">
                Pilih Orang Tua Terdaftar:
              </label>
              <select
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#15803d]"
              >
                {mockParents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name} ({parent.phone}) - {parent.address.slice(0, 25)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Parent Detail Card */}
            <div className="bg-white p-4 rounded-xl border border-[#e2ebe5] shadow-xs space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#b1f2be] text-[#00210d] font-bold flex items-center justify-center text-xs shrink-0">
                  {selectedParent.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0b1c30]">{selectedParent.name}</p>
                  <p className="text-[11px] text-[#6f7a6e]">{selectedParent.phone}</p>
                </div>
              </div>
              <div className="text-[11px] text-[#3f493f] pt-1 border-t border-[#f1f5f9]">
                <p><strong>Alamat:</strong> {selectedParent.address}</p>
                <p><strong>Jumlah Balita:</strong> {selectedParent.childrenCount} anak terdaftar</p>
              </div>
            </div>

            {/* Hubungan Keluarga */}
            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">
                Hubungan dengan Balita:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["ibu", "ayah", "wali"].map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => setRelation(rel)}
                    className={`py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                      relation === rel
                        ? "bg-[#15803d] text-white shadow-sm"
                        : "bg-white text-[#3f493f] border border-[#cbd5e1]"
                    }`}
                  >
                    {rel === "ibu" ? "Ibu Kandung" : rel === "ayah" ? "Ayah Kandung" : "Wali Sah"}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#15803d] hover:bg-[#14532d] text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>Simpan & Hubungkan ke Akun Orang Tua</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

