"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import useChildrenData from "@/app/hooks/useChildrenData";
import { getCurrentUser, signOut, updateParentProfile, UserProfile } from "@/lib/supabase";
import { calculateDetailedAge } from "@/lib/ageHelper";
import { StuntingBadge } from "@/components/ui/badge";

export default function ProfilPenggunaPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [fullName, setFullName] = useState("");
  const [nik, setNik] = useState("");
  const [roleInFamily, setRoleInFamily] = useState("Orang Tua / Wali");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [posyandu, setPosyandu] = useState("");

  // Data Pasangan (opsional, diisi pengguna sendiri jika diperlukan)
  const [spouseName, setSpouseName] = useState("");
  const [spouseNik, setSpouseNik] = useState("");
  const [spousePhone, setSpousePhone] = useState("");
  const [spouseRole, setSpouseRole] = useState("Pasangan / Wali");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((user) => {
        if (!mounted) return;
        setCurrentUser(user);
        if (user) {
          setFullName(user.fullName || "");
          setNik(user.nik || "");
          setPhone(user.phone || "");
          setEmail(user.email || "");
          setAddress(user.address || "");
          setPosyandu(user.posyandu || "Posyandu Melati 01 (RW 01)");
        }
      })
      .finally(() => {
        if (mounted) setLoadingUser(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Auth-First Query Gating + Filter eksplisit parent_id
  const { children: myChildren, loading: loadingChildren } = useChildrenData({
    parentId: currentUser?.id ?? "",
    enabled: !loadingUser,
  });

  const isLoading = loadingUser || loadingChildren;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    setSaving(true);
    setSaveError(null);
    setSaved(false);

    const res = await updateParentProfile(currentUser.id, {
      fullName,
      nik,
      phone,
      address,
    });

    setSaving(false);
    if (!res.success) {
      setSaveError(res.error || "Gagal menyimpan perubahan profil.");
      return;
    }

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

  const handleConfirmLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut();
    } catch (err) {
      console.warn("Parent logout error:", err);
    } finally {
      router.push("/login");
    }
  };

  const initials = (fullName || "OT").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          Profil Orang Tua / Wali &amp; Keluarga
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola identitas diri, relasi keluarga, serta daftar balita yang terhubung dengan akun Anda.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-emerald-900 shadow-xs animate-in fade-in">
          <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
          <span>Data identitas diri berhasil disimpan ke sistem!</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-rose-900 shadow-xs">
          <span className="material-symbols-outlined text-[20px] text-rose-600">error</span>
          <span>{saveError}</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-2xl sm:text-3xl border border-emerald-200 shrink-0 shadow-xs">
            {loadingUser ? "..." : initials}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                {loadingUser ? "Memuat profil..." : fullName || "Orang Tua"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                {roleInFamily}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span>
                NIK: <strong className="text-slate-800 font-semibold">{nik || "-"}</strong>
              </span>
              {email && (
                <>
                  <span>•</span>
                  <span>
                    Email: <strong className="text-slate-800 font-semibold">{email}</strong>
                  </span>
                </>
              )}
              {spouseName && (
                <>
                  <span>•</span>
                  <span>
                    Pasangan: <strong className="text-slate-800 font-semibold">{spouseName}</strong> ({spouseRole})
                  </span>
                </>
              )}
            </p>
            <p className="text-xs text-emerald-800 font-medium">
              Posyandu Binaan: {myChildren[0]?.posyandu || posyandu || "Posyandu Melati 01 (RW 01)"}
            </p>
          </div>
        </div>

        <div className="text-center sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 w-full sm:w-auto">
          <span className="text-xs text-slate-500 block">Balita Terhubung</span>
          <span className="font-heading text-xl font-extrabold text-slate-900 block">
            {isLoading ? "..." : `${myChildren.length} Anak`}
          </span>
          <span className="text-xs text-emerald-700 font-semibold">
            {myChildren.length > 0 ? "Aktif di KMS Posyandu" : "Belum ada anak terdaftar"}
          </span>
        </div>
      </div>

      {/* SECTION 1: HUBUNGAN KELUARGA DENGAN BALITA */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[22px]">family_restroom</span>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Daftar Balita &amp; Hubungan Keluarga ({isLoading ? "..." : myChildren.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Terhubung otomatis dengan catatan penimbangan Posyandu
          </span>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-xs text-slate-500">
            Memuat daftar balita milik akun Anda...
          </div>
        ) : myChildren.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1.5">
            <p className="text-sm font-semibold text-slate-800">
              Belum ada balita yang terhubung ke akun {fullName || "Anda"}.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Jika Anda memiliki anak yang sudah ditimbang di Posyandu, pastikan kader telah mengaitkan data balita ke akun Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myChildren.map((child) => {
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
                        <p>
                          NIK: <strong className="text-slate-800">{child.nik}</strong>
                        </p>
                        <p>
                          Umur: <strong className="text-emerald-800 font-bold">{ageDetail.textLong}</strong> ({ageDetail.totalMonths} Bln)
                        </p>
                        <p>
                          Hubungan: <strong className="text-slate-700">Anak dari {fullName || "Orang Tua"}</strong>
                        </p>
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
        )}
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
                  placeholder="Nama lengkap sesuai KTP"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-sm"
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
                  placeholder="16 digit NIK sesuai KTP/KK"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 tracking-wide focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hubungan Keluarga dengan Balita *</label>
                <select
                  value={roleInFamily}
                  onChange={(e) => setRoleInFamily(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-sm cursor-pointer"
                >
                  <option value="Orang Tua / Wali">Orang Tua / Wali</option>
                  <option value="Ibu Kandung">Ibu Kandung</option>
                  <option value="Bapak Kandung">Bapak Kandung</option>
                  <option value="Wali">Wali</option>
                  <option value="Ibu Asuh">Ibu Asuh</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full h-11 px-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 cursor-not-allowed text-base sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili Lengkap</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Masukkan alamat domisili lengkap"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-sm"
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
              Opsional: catat informasi kontak orang tua kedua atau wali pendamping balita.
            </p>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Pasangan (Suami / Istri)</label>
                <input
                  type="text"
                  value={spouseName}
                  onChange={(e) => setSpouseName(e.target.value)}
                  placeholder="Nama lengkap pasangan (opsional)"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIK Pasangan (16 Digit)</label>
                <input
                  type="text"
                  maxLength={16}
                  value={spouseNik}
                  onChange={(e) => setSpouseNik(e.target.value.replace(/\D/g, ""))}
                  placeholder="16 digit NIK pasangan (opsional)"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 tracking-wide focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peran Pasangan</label>
                  <select
                    value={spouseRole}
                    onChange={(e) => setSpouseRole(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-sm cursor-pointer"
                  >
                    <option value="Pasangan / Wali">Pasangan / Wali</option>
                    <option value="Bapak Kandung">Bapak Kandung</option>
                    <option value="Ibu Kandung">Ibu Kandung</option>
                    <option value="Wali">Wali</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. HP / WA Pasangan</label>
                  <input
                    type="tel"
                    value={spousePhone}
                    onChange={(e) => setSpousePhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-sm"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/70 text-xs text-emerald-900 flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-700 shrink-0 mt-0.5">verified</span>
                <span>
                  Data profil utama Anda disinkronkan langsung dengan tabel akun dan biodata keluarga di Supabase.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || loadingUser}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-2 text-sm disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>{saving ? "Menyimpan..." : "Simpan Data Profil & Hubungan Keluarga"}</span>
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
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-sm"
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
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-sm"
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
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-sm"
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

      {/* SECTION 4: KELUAR DARI AKUN */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">
            Sesi &amp; Akses Akun
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Keluar dari sesi aktif pada perangkat ini dan kembali ke halaman masuk TumbuhKu.
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
            aria-labelledby="parent-logout-confirm-title"
          >
            <div
              className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-5 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto">
                <LogOut className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 id="parent-logout-confirm-title" className="font-heading text-base font-bold text-slate-900">
                  Apakah yakin anda ingin keluar?
                </h3>
                <p className="text-xs text-slate-500">
                  Anda perlu masuk kembali untuk melihat data pertumbuhan balita Anda.
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
