"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { mockAnnouncements } from "@/lib/mockData";
import { ParentSidebar } from "@/components/common/ParentSidebar";
import { ParentHeader } from "@/components/common/ParentHeader";
import { ParentBottomBar } from "@/components/common/ParentBottomBar";

type FilterTabKey = "all" | "jadwal" | "imunisasi" | "edukasi";

function PengumumanJadwalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterTabKey>("all");

  // Sinkronkan tab filter dari URL query parameter ?tab=...
  useEffect(() => {
    const tabParam = searchParams.get("tab")?.toLowerCase();
    if (tabParam === "jadwal-posyandu" || tabParam === "jadwal") {
      setActiveFilter("jadwal");
    } else if (tabParam === "jadwal-imunisasi" || tabParam === "imunisasi") {
      setActiveFilter("imunisasi");
    } else if (tabParam === "edukasi-gizi" || tabParam === "edukasi") {
      setActiveFilter("edukasi");
    } else if (tabParam === "semua" || tabParam === "all") {
      setActiveFilter("all");
    }
  }, [searchParams]);

  const handleTabChange = (key: FilterTabKey) => {
    setActiveFilter(key);
    let queryVal = "all";
    if (key === "jadwal") queryVal = "jadwal-posyandu";
    if (key === "imunisasi") queryVal = "jadwal-imunisasi";
    if (key === "edukasi") queryVal = "edukasi-gizi";

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", queryVal);
    router.replace(`/pengumuman-jadwal?${params.toString()}`);
  };

  const filteredAnnouncements = mockAnnouncements.filter((a) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "jadwal") return a.category === "Jadwal Posyandu";
    if (activeFilter === "imunisasi") return a.category === "Imunisasi";
    if (activeFilter === "edukasi") return a.category === "Edukasi Gizi";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Dashboard Sidebar (hidden on mobile) */}
      <Suspense fallback={<div className="hidden lg:block w-[260px] h-screen bg-white fixed left-0 top-0" />}>
        <ParentSidebar />
      </Suspense>

      <div className="pl-0 lg:pl-[260px] transition-[padding] duration-200">
        {/* 2. Dashboard App Header with Calendar & Notification Widgets */}
        <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200" />}>
          <ParentHeader />
        </Suspense>

        {/* 3. Main Dashboard Content */}
        <main className="w-full pt-16 pb-24 lg:pb-8 min-h-screen">
          <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
            {/* Breadcrumb & Header Info */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                <Link href="/parent/dashboard" className="hover:text-emerald-700">Dashboard</Link>
                <span>/</span>
                <span className="text-slate-800 font-semibold">Pengumuman & Jadwal</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                    Pengumuman & Jadwal Posyandu
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                    Informasi resmi jadwal penimbangan balita, pekan imunisasi, serta penyuluhan gizi keluarga di Posyandu Melati.
                  </p>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200/60 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Kanal Resmi Warga
                </span>
              </div>
            </div>

            {/* Filter Tabs Interaktif */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
              {[
                { key: "all" as FilterTabKey, label: "Semua Informasi", icon: "dashboard" },
                { key: "jadwal" as FilterTabKey, label: "Jadwal Posyandu", icon: "event" },
                { key: "imunisasi" as FilterTabKey, label: "Jadwal Imunisasi", icon: "vaccines" },
                { key: "edukasi" as FilterTabKey, label: "Edukasi & Gizi", icon: "menu_book" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeFilter === tab.key
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {activeFilter === tab.key && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5" />
                  )}
                </button>
              ))}
            </div>

            {/* Announcements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredAnnouncements.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200/80">
                  <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">event_busy</span>
                  <p className="text-sm font-semibold text-slate-800">Belum ada pengumuman pada kategori ini</p>
                  <p className="text-xs text-slate-500 mt-1">Silakan pilih tab filter lainnya.</p>
                </div>
              ) : (
                filteredAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
                          {ann.category}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                          {ann.date}
                        </span>
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
                              <span className="material-symbols-outlined text-[16px] text-emerald-600">event</span>
                              <span>Hari & Tanggal: <strong className="text-slate-900">{ann.eventDate}</strong></span>
                            </p>
                          )}
                          {ann.location && (
                            <p className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-emerald-600">pin_drop</span>
                              <span>Lokasi: <strong className="text-slate-900">{ann.location}</strong></span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Diterbitkan: <strong className="text-slate-700 font-semibold">{ann.publishedBy}</strong></span>
                      <button
                        onClick={() => alert("Pengingat jadwal berhasil ditambahkan ke kalender.")}
                        className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">notification_add</span>
                        <span>Ingatkan Saya</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <Suspense fallback={null}>
        <ParentBottomBar />
      </Suspense>
    </div>
  );
}

export default function PengumumanJadwalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[20px] text-emerald-600">sync</span>
            <span>Memuat Pengumuman & Jadwal...</span>
          </div>
        </div>
      }
    >
      <PengumumanJadwalContent />
    </Suspense>
  );
}
