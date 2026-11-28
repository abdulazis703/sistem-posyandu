"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import useChildrenData from "@/app/hooks/useChildrenData";
import { getCurrentUser, UserProfile } from "@/lib/supabase";
import { StuntingBadge } from "@/components/ui/badge";
import { ImtGrowthChart } from "@/components/growth/ImtGrowthChart";
import { calculateImt, assessImt } from "@/lib/imtStandards";
import { calculateDetailedAge } from "@/lib/ageHelper";

export default function GrafikPertumbuhanParentPage() {
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [activeCurveTab, setActiveCurveTab] = useState<"imt" | "bb" | "tb">("imt");
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

  if (isLoading) {
    return (
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center text-xs text-slate-500">
          Memuat data pertumbuhan balita...
        </div>
      </div>
    );
  }

  if (myChildren.length === 0) {
    return (
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/parent/dashboard" className="hover:text-emerald-700">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Balita Saya</span>
        </div>

        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200/80 shadow-xs text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
            <span className="material-symbols-outlined text-[28px]">child_care</span>
          </div>
          <h1 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
            Belum Ada Balita Terdaftar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Akun <strong>{currentUser?.fullName || "Anda"}</strong> saat ini memiliki 0 data balita di sistem Posyandu. Grafik pertumbuhan akan tampil otomatis setelah kader mendaftarkan buah hati Anda.
          </p>
          <div className="pt-2">
            <Link
              href="/parent/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Kembali ke Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeChild = myChildren[selectedChildIndex] || myChildren[0];
  const childImt = calculateImt(activeChild.weight, activeChild.height);
  const childImtAssessment = assessImt(
    childImt,
    activeChild.ageMonths || 18,
    activeChild.gender || "L"
  );

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Top Utility Bar: Child Switcher & PDF Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/parent/dashboard" className="hover:text-emerald-700">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Balita Saya &amp; Grafik Pertumbuhan</span>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Child Switcher Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">family_restroom</span>
            <select
              value={selectedChildIndex}
              onChange={(e) => setSelectedChildIndex(Number(e.target.value))}
              className="bg-transparent text-base sm:text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {myChildren.map((child, idx) => (
                <option key={child.id} value={idx}>
                  {child.name} ({child.ageMonths} Bulan)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => alert("Mengunduh Buku KIA / KMS & Grafik IMT Digital format PDF...")}
            className="px-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">menu_book</span>
            <span>Unduh Buku KIA (PDF)</span>
          </button>
        </div>
      </div>

      {/* Child Header Profile Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-2xl flex items-center justify-center border border-emerald-200 shrink-0">
            {activeChild.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-heading text-xl lg:text-2xl font-bold text-slate-900">
                {activeChild.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                {activeChild.gender === "L" ? "Laki-laki" : "Perempuan"}
              </span>
              <StuntingBadge status={activeChild.stuntingStatus} />
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${childImtAssessment.badgeColorClass}`}>
                IMT: {childImtAssessment.category}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500">
              <span>NIK: <strong className="text-slate-800 font-semibold">{activeChild.nik}</strong></span>
              <span>•</span>
              <span>
                Umur Presisi: <strong className="text-emerald-800 font-bold">{calculateDetailedAge(activeChild.birthDate).textLong}</strong> ({activeChild.ageMonths} Bulan)
              </span>
              <span>•</span>
              <span>Lahir: <strong className="text-slate-800 font-semibold">{activeChild.birthDate}</strong></span>
              <span>•</span>
              <span>Posyandu: <strong className="text-slate-800 font-semibold">{activeChild.posyandu}</strong></span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          <span className="text-xs text-slate-500 block">Pemeriksaan Terakhir</span>
          <span className="font-heading text-sm font-bold text-slate-900 block mt-0.5">
            {activeChild.lastExamDate}
          </span>
          <span className="text-xs text-emerald-700 font-medium">Tercatat di Posyandu</span>
        </div>
      </div>

      {/* 5 Biometric Metric Cards (Including IMT) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: BB */}
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 block font-medium">Berat Badan</span>
          <p className="font-heading text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
            {activeChild.weight} <span className="text-xs font-normal text-slate-500">kg</span>
          </p>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            Z-Score BB/U: {activeChild.zScoreBbU} SD
          </span>
        </div>

        {/* Card 2: TB */}
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 block font-medium">Panjang / Tinggi</span>
          <p className="font-heading text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
            {activeChild.height} <span className="text-xs font-normal text-slate-500">cm</span>
          </p>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            Z-Score TB/U: {activeChild.zScoreTbU} SD
          </span>
        </div>

        {/* Card 3: IMT */}
        <div className="p-4 sm:p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-900 block font-bold">Indeks Massa Tubuh</span>
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          </div>
          <p className="font-heading text-2xl lg:text-3xl font-extrabold text-emerald-900 mt-1">
            {childImt} <span className="text-xs font-normal text-emerald-700">kg/m²</span>
          </p>
          <span className="text-xs text-emerald-800 font-bold mt-1 block">
            {childImtAssessment.category}
          </span>
        </div>

        {/* Card 4: LK */}
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 block font-medium">Lingkar Kepala</span>
          <p className="font-heading text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
            {activeChild.headCircumference ?? "-"}{" "}
            {activeChild.headCircumference != null && (
              <span className="text-xs font-normal text-slate-500">cm</span>
            )}
          </p>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            {activeChild.headCircumference != null ? "Data Ukur Terkini" : "Belum Diukur"}
          </span>
        </div>

        {/* Card 5: LiLA */}
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-500 block font-medium">Lingkar Lengan (LiLA)</span>
          <p className="font-heading text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
            {activeChild.lila ?? "-"}{" "}
            {activeChild.lila != null && (
              <span className="text-xs font-normal text-slate-500">cm</span>
            )}
          </p>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            {activeChild.lila != null ? "Data Ukur Terkini" : "Belum Diukur"}
          </span>
        </div>
      </div>

      {/* Curve Navigation Selector Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveCurveTab("imt")}
          className={`pb-3 px-1 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeCurveTab === "imt"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">query_stats</span>
          <span>Grafik Indeks Massa Tubuh (IMT/U)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            Interaktif
          </span>
        </button>

        <button
          onClick={() => setActiveCurveTab("bb")}
          className={`pb-3 px-1 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeCurveTab === "bb"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">monitor_weight</span>
          <span>Kurva Berat Badan (BB/U KMS)</span>
        </button>

        <button
          onClick={() => setActiveCurveTab("tb")}
          className={`pb-3 px-1 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeCurveTab === "tb"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">straighten</span>
          <span>Kurva Tinggi Badan (TB/U Stunting)</span>
        </button>
      </div>

      {/* Tab Content Display */}
      {activeCurveTab === "imt" ? (
        <ImtGrowthChart child={activeChild} role="parent" />
      ) : activeCurveTab === "bb" ? (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Kurva Berat Badan menurut Umur (BB/U) — KMS Kemenkes RI
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pita hijau menunjukkan lintasan penimbangan berat badan anak usia 0 - 24 bulan.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Status BB: {activeChild.wastingStatus} ({activeChild.weight} kg)
              </span>
            </div>
          </div>

          <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-6 border border-slate-200/70 overflow-x-auto">
            <svg viewBox="0 0 680 230" className="w-full h-64 overflow-visible min-w-[580px]" fill="none">
              <line x1="40" y1="30" x2="660" y2="30" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="40" y1="80" x2="660" y2="80" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="40" y1="130" x2="660" y2="130" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="40" y1="180" x2="660" y2="180" stroke="#CBD5E1" />

              <path d="M40,210 Q220,185 360,170 T660,140 L660,165 T360,195 Q220,205 40,225 Z" fill="#FEE2E2" opacity="0.7" />
              <path d="M40,195 Q220,170 360,150 T660,115 L660,140 T360,170 Q220,185 40,210 Z" fill="#FEF3C7" opacity="0.8" />
              <path d="M40,160 Q220,120 360,90 T660,40 L660,115 T360,150 Q220,170 40,195 Z" fill="#D1FAE5" opacity="0.85" />

              <path
                d="M40,215 Q140,195 240,170 T440,125 T640,75"
                stroke="#059669"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />

              {[
                { cx: 540, cy: 100, val: `${activeChild.weight} kg` },
              ].map((p, i) => (
                <g key={i}>
                  <circle cx={p.cx} cy={p.cy} r="6" fill="#059669" stroke="#FFFFFF" strokeWidth="2.5" />
                  <text x={p.cx} y={p.cy - 12} textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="bold">
                    {p.val}
                  </text>
                </g>
              ))}

              <text x="40" y="228" fill="#64748B" fontSize="10">0 Bln</text>
              <text x="140" y="228" fill="#64748B" fontSize="10">3 Bln</text>
              <text x="240" y="228" fill="#64748B" fontSize="10">6 Bln</text>
              <text x="340" y="228" fill="#64748B" fontSize="10">9 Bln</text>
              <text x="440" y="228" fill="#64748B" fontSize="10">12 Bln</text>
              <text x="540" y="228" fill="#64748B" fontSize="10">18 Bln</text>
              <text x="640" y="228" fill="#64748B" fontSize="10">24 Bln</text>
            </svg>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Kurva Panjang / Tinggi Badan menurut Umur (TB/U) — Standar WHO
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Area hijau menandakan pita deviasi batas tinggi badan normal (-2 SD s/d +2 SD).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Status: {activeChild.stuntingStatus} ({activeChild.height} cm)
              </span>
            </div>
          </div>

          <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-6 border border-slate-200/70 overflow-x-auto">
            <svg viewBox="0 0 680 230" className="w-full h-64 overflow-visible min-w-[580px]" fill="none">
              <line x1="40" y1="30" x2="660" y2="30" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="40" y1="80" x2="660" y2="80" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="40" y1="130" x2="660" y2="130" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="40" y1="180" x2="660" y2="180" stroke="#CBD5E1" />

              <path d="M40,170 Q220,130 380,85 T660,45 L660,135 Q400,165 220,185 T40,205 Z" fill="#D1FAE5" opacity="0.85" />
              <path d="M40,170 Q220,130 380,85 T660,45" stroke="#86EFAC" strokeWidth="1.5" strokeDasharray="3 2" />
              <path d="M40,205 Q220,185 400,165 T660,135" stroke="#86EFAC" strokeWidth="1.5" strokeDasharray="3 2" />

              <path
                d="M40,190 L140,175 L240,155 L340,135 L440,118 L540,98"
                stroke="#059669"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />

              {[
                { cx: 540, cy: 98, val: `${activeChild.height} cm` },
              ].map((p, i) => (
                <g key={i}>
                  <circle cx={p.cx} cy={p.cy} r="6" fill="#059669" stroke="#FFFFFF" strokeWidth="2.5" />
                  <text x={p.cx} y={p.cy - 12} textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="bold">
                    {p.val}
                  </text>
                </g>
              ))}

              <text x="40" y="228" fill="#64748B" fontSize="10">0 Bln</text>
              <text x="140" y="228" fill="#64748B" fontSize="10">3 Bln</text>
              <text x="240" y="228" fill="#64748B" fontSize="10">6 Bln</text>
              <text x="340" y="228" fill="#64748B" fontSize="10">9 Bln</text>
              <text x="440" y="228" fill="#64748B" fontSize="10">12 Bln</text>
              <text x="540" y="228" fill="#64748B" fontSize="10">18 Bln</text>
              <text x="640" y="228" fill="#64748B" fontSize="10">24 Bln</text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
