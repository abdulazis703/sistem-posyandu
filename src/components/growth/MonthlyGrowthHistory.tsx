"use client";

import React, { useEffect, useState } from "react";
import { ExamRecord, Child } from "@/lib/mockData";
import { StuntingBadge } from "@/components/ui/badge";

interface MonthlyGrowthHistoryProps {
  exams: ExamRecord[];
  child: Child;
}

export default function MonthlyGrowthHistory({ exams, child }: MonthlyGrowthHistoryProps) {
  const [viewMode, setViewMode] = useState<"table" | "timeline">("table");
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; examDate: string } | null>(null);

  useEffect(() => {
    if (!previewPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewPhoto(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewPhoto]);

  // Urutkan rekaman dari tanggal paling lama ke paling baru untuk menghitung delta
  const sortedAsc = [...exams].sort(
    (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
  );

  // Hitung selisih (delta) dibandingkan sesi sebelumnya
  const enrichedRecords = sortedAsc.map((record, index) => {
    const prev = index > 0 ? sortedAsc[index - 1] : null;

    let deltaWeight: number | null = null;
    let deltaHeight: number | null = null;
    let weightGrowthStatus: "N" | "T" | "TURUN" | "FIRST" = "FIRST";

    if (prev) {
      deltaWeight = parseFloat((record.weight - prev.weight).toFixed(2));
      deltaHeight = parseFloat((record.height - prev.height).toFixed(1));

      if (deltaWeight > 0.2) {
        weightGrowthStatus = "N";
      } else if (deltaWeight >= 0) {
        weightGrowthStatus = "T";
      } else {
        weightGrowthStatus = "TURUN";
      }
    }

    return {
      ...record,
      deltaWeight,
      deltaHeight,
      weightGrowthStatus,
    };
  });

  // Untuk tampilan display default: urutkan dari yang paling baru ke lama
  const displayRecords = [...enrichedRecords].reverse();

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-6">
        {/* Header and Toggle Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[24px]">monitoring</span>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Riwayat Penimbangan &amp; Perkembangan Bulanan
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Log kronologis penimbangan bulanan, selisih pertumbuhan (delta BB/TB), dan hasil evaluasi antropometri.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
              <span>Tabel Rinci</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
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

        {displayRecords.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 text-center space-y-1.5">
            <p className="text-sm font-semibold text-slate-800">
              Belum ada catatan riwayat penimbangan untuk {child.name}.
            </p>
            <p className="text-xs text-slate-500">
              Riwayat penimbangan akan muncul otomatis setelah kader mencatat pemeriksaan pada sesi Posyandu.
            </p>
          </div>
        ) : viewMode === "table" ? (
          /* VIEW 1: TABEL RINCI */
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[1060px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-200 text-xs font-semibold uppercase tracking-wide">
                  <th className="px-4 py-3 align-middle whitespace-nowrap min-w-[135px]">Tgl Periksa</th>
                  <th className="px-4 py-3 align-middle whitespace-nowrap min-w-[100px]">Usia Balita</th>
                  <th className="px-4 py-3 align-middle whitespace-nowrap min-w-[155px]">Berat Badan (BB)</th>
                  <th className="px-4 py-3 align-middle whitespace-nowrap min-w-[155px]">Tinggi Badan (TB)</th>
                  <th className="px-4 py-3 align-middle whitespace-nowrap min-w-[130px]">Status KBM</th>
                  <th className="px-4 py-3 align-middle whitespace-nowrap min-w-[180px]">Status Antropometri</th>
                  <th className="px-4 py-3 align-middle whitespace-nowrap min-w-[150px]">Pengantar / Wali</th>
                  <th className="px-4 py-3 align-middle min-w-[200px]">Catatan Petugas</th>
                  <th className="px-4 py-3 align-middle whitespace-nowrap min-w-[125px] text-center">Foto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {displayRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Tanggal Periksa */}
                    <td className="px-4 py-3 align-middle font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">event</span>
                        <span>{item.examDate || "-"}</span>
                      </div>
                    </td>

                    {/* Usia */}
                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                        {item.ageMonths} Bulan
                      </span>
                    </td>

                    {/* Berat Badan & Delta */}
                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-900 text-sm">
                          {item.weight} kg
                        </span>
                        {item.deltaWeight !== null ? (
                          <span
                            className={`text-xs font-medium inline-flex items-center gap-0.5 ${
                              item.deltaWeight > 0
                                ? "text-emerald-700"
                                : item.deltaWeight === 0
                                ? "text-slate-500"
                                : "text-rose-600"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {item.deltaWeight > 0 ? "trending_up" : item.deltaWeight === 0 ? "trending_flat" : "trending_down"}
                            </span>
                            <span>
                              {item.deltaWeight > 0 ? `+${item.deltaWeight}` : item.deltaWeight} kg dr bln lalu
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Timbang Awal</span>
                        )}
                      </div>
                    </td>

                    {/* Tinggi Badan & Delta */}
                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-900 text-sm">
                          {item.height} cm
                        </span>
                        {item.deltaHeight !== null ? (
                          <span className="text-xs font-medium text-sky-800 inline-flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[14px]">straighten</span>
                            <span>+{item.deltaHeight} cm dr bln lalu</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Ukur Awal</span>
                        )}
                      </div>
                    </td>

                    {/* Status KBM */}
                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      {item.weightGrowthStatus === "N" && (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-semibold text-xs inline-flex items-center gap-1 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          <span>N (Naik)</span>
                        </span>
                      )}
                      {item.weightGrowthStatus === "T" && (
                        <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 font-semibold text-xs inline-flex items-center gap-1 border border-amber-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>T (Tetap/Kurang)</span>
                        </span>
                      )}
                      {item.weightGrowthStatus === "TURUN" && (
                        <span className="px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 font-semibold text-xs inline-flex items-center gap-1 border border-rose-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                          <span>Turun (BGM)</span>
                        </span>
                      )}
                      {item.weightGrowthStatus === "FIRST" && (
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 font-medium text-xs inline-block">
                          Bulan Pertama
                        </span>
                      )}
                    </td>

                    {/* Status Gizi Antropometri */}
                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <StuntingBadge status={item.stuntingStatus} />
                        <span className="text-xs text-slate-500">
                          TB/U: {item.zScoreTbU} SD • BB/U: {item.zScoreBbU} SD
                        </span>
                      </div>
                    </td>

                    {/* Pengantar Balita */}
                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-semibold text-slate-900">
                          {item.companionName || child.motherName || child.parentName}
                        </p>
                        <span className="text-xs font-medium text-emerald-800">
                          {item.companionRelation || "Orang Tua / Wali"}
                        </span>
                      </div>
                    </td>

                    {/* Catatan Petugas */}
                    <td className="px-4 py-3 align-middle">
                      <p className="text-sm text-slate-700 leading-snug line-clamp-2">
                        {item.notes || "Pemeriksaan rutin berkala Posyandu."}
                      </p>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        Petugas: {item.recordedBy}
                      </span>
                    </td>

                    {/* Foto Pemeriksaan (hanya tampil tombol/thumbnail bila memiliki photo_url) */}
                    <td className="px-4 py-3 align-middle whitespace-nowrap text-center">
                      {item.photoUrl ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewPhoto({
                              url: item.photoUrl!,
                              examDate: item.examDate,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-semibold transition-colors cursor-pointer"
                          title="Lihat foto pemeriksaan balita"
                        >
                          <img
                            src={item.photoUrl}
                            alt={`Foto ${child.name}`}
                            className="w-5 h-5 rounded-md object-cover border border-emerald-200 shrink-0"
                          />
                          <span>Lihat Foto</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* VIEW 2: TIMELINE KRONOLOGIS */
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
            {displayRecords.map((item, index) => (
              <div key={item.id} className="relative group">
                <div
                  className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-xs font-bold ${
                    index === 0
                      ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {displayRecords.length - index}
                </div>

                <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-emerald-300 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading text-sm font-bold text-slate-900">
                        Sesi Penimbangan: {item.examDate}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                        Usia {item.ageMonths} Bulan
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-semibold">
                          Pemeriksaan Terkini
                        </span>
                      )}
                    </div>
                    <StuntingBadge status={item.stuntingStatus} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
                      <span className="text-xs text-slate-500 block">Berat Badan</span>
                      <p className="font-heading text-base font-bold text-slate-900 mt-0.5">
                        {item.weight} kg
                      </p>
                      {item.deltaWeight !== null ? (
                        <span
                          className={`text-xs font-semibold block mt-0.5 ${
                            item.deltaWeight > 0 ? "text-emerald-700" : item.deltaWeight === 0 ? "text-slate-500" : "text-rose-600"
                          }`}
                        >
                          {item.deltaWeight > 0 ? `+${item.deltaWeight}` : item.deltaWeight} kg dr bln lalu
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Pengukuran awal</span>
                      )}
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
                      <span className="text-xs text-slate-500 block">Tinggi Badan</span>
                      <p className="font-heading text-base font-bold text-slate-900 mt-0.5">
                        {item.height} cm
                      </p>
                      {item.deltaHeight !== null ? (
                        <span className="text-xs font-semibold text-sky-800 block mt-0.5">
                          +{item.deltaHeight} cm dr bln lalu
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Pengukuran awal</span>
                      )}
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
                      <span className="text-xs text-slate-500 block">Pengantar Balita</span>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate">
                        {item.companionName || child.motherName || child.parentName}
                      </p>
                      <span className="text-xs font-medium text-emerald-800">
                        {item.companionRelation || "Orang Tua / Wali"}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
                      <span className="text-xs text-slate-500 block">Petugas Pencatat</span>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate">
                        {item.recordedBy}
                      </p>
                      <span className="text-xs text-slate-500">
                        Metode: {item.method}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    {item.notes && (
                      <div className="flex-1 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100/80 text-xs text-emerald-950 flex items-start gap-2">
                        <span className="material-symbols-outlined text-emerald-700 text-[18px] shrink-0 mt-0.5">info</span>
                        <p className="leading-relaxed">{item.notes}</p>
                      </div>
                    )}

                    {item.photoUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewPhoto({
                            url: item.photoUrl!,
                            examDate: item.examDate,
                          })
                        }
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-center"
                      >
                        <img
                          src={item.photoUrl}
                          alt={`Foto ${child.name}`}
                          className="w-6 h-6 rounded-md object-cover border border-emerald-200"
                        />
                        <span>Lihat Foto Pemeriksaan</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Pratinjau Foto Pemeriksaan (Lightbox) */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs"
          onClick={() => setPreviewPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Pratinjau foto pemeriksaan ${child.name}`}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <h4 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                  Foto Pemeriksaan: {child.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tanggal Pemeriksaan: {previewPhoto.examDate || "-"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup pratinjau foto"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-slate-50 flex items-center justify-center">
              <img
                src={previewPhoto.url}
                alt={`Foto pemeriksaan ${child.name} tanggal ${previewPhoto.examDate}`}
                className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-xs border border-slate-200 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
