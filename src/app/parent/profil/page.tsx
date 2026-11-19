"use client";

import React, { useState } from "react";
import Link from "next/link";
import useChildrenData from "@/app/hooks/useChildrenData";
import { calculateDetailedAge } from "@/lib/ageHelper";
import { StuntingBadge } from "@/components/ui/badge";

export default function ProfilPenggunaPage() {
  const { children } = useChildrenData();
  const [fullName, setFullName] = useState("Sari Rahmawati");
  const [nik, setNik] = useState("3201294829340001");
  const [roleInFamily, setRoleInFamily] = useState("Ibu Kandung");
  const [phone, setPhone] = useState("081234567890");
  const [email, setEmail] = useState("sari.rahmawati@gmail.com");
  const [address, setAddress] = useState("Jl. Dahlia No. 14, RT 02 / RW 04, Kel. Sukamaju");
  const [posyandu, setPosyandu] = useState("Posyandu Melati 04 (RW 04)");

  // Data Pasangan (Relasi Dua Orang Tua)
  const [spouseName, setSpouseName] = useState("Ahmad Fauzi");
  const [spouseNik, setSpouseNik] = useState("3201294829340008");
  const [spousePhone, setSpousePhone] = useState("081298765431");
  const [spouseRole, setSpouseRole] = useState("Bapak Kandung");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);

  // Balita yang terhubung dengan akun ini
  const myChildren = children.filter(
    (c) =>
      c.parentId === "parent-1" ||
      c.parentName.toLowerCase().includes("sari") ||
      c.motherName?.toLowerCase().includes("sari") ||
      c.fatherName?.toLowerCase().includes("ahmad")
  );

  const displayChildren =
    myChildren.length > 0
      ? myChildren
      : children.slice(0, 2);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Konfirmasi kata sandi baru tidak cocok!");
      return;
    }
    alert("Kata sandi berhasil diperbarui!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          Profil Orang Tua / Wali & Keluarga
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola identitas diri, relasi dua orang tua (ibu & bapak), serta hubungan keluarga dengan balita Anda.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-emerald-900 shadow-xs animate-in fade-in">
          <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
          <span>Data identitas diri dan hubungan keluarga berhasil disimpan!</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-2xl sm:text-3xl border border-emerald-200 shrink-0 shadow-xs">
            {fullName.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">{fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                {roleInFamily}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 justify-center sm:justify-start">
              <span>NIK: <strong className="text-slate-800 font-semibold">{nik}</strong></span>
              <span>•</span>
              <span>Pasangan: <strong className="text-slate-800 font-semibold">{spouseName}</strong> ({spouseRole})</span>
            </p>
            <p className="text-xs text-emerald-800 font-medium">
              Posyandu Binaan: {posyandu}
            </p>
          </div>
        </div>

        <div className="text-center sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 w-full sm:w-auto">
          <span className="text-xs text-slate-500 block">Balita Terhubung</span>
          <span className="font-heading text-xl font-extrabold text-slate-900 block">
            {displayChildren.length} Anak
          </span>
          <span className="text-xs text-emerald-700 font-semibold">Aktif di KMS Posyandu</span>
        </div>
      </div>

      {/* SECTION 1: HUBUNGAN KELUARGA DENGAN BALITA */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[22px]">family_restroom</span>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Daftar Balita & Hubungan Keluarga
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Terhubung otomatis dengan catatan penimbangan e-PPGBM
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayChildren.map((child) => {
            const ageDetail = calculateDetailedAge(child.birthDate);
            return (
              <div
                key={child.id}
                className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                    {child.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-heading font-bold text-sm text-slate-900 truncate">
                        {child.name}
                      </h4>
                      <StuntingBadge status={child.stuntingStatus} />
                    </div>

                    <div className="text-xs text-slate-500 space-y-0.5">
                      <p>NIK: <strong className="text-slate-800">{child.nik}</strong></p>
                      <p>
                        Umur: <strong className="text-emerald-800 font-bold">{ageDetail.textLong}</strong> ({ageDetail.totalMonths} Bln)
                      </p>
                      <p>Hubungan: <strong className="text-slate-700">Anak Kandung dari {fullName} ({roleInFamily})</strong></p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Penimbangan Terakhir: <strong>{child.lastExamDate}</strong>
                  </span>
                  <Link
                    href="/parent/grafik"
                    className="font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                  >
                    <span>Buka Grafik KMS</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: FORM BIODATA ORANG TUA & PASANGAN */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identitas Diri Utama */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">badge</span>
              Identitas Diri Orang Tua / Wali
            </h3>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Nomor Induk Kependudukan (NIK) *</span>
                  <span className="text-[11px] font-normal text-emerald-700">Wajib 16 Digit KTP</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hubungan Keluarga dengan Balita *</label>
                <select
                  value={roleInFamily}
                  onChange={(e) => setRoleInFamily(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm cursor-pointer"
                >
                  <option value="Ibu Kandung">Ibu Kandung</option>
                  <option value="Bapak Kandung">Bapak Kandung</option>
                  <option value="Wali">Wali</option>
                  <option value="Ibu Asuh">Ibu Asuh</option>
                  <option value="Ibu Tiri">Ibu Tiri</option>
                  <option value="Bapak Tiri">Bapak Tiri</option>
                  <option value="Bibi">Bibi</option>
                  <option value="Paman">Paman</option>
                  <option value="Nenek / Kakek">Nenek / Kakek</option>
                  <option value="Baby Sitter">Baby Sitter / Pengasuh</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili Lengkap</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Relasi Dua Orang Tua (Data Pasangan / Orang Tua Kedua) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">wc</span>
              Data Pasangan / Orang Tua Kedua
            </h3>

            <p className="text-xs text-slate-500">
              Memastikan satu balita terhubung secara sah dengan kedua orang tua (Ibu dan Bapak) di sistem Posyandu.
            </p>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Pasangan (Suami / Istri)</label>
                <input
                  type="text"
                  value={spouseName}
                  onChange={(e) => setSpouseName(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIK Pasangan (16 Digit)</label>
                <input
                  type="text"
                  maxLength={16}
                  value={spouseNik}
                  onChange={(e) => setSpouseNik(e.target.value.replace(/\D/g, ""))}
                  placeholder="Contoh: 3201294829340008"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peran Pasangan</label>
                  <select
                    value={spouseRole}
                    onChange={(e) => setSpouseRole(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="Bapak Kandung">Bapak Kandung</option>
                    <option value="Ibu Kandung">Ibu Kandung</option>
                    <option value="Bapak Tiri">Bapak Tiri</option>
                    <option value="Ibu Tiri">Ibu Tiri</option>
                    <option value="Wali">Wali</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. HP / WA Pasangan</label>
                  <input
                    type="tel"
                    value={spousePhone}
                    onChange={(e) => setSpousePhone(e.target.value)}
                    placeholder="081298765431"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/70 text-xs text-emerald-900 flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-700 shrink-0 mt-0.5">verified</span>
                <span>
                  Kedua kontak orang tua akan menerima pengingat jadwal posyandu dan pembaruan hasil penimbangan balita secara sinkron.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Simpan Data Profil & Hubungan Keluarga</span>
          </button>
        </div>
      </form>

      {/* SECTION 3: KATA SANDI */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 max-w-xl">
        <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <span className="material-symbols-outlined text-emerald-600 text-[20px]">lock</span>
          Ubah Kata Sandi Akun
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Saat Ini</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Baru</label>
              <input
                type="password"
                required
                placeholder="Minimal 8 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
              <input
                type="password"
                required
                placeholder="Ulangi kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer text-xs sm:text-sm"
          >
            Simpan Kata Sandi Baru
          </button>
        </form>
      </div>
    </div>
  );
}
