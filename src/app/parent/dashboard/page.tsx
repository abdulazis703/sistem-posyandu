"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import useChildrenData from "@/app/hooks/useChildrenData";
import { getCurrentUser, UserProfile } from "@/lib/supabase";
import { StuntingBadge } from "@/components/ui/badge";
import { TumbuhKuLoader } from "@/components/ui/TumbuhKuLoader";
import { calculateDetailedAge } from "@/lib/ageHelper";

export default function ParentDashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((user) => {
        if (mounted) setCurrentUser(user);
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

  const displayName = loadingUser
    ? "..."
    : currentUser?.fullName || "Orang Tua";

  const displayPosyandu =
    myChildren[0]?.posyandu ||
    currentUser?.posyandu ||
    "Posyandu Melati 01 (RW 01)";

  const examinedCount = myChildren.filter((c) => Boolean(c.lastExamDate)).length;
  const examinedPct =
    myChildren.length > 0 ? Math.round((examinedCount / myChildren.length) * 100) : 0;

  const normalCount = myChildren.filter((c) => c.stuntingStatus === "Normal").length;
  const normalPct =
    myChildren.length > 0 ? Math.round((normalCount / myChildren.length) * 100) : 0;

  if (isLoading) {
    return (
      <TumbuhKuLoader
        message="Menyiapkan Ruang TumbuhKu..."
        subMessage="Memuat data balita & Buku KIA Digital Anda..."
      />
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Subtle Disclaimer Banner */}
      <div className="w-full bg-emerald-50/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs border border-emerald-200/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
            <span className="material-symbols-outlined text-[20px]">info</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-900">
              Hasil ini adalah indikasi awal dan perlu ditinjau petugas kesehatan.
            </span>
            <span className="text-xs text-slate-500">
              Data bersumber dari penimbangan resmi kader {displayPosyandu}.
            </span>
          </div>
        </div>
        <span className="text-xs font-semibold text-emerald-800 bg-white px-3 py-1 rounded-full shrink-0 border border-emerald-200/70 shadow-xs">
          Buku KIA Digital
        </span>
      </div>

      {/* Greeting Header & Visual Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-800 to-[#14532d] text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-emerald-100 text-xs font-semibold w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
              {displayPosyandu}
            </span>
            <h1 className="font-heading text-2xl lg:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              Selamat datang, {displayName} <span className="text-2xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Pantau perkembangan kurva KMS dan riwayat pemeriksaan posyandu buah hati Anda secara berkala, transparan, dan akurat.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => alert("Mengunduh rangkuman catatan KMS digital dalam format PDF...")}
                className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Unduh Rangkuman KMS</span>
              </button>
              <Link
                href="/parent/grafik"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">show_chart</span>
                <span>Buka Kurva Pertumbuhan</span>
              </Link>
            </div>
          </div>

          {/* Banner Photo Preview */}
          <div className="hidden sm:block w-full sm:w-60 md:w-72 lg:w-80 aspect-[16/10] rounded-xl overflow-hidden shadow-md border-2 border-white/20 shrink-0 bg-emerald-900">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
              alt="Ibu dan Balita Posyandu"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80";
              }}
            />
          </div>
        </div>
      </div>

      {/* Row of 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex items-start justify-between hover:shadow-sm transition-shadow">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Jumlah Balita Terdaftar
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-slate-900">
                {isLoading ? "..." : myChildren.length}
              </span>
              <span className="text-xs text-slate-500 font-medium">Anak</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-xs text-emerald-800 font-medium">
                {isLoading
                  ? "Memuat data balita..."
                  : myChildren.length > 0
                  ? "Semua aktif terpantau"
                  : "Belum ada balita terdaftar"}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <span className="material-symbols-outlined text-[28px]">family_restroom</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Pemeriksaan Bulan Ini
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-heading text-2xl lg:text-3xl font-extrabold text-slate-900">
                  {isLoading ? "..." : examinedCount}{" "}
                  <span className="text-xs text-slate-500 font-normal">
                    dari {isLoading ? "..." : myChildren.length} Selesai
                  </span>
                </span>
                <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {isLoading ? "..." : `${examinedPct}%`}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <span className="material-symbols-outlined text-[26px]">event_available</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{ width: isLoading ? "0%" : `${examinedPct}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
              <span>Periode Berjalan</span>
              <span className="font-semibold text-slate-800">
                {myChildren.length > 0 ? "Terjadwal rutin" : "Belum ada jadwal"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex items-start justify-between hover:shadow-sm transition-shadow">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Status Pertumbuhan
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-emerald-700">
                {isLoading ? "..." : myChildren.length > 0 ? `${normalPct}%` : "-"}
              </span>
              <span className="text-xs text-slate-500 font-medium">Zona Hijau</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
              <span className="text-xs text-emerald-800 font-medium">
                {myChildren.length > 0 ? "Tumbuh Kembang Terpantau" : "Belum ada data ukur"}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <span className="material-symbols-outlined text-[28px]">sentiment_very_satisfied</span>
          </div>
        </div>
      </div>

      {/* Children Cards List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold text-slate-900">
            Kartu Balita Saya ({isLoading ? "..." : `${myChildren.length} Anak`})
          </h2>
          <span className="text-xs text-slate-500">
            Otomatis terhubung dari data Posyandu
          </span>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center text-xs text-slate-500">
            Memuat data balita milik akun {displayName}...
          </div>
        ) : myChildren.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-800">
              Belum ada data balita yang terhubung ke akun {displayName}.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Data balita akan muncul otomatis setelah kader Posyandu mendaftarkan anak Anda ke akun orang tua ini (NIK: {currentUser?.nik || "-"}).
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {myChildren.map((child) => (
              <div
                key={child.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-lg flex items-center justify-center border border-emerald-200">
                        {child.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-heading text-base font-bold text-slate-900">
                          {child.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {calculateDetailedAge(child.birthDate).textLong} ({child.ageMonths} Bulan) •{" "}
                          {child.gender === "L" ? "Laki-laki" : "Perempuan"}
                        </p>
                      </div>
                    </div>

                    <StuntingBadge status={child.stuntingStatus} />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 my-4">
                    <div className="p-2 sm:p-3 bg-slate-50 rounded-xl text-center border border-slate-200/70">
                      <span className="text-[11px] sm:text-xs text-slate-500 block truncate">Berat Badan</span>
                      <span className="font-heading text-base sm:text-lg font-bold text-slate-900 mt-0.5 block">
                        {child.weight} <span className="text-[10px] sm:text-xs font-normal text-slate-500">kg</span>
                      </span>
                      <span className="text-[11px] sm:text-xs text-emerald-700 font-semibold truncate block">
                        {child.wastingStatus}
                      </span>
                    </div>

                    <div className="p-2 sm:p-3 bg-slate-50 rounded-xl text-center border border-slate-200/70">
                      <span className="text-[11px] sm:text-xs text-slate-500 block truncate">Tinggi Badan</span>
                      <span className="font-heading text-base sm:text-lg font-bold text-slate-900 mt-0.5 block">
                        {child.height} <span className="text-[10px] sm:text-xs font-normal text-slate-500">cm</span>
                      </span>
                      <span className="text-[11px] sm:text-xs text-emerald-700 font-semibold truncate block">
                        {child.stuntingStatus}
                      </span>
                    </div>

                    <div className="p-2 sm:p-3 bg-slate-50 rounded-xl text-center border border-slate-200/70">
                      <span className="text-[11px] sm:text-xs text-slate-500 block truncate">Z-Score TB/U</span>
                      <span className="font-heading text-base sm:text-lg font-bold text-emerald-700 mt-0.5 block">
                        {child.zScoreTbU} <span className="text-[10px] sm:text-xs font-normal text-slate-500">SD</span>
                      </span>
                      <span className="text-[11px] sm:text-xs text-emerald-700 font-semibold truncate block">
                        {child.stuntingStatus === "Normal" ? "Sesuai Usia" : "Perlu Pantau"}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1">
                    <p>
                      Terakhir ditimbang: <strong className="text-slate-800">{child.lastExamDate}</strong>
                    </p>
                    <p>
                      Posyandu: <strong className="text-slate-800">{child.posyandu}</strong>
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/parent/riwayat"
                    className="text-xs font-semibold text-slate-600 hover:text-emerald-700"
                  >
                    Riwayat Pengukuran
                  </Link>
                  <Link
                    href="/parent/grafik"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Lihat Grafik</span>
                    <span className="material-symbols-outlined text-[16px]">show_chart</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
