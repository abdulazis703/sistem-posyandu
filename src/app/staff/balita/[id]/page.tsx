"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { mockChildren, mockExamRecords } from "@/lib/mockData";
import { StuntingBadge } from "@/components/ui/badge";

export default function DetailBalitaPetugasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const childId = resolvedParams?.id || "child-1";

  const child =
    mockChildren.find((c) => c.id === childId) || mockChildren[0];

  const exams = mockExamRecords.filter(
    (e) => e.childId === child.id || e.childName === child.name
  );

  const [activeTab, setActiveTab] = useState<"kurva" | "riwayat" | "rekomendasi">("kurva");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNotes, setEditNotes] = useState("");

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8 max-w-[1440px] mx-auto w-full">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/staff/balita" className="hover:text-emerald-700 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">child_care</span>
            <span>Data Balita</span>
          </Link>
          <span>/</span>
          <span className="text-emerald-800 font-semibold">{child.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/staff/balita"
            className="px-3.5 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Kembali</span>
          </Link>
          <Link
            href="/staff/pemeriksaan"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">assignment_add</span>
            <span>+ Catat Pemeriksaan</span>
          </Link>
        </div>
      </div>

      {/* Child Profile Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-2xl flex items-center justify-center shrink-0 border border-emerald-200">
            {child.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-heading text-xl lg:text-2xl font-bold text-slate-900">
                {child.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {child.gender === "L" ? "Laki-laki" : "Perempuan"}
              </span>
              <StuntingBadge status={child.stuntingStatus} />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
              <span>NIK: <strong className="text-slate-800 font-semibold">{child.nik}</strong></span>
              <span>•</span>
              <span>Lahir: <strong className="text-slate-800 font-semibold">{child.birthDate} ({child.ageMonths} Bulan)</strong></span>
              <span>•</span>
              <span>Orang Tua: <strong className="text-slate-800 font-semibold">{child.parentName}</strong></span>
              <span>•</span>
              <span>Posyandu: <strong className="text-slate-800 font-semibold">{child.posyandu}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#f8f9ff] border border-[#cbd5e1] text-xs font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            <span>Koreksi Data</span>
          </button>
          <button
            onClick={() => alert(`Rujukan medis Puskesmas untuk ${child.name} telah disiapkan.`)}
            className="px-3.5 py-2 rounded-xl bg-[#fee2e2] border border-[#fca5a5] text-xs font-semibold text-[#ba1a1a] hover:bg-[#fecaca] transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">assignment_late</span>
            <span>Rujuk ke Puskesmas</span>
          </button>
        </div>
      </div>

      {/* 4 Biometric Metric Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#e2ebe5] shadow-xs">
          <span className="text-xs text-[#6f7a6e] block">Berat Badan Terakhir</span>
          <p className="font-heading text-2xl font-extrabold text-[#0b1c30] mt-1">
            {child.weight} <span className="text-xs font-normal text-[#6f7a6e]">kg</span>
          </p>
          <span className="text-[11px] text-[#15803d] font-semibold mt-0.5 block">
            Z-Score BB/U: {child.zScoreBbU} SD (Normal)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e2ebe5] shadow-xs">
          <span className="text-xs text-[#6f7a6e] block">Panjang / Tinggi Badan</span>
          <p className="font-heading text-2xl font-extrabold text-[#0b1c30] mt-1">
            {child.height} <span className="text-xs font-normal text-[#6f7a6e]">cm</span>
          </p>
          <span className={`text-[11px] font-semibold mt-0.5 block ${
            child.zScoreTbU < -2 ? "text-[#ba1a1a]" : "text-[#15803d]"
          }`}>
            Z-Score TB/U: {child.zScoreTbU} SD ({child.stuntingStatus})
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e2ebe5] shadow-xs">
          <span className="text-xs text-[#6f7a6e] block">Lingkar Kepala</span>
          <p className="font-heading text-2xl font-extrabold text-[#0b1c30] mt-1">
            {child.headCircumference || 46.5} <span className="text-xs font-normal text-[#6f7a6e]">cm</span>
          </p>
          <span className="text-[11px] text-[#15803d] font-semibold mt-0.5 block">
            Normocephalic (Normal)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e2ebe5] shadow-xs">
          <span className="text-xs text-[#6f7a6e] block">LiLA (Lingkar Lengan)</span>
          <p className="font-heading text-2xl font-extrabold text-[#0b1c30] mt-1">
            {child.lila || 14.5} <span className="text-xs font-normal text-[#6f7a6e]">cm</span>
          </p>
          <span className="text-[11px] text-[#15803d] font-semibold mt-0.5 block">
            Pita Hijau (Gizi Cukup)
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#e2ebe5] gap-4">
        <button
          onClick={() => setActiveTab("kurva")}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "kurva"
              ? "border-[#15803d] text-[#15803d]"
              : "border-transparent text-[#6f7a6e] hover:text-[#0b1c30]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">show_chart</span>
          <span>Kurva Pertumbuhan KMS (WHO)</span>
        </button>

        <button
          onClick={() => setActiveTab("riwayat")}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "riwayat"
              ? "border-[#15803d] text-[#15803d]"
              : "border-transparent text-[#6f7a6e] hover:text-[#0b1c30]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">table_rows</span>
          <span>Tabel Riwayat Penimbangan</span>
        </button>

        <button
          onClick={() => setActiveTab("rekomendasi")}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "rekomendasi"
              ? "border-[#15803d] text-[#15803d]"
              : "border-transparent text-[#6f7a6e] hover:text-[#0b1c30]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
          <span>Diagnosis & Intervensi Gizi</span>
        </button>
      </div>

      {/* Tab 1: Kurva Pertumbuhan */}
      {activeTab === "kurva" && (
        <div className="bg-white rounded-2xl p-6 border border-[#e2ebe5] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
            <div>
              <h3 className="font-heading text-sm font-bold text-[#0b1c30]">
                Kurva Panjang / Tinggi Badan menurut Umur (TB/U) - Standar WHO
              </h3>
              <p className="text-xs text-[#6f7a6e]">
                Area hijau muda menandakan pita batas deviasi normal (-2 SD s/d +2 SD).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#dcfce7] text-[#15803d] rounded-lg text-xs font-semibold">
                Plotting Terkini: {child.height} cm ({child.zScoreTbU} SD)
              </span>
            </div>
          </div>

          <div className="bg-[#f7faf8] rounded-2xl p-4 border border-[#e2ebe5]">
            <svg viewBox="0 0 700 240" className="w-full h-64 overflow-visible" fill="none">
              <line x1="40" y1="30" x2="680" y2="30" stroke="#E2EBE5" strokeDasharray="3 3" />
              <line x1="40" y1="80" x2="680" y2="80" stroke="#E2EBE5" strokeDasharray="3 3" />
              <line x1="40" y1="130" x2="680" y2="130" stroke="#E2EBE5" strokeDasharray="3 3" />
              <line x1="40" y1="180" x2="680" y2="180" stroke="#E2EBE5" />

              {/* WHO Normal Zone Band (+2 SD to -2 SD) */}
              <path
                d="M 40,160 Q 200,120 380,75 T 680,35 L 680,140 Q 400,160 200,180 T 40,200 Z"
                fill="#DCFCE7"
                fillOpacity="0.55"
              />
              <path d="M 40,160 Q 200,120 380,75 T 680,35" stroke="#86EFAC" strokeWidth="1.5" strokeDasharray="3 2" />
              <path d="M 40,200 Q 200,180 400,160 T 680,140" stroke="#86EFAC" strokeWidth="1.5" strokeDasharray="3 2" />

              {/* Child Plot Line */}
              <path
                d="M 40,180 L 140,165 L 240,148 L 340,128 L 440,112 L 530,98"
                stroke={child.riskFlag === "NORMAL" ? "#15803D" : "#E5484D"}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Nodes */}
              <circle cx="40" cy="180" r="4.5" fill="white" stroke="#15803D" strokeWidth="2.5" />
              <circle cx="140" cy="165" r="4.5" fill="white" stroke="#15803D" strokeWidth="2.5" />
              <circle cx="240" cy="148" r="4.5" fill="white" stroke="#15803D" strokeWidth="2.5" />
              <circle cx="340" cy="128" r="4.5" fill="white" stroke="#15803D" strokeWidth="2.5" />
              <circle cx="440" cy="112" r="4.5" fill="white" stroke="#15803D" strokeWidth="2.5" />
              <circle cx="530" cy="98" r="7" fill={child.riskFlag === "NORMAL" ? "#15803D" : "#E5484D"} fillOpacity="0.25" />
              <circle cx="530" cy="98" r="5" fill={child.riskFlag === "NORMAL" ? "#15803D" : "#E5484D"} />

              {/* X Axis Labels */}
              <text x="40" y="205" fill="#6B7280" fontSize="11" textAnchor="middle">0 Bln</text>
              <text x="140" y="205" fill="#6B7280" fontSize="11" textAnchor="middle">3 Bln</text>
              <text x="240" y="205" fill="#6B7280" fontSize="11" textAnchor="middle">6 Bln</text>
              <text x="340" y="205" fill="#6B7280" fontSize="11" textAnchor="middle">9 Bln</text>
              <text x="440" y="205" fill="#6B7280" fontSize="11" textAnchor="middle">12 Bln</text>
              <text x="530" y="205" fill="#15803D" fontWeight="bold" fontSize="11" textAnchor="middle">18 Bln</text>
              <text x="680" y="205" fill="#6B7280" fontSize="11" textAnchor="middle">24 Bln</text>
            </svg>
          </div>
        </div>
      )}

      {/* Tab 2: Tabel Riwayat */}
      {activeTab === "riwayat" && (
        <div className="bg-white rounded-2xl border border-[#e2ebe5] shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] text-[#3f493f] border-b border-[#e2ebe5]">
                <th className="py-3 px-4 font-semibold">Tanggal Periksa</th>
                <th className="py-3 px-4 font-semibold">Usia</th>
                <th className="py-3 px-4 font-semibold">Berat (kg)</th>
                <th className="py-3 px-4 font-semibold">Tinggi (cm)</th>
                <th className="py-3 px-4 font-semibold">Metode</th>
                <th className="py-3 px-4 font-semibold">Z-Score (TB/U)</th>
                <th className="py-3 px-4 font-semibold">Status Stunting</th>
                <th className="py-3 px-4 font-semibold">Petugas Pencatat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-[#f8fafc]">
                  <td className="py-3 px-4 font-bold text-[#0b1c30]">{exam.examDate}</td>
                  <td className="py-3 px-4">{exam.ageMonths} Bulan</td>
                  <td className="py-3 px-4 font-semibold text-[#0b1c30]">{exam.weight} kg</td>
                  <td className="py-3 px-4 font-semibold text-[#0b1c30]">{exam.height} cm</td>
                  <td className="py-3 px-4 capitalize">{exam.method}</td>
                  <td className="py-3 px-4 font-bold text-[#0b1c30]">{exam.zScoreTbU} SD</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] font-semibold text-[11px]">
                      {exam.stuntingStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#6f7a6e]">{exam.recordedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Rekomendasi Klinis */}
      {activeTab === "rekomendasi" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e2ebe5] shadow-sm space-y-4">
            <h3 className="font-heading text-sm font-bold text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#15803d] text-[20px]">medical_services</span>
              Evaluasi Medis & Rekomendasi Gizi
            </h3>
            <p className="text-xs text-[#3f493f] leading-relaxed">
              {child.stuntingStatus === "Normal"
                ? "Pertumbuhan anak berada dalam rentang normal dan stabil mengikuti kurva pertumbuhan baku WHO. Pertahankan pemberian makanan pendamping ASI (MP-ASI) kaya zat besi dan protein hewani (telur, ikan, daging ayam)."
                : "Indikasi panjang/tinggi badan anak berada di bawah kurva pertumbuhan standar. Disarankan untuk berkonsultasi dengan petugas gizi Posyandu/Puskesmas untuk evaluasi asupan MP-ASI dan sanitasi lingkungan."}
            </p>
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e2ebe5] text-xs text-[#6f7a6e] space-y-1">
              <p><strong>Pemeriksa Terakhir:</strong> Bidan Sri Wahyuni, A.Md.Keb</p>
              <p><strong>Catatan Tambahan:</strong> Nafsu makan baik, motorik kasar sesuai usia.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2ebe5] shadow-sm space-y-3">
            <h3 className="font-heading text-sm font-bold text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#15803d] text-[20px]">checklist</span>
              Rencana Tindak Lanjut (Next Steps)
            </h3>
            <ul className="space-y-2 text-xs text-[#3f493f]">
              <li className="flex items-center gap-2">
                <span className="text-[#15803d] font-bold">✓</span>
                Jadwalkan penimbangan ulang pada sesi Posyandu tanggal 14 November 2024.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#15803d] font-bold">✓</span>
                Pastikan pemberian kapsul Vitamin A warna merah telah tercatat.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#15803d] font-bold">✓</span>
                Kirim pesan pengingat otomatis ke nomor WhatsApp orang tua (0812-3456-7890).
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Edit Data Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-[#e2ebe5] z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
              <h3 className="font-heading text-base font-bold text-[#0b1c30]">
                Koreksi Data Pengukuran Balita
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-[#6f7a6e] hover:text-[#0b1c30]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Alasan Koreksi (Audit Log) *</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Contoh: Kesalahan input tinggi badan saat penimbangan ramai..."
                  className="w-full p-2.5 bg-[#f8f9ff] border border-[#cbd5e1] rounded-xl text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Data koreksi berhasil disimpan ke riwayat audit.");
                  setShowEditModal(false);
                }}
                className="px-4 py-2 bg-[#15803d] hover:bg-[#14532d] text-white rounded-xl text-xs font-semibold"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
