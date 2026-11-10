"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"parent" | "staff">("parent");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === "parent") {
        router.push("/parent/dashboard");
      } else {
        router.push("/staff/dashboard");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col justify-center">
      <div className="w-full min-h-screen flex flex-col lg:flex-row bg-[#f8f9ff]">
        {/* Left Hero & Clinical Reassurance Panel */}
        <div className="lg:w-1/2 bg-[#e5eeff] flex flex-col justify-between p-8 lg:p-14 text-[#0b1c30] relative overflow-hidden">
          {/* Decorative Ambient Layers */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#b1f2be]/40 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 bottom-1/4 w-80 h-80 bg-[#79db8d]/30 rounded-full blur-2xl pointer-events-none"></div>

          {/* Top Branding Section */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm border border-[#becabc]/30">
                <span className="material-symbols-outlined text-[#00652c] text-[26px]">eco</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold tracking-tight text-[#0b1c30]">
                  TumbuhKu
                </span>
                <span className="text-xs text-[#2e6a41] tracking-wide font-medium">
                  Sistem Pantau Gizi & KMS Posyandu
                </span>
              </div>
            </Link>
            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-white/80 border border-[#becabc]/40 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00652c] animate-pulse"></span>
              <span className="text-xs text-[#2e6a41] font-semibold">
                Versi Layanan Kader & Keluarga 2.4
              </span>
            </div>
          </div>

          {/* Middle Value Proposition */}
          <div className="relative z-10 my-10 lg:my-auto">
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight max-w-lg mb-4">
              Tumbuh sehat dimulai dari pemantauan yang tepat.
            </h1>
            <p className="text-sm sm:text-base text-[#3f493f] max-w-md leading-relaxed mb-8">
              Pantau grafik pertumbuhan anak, jadwal penimbangan Posyandu, dan riwayat kesehatan si kecil secara berkala dalam satu aplikasi aman.
            </p>

            {/* Micro Graphic Card with KMS Simulation */}
            <div className="relative w-full max-w-md p-6 bg-white rounded-2xl border border-[#becabc]/30 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00652c] text-[20px]">show_chart</span>
                  <span className="text-xs font-bold text-[#0b1c30]">Trajektori Kurva Berat (WHO)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#b1f2be] text-[#00210d] text-[11px] font-semibold">
                  Optimal (+0.2 SD)
                </span>
              </div>

              {/* Stylized Curve */}
              <div className="w-full h-24 relative">
                <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 340 100">
                  <path className="text-[#b1f2be]/50" d="M0,85 Q85,75 170,55 T340,25 L340,70 Q255,90 170,95 T0,100 Z" fill="currentColor" />
                  <path className="text-[#becabc]" d="M0,80 Q85,70 170,50 T340,15" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.5" />
                  <path className="text-[#00652c]" d="M0,88 Q85,78 170,52 T340,22" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
                  <circle cx="0" cy="88" fill="white" stroke="#00652c" strokeWidth="2" r="3.5" />
                  <circle cx="85" cy="80" fill="white" stroke="#00652c" strokeWidth="2" r="3.5" />
                  <circle cx="170" cy="52" fill="white" stroke="#00652c" strokeWidth="2" r="3.5" />
                  <circle cx="255" cy="35" fill="white" stroke="#00652c" strokeWidth="2" r="3.5" />
                  <circle cx="340" cy="22" fill="#15803d" stroke="#00652c" strokeWidth="2" r="5" />
                </svg>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#e5eeff]">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e5eeff] rounded-full text-[11px] font-semibold text-[#3f493f]">
                  <span className="material-symbols-outlined text-[14px] text-[#00652c]">verified</span>
                  Standar WHO & Kemenkes RI
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e5eeff] rounded-full text-[11px] font-semibold text-[#3f493f]">
                  <span className="material-symbols-outlined text-[14px] text-[#00652c]">monitoring</span>
                  Status Gizi Terpantau
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicator Bottom Bar */}
          <div className="relative z-10 pt-6 border-t border-[#becabc]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#00652c] text-[20px]">health_and_safety</span>
              <span className="text-xs text-[#3f493f]">Terintegrasi dengan 4.800+ Posyandu & Puskesmas</span>
            </div>
            <span className="text-[11px] text-[#6f7a6e] font-medium hidden sm:inline">SATUSEHAT Validated</span>
          </div>
        </div>

        {/* Right Half Interaction & Authentication Workspace */}
        <div className="lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[#eff4ff]">
          {/* Back Navigation Header */}
          <div className="flex justify-between items-center w-full max-w-md mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#00652c] hover:text-[#12512c] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Kembali ke Beranda
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-[#3f493f]">
              <span className="w-2 h-2 rounded-full bg-[#15803d]"></span>
              Server Aktif
            </div>
          </div>

          {/* Form Card Container */}
          <div className="w-full max-w-md mx-auto my-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e2ebe5]">
              <div className="mb-6">
                <h2 className="font-heading text-2xl font-bold text-[#0b1c30]">Masuk ke Akun</h2>
                <p className="text-xs text-[#3f493f] mt-1">
                  Pilih peran Anda dan masukkan kredensial untuk melanjutkan.
                </p>
              </div>

              {/* Role Switcher Tab */}
              <div className="flex p-1 bg-[#f8f9ff] rounded-xl border border-[#e2ebe5] mb-6">
                <button
                  type="button"
                  onClick={() => setRole("parent")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    role === "parent"
                      ? "bg-[#15803d] text-white shadow-sm"
                      : "text-[#6f7a6e] hover:text-[#0b1c30]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">family_restroom</span>
                  <span>Orang Tua / Wali</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("staff")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    role === "staff"
                      ? "bg-[#15803d] text-white shadow-sm"
                      : "text-[#6f7a6e] hover:text-[#0b1c30]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">badge</span>
                  <span>Petugas / Kader</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">
                    {role === "parent" ? "Nomor WhatsApp / Email" : "ID Petugas / Email"}
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#6f7a6e]">
                      {role === "parent" ? "smartphone" : "badge"}
                    </span>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        role === "parent"
                          ? "Contoh: 081234567890 / ibu.siti@example.com"
                          : "Contoh: kader.budi@example.com"
                      }
                      className="w-full h-11 pl-10 pr-4 bg-white border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#0b1c30]">
                      Kata Sandi
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-semibold text-[#00652c] hover:underline"
                    >
                      Lupa Kata Sandi?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#6f7a6e]">
                      lock
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      className="w-full h-11 pl-10 pr-10 bg-white border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-[#6f7a6e] hover:text-[#0b1c30]"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#15803d] hover:bg-[#14532d] text-white font-semibold text-xs rounded-xl shadow-md shadow-[#15803d]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Masuk sebagai {role === "parent" ? "Orang Tua" : "Petugas"}</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Quick Demo Pre-fill */}
              <div className="mt-5 pt-4 border-t border-[#f1f5f9] text-center">
                <p className="text-[11px] text-[#6f7a6e] mb-2 font-medium">Mode Percobaan Cepat (Demo):</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRole("parent");
                      setIdentifier("081234567890");
                      setPassword("password123");
                    }}
                    className="flex-1 py-1 px-2 text-[10px] bg-[#eff4ff] text-[#00652c] rounded-lg border border-[#becabc]/40 hover:bg-[#dcfce7] font-semibold"
                  >
                    Isi Akun Orang Tua
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole("staff");
                      setIdentifier("kader.budi@example.com");
                      setPassword("password123");
                    }}
                    className="flex-1 py-1 px-2 text-[10px] bg-[#eff4ff] text-[#00652c] rounded-lg border border-[#becabc]/40 hover:bg-[#dcfce7] font-semibold"
                  >
                    Isi Akun Kader
                  </button>
                </div>
              </div>

              {/* Registration Link */}
              <div className="mt-5 text-center">
                <p className="text-xs text-[#3f493f]">
                  Belum memiliki akun orang tua?{" "}
                  <Link href="/register" className="font-bold text-[#00652c] hover:underline">
                    Daftar di sini
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-xs text-[#6f7a6e]">
            Kerahasiaan data anak dijamin sesuai UU Perlindungan Data Pribadi (PDP).
          </div>
        </div>
      </div>
    </div>
  );
}

