"use client";

import React, { useState } from "react";
import { ExamRecord, Child } from "@/lib/mockData";
import { StuntingBadge } from "@/components/ui/badge";

interface MonthlyGrowthHistoryProps {
  exams: ExamRecord[];
  child: Child;
}

export default function MonthlyGrowthHistory({ exams, child }: MonthlyGrowthHistoryProps) {
  const [viewMode, setViewMode] = useState<"table" | "timeline">("table");

  // Urutkan rekaman dari tanggal paling lama ke paling baru untuk menghitung delta
  const sortedAsc = [...exams].sort(
    (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
  );

  // Hitung selisih (delta) dibandingkan bulan sebelumnya
  const enrichedRecords = sortedAsc.map((record, index) => {
    const prev = index > 0 ? sortedAsc[index - 1] : null;

    let deltaWeight: number | null = null;
    let deltaHeight: number | null = null;
    let weightGrowthStatus: "N" | "T" | "TURUN" | "FIRST" = "FIRST";

    if (prev) {
      deltaWeight = parseFloat((record.weight - prev.weight).toFixed(2));
      deltaHeight = parseFloat((record.height - prev.height).toFixed(1));

      // Standar KBM Posyandu (Kenaikan Berat Badan Minimal biasanya >= 0.2 - 0.3 kg tergantung usia)
      if (deltaWeight > 0.2) {
        weightGrowthStatus = "N"; // Naik Adekuat
      } else if (deltaWeight >= 0) {
        weightGrowthStatus = "T"; // Tumbuh Tidak Adekuat / Tetap
      } else {
        weightGrowthStatus = "TURUN"; // Turun (Atensi)
      }
    }

    return {
      ...record,
      deltaWeight,
      deltaHeight,
      weightGrowthStatus,
      prevRecord: prev,
    };
  });

  // Untuk tampilan display default: urutkan dari yang paling baru ke lama
  const displayRecords = [...enrichedRecords].reverse();

  // Rata-rata kenaikan bulanan
  const validDeltasW = enrichedRecords.filter((r) => r.deltaWeight !== null).map((r) => r.deltaWeight as number);
  const avgDeltaW = validDeltasW.length > 0 ? (validDeltasW.reduce((a, b) => a + b, 0) / validDeltasW.length).toFixed(2) : "0.35";

  const validDeltasH = enrichedRecords.filter((r) => r.deltaHeight !== null).map((r) => r.deltaHeight as number);
  const avgDeltaH = validDeltasH.length > 0 ? (validDeltasH.reduce((a, b) => a + b, 0) / validDeltasH.length).toFixed(1) : "1.1";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[24px]">monitoring</span>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Riwayat Penimbangan & Perkembangan Bulanan
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Log kronologis penimbangan bulanan, selisih pertumbuhan (delta BB/TB), dan identitas pengantar resmi.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "table"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">table_rows</span>
            <span>Tabel Rinci</span>
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "timeline"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">timeline</span>
            <span>Timeline Kronologis</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Pill Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-100">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
            Rata-rata Kenaikan BB
          </span>
          <p className="font-heading text-xl font-extrabold text-emerald-900 mt-1 tabular-nums">
            +{avgDeltaW} kg/bln
          </p>
          <span className="text-xs text-emerald-700 font-medium">Standar KBM: &ge; +0.3 kg</span>
        </div>

        <div className="p-3.5 bg-sky-50/80 rounded-xl border border-sky-100">
          <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider block">
            Rata-rata Kenaikan TB
          </span>
          <p className="font-heading text-xl font-extrabold text-sky-950 mt-1 tabular-nums">
            +{avgDeltaH} cm/bln
          </p>
          <span className="text-xs text-sky-700 font-medium">Pertumbuhan linier tulang</span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
            Total Sesi Timbang
          </span>
          <p className="font-heading text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {enrichedRecords.length} Kali
          </p>
          <span className="text-xs text-slate-500">Tercatat di e-PPGBM</span>
        </div>

        <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-100">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">
            Status Tumbuh Terakhir
          </span>
          <p className="font-heading text-lg font-extrabold text-amber-950 mt-1 truncate">
            {displayRecords[0]?.weightGrowthStatus === "N"
              ? "N (Naik Adekuat) 🟢"
              : displayRecords[0]?.weightGrowthStatus === "T"
              ? "T (Kurang Naik) 🟡"
              : "Perlu Evaluasi 🔴"}
          </p>
          <span className="text-xs text-amber-800 font-medium truncate block">
            KBM Sesi {displayRecords[0]?.examDate}
          </span>
        </div>
      </div>

      {/* VIEW 1: TABEL RINCI */}
      {viewMode === "table" && (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Bulan / Tgl Periksa</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Usia Balita</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Berat Badan (BB) & Delta</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Tinggi Badan (TB) & Delta</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Status KBM</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Status Antropometri</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Pengantar Balita</th>
                <th className="py-3 px-4 font-semibold min-w-[200px]">Catatan Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {displayRecords.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Tanggal Periksa */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">event</span>
                      <span>{item.examDate}</span>
                    </div>
                  </td>

                  {/* Usia */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold tabular-nums">
                      {item.ageMonths} Bulan
                    </span>
                  </td>

                  {/* Berat Badan & Delta */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-900 text-sm tabular-nums">
                        {item.weight} kg
                      </span>
                      {item.deltaWeight !== null ? (
                        <span
                          className={`text-xs font-bold tabular-nums inline-flex items-center gap-0.5 ${
                            item.deltaWeight > 0
                              ? "text-emerald-700"
                              : item.deltaWeight === 0
                              ? "text-slate-500"
                              : "text-rose-600 font-bold"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {item.deltaWeight > 0 ? "trending_up" : item.deltaWeight === 0 ? "trending_flat" : "trending_down"}
                          </span>
                          <span>
                            {item.deltaWeight > 0 ? `+${item.deltaWeight}` : item.deltaWeight} kg dr bln lalu
                          </span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Timbang Awal</span>
                      )}
                    </div>
                  </td>

                  {/* Tinggi Badan & Delta */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-900 text-sm tabular-nums">
                        {item.height} cm
                      </span>
                      {item.deltaHeight !== null ? (
                        <span className="text-xs font-bold text-sky-800 tabular-nums inline-flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px]">straighten</span>
                          <span>+{item.deltaHeight} cm dr bln lalu</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Ukur Awal</span>
                      )}
                    </div>
                  </td>

                  {/* Status KBM (Kenaikan Berat Minimal) */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {item.weightGrowthStatus === "N" && (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs inline-flex items-center gap-1 border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span>N (Naik)</span>
                      </span>
                    )}
                    {item.weightGrowthStatus === "T" && (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs inline-flex items-center gap-1 border border-amber-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>T (Tetap/Kurang)</span>
                      </span>
                    )}
                    {item.weightGrowthStatus === "TURUN" && (
                      <span className="px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 font-bold text-xs inline-flex items-center gap-1 border border-rose-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                        <span>Turun (BGM)</span>
                      </span>
                    )}
                    {item.weightGrowthStatus === "FIRST" && (
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 font-medium text-xs">
                        Bulan Pertama
                      </span>
                    )}
                  </td>

                  {/* Status Gizi Antropometri */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <StuntingBadge status={item.stuntingStatus} />
                      <span className="text-[11px] text-slate-500 font-medium tabular-nums">
                        TB/U: {item.zScoreTbU} SD • BB/U: {item.zScoreBbU} SD
                      </span>
                    </div>
                  </td>

                  {/* Pengantar Balita */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900 whitespace-nowrap">
                      {item.companionName || child.motherName || child.parentName}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
                      {item.companionRelation || "Ibu Kandung"}
                    </span>
                  </td>

                  {/* Catatan Petugas */}
                  <td className="py-3.5 px-4 text-xs text-slate-600 leading-relaxed">
                    <p className="line-clamp-2">{item.notes || "Pemeriksaan rutin berkala Posyandu."}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Petugas: {item.recordedBy}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: TIMELINE KRONOLOGIS */}
      {viewMode === "timeline" && (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
          {displayRecords.map((item, index) => (
            <div key={item.id} className="relative group">
              {/* Dot indicator on timeline line */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-[10px] font-bold ${
                  index === 0
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {displayRecords.length - index}
              </div>

              {/* Timeline Card */}
              <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-emerald-300 transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading text-sm font-bold text-slate-900">
                      Sesi Penimbangan: {item.examDate}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold tabular-nums">
                      Usia {item.ageMonths} Bulan
                    </span>
                    {index === 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                        Pemeriksaan Terkini
                      </span>
                    )}
                  </div>
                  <StuntingBadge status={item.stuntingStatus} />
                </div>

                {/* Metrics Comparison in Timeline */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
                    <span className="text-[11px] text-slate-500 block">Berat Badan</span>
                    <p className="font-heading text-base font-extrabold text-slate-900 mt-0.5 tabular-nums">
                      {item.weight} kg
                    </p>
                    {item.deltaWeight !== null ? (
                      <span
                        className={`text-xs font-bold tabular-nums block mt-0.5 ${
                          item.deltaWeight > 0 ? "text-emerald-700" : item.deltaWeight === 0 ? "text-slate-500" : "text-rose-600"
                        }`}
                      >
                        {item.deltaWeight > 0 ? `+${item.deltaWeight}` : item.deltaWeight} kg dr bln lalu
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Pengukuran awal</span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
                    <span className="text-[11px] text-slate-500 block">Tinggi Badan</span>
                    <p className="font-heading text-base font-extrabold text-slate-900 mt-0.5 tabular-nums">
                      {item.height} cm
                    </p>
                    {item.deltaHeight !== null ? (
                      <span className="text-xs font-bold text-sky-800 tabular-nums block mt-0.5">
                        +{item.deltaHeight} cm dr bln lalu
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Pengukuran awal</span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
                    <span className="text-[11px] text-slate-500 block">Pengantar Balita</span>
                    <p className="font-heading text-xs font-bold text-slate-900 mt-0.5 truncate">
                      {item.companionName || child.motherName || child.parentName}
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-800">
                      {item.companionRelation || "Ibu Kandung"}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
                    <span className="text-[11px] text-slate-500 block">Petugas Pencatat</span>
                    <p className="font-heading text-xs font-bold text-slate-900 mt-0.5 truncate">
                      {item.recordedBy}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      Metode: {item.method}
                    </span>
                  </div>
                </div>

                {item.notes && (
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100/80 text-xs text-emerald-950 flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-700 text-[18px] shrink-0 mt-0.5">info</span>
                    <p className="leading-relaxed">{item.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
