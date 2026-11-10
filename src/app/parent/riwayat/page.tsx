"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockChildren, mockExamRecords } from "@/lib/mockData";
import { StuntingBadge } from "@/components/ui/badge";

export default function RiwayatPemeriksaanParentPage() {
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
      {/* Breadcrumb & Heading */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/parent/dashboard" className="hover:text-emerald-700">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Riwayat Pemeriksaan</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Riwayat Pemeriksaan Balita
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Catatan berkala pengukuran antropometri dan pertumbuhan di Posyandu resmi binaan Puskesmas.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-xl shadow-xs transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">print</span>
            <span>Cetak Riwayat PDF</span>
          </button>
        </div>
      </div>

      {/* Child Selector Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {myChildren.map((child, idx) => (
          <button
            key={child.id}
            onClick={() => setSelectedChildIndex(idx)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedChildIndex === idx
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
              {child.name.slice(0, 1)}
            </span>
            <span>{child.name}</span>
            <span className="text-xs opacity-80">({child.ageMonths} Bln)</span>
          </button>
        ))}
      </div>

      {/* Timeline Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">clinical_notes</span>
            </div>
            <h3 className="font-heading text-sm font-bold text-slate-900">
              Tabel Riwayat Penimbangan: {activeChild.name}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">{exams.length} Catatan Pemeriksaan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 uppercase text-xs font-semibold border-b border-slate-100">
                <th className="py-3.5 px-5">Tanggal</th>
                <th className="py-3.5 px-4">Usia</th>
                <th className="py-3.5 px-4">Berat Badan</th>
                <th className="py-3.5 px-4">Tinggi Badan</th>
                <th className="py-3.5 px-4">Lingkar Kepala</th>
                <th className="py-3.5 px-4">LiLA</th>
                <th className="py-3.5 px-4">Status Stunting</th>
                <th className="py-3.5 px-5">Catatan Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-slate-900">{exam.examDate}</td>
                  <td className="py-3.5 px-4 text-slate-700">{exam.ageMonths} Bulan</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900">{exam.weight} kg</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900">{exam.height} cm</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{exam.headCircumference || "-"} cm</td>
                  <td className="py-3.5 px-4 text-slate-600">{exam.lila || "-"} cm</td>
                  <td className="py-3.5 px-4">
                    <StuntingBadge status={exam.stuntingStatus} />
                  </td>
                  <td className="py-3.5 px-5 text-slate-600 max-w-xs text-xs sm:text-sm">
                    {exam.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
