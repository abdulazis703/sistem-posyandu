"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { mockAnnouncements } from "@/lib/mockData";

type FilterTabKey = "all" | "jadwal" | "imunisasi" | "edukasi";

function getFilterFromParam(param: string | null): FilterTabKey {
  const p = param?.toLowerCase();
  if (p === "jadwal-posyandu" || p === "jadwal") return "jadwal";
  if (p === "jadwal-imunisasi" || p === "imunisasi") return "imunisasi";
  if (p === "edukasi-gizi" || p === "edukasi") return "edukasi";
  return "all";
}

function PengumumanParentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const [selectedFilter, setSelectedFilter] = useState<FilterTabKey | null>(null);
  const activeFilter = selectedFilter ?? getFilterFromParam(tabParam);

  const handleTabChange = (key: FilterTabKey) => {
    setSelectedFilter(key);
    let queryVal = "all";
    if (key === "jadwal") queryVal = "jadwal-posyandu";
    if (key === "imunisasi") queryVal = "jadwal-imunisasi";
    if (key === "edukasi") queryVal = "edukasi-gizi";
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", queryVal);
    router.replace(`/parent/pengumuman?${params.toString()}`, { scroll: false });
  };

  const filteredAnnouncements = mockAnnouncements.filter((a) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "jadwal") return a.category === "Jadwal Posyandu";
    if (activeFilter === "imunisasi") return a.category === "Imunisasi";
    if (activeFilter === "edukasi") return a.category === "Edukasi Gizi";
    return true;
  });

  return (
    <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
          <Link href="/parent/dashboard" className="hover:text-emerald-700">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Pengumuman & Jadwal</span>
        </div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
          Pengumuman & Jadwal Posyandu
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Informasi penting jadwal buka Posyandu Melati, imunisasi anak, dan panduan gizi keluarga.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: "all" as FilterTabKey, label: "Semua Informasi" },
          { key: "jadwal" as FilterTabKey, label: "Jadwal Posyandu" },
          { key: "imunisasi" as FilterTabKey, label: "Jadwal Imunisasi" },
          { key: "edukasi" as FilterTabKey, label: "Edukasi & Gizi" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === tab.key
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
                  {ann.category}
                </span>
                <span className="text-xs text-slate-500">{ann.date}</span>
              </div>

              <h3 className="font-heading text-base font-bold text-slate-900">
                {ann.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {ann.content}
              </p>

              {(ann.eventDate || ann.location) && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700 space-y-1.5">
                  {ann.eventDate && (
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">calendar_today</span>
                      <span>Hari & Tanggal: <strong className="text-slate-900">{ann.eventDate}</strong></span>
                    </p>
                  )}
                  {ann.location && (
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">location_on</span>
                      <span>Tempat: <strong className="text-slate-900">{ann.location}</strong></span>
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Diterbitkan oleh: <strong className="text-slate-700 font-semibold">{ann.publishedBy}</strong></span>
              <button
                onClick={() => alert("Pengingat jadwal berhasil ditambahkan ke kalender ponsel Anda.")}
                className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">notification_add</span>
                <span>Ingatkan Saya</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PengumumanParentPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1240px] w-full mx-auto px-6 py-8 text-xs text-slate-500 flex items-center gap-2">
          <span className="material-symbols-outlined animate-spin text-[18px] text-emerald-600">sync</span>
          <span>Memuat filter pengumuman...</span>
        </div>
      }
    >
      <PengumumanParentContent />
    </Suspense>
  );
}
