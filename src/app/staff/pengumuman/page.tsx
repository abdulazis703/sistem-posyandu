"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { mockAnnouncements, Announcement } from "@/lib/mockData";

type FilterTabKey = "all" | "jadwal" | "imunisasi" | "edukasi";

function PengumumanPetugasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [activeFilter, setActiveFilter] = useState<FilterTabKey>("all");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Announcement["category"]>("Jadwal Posyandu");
  const [content, setContent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");

  // Sinkronkan active filter tab dari URL parameter ?tab=...
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
    router.replace(`/staff/pengumuman?${params.toString()}`);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      category,
      content,
      date: new Date().toISOString().split("T")[0],
      eventDate,
      location,
      publishedBy: "Bidan Sri Wahyuni",
      isImportant: true,
    };
    setAnnouncements([newAnn, ...announcements]);
    setShowModal(false);
    setTitle("");
    setContent("");
    setEventDate("");
    setLocation("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus pengumuman ini?")) {
      setAnnouncements(announcements.filter((a) => a.id !== id));
    }
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "jadwal") return a.category === "Jadwal Posyandu";
    if (activeFilter === "imunisasi") return a.category === "Imunisasi";
    if (activeFilter === "edukasi") return a.category === "Edukasi Gizi";
    return true;
  });

  return (
    <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Pengumuman & Jadwal Posyandu
            </h1>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200/60">
              Kanal Informasi Warga
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publikasikan jadwal kegiatan penimbangan, imunisasi rutin, dan edukasi nutrisi yang dapat dibaca langsung oleh orang tua.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>+ Buat Pengumuman Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { key: "all" as FilterTabKey, label: "Semua Kategori", icon: "dashboard" },
          { key: "jadwal" as FilterTabKey, label: "Jadwal Posyandu", icon: "event" },
          { key: "imunisasi" as FilterTabKey, label: "Jadwal Imunisasi", icon: "vaccines" },
          { key: "edukasi" as FilterTabKey, label: "Edukasi Gizi", icon: "menu_book" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === tab.key
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">event_busy</span>
            <p className="text-sm font-semibold text-slate-800">Belum ada pengumuman pada kategori ini</p>
            <p className="text-xs text-slate-500 mt-1">Gunakan tombol "+ Buat Pengumuman Baru" untuk mempublikasikan informasi.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
                    {ann.category}
                  </span>
                  {ann.isImportant && (
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold border border-rose-200/70">
                      Penting
                    </span>
                  )}
                  <span className="text-xs text-slate-500">• Diterbitkan {ann.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Pengumuman"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              <h3 className="font-heading text-base font-bold text-slate-900">
                {ann.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {ann.content}
              </p>

              {(ann.eventDate || ann.location) && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-700">
                  {ann.eventDate && (
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">calendar_today</span>
                      Tanggal Kegiatan: <strong className="text-slate-900">{ann.eventDate}</strong>
                    </span>
                  )}
                  {ann.location && (
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">location_on</span>
                      Lokasi: <strong className="text-slate-900">{ann.location}</strong>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-slate-500">
                    Oleh: {ann.publishedBy}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Buat Pengumuman */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading text-base font-bold text-slate-900">
                Publikasikan Pengumuman / Jadwal
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jadwal Posyandu Melati 01 Bulan Depan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Announcement["category"])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Jadwal Posyandu">Jadwal Posyandu</option>
                  <option value="Imunisasi">Jadwal Imunisasi</option>
                  <option value="Edukasi Gizi">Edukasi Gizi</option>
                  <option value="Penting">Penting / Khusus</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Isi Konten / Penjelasan *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tulis detail jadwal, syarat membawa buku KIA/KMS, dan imbauan lainnya..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hari & Tanggal</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kamis, 14 Nov 2026"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lokasi Kegiatan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Balai RW 04"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Publikasikan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PengumumanPetugasPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1240px] w-full mx-auto px-6 py-8 text-xs text-slate-500 flex items-center gap-2">
          <span className="material-symbols-outlined animate-spin text-[18px] text-emerald-600">sync</span>
          <span>Memuat filter pengumuman petugas...</span>
        </div>
      }
    >
      <PengumumanPetugasContent />
    </Suspense>
  );
}
