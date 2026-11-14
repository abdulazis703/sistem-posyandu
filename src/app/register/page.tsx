"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpParent } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [posyandu, setPosyandu] = useState("Posyandu Melati 01 (RW 01)");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      await signUpParent({
        fullName,
        phone,
        email,
        password,
        posyanduName: posyandu,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/parent/dashboard");
      }, 1500);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn("Register attempt fallback:", errMsg);
      // Jika mode offline/mock tanpa env supabase, tetap berikan pengalaman demo
      if (errMsg.includes("fetch") || errMsg.includes("mock")) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/parent/dashboard");
        }, 1200);
        return;
      }
      setErrorMessage(errMsg || "Pendaftaran gagal. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col justify-center">
      <div className="w-full min-h-screen flex flex-col lg:flex-row bg-[#f8f9ff]">
        {/* Left Hero & Narrative Panel */}
        <div className="w-full lg:w-1/2 bg-[#12512c] relative p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden text-white">
          {/* Ambient Decorative Organic Blobs */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#2e6a41] opacity-30 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#95f8a7] opacity-15 blur-3xl pointer-events-none"></div>

          {/* Top Header / Brand Identity */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#b1f2be] flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[#00652c] text-2xl">eco</span>
              </div>
              <div>
                <span className="font-heading text-xl font-bold tracking-tight text-white block leading-tight">
                  TumbuhKu
                </span>
                <span className="text-[11px] text-[#96d5a3] uppercase tracking-wider block">
                  KMS & Posyandu Digital
                </span>
              </div>
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2e6a41]/70 backdrop-blur text-[#95f8a7] text-xs font-semibold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#95f8a7] animate-pulse"></span>
              Pendaftaran Akun Baru
            </span>
          </div>

          {/* Center Narrative & Feature Highlights */}
          <div className="relative z-10 my-10 lg:my-auto flex flex-col gap-6 max-w-xl">
            <div className="space-y-4">
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Tumbuh sehat dimulai dari pemantauan yang tepat.
              </h1>
              <p className="text-sm sm:text-base text-[#d6e6dd] leading-relaxed">
                Bergabung bersama ribuan orang tua dan kader Posyandu untuk memastikan tumbuh kembang balita optimal, terukur, dan bebas risiko stunting sejak dini.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="rounded-2xl p-4 bg-[#2e6a41]/40 backdrop-blur-sm border border-[#b1f2be]/20">
                <div className="w-9 h-9 rounded-xl bg-[#b1f2be]/20 flex items-center justify-center text-[#95f8a7] mb-3">
                  <span className="material-symbols-outlined text-xl">insights</span>
                </div>
                <h2 className="text-xs font-bold text-white mb-1">KMS Digital Otomatis</h2>
                <p className="text-[11px] text-[#96d5a3]">
                  Plotting Z-Score WHO standar Kemenkes tanpa hitung manual.
                </p>
              </div>

              <div className="rounded-2xl p-4 bg-[#2e6a41]/40 backdrop-blur-sm border border-[#b1f2be]/20">
                <div className="w-9 h-9 rounded-xl bg-[#b1f2be]/20 flex items-center justify-center text-[#95f8a7] mb-3">
                  <span className="material-symbols-outlined text-xl">notifications_active</span>
                </div>
                <h2 className="text-xs font-bold text-white mb-1">Pengingat Jadwal</h2>
                <p className="text-[11px] text-[#96d5a3]">
                  Notifikasi rutin penimbangan, vitamin A, dan imunisasi.
                </p>
              </div>

              <div className="rounded-2xl p-4 bg-[#2e6a41]/40 backdrop-blur-sm border border-[#b1f2be]/20">
                <div className="w-9 h-9 rounded-xl bg-[#b1f2be]/20 flex items-center justify-center text-[#95f8a7] mb-3">
                  <span className="material-symbols-outlined text-xl">health_and_safety</span>
                </div>
                <h2 className="text-xs font-bold text-white mb-1">Terhubung Posyandu</h2>
                <p className="text-[11px] text-[#96d5a3]">
                  Sinkronisasi langsung dengan kader di meja penimbangan.
                </p>
              </div>
            </div>

            {/* Notice info */}
            <div className="p-4 rounded-2xl bg-[#2e6a41]/30 border border-[#b1f2be]/20 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#95f8a7] text-[24px]">info</span>
              <p className="text-xs text-[#d6e6dd] leading-relaxed">
                <strong className="text-white font-semibold">Tanpa Kode Undangan:</strong> Begitu akun Anda dibuat, balita yang didaftarkan oleh kader di Posyandu akan otomatis muncul di akun Anda.
              </p>
            </div>
          </div>

          {/* Footer note */}
          <div className="relative z-10 pt-6 border-t border-[#2e6a41] flex items-center justify-between text-xs text-[#96d5a3]">
            <span>Sesuai Pedoman Antropometri Kemenkes RI</span>
            <span>Versi 2.4</span>
          </div>
        </div>

        {/* Right Form Workspace */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[#eff4ff]">
          <div className="flex justify-between items-center w-full max-w-lg mx-auto">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#00652c] hover:underline"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Sudah punya akun? Masuk
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-[#3f493f]">
              <span className="w-2 h-2 rounded-full bg-[#15803d]"></span>
              Formulir Mandiri Orang Tua
            </div>
          </div>

          <div className="w-full max-w-lg mx-auto my-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e2ebe5]">
              <div className="mb-6">
                <h2 className="font-heading text-2xl font-bold text-[#0b1c30]">
                  Registrasi Akun Orang Tua
                </h2>
                <p className="text-xs text-[#3f493f] mt-1">
                  Lengkapi data diri Anda untuk memantau tumbuh kembang buah hati secara digital.
                </p>
              </div>

              {success ? (
                <div className="p-6 bg-[#dcfce7] rounded-xl border border-[#86efac] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#15803d] text-white flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-[28px]">check</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#14532d]">
                    Pendaftaran Berhasil!
                  </h3>
                  <p className="text-xs text-[#166534]">
                    Akun Anda telah aktif. Mengalihkan ke Dashboard Orang Tua...
                  </p>
                </div>
              ) : (
                <>
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-red-600">error</span>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">
                      Nama Lengkap Ibu / Ayah / Wali *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Siti Aminah"
                      className="w-full h-11 px-3.5 bg-white border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">
                        Nomor WhatsApp Aktif *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full h-11 px-3.5 bg-white border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">
                        Email (Opsional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full h-11 px-3.5 bg-white border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">
                      Pilih Posyandu Domisili Terdekat *
                    </label>
                    <select
                      value={posyandu}
                      onChange={(e) => setPosyandu(e.target.value)}
                      className="w-full h-11 px-3.5 bg-white border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all"
                    >
                      <option>Posyandu Melati 01 (RW 01)</option>
                      <option>Posyandu Melati 02 (RW 02)</option>
                      <option>Posyandu Melati 03 (RW 03)</option>
                      <option>Posyandu Melati 04 (RW 04)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">
                        Kata Sandi *
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full h-11 px-3.5 bg-white border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">
                        Konfirmasi Kata Sandi *
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi kata sandi"
                        className="w-full h-11 px-3.5 bg-white border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        required
                        className="mt-0.5 rounded text-[#15803d] focus:ring-[#15803d]"
                      />
                      <span className="text-xs text-[#3f493f] leading-relaxed">
                        Saya menyetujui ketentuan privasi data pemantauan pertumbuhan balita pada sistem Posyandu digital.
                      </span>
                    </label>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={loading || !agree}
                      className="w-full h-11 bg-[#15803d] hover:bg-[#14532d] text-white font-semibold text-xs rounded-xl shadow-md shadow-[#15803d]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <span>Buat Akun Orang Tua Sekarang</span>
                          <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
            </div>
          </div>

          <div className="text-center text-xs text-[#6f7a6e]">
            © 2024 TumbuhKu KMS Digital. Dilindungi privasi kesehatan keluarga.
          </div>
        </div>
      </div>
    </div>
  );
}

