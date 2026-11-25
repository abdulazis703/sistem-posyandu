"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import useChildrenData from "@/app/hooks/useChildrenData";
import { mockChildren, mockExamRecords, ExamRecord } from "@/lib/mockData";
import { StuntingBadge } from "@/components/ui/badge";
import { calculateDetailedAge } from "@/lib/ageHelper";
import MonthlyGrowthHistory from "@/components/growth/MonthlyGrowthHistory";

export default function RiwayatPemeriksaanParentPage() {
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [storedExams, setStoredExams] = useState<ExamRecord[]>([]);
  const { children } = useChildrenData();

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("tumbuhku_exam_records");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStoredExams(parsed);
          }
        }
      }
    } catch (e) {
      console.warn("Gagal load stored exams:", e);
    }
  }, []);

  const allRecords = storedExams.length > 0 ? storedExams : mockExamRecords;

  const matched = children.filter(
    (c) => c.parentId === "parent-1" || c.parentName.toLowerCase().includes("sari")
  );
  const myChildren = matched.length > 0 ? matched : (children.length > 0 ? children : mockChildren);

  const activeChild = myChildren[selectedChildIndex] || myChildren[0];
  const matchedExams = allRecords.filter(
    (e) => e.childId === activeChild.id || e.childName === activeChild.name
  );

  const exams =
    matchedExams.length > 0
      ? matchedExams
      : [
          {
            id: `exam-${activeChild.id}`,
            childId: activeChild.id,
            childName: activeChild.name,
            examDate: activeChild.lastExamDate || "2026-10-24",
            ageMonths: activeChild.ageMonths || 18,
            weight: activeChild.weight || 10.5,
            height: activeChild.height || 82,
            headCircumference: activeChild.headCircumference || 46,
            lila: activeChild.lila || 14.5,
            method: "terlentang" as const,
            recordedBy: "Bidan Sri Wahyuni, A.Md.Keb",
            companionName: activeChild.motherName || activeChild.parentName,
            companionRelation: "Ibu Kandung",
            companionPhone: "081234567890",
            zScoreTbU: activeChild.zScoreTbU || 0,
            zScoreBbU: activeChild.zScoreBbU || 0,
            zScoreBbTb: activeChild.zScoreBbTb || 0,
            stuntingStatus: activeChild.stuntingStatus,
            wastingStatus: activeChild.wastingStatus,
            riskFlag: activeChild.riskFlag,
            notes: "Catatan riwayat pemeriksaan posyandu terintegrasi e-PPGBM.",
            status: "validated" as const,
          },
        ];

  const childAge = calculateDetailedAge(activeChild.birthDate);

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Breadcrumb & Heading */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/parent/dashboard" className="hover:text-emerald-700">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Riwayat Pemeriksaan & Pengantar</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Riwayat Kunjungan & Pengantar Balita
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Catatan berkala pengukuran antropometri dan pencatatan identitas pengantar resmi di Posyandu.
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

      {/* Child Summary Card with Detailed Age */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-heading text-lg font-bold text-slate-900">{activeChild.name}</h2>
            <StuntingBadge status={activeChild.stuntingStatus} />
          </div>
          <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-xs text-slate-500 mt-1">
            <span>NIK: <strong className="text-slate-800">{activeChild.nik}</strong></span>
            <span>•</span>
            <span>
              Umur Presisi: <strong className="text-emerald-800 font-bold">{childAge.textLong}</strong>
            </span>
            <span>•</span>
            <span>Ibu: <strong>{activeChild.motherName || activeChild.parentName}</strong></span>
            {activeChild.fatherName && <span>• Bapak: <strong>{activeChild.fatherName}</strong></span>}
          </div>
        </div>

        <Link
          href="/parent/grafik"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Buka Grafik Pertumbuhan & IMT</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      {/* Monthly Growth History & Delta Component */}
      <MonthlyGrowthHistory exams={exams} child={activeChild} />
    </div>
  );
}
