"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockChildren, mockExamRecords } from "@/lib/mockData";
import { StuntingBadge } from "@/components/ui/badge";

export default function GrafikPertumbuhanParentPage() {
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const myChildren = mockChildren.filter(
    (c) => c.parentId === "parent-1" || c.parentName === "Sari Rahmawati"
  );

  const activeChild = myChildren[selectedChildIndex] || myChildren[0];
  const exams = mockExamRecords.filter(
    (e) => e.childId === activeChild.id || e.childName === activeChild.name
  );

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Top Utility Bar: Child Switcher & PDF Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/parent/dashboard" className="hover:text-emerald-700">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Grafik KMS & Pertumbuhan</span>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Child Switcher Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">family_restroom</span>
            <select
              value={selectedChildIndex}
              onChange={(e) => setSelectedChildIndex(Number(e.target.value))}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {myChildren.map((child, idx) => (
                <option key={child.id} value={idx}>
                  {child.name} ({child.ageMonths} Bulan)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => alert("Mengunduh Buku KIA / KMS Digital format PDF...")}
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
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500">
              <span>NIK: <strong className="text-slate-800 font-semibold">{activeChild.nik}</strong></span>
              <span>•</span>
              <span>Usia: <strong className="text-slate-800 font-semibold">{activeChild.ageMonths} Bulan</strong></span>
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
          <span className="text-xs text-emerald-700 font-medium">Tercatat Valid di e-PPGBM</span>
        </div>
      </div>

      {/* 4 Biometric Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 block font-medium">Berat Badan</span>
          <p className="font-heading text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
            {activeChild.weight} <span className="text-xs font-normal text-slate-500">kg</span>
          </p>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            Z-Score: +0.2 SD (Ideal)
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 block font-medium">Panjang / Tinggi</span>
          <p className="font-heading text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
            {activeChild.height} <span className="text-xs font-normal text-slate-500">cm</span>
          </p>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            Z-Score: {activeChild.zScoreTbU} SD (Normal)
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 block font-medium">Lingkar Kepala</span>
          <p className="font-heading text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
            {activeChild.headCircumference || 46.5} <span className="text-xs font-normal text-slate-500">cm</span>
          </p>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            Pertumbuhan Otak Baik
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 block font-medium">Lingkar Lengan (LiLA)</span>
          <p className="font-heading text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
            {activeChild.lila || 14.5} <span className="text-xs font-normal text-slate-500">cm</span>
          </p>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            Pita Hijau (Gizi Cukup)
          </span>
        </div>
      </div>

      {/* Main Growth Curve KMS Chart Container */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Kurva Pertumbuhan KMS Digital (Standar WHO / Kemenkes RI)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pita hijau menunjukkan lintasan pertumbuhan ideal anak usia 0 - 24 bulan.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Status: Normal / Sesuai Rujukan
            </span>
          </div>
        </div>

        {/* KMS SVG Graphic */}
        <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-6 border border-slate-200/70">
          <svg viewBox="0 0 680 230" className="w-full h-64 overflow-visible" fill="none">
            <line x1="40" y1="30" x2="660" y2="30" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="40" y1="80" x2="660" y2="80" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="40" y1="130" x2="660" y2="130" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="40" y1="180" x2="660" y2="180" stroke="#CBD5E1" />

            {/* KMS WHO Standard Growth Bands */}
            <path d="M40,210 Q220,185 360,170 T660,140 L660,165 T360,195 Q220,205 40,225 Z" fill="#FEE2E2" opacity="0.7" />
            <path d="M40,195 Q220,170 360,150 T660,115 L660,140 T360,170 Q220,185 40,210 Z" fill="#FEF3C7" opacity="0.8" />
            <path d="M40,160 Q220,120 360,90 T660,40 L660,115 T360,150 Q220,170 40,195 Z" fill="#D1FAE5" opacity="0.85" />

            {/* Trajectory Plot Line */}
            <path
              d="M40,215 Q140,195 240,170 T440,125 T640,75"
              stroke="#059669"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Data Points */}
            {[
              { cx: 40, cy: 215, val: "3.2 kg" },
              { cx: 140, cy: 195, val: "5.1 kg" },
              { cx: 240, cy: 170, val: "7.0 kg" },
              { cx: 340, cy: 145, val: "8.4 kg" },
              { cx: 440, cy: 125, val: "9.6 kg" },
              { cx: 540, cy: 100, val: "10.8 kg" },
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.cx} cy={p.cy} r="6" fill="#059669" stroke="#FFFFFF" strokeWidth="2.5" />
                <text x={p.cx} y={p.cy - 12} textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="bold">
                  {p.val}
                </text>
              </g>
            ))}

            {/* Labels */}
            <text x="40" y="228" fill="#64748B" fontSize="10">0 Bln</text>
            <text x="140" y="228" fill="#64748B" fontSize="10">3 Bln</text>
            <text x="240" y="228" fill="#64748B" fontSize="10">6 Bln</text>
            <text x="340" y="228" fill="#64748B" fontSize="10">9 Bln</text>
            <text x="440" y="228" fill="#64748B" fontSize="10">12 Bln</text>
            <text x="540" y="228" fill="#64748B" fontSize="10">18 Bln</text>
            <text x="640" y="228" fill="#64748B" fontSize="10">24 Bln</text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-200"></span>
              <span>Gizi Normal / Sesuai Usia</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-200"></span>
              <span>Garis Pertumbuhan Waspada</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-200"></span>
              <span>Di Bawah Garis Merah (BGM)</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <span className="w-3 h-1 bg-emerald-600 rounded-full"></span>
              <span>Plot Pertumbuhan Anak</span>
            </span>
          </div>

          <span>Sumber: Buku Kesehatan Ibu dan Anak (KIA) Kemenkes RI</span>
        </div>
      </div>
    </div>
  );
}
