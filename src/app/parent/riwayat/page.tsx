"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import useChildrenData from "@/app/hooks/useChildrenData";
import { getCurrentUser, getChildExamRecords, UserProfile } from "@/lib/supabase";
import { ExamRecord } from "@/lib/mockData";
import { StuntingBadge } from "@/components/ui/badge";
import { calculateDetailedAge } from "@/lib/ageHelper";
import MonthlyGrowthHistory from "@/components/growth/MonthlyGrowthHistory";

export default function RiwayatPemeriksaanParentPage() {
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);

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

  const activeChild = myChildren[selectedChildIndex] || myChildren[0];

  useEffect(() => {
    if (!activeChild?.id) {
      setExams([]);
      return;
    }

    let mounted = true;
    setLoadingExams(true);
    getChildExamRecords(activeChild.id, {
      name: activeChild.name,
      parentName: currentUser?.fullName || activeChild.parentName,
    })
      .then((records) => {
        if (mounted) setExams(records);
      })
      .finally(() => {
        if (mounted) setLoadingExams(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeChild?.id, activeChild?.name, activeChild?.parentName, currentUser?.fullName]);

  const isLoading = loadingUser || loadingChildren;

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
              Riwayat Kunjungan &amp; Pemeriksaan Balita
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Catatan berkala pengukuran antropometri anak yang terhubung langsung ke akun Anda.
            </p>
          </div>

          {myChildren.length > 0 && (
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-xl shadow-xs transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-500">print</span>
              <span>Cetak Riwayat PDF</span>
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center text-xs text-slate-500">
          Memuat data riwayat pemeriksaan...
        </div>
      ) : myChildren.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200/80 shadow-xs text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
            <span className="material-symbols-outlined text-[28px]">clinical_notes</span>
          </div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
            Belum Ada Riwayat Pemeriksaan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Akun <strong>{currentUser?.fullName || "Anda"}</strong> saat ini belum memiliki data balita terdaftar. Riwayat pemeriksaan akan tampil setelah balita didaftarkan dan ditimbang di Posyandu.
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
      ) : (
        <>
          {/* Child Selector Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
            {myChildren.map((child, idx) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildIndex(idx)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
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
                  Umur Presisi: <strong className="text-emerald-800 font-bold">{calculateDetailedAge(activeChild.birthDate).textLong}</strong>
                </span>
                <span>•</span>
                <span>Orang Tua: <strong className="text-slate-800">{currentUser?.fullName || activeChild.parentName}</strong></span>
              </div>
            </div>

            <Link
              href="/parent/grafik"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Buka Grafik Pertumbuhan &amp; IMT</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {loadingExams ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center text-xs text-slate-500">
              Memuat riwayat pengukuran dari database...
            </div>
          ) : (
            <MonthlyGrowthHistory exams={exams} child={activeChild} />
          )}
        </>
      )}
    </div>
  );
}
