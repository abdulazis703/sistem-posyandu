"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/supabase";

export default function ProfilPetugasPage() {
  const router = useRouter();
  const [name, setName] = useState("Bidan Sri Wahyuni, A.Md.Keb");
  const [phone, setPhone] = useState("081234567890");
  const [email, setEmail] = useState("sri.wahyuni@puskesmas-sukamaju.go.id");
  const position = "Bidan Pembina Wilayah Kel. Sukamaju";
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Konfirmasi kata sandi tidak cocok!");
      return;
    }
    alert("Kata sandi berhasil diperbarui!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleConfirmLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut();
    } catch (err) {
      console.warn("Staff logout error:", err);
    } finally {
      router.push("/login");
    }
  };

  return (
    <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          Profil Petugas
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola informasi personal akun petugas, hak akses wilayah, dan kredensial keamanan.
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
        <div className="w-20 h-20 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-xs">
          SW
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h2 className="font-heading text-lg font-bold text-slate-900">{name}</h2>
          <p className="text-xs sm:text-sm text-emerald-700 font-semibold">{position}</p>
          <p className="text-xs text-slate-500">
            SIPB: 446/092/Bidan/Dinkes • Penugasan: Posyandu Melati 01 s/d 04 (Kel. Sukamaju)
          </p>
        </div>
      </div>

      {/* Two Column Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Biodata */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">badge</span>
            Data Personal Petugas
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap &amp; Gelar</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp / Kontak</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jabatan &amp; Penugasan</label>
              <input
                type="text"
                disabled
                value={position}
                className="w-full h-11 px-3.5 bg-slate-100 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Simpan Data Diri
            </button>
          </form>
        </div>

        {/* Form Keamanan Kata Sandi */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">lock_reset</span>
            Keamanan &amp; Kata Sandi
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
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
              <input
                type="password"
                required
                placeholder="Ketik ulang kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Perbarui Kata Sandi
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Sesi & Keluar dari Akun */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">
            Sesi &amp; Akses Akun
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Keluar dari sesi aktif petugas pada perangkat ini dan kembali ke halaman masuk TumbuhKu.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar dari Akun</span>
        </button>
      </div>

      {/* Modal Konfirmasi Logout (Portal ke document.body agar selalu terkunci di tengah viewport) */}
      {showLogoutConfirm &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => !loggingOut && setShowLogoutConfirm(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="staff-logout-confirm-title"
          >
            <div
              className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-5 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto">
                <LogOut className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 id="staff-logout-confirm-title" className="font-heading text-base font-bold text-slate-900">
                  Apakah yakin anda ingin keluar?
                </h3>
                <p className="text-xs text-slate-500">
                  Anda perlu masuk kembali untuk mengelola data Posyandu.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={loggingOut}
                  className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  disabled={loggingOut}
                  className="h-11 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loggingOut ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Ya, Keluar</span>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
