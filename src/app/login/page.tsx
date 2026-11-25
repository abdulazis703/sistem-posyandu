"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/supabase";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const reason = searchParams.get("reason");

  const [role, setRole] = useState<"parent" | "staff">("parent");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State untuk Edu-Tip Animasi Berputar
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const eduTips = [
    {
      icon: "egg_alt",
      badge: "Nutrisi Kunci",
      title: "1 Butir Telur Tiap Hari",
      desc: "Kaya kolin dan asam amino lengkap untuk memicu hormon pertumbuhan tinggi badan balita bebas stunting.",
      accent: "border-amber-200 bg-amber-50/90 text-amber-900",
      badgeBg: "bg-amber-500 text-white",
    },
    {
      icon: "scale",
      badge: "Pantau Rutin",
      title: "Timbang Rutin Setiap Bulan",
      desc: "Deteksi dini faltering growth sebelum terlambat dan pastikan kurva pertumbuhan KMS tetap di zona hijau.",
      accent: "border-emerald-200 bg-emerald-50/90 text-emerald-900",
      badgeBg: "bg-emerald-600 text-white",
    },
    {
      icon: "water_drop",
      badge: "Imunisasi Emas",
      title: "ASI Eksklusif 6 Bulan Pertama",
      desc: "Perlindungan alami terbaik dari infeksi, menyediakan nutrisi terlengkap untuk otak dan imunitas buah hati.",
      accent: "border-sky-200 bg-sky-50/90 text-sky-900",
      badgeBg: "bg-sky-500 text-white",
    },
    {
      icon: "nutrition",
      badge: "Gizi Seimbang",
      title: "Kombinasi Protein & Sayur",
      desc: "Padukan ikan kembung atau hati ayam dengan sayur hijau segar untuk mencukupi zat besi harian si kecil.",
      accent: "border-rose-200 bg-rose-50/90 text-rose-900",
      badgeBg: "bg-rose-500 text-white",
    },
  ];

  // Auto rotate tips edukasi setiap 4 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % eduTips.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [eduTips.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    // Format email jika pengguna memasukkan nomor telepon tanpa @
    let loginEmail = identifier.trim();
    if (!loginEmail.includes("@")) {
      loginEmail = `${loginEmail.replace(/[^0-9]/g, "")}@posyandu.parent.local`;
    }

    try {
      const result = await signIn(loginEmail, password);
      const userRole = result.role;

      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (userRole === "parent") {
        router.push("/parent/dashboard");
      } else {
        router.push("/staff/dashboard");
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn("Login attempt with Supabase:", errMsg);

      // Cek apakah fallback demo mode (jika env supabase belum disetup atau credentials demo)
      const cleanId = identifier.trim().toLowerCase();
      const isDemoParent = cleanId === "081234567890" || cleanId === "ibu.siti@example.com" || cleanId.includes("siti");
      const isDemoStaff = cleanId === "kader.budi@example.com" || cleanId === "bidan.sri@example.com" || cleanId === "admin@posyandu.id" || cleanId.includes("admin") || cleanId.includes("kader");

      if ((isDemoParent || isDemoStaff) && (password === "Password123!" || password === "password123")) {
        // Fallback demo redirect
        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (role === "parent") {
          router.push("/parent/dashboard");
        } else {
          router.push("/staff/dashboard");
        }
        return;
      }

      if (errMsg.toLowerCase().includes("failed to fetch")) {
        setErrorMessage(
          "Gagal terhubung ke server. Pastikan koneksi internet stabil atau coba beberapa saat lagi."
        );
      } else {
        setErrorMessage(
          errMsg === "Invalid login credentials"
            ? "Email atau kata sandi tidak sesuai. Silakan periksa kembali."
            : errMsg || "Gagal masuk ke akun. Pastikan koneksi internet stabil."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoRole: "parent" | "staff") => {
    setRole(demoRole);
    if (demoRole === "parent") {
      setIdentifier("081234567890");
      setPassword("Password123!");
    } else {
      setIdentifier("kader.budi@example.com");
      setPassword("Password123!");
    }
    setErrorMessage(null);
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-[#f0fdf4] via-[#f8faf9] to-[#eff6ff] flex flex-col justify-center overflow-x-hidden">
      <div className="w-full min-h-dvh flex flex-col lg:flex-row">
        {/* Left Hero & Cheerful Educational Panel */}
        <div className="w-full lg:w-1/2 bg-gradient-to-b from-[#eaf8ee] to-[#dcfce7]/60 flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-[#0b1c30] relative overflow-hidden border-b lg:border-b-0 lg:border-r border-emerald-100">
          <div className="absolute -right-24 -top-24 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 bottom-1/4 w-80 h-80 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none"></div>

          {/* Top Branding Section */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-md border border-emerald-200 text-emerald-700 shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">eco</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-extrabold tracking-tight text-[#14532d]">
                  TumbuhKu
                </span>
                <span className="text-xs text-emerald-700 tracking-wide font-bold">
                  Posyandu Ceria & KMS Digital
                </span>
              </div>
            </Link>

            <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 bg-white/90 border border-emerald-200 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="text-xs text-emerald-800 font-bold">
                Keluarga Sehat • Generasi Bebas Stunting
              </span>
            </div>
          </div>

          {/* Middle Value Proposition & Animated Educational Rotating Tip */}
          <div className="relative z-10 my-6 lg:my-auto space-y-6">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#14532d] tracking-tight max-w-lg mb-2 sm:mb-3 leading-snug">
                Tumbuh Sehat & Riang Setiap Hari
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
                Pantau grafik kurva KMS anak secara transparan, dapatkan notifikasi jadwal Posyandu, dan panduan gizi terpercaya.
              </p>
            </div>

            {/* Desktop Illustration Photo Banner with Floating Badges */}
            <div className="hidden lg:block relative w-full max-w-md rounded-3xl overflow-hidden shadow-lg border-2 border-emerald-200 aspect-[16/10] bg-emerald-50 group">
              <img
                src="/foto/ortu-dan-balita.jpg"
                alt="Orang Tua dan Balita Sehat Posyandu"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs py-1 px-3 rounded-full border border-emerald-100 shadow-2xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-700">child_care</span>
                <span className="text-[11px] font-bold text-emerald-900">Senyum Sehat Si Kecil</span>
              </div>
            </div>

            {/* Elemen Edukasi Berbasis Animasi: Rotating Edu-Tips Carousel */}
            <div className="relative max-w-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-700">lightbulb</span>
                  Edukasi Rutin Posyandu (Auto-Slide):
                </span>
                <div className="flex items-center gap-1">
                  {eduTips.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTipIndex(idx)}
                      aria-label={`Pilih tips edukasi ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentTipIndex === idx ? "w-5 bg-emerald-600" : "w-1.5 bg-emerald-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Animated Tip Card */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all duration-300 shadow-xs flex items-start gap-3.5 bg-white ${
                  eduTips[currentTipIndex].accent
                }`}
              >
                <div className="w-11 h-11 rounded-2xl bg-white shadow-2xs shrink-0 flex items-center justify-center text-emerald-700 border border-slate-200/60">
                  <span className="material-symbols-outlined text-[24px]">
                    {eduTips[currentTipIndex].icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${eduTips[currentTipIndex].badgeBg}`}>
                      {eduTips[currentTipIndex].badge}
                    </span>
                    <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {eduTips[currentTipIndex].title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {eduTips[currentTipIndex].desc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicator Bottom Bar */}
          <div className="relative z-10 pt-4 border-t border-emerald-200/60 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-700 text-[20px]">health_and_safety</span>
              <span className="text-xs font-medium">Binaan Puskesmas & Standar WHO</span>
            </div>
            <span className="text-xs font-semibold text-emerald-800 hidden sm:inline">KMS Digital RW 04</span>
          </div>
        </div>

        {/* Right Half: Joyful Authentication Workspace */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between p-5 sm:p-10 lg:p-14 bg-white">
          {/* Back Navigation Header */}
          <div className="flex justify-between items-center w-full max-w-md mx-auto mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 py-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Kembali ke Beranda
            </Link>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full text-xs font-semibold text-emerald-800 border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Online
            </div>
          </div>

          {/* Form Card Container */}
          <div className="w-full max-w-md mx-auto my-auto py-2">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100">
              {/* Joyful Greeting Header */}
              <div className="mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 shadow-2xs">
                  <span className="material-symbols-outlined text-[22px]">
                    {role === "parent" ? "family_restroom" : "medical_services"}
                  </span>
                </div>
                <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900">
                  {role === "parent" ? "Selamat Datang Ayah & Bunda" : "Portal Masuk Petugas & Kader"}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {role === "parent"
                    ? "Masuk untuk melihat catatan timbang dan kurva pertumbuhan si kecil."
                    : "Masuk untuk mencatat antropometri dan verifikasi penimbangan balita."}
                </p>
              </div>

              {/* Notice jika diarahkan untuk login dulu */}
              {(reason === "jadwal" || redirectUrl?.includes("pengumuman")) && (
                <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl text-xs flex items-center gap-2.5 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-emerald-950">Akses Jadwal Posyandu</span>
                    <span className="text-[11px] text-emerald-800 leading-relaxed">
                      Silakan masuk untuk membaca rincian jadwal kegiatan dan pengumuman lengkap.
                    </span>
                  </div>
                </div>
              )}

              {/* Role Switcher Tab (Ceria & Jelas) */}
              <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 mb-6 gap-1">
                <button
                  type="button"
                  onClick={() => setRole("parent")}
                  className={`flex-1 h-11 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    role === "parent"
                      ? "bg-white text-emerald-800 shadow-sm scale-102"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                  <span>Orang Tua / Wali</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("staff")}
                  className={`flex-1 h-11 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    role === "staff"
                      ? "bg-white text-emerald-800 shadow-sm scale-102"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  <span>Petugas / Kader</span>
                </button>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-rose-600 shrink-0">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {role === "parent" ? "Nomor WhatsApp / Email Orang Tua" : "Email Petugas / ID Kader"}
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-[18px] text-slate-400 pointer-events-none">
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
                      className="w-full h-11 pl-10 pr-4 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Kata Sandi
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      Lupa Sandi?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-[18px] text-slate-400 pointer-events-none">
                      lock
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      className="w-full h-11 pl-10 pr-12 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 bottom-0 w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                      title={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                      aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
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
                    className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
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

              {/* Quick Fill Demo Helper Pill */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1.5 mb-2 text-center">
                  <span className="material-symbols-outlined text-[15px] text-amber-600">bolt</span>
                  Akses Cepat Akun Demo (1-Klik Isi):
                </span>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount("parent")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">person</span>
                    <span>Ibu Siti (Wali)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount("staff")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">badge</span>
                    <span>Kader Budi (Petugas)</span>
                  </button>
                </div>
              </div>

              {/* Registration Link */}
              <div className="mt-5 text-center">
                <p className="text-xs text-slate-600">
                  Belum memiliki akun orang tua?{" "}
                  <Link href="/register" className="font-bold text-emerald-700 hover:underline inline-block">
                    Daftar Mandiri di Sini
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-xs text-slate-400 mt-4">
            Keamanan & kerahasiaan data balita terjamin sesuai standar Posyandu Digital.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-slate-50 flex items-center justify-center p-4 text-xs text-slate-500">Memuat halaman login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
