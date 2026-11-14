"use client";

import React, { useState } from "react";

export default function ProfilPenggunaPage() {
  const [fullName, setFullName] = useState("Sari Rahmawati");
  const [phone, setPhone] = useState("081234567890");
  const [email, setEmail] = useState("sari.rahmawati@gmail.com");
  const [address, setAddress] = useState("Jl. Dahlia No. 14, RT 02 / RW 04, Kel. Sukamaju");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);

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
    <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          Profil Akun Orang Tua
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola data pribadi Anda dan akses keamanan akun keluarga.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-emerald-900 shadow-xs">
          <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
          <span>Perubahan profil berhasil disimpan!</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-2xl border border-emerald-200 shrink-0 shadow-xs">
          SR
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h2 className="font-heading text-lg font-bold text-slate-900">{fullName}</h2>
          <p className="text-xs sm:text-sm text-emerald-700 font-semibold">Orang Tua / Wali Terdaftar</p>
          <p className="text-xs text-slate-500">
            Posyandu Binaan: Posyandu Melati 04 (RW 04, Kel. Sukamaju)
          </p>
        </div>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Biodata */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">person</span>
            Biodata Diri
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </form>
        </div>

        {/* Form Kata Sandi */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">lock</span>
            Ubah Kata Sandi
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
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Baru</label>
              <input
                type="password"
                required
                placeholder="Minimal 8 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Simpan Kata Sandi Baru
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
