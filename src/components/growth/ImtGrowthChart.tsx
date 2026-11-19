"use client";

import React, { useState } from "react";
import {
  whoBmiBoys,
  whoBmiGirls,
  calculateImt,
  assessImt,
  generateImtHistory,
  ImtHistoryPoint,
} from "@/lib/imtStandards";
import { Child } from "@/lib/mockData";

interface ImtGrowthChartProps {
  child: Child;
  role: "parent" | "staff";
  className?: string;
}

export function ImtGrowthChart({ child, role, className = "" }: ImtGrowthChartProps) {
  const gender = child.gender || "L";
  const ageMonths = child.ageMonths || 18;
  const weight = child.weight || 10.5;
  const height = child.height || 81;

  const currentImt = calculateImt(weight, height);
  const assessment = assessImt(currentImt, ageMonths, gender);
  const historyPoints = generateImtHistory(ageMonths, weight, height, gender);

  const [hoveredPoint, setHoveredPoint] = useState<number | null>(
    historyPoints.length > 0 ? historyPoints.length - 1 : null
  );

  // Standar referensi WHO sesuai gender
  const standards = gender === "P" ? whoBmiGirls : whoBmiBoys;

  // Dimensi SVG
  const width = 760;
  const heightSvg = 340;
  const padLeft = 55;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 45;

  const plotWidth = width - padLeft - padRight;
  const plotHeight = heightSvg - padTop - padBottom;

  // Skala: Umur 0 s/d max (24 bulan jika umur <= 24, atau 60 bulan jika umur > 24)
  const maxAge = ageMonths <= 24 ? 24 : 60;
  const minImt = 10;
  const maxImt = 23;

  const getX = (m: number) => padLeft + (Math.min(m, maxAge) / maxAge) * plotWidth;
  const getY = (val: number) => {
    const clamped = Math.max(minImt, Math.min(val, maxImt));
    return padTop + plotHeight - ((clamped - minImt) / (maxImt - minImt)) * plotHeight;
  };

  // Filter standar sesuai batas umur maxAge
  const activeStandards = standards.filter((s) => s.ageMonths <= maxAge);

  // Helper untuk membuat path SVG dari array titik
  const makeLinePath = (getter: (s: (typeof standards)[0]) => number) => {
    return activeStandards
      .map((s, i) => `${i === 0 ? "M" : "L"} ${getX(s.ageMonths).toFixed(1)},${getY(getter(s)).toFixed(1)}`)
      .join(" ");
  };

  // Path batas zona WHO
  const pathSd3pos = makeLinePath((s) => s.sd3pos);
  const pathSd2pos = makeLinePath((s) => s.sd2pos);
  const pathSd1pos = makeLinePath((s) => s.sd1pos);
  const pathMedian = makeLinePath((s) => s.median);
  const pathSd2neg = makeLinePath((s) => s.sd2neg);
  const pathSd3neg = makeLinePath((s) => s.sd3neg);

  // Polygon untuk area warna (Zona Hijau Normal -2 SD s/d +1 SD)
  const normalBandPolygon = () => {
    const top = activeStandards.map((s) => `${getX(s.ageMonths).toFixed(1)},${getY(s.sd1pos).toFixed(1)}`);
    const bottom = [...activeStandards]
      .reverse()
      .map((s) => `${getX(s.ageMonths).toFixed(1)},${getY(s.sd2neg).toFixed(1)}`);
    return `M ${top.join(" L ")} L ${bottom.join(" L ")} Z`;
  };

  // Polygon untuk area Kuning Berisiko Gizi Lebih (+1 SD s/d +2 SD)
  const riskOverweightBand = () => {
    const top = activeStandards.map((s) => `${getX(s.ageMonths).toFixed(1)},${getY(s.sd2pos).toFixed(1)}`);
    const bottom = [...activeStandards]
      .reverse()
      .map((s) => `${getX(s.ageMonths).toFixed(1)},${getY(s.sd1pos).toFixed(1)}`);
    return `M ${top.join(" L ")} L ${bottom.join(" L ")} Z`;
  };

  // Polygon untuk area Oranye Overweight (+2 SD s/d +3 SD)
  const overweightBand = () => {
    const top = activeStandards.map((s) => `${getX(s.ageMonths).toFixed(1)},${getY(s.sd3pos).toFixed(1)}`);
    const bottom = [...activeStandards]
      .reverse()
      .map((s) => `${getX(s.ageMonths).toFixed(1)},${getY(s.sd2pos).toFixed(1)}`);
    return `M ${top.join(" L ")} L ${bottom.join(" L ")} Z`;
  };

  // Polygon untuk area Kuning Gizi Kurang (-2 SD s/d -3 SD)
  const wastedBand = () => {
    const top = activeStandards.map((s) => `${getX(s.ageMonths).toFixed(1)},${getY(s.sd2neg).toFixed(1)}`);
    const bottom = [...activeStandards]
      .reverse()
      .map((s) => `${getX(s.ageMonths).toFixed(1)},${getY(s.sd3neg).toFixed(1)}`);
    return `M ${top.join(" L ")} L ${bottom.join(" L ")} Z`;
  };

  // Trajectory Plot Line balita
  const childPlotPoints = historyPoints.filter((p) => p.ageMonths <= maxAge);
  const childPath = childPlotPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(p.ageMonths).toFixed(1)},${getY(p.imt).toFixed(1)}`)
    .join(" ");

  // Garis horizontal panduan IMT (12, 14, 16, 18, 20, 22)
  const imtTicks = [12, 14, 16, 18, 20, 22];

  // Titik label sumbu X (bulan)
  const monthTicks = maxAge === 24 ? [0, 3, 6, 9, 12, 15, 18, 21, 24] : [0, 6, 12, 24, 36, 48, 60];

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {/* Top Metric & Status Summary Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
            <span className="material-symbols-outlined text-[30px]">calculate</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Indeks Massa Tubuh (IMT / BMI) Balita
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${assessment.badgeColorClass}`}>
                {assessment.category}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                {currentImt}
              </span>
              <span className="text-sm font-semibold text-slate-500">kg/m²</span>
              <span className="text-xs text-slate-400 ml-1">
                (Deviasi: <strong className={assessment.zScore < -2 || assessment.zScore > 2 ? "text-rose-600" : "text-emerald-700"}>
                  {assessment.zScore > 0 ? `+${assessment.zScore}` : assessment.zScore} SD
                </strong>)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dihitung dari Berat Badan: <strong>{weight} kg</strong> & Panjang/Tinggi: <strong>{height} cm</strong>
            </p>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 text-xs flex flex-col gap-1 min-w-[240px]">
          <div className="flex justify-between items-center text-slate-600">
            <span>Rujukan Ideal WHO ({ageMonths} Bln):</span>
            <strong className="text-emerald-700 font-bold">14.5 – 17.5 kg/m²</strong>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Standar Median (0 SD):</span>
            <strong className="text-slate-800">
              {(gender === "P" ? whoBmiGirls : whoBmiBoys).find((s) => s.ageMonths >= ageMonths)?.median || 16.0} kg/m²
            </strong>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Baku Rujukan:</span>
            <span className="text-slate-500 font-medium">Permenkes RI No. 2 / 2020</span>
          </div>
        </div>
      </div>

      {/* Main SVG Curve Container */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-base font-bold text-slate-900">
                Kurva IMT menurut Umur (BMI-for-Age) — Standar WHO
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                {gender === "L" ? "Laki-laki (0 - " + maxAge + " Bln)" : "Perempuan (0 - " + maxAge + " Bln)"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pita hijau menunjukkan zona proporsi gizi seimbang (-2 SD s/d +1 SD). Arahkan kursor atau sentuh titik untuk melihat detail pengukuran.
            </p>
          </div>

          {/* Quick Point Inspection Badge */}
          {hoveredPoint !== null && childPlotPoints[hoveredPoint] && (
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl px-3.5 py-2 text-xs flex items-center gap-3 shrink-0 animate-in fade-in">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></div>
              <div>
                <span className="text-slate-500 font-medium">Titik Usia {childPlotPoints[hoveredPoint].ageMonths} Bln: </span>
                <strong className="text-emerald-900 font-bold">{childPlotPoints[hoveredPoint].imt} kg/m²</strong>
                <span className="text-slate-400 mx-1">•</span>
                <span className="text-slate-600">{childPlotPoints[hoveredPoint].weight} kg / {childPlotPoints[hoveredPoint].height} cm</span>
              </div>
            </div>
          )}
        </div>

        {/* SVG Canvas */}
        <div className="bg-slate-50/70 rounded-2xl p-3 sm:p-5 border border-slate-200/70 overflow-x-auto">
          <div className="min-w-[620px]">
            <svg viewBox={`0 0 ${width} ${heightSvg}`} className="w-full h-72 sm:h-80 overflow-visible select-none" fill="none">
              <defs>
                {/* Glow Filter for Points */}
                <filter id="imtPointGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#047857" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Grid Lines Sumbu Y */}
              {imtTicks.map((val) => {
                const y = getY(val);
                return (
                  <g key={`grid-y-${val}`}>
                    <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <text x={padLeft - 10} y={y + 4} textAnchor="end" fill="#64748B" fontSize="11" fontWeight="600">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Grid Lines Sumbu X */}
              {monthTicks.map((m) => {
                const x = getX(m);
                return (
                  <g key={`grid-x-${m}`}>
                    <line x1={x} y1={padTop} x2={x} y2={heightSvg - padBottom} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <text x={x} y={heightSvg - padBottom + 18} textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="600">
                      {m} Bln
                    </text>
                  </g>
                );
              })}

              {/* WHO Growth Bands (Colored Zones) */}
              {/* 1. Obesitas Zone (Background Top) */}
              <rect
                x={padLeft}
                y={padTop}
                width={plotWidth}
                height={plotHeight}
                fill="#FAF5FF"
                opacity="0.4"
              />

              {/* 2. Overweight Band (+2 SD to +3 SD) */}
              <path d={overweightBand()} fill="#FFEDD5" opacity="0.75" />

              {/* 3. Risk of Overweight (+1 SD to +2 SD) */}
              <path d={riskOverweightBand()} fill="#FEF08A" opacity="0.65" />

              {/* 4. Normal / Ideal Band (-2 SD to +1 SD) */}
              <path d={normalBandPolygon()} fill="#D1FAE5" opacity="0.85" />

              {/* 5. Gizi Kurang Band (-2 SD to -3 SD) */}
              <path d={wastedBand()} fill="#FEF3C7" opacity="0.85" />

              {/* 6. Gizi Buruk Band (< -3 SD) */}
              <path
                d={`M ${padLeft},${getY(10)} L ${activeStandards
                  .map((s) => `${getX(s.ageMonths).toFixed(1)},${getY(s.sd3neg).toFixed(1)}`)
                  .join(" L ")} L ${width - padRight},${getY(10)} Z`}
                fill="#FEE2E2"
                opacity="0.7"
              />

              {/* Reference Lines */}
              <path d={pathSd3pos} stroke="#C084FC" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />
              <path d={pathSd2pos} stroke="#FB923C" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />
              <path d={pathSd1pos} stroke="#A3E635" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />
              <path d={pathMedian} stroke="#059669" strokeWidth="1.8" opacity="0.9" />
              <path d={pathSd2neg} stroke="#FBBF24" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />
              <path d={pathSd3neg} stroke="#F87171" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />

              {/* Line Labels at the right edge */}
              <text x={width - padRight + 6} y={getY(activeStandards[activeStandards.length - 1].sd3pos) + 3} fill="#9333EA" fontSize="9" fontWeight="bold">+3 SD</text>
              <text x={width - padRight + 6} y={getY(activeStandards[activeStandards.length - 1].sd2pos) + 3} fill="#EA580C" fontSize="9" fontWeight="bold">+2 SD</text>
              <text x={width - padRight + 6} y={getY(activeStandards[activeStandards.length - 1].sd1pos) + 3} fill="#65A30D" fontSize="9" fontWeight="bold">+1 SD</text>
              <text x={width - padRight + 6} y={getY(activeStandards[activeStandards.length - 1].median) + 3} fill="#047857" fontSize="9" fontWeight="bold">0 (Median)</text>
              <text x={width - padRight + 6} y={getY(activeStandards[activeStandards.length - 1].sd2neg) + 3} fill="#D97706" fontSize="9" fontWeight="bold">-2 SD</text>
              <text x={width - padRight + 6} y={getY(activeStandards[activeStandards.length - 1].sd3neg) + 3} fill="#DC2626" fontSize="9" fontWeight="bold">-3 SD</text>

              {/* Child Trajectory Plot Line */}
              <path
                d={childPath}
                stroke="#047857"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Data Points on Plot Line */}
              {childPlotPoints.map((p, i) => {
                const cx = getX(p.ageMonths);
                const cy = getY(p.imt);
                const isSelected = hoveredPoint === i;

                return (
                  <g
                    key={`point-${i}`}
                    className="cursor-pointer transition-transform"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onClick={() => setHoveredPoint(i)}
                  >
                    {/* Pulsing ring for selected/last point */}
                    {isSelected && (
                      <circle cx={cx} cy={cy} r="10" fill="#059669" opacity="0.25" className="animate-ping" />
                    )}

                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? "7" : "5.5"}
                      fill="#047857"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      filter="url(#imtPointGlow)"
                    />

                    {/* Value Badge on top */}
                    <rect
                      x={cx - 20}
                      y={cy - 24}
                      width="40"
                      height="16"
                      rx="8"
                      fill="#0F172A"
                      opacity={isSelected ? "0.95" : "0.75"}
                    />
                    <text
                      x={cx}
                      y={cy - 13}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9.5"
                      fontWeight="bold"
                    >
                      {p.imt}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Label */}
              <text
                x={padLeft + plotWidth / 2}
                y={heightSvg - 8}
                textAnchor="middle"
                fill="#475569"
                fontSize="11"
                fontWeight="bold"
              >
                Usia Balita (Bulan)
              </text>

              {/* Y Axis Label */}
              <text
                x={16}
                y={padTop + plotHeight / 2}
                textAnchor="middle"
                transform={`rotate(-90 16 ${padTop + plotHeight / 2})`}
                fill="#475569"
                fontSize="11"
                fontWeight="bold"
              >
                Indeks Massa Tubuh (kg/m²)
              </text>
            </svg>
          </div>
        </div>

        {/* Legend of Zones */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-emerald-200 border border-emerald-300"></span>
              <span>Gizi Baik / Ideal (-2 s/d +1 SD)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-yellow-200 border border-yellow-300"></span>
              <span>Berisiko Lebih (+1 s/d +2 SD)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-orange-200 border border-orange-300"></span>
              <span>Gizi Lebih / Kurang</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-rose-200 border border-rose-300"></span>
              <span>Gizi Buruk (&lt; -3 SD) / Obesitas</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <span className="w-3 h-1 bg-emerald-700 rounded-full"></span>
              <span>Plot Pertumbuhan Balita</span>
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            Sumber: Standar Antropometri Kemenkes RI 2020 & WHO
          </span>
        </div>
      </div>

      {/* Role-Specific Diagnostic / Guidance Panel */}
      {role === "parent" ? (
        /* Parent-Friendly Guidance Panel */
        <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-white rounded-2xl p-5 sm:p-6 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[26px]">nutrition</span>
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                Catatan Gizi Seimbang untuk Ayah & Ibu
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Edukasi Keluarga
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {assessment.parentFriendlyAdvice}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/90 p-3 rounded-xl border border-emerald-200/60 shadow-2xs">
                <span className="text-[11px] font-bold text-emerald-800 block flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">egg_alt</span>
                  Protein Hewani
                </span>
                <span className="text-xs text-slate-600 mt-0.5 block">
                  Cukupi telur, ikan, atau daging setiap hari untuk mendukung pembentukan otot dan otak.
                </span>
              </div>

              <div className="bg-white/90 p-3 rounded-xl border border-emerald-200/60 shadow-2xs">
                <span className="text-[11px] font-bold text-emerald-800 block flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">cookie</span>
                  Batasi Gula & Cemilan
                </span>
                <span className="text-xs text-slate-600 mt-0.5 block">
                  Hindari makanan/minuman manis berpengawet berlebihan agar nafsu makan makanan pokok terjaga.
                </span>
              </div>

              <div className="bg-white/90 p-3 rounded-xl border border-emerald-200/60 shadow-2xs">
                <span className="text-[11px] font-bold text-emerald-800 block flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">event_repeat</span>
                  Posyandu Rutin
                </span>
                <span className="text-xs text-slate-600 mt-0.5 block">
                  Timbang berat dan ukur tinggi badan setiap bulan di Posyandu untuk memantau tren IMT.
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Staff Clinical Assessment & Protocol Panel */
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">medical_services</span>
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-slate-900">
                  Asesmen Klinis & Protokol Intervensi Tenaga Kesehatan
                </h4>
                <p className="text-xs text-slate-500">
                  Panduan tindak lanjut antropometri balita berdasarkan IMT menurut Umur.
                </p>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${assessment.badgeColorClass}`}>
              Status: {assessment.category}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">health_and_safety</span>
                Interpretasi Klinis & Analisis Risiko:
              </span>
              <p className="text-slate-600 leading-relaxed">
                {assessment.clinicalSummary}
              </p>
              <div className="pt-2 text-slate-500 flex flex-col gap-1 text-[11px]">
                <span>• Z-Score IMT/U: <strong>{assessment.zScore > 0 ? `+${assessment.zScore}` : assessment.zScore} SD</strong></span>
                <span>• Z-Score TB/U: <strong>{child.zScoreTbU} SD ({child.stuntingStatus})</strong></span>
                <span>• Status Wasting: <strong>{child.wastingStatus}</strong></span>
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-600">checklist</span>
                Rekomendasi Rencana Tindak Lanjut:
              </span>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                {assessment.category === "Gizi Baik (Normal)" ? (
                  <>
                    <li>Pertahankan intervensi nutrisi preventif & pemantauan rutin 1x per bulan.</li>
                    <li>Berikan apresiasi & edukasi konseling ASI/MPASI adekuat kepada orang tua.</li>
                    <li>Input hasil pengukuran terkini ke database e-PPGBM Posyandu.</li>
                  </>
                ) : assessment.category.includes("Kurang") || assessment.category.includes("Buruk") ? (
                  <>
                    <li className="text-rose-700 font-semibold">Daftarkan balita ke program PMT Pemulihan tinggi protein (Kemenkes).</li>
                    <li>Lakukan kunjungan rumah (home visit) kader untuk verifikasi sanitasi & asupan harian.</li>
                    <li>Rujuk ke Puskesmas jika berat badan tidak naik dalam 2 kali penimbangan beruntun (2T).</li>
                  </>
                ) : (
                  <>
                    <li className="text-amber-800 font-semibold">Konseling pola makan keluarga: evaluasi pemberian susu formula/camilan padat kalori.</li>
                    <li>Anjurkan stimulasi aktivitas fisik aktif minimal 60 menit per hari tanpa gawai/gadget.</li>
                    <li>Rujukan dokter spesialis anak di Puskesmas jika Z-Score melampaui +3 SD.</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
