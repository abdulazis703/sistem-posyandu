"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Child,
  Parent,
  Announcement,
  ExamRecord,
  mockParents,
  mockAnnouncements,
  mockExamRecords,
} from "@/lib/mockData";
import { getStoredChildren } from "@/app/hooks/useChildrenData";

interface HeaderRealtimeSearchProps {
  role: "staff" | "parent";
  placeholder?: string;
  onSearch?: (q: string) => void;
}

interface QuickMenu {
  title: string;
  href: string;
  icon: string;
  desc: string;
}

const staffMenus: QuickMenu[] = [
  { title: "Dashboard Petugas", href: "/staff/dashboard", icon: "space_dashboard", desc: "Ringkasan metrik & statistik balita binaan" },
  { title: "Data Balita", href: "/staff/balita", icon: "child_care", desc: "Daftar seluruh balita, status gizi & KMS" },
  { title: "Tambah Data Balita", href: "/staff/balita/tambah", icon: "person_add", desc: "Registrasi balita baru e-PPGBM" },
  { title: "Akun Orang Tua", href: "/staff/orang-tua", icon: "group", desc: "Kelola wali & kontak binaan" },
  { title: "Catat Pemeriksaan", href: "/staff/pemeriksaan", icon: "assignment", desc: "Input antropometri bulanan posyandu" },
  { title: "Monitoring Stunting", href: "/staff/monitoring", icon: "monitoring", desc: "Pemantauan atensi balita berisiko" },
  { title: "Laporan Posyandu", href: "/staff/laporan", icon: "bar_chart", desc: "Rekap data & ekspor laporan" },
  { title: "Pengumuman & Jadwal", href: "/staff/pengumuman", icon: "event_available", desc: "Agenda penimbangan posyandu" },
  { title: "Profil Petugas", href: "/staff/profil", icon: "account_circle", desc: "Pengaturan akun pembina posyandu" },
];

const parentMenus: QuickMenu[] = [
  { title: "Dashboard Orang Tua", href: "/parent/dashboard", icon: "grid_view", desc: "Status tumbuh kembang anak & jadwal posyandu" },
  { title: "Balita Saya (Grafik Pertumbuhan)", href: "/parent/grafik", icon: "child_care", desc: "Kurva WHO, IMT & tumbuh kembang anak saya" },
  { title: "Riwayat Pemeriksaan", href: "/parent/riwayat", icon: "clinical_notes", desc: "Catatan penimbangan & vitamin balita saya" },
  { title: "Jadwal & Pengumuman", href: "/parent/pengumuman", icon: "event_available", desc: "Agenda imunisasi & posyandu terdekat" },
  { title: "Profil Akun", href: "/parent/profil", icon: "manage_accounts", desc: "Informasi data keluarga & kontak saya" },
];

export function HeaderRealtimeSearch({
  role,
  placeholder,
  onSearch,
}: HeaderRealtimeSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Muat data balita secara real-time dari cache lokal / storage
  useEffect(() => {
    setChildrenData(getStoredChildren());

    const handleSync = () => {
      setChildrenData(getStoredChildren());
    };
    window.addEventListener("tumbuhku_children_updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("tumbuhku_children_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Filter HANYA anak yang terdaftar pada akun orang tua yang aktif (Privasi ketat)
  const myChildren = useMemo(() => {
    return childrenData.filter(
      (c) =>
        c.parentId === "parent-1" ||
        (c.parentName && c.parentName.toLowerCase().includes("sari")) ||
        (c.motherName && c.motherName.toLowerCase().includes("sari"))
    );
  }, [childrenData]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tutup dropdown saat tekan tombol Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    setIsOpen(val.trim().length > 0);
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    if (onSearch) {
      onSearch("");
    }
    inputRef.current?.focus();
  };

  const handleSelectResult = (href: string) => {
    setIsOpen(false);
    setMobileSearchOpen(false);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      setIsOpen(false);
      setMobileSearchOpen(false);
      if (role === "staff") {
        router.push(`/staff/balita?search=${encodeURIComponent(query.trim())}`);
      } else {
        router.push(`/parent/grafik`);
      }
    }
  };

  // Filter Hasil Pencarian Real-Time dengan Pemisahan Hak Akses Role
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        children: [],
        parents: [],
        announcements: [],
        exams: [],
        menus: [],
        total: 0,
      };
    }

    if (role === "staff") {
      // ROLE PETUGAS: Memiliki akses menyeluruh ke seluruh balita & orang tua di wilayah binaan
      // 1. Seluruh Balita di Posyandu
      const filteredChildren = childrenData
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.nik.includes(q) ||
            c.posyandu.toLowerCase().includes(q) ||
            c.parentName.toLowerCase().includes(q) ||
            (c.motherName && c.motherName.toLowerCase().includes(q)) ||
            (c.fatherName && c.fatherName.toLowerCase().includes(q))
        )
        .slice(0, 5);

      // 2. Seluruh Akun Orang Tua
      const filteredParents = mockParents
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.nik.includes(q) ||
            p.phone.includes(q) ||
            p.posyandu.toLowerCase().includes(q) ||
            p.children.some((ch) => ch.name.toLowerCase().includes(q))
        )
        .slice(0, 3);

      // 3. Jadwal & Pengumuman
      const filteredAnnouncements = mockAnnouncements
        .filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.content.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q) ||
            (a.location && a.location.toLowerCase().includes(q))
        )
        .slice(0, 3);

      // 4. Menu Petugas
      const filteredMenus = staffMenus
        .filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.desc.toLowerCase().includes(q)
        )
        .slice(0, 3);

      return {
        children: filteredChildren,
        parents: filteredParents,
        announcements: filteredAnnouncements,
        exams: [],
        menus: filteredMenus,
        total:
          filteredChildren.length +
          filteredParents.length +
          filteredAnnouncements.length +
          filteredMenus.length,
      };
    } else {
      // ROLE ORANG TUA: Hak akses TERBATAS (hanya anak sendiri, jadwal, riwayat anak sendiri, menu orang tua)
      // 1. HANYA Balita Milik Akun Ini (TIDAK PERNAH mencampur data balita keluarga lain!)
      const filteredChildren = myChildren
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.nik.includes(q)
        )
        .slice(0, 3);

      // 2. Jadwal & Pengumuman Posyandu
      const filteredAnnouncements = mockAnnouncements
        .filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.content.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q) ||
            (a.location && a.location.toLowerCase().includes(q))
        )
        .slice(0, 3);

      // 3. Riwayat Pemeriksaan HANYA untuk Anak Sendiri
      const myChildIds = new Set(myChildren.map((c) => c.id));
      const myChildNames = new Set(myChildren.map((c) => c.name.toLowerCase()));
      const filteredExams = mockExamRecords
        .filter(
          (e) =>
            (myChildIds.has(e.childId) || myChildNames.has(e.childName.toLowerCase())) &&
            (e.childName.toLowerCase().includes(q) ||
              e.examDate.includes(q) ||
              e.stuntingStatus.toLowerCase().includes(q) ||
              (e.notes && e.notes.toLowerCase().includes(q)))
        )
        .slice(0, 2);

      // 4. Menu Pintasan Orang Tua
      const filteredMenus = parentMenus
        .filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.desc.toLowerCase().includes(q)
        )
        .slice(0, 3);

      return {
        children: filteredChildren,
        parents: [], // ORANG TUA TIDAK BISA MELIHAT AKUN ORANG TUA LAIN
        announcements: filteredAnnouncements,
        exams: filteredExams,
        menus: filteredMenus,
        total:
          filteredChildren.length +
          filteredAnnouncements.length +
          filteredExams.length +
          filteredMenus.length,
      };
    }
  }, [query, childrenData, myChildren, role]);

  const defaultPlaceholder =
    role === "staff"
      ? "Cari balita binaan, NIK, orang tua, jadwal..."
      : "Cari data balita saya, jadwal posyandu...";

  return (
    <>
      {/* Mobile Search Toggle Icon (< sm) */}
      <div className="flex sm:hidden items-center">
        <button
          type="button"
          onClick={() => {
            setMobileSearchOpen((v) => !v);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className="p-2 rounded-xl text-[#6f7a6e] hover:text-[#0b1c30] hover:bg-[#f1f5f9] transition-colors"
          title="Buka Pencarian"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
      </div>

      {/* Main Search Container */}
      <div
        ref={containerRef}
        className={`relative flex-1 ${
          mobileSearchOpen
            ? "fixed inset-x-2 top-2 z-50 flex items-center bg-white p-2 rounded-2xl shadow-2xl border border-[#e2ebe5]"
            : "hidden sm:flex max-w-xs md:max-w-md mx-2 lg:mx-4"
        }`}
      >
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#6f7a6e] pointer-events-none">
            search
          </span>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => {
              if (query.trim()) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || defaultPlaceholder}
            className="w-full pl-9 pr-8 py-1.5 bg-[#f8f9ff] border border-[#e2ebe5] rounded-xl text-xs text-[#0b1c30] placeholder:text-[#6f7a6e] focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 p-0.5 rounded-full text-[#6f7a6e] hover:text-[#ba1a1a] hover:bg-slate-200 transition-colors cursor-pointer"
              title="Bersihkan pencarian"
            >
              <span className="material-symbols-outlined text-[16px] block">close</span>
            </button>
          )}

          {mobileSearchOpen && (
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="ml-2 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-900 font-medium"
            >
              Tutup
            </button>
          )}
        </div>

        {/* Floating Dropdown Real-time Search Results */}
        {isOpen && query.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#e2ebe5] z-50 max-h-[460px] overflow-y-auto divide-y divide-[#f1f5f9] animate-in fade-in zoom-in-95 duration-150">
            {/* Dropdown Header dengan Label Hak Akses */}
            <div className="p-3 bg-[#f8f9ff] flex items-center justify-between text-xs text-[#6f7a6e] border-b border-[#e2ebe5]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse shrink-0"></span>
                <span className="font-semibold truncate">
                  {role === "staff" ? "Pencarian Petugas" : "Pencarian Akun Keluarga"}: &ldquo;<strong className="text-[#0b1c30]">{query}</strong>&rdquo;
                </span>
              </div>
              <span className="text-[11px] bg-white px-2 py-0.5 rounded-md border border-[#e2ebe5] shrink-0 font-medium">
                {searchResults.total} hasil
              </span>
            </div>

            {/* Empty State Khusus Tiap Role */}
            {searchResults.total === 0 && (
              <div className="p-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">search_off</span>
                </div>
                <p className="text-xs font-semibold text-slate-700">Tidak ada hasil yang cocok</p>
                <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {role === "parent"
                    ? "Pencarian akun Orang Tua dibatasi secara ketat hanya untuk data balita dalam keluarga Anda serta jadwal Posyandu."
                    : "Coba gunakan kata kunci nama balita, NIK, nama orang tua, atau posyandu binaan."}
                </p>
              </div>
            )}

            {/* Section 1: Balita */}
            {searchResults.children.length > 0 && (
              <div className="p-2">
                <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#166534] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">child_care</span>
                    <span>{role === "staff" ? "Data Balita Binaan Posyandu" : "Balita Saya (Keluarga Anda)"}</span>
                  </div>
                  {role === "parent" && (
                    <span className="text-[10px] text-emerald-700 font-medium lowercase">hanya anak saya</span>
                  )}
                </div>
                <div className="space-y-0.5 mt-1">
                  {searchResults.children.map((c) => {
                    const isStunted =
                      c.stuntingStatus.includes("Pendek") ||
                      c.stuntingStatus.includes("Stunted");
                    const targetHref =
                      role === "staff" ? `/staff/balita/${c.id}` : `/parent/grafik`;

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectResult(targetHref)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#dcfce7]/40 flex items-center justify-between gap-3 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                              {c.name}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {role === "staff"
                                ? `NIK: ${c.nik} • Usia: ${c.ageMonths} Bln • Ortu: ${c.parentName}`
                                : `NIK: ${c.nik} • Usia: ${c.ageMonths} Bulan • ${c.gender === "L" ? "Laki-laki" : "Perempuan"}`}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                            isStunted
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          {c.stuntingStatus}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 2: Orang Tua (HANYA MUNCUL PADA PETUGAS) */}
            {role === "staff" && searchResults.parents.length > 0 && (
              <div className="p-2">
                <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#166534] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">group</span>
                  <span>Akun Orang Tua / Wali Binaan</span>
                </div>
                <div className="space-y-0.5 mt-1">
                  {searchResults.parents.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectResult(`/staff/orang-tua/${p.id}`)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#dcfce7]/40 flex items-center justify-between gap-3 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px]">face</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            HP: {p.phone} • NIK: {p.nik} • {p.posyandu}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 group-hover:text-emerald-700 shrink-0 flex items-center">
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Riwayat Pemeriksaan Balita (Khusus Orang Tua) */}
            {role === "parent" && searchResults.exams.length > 0 && (
              <div className="p-2">
                <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#166534] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">clinical_notes</span>
                  <span>Riwayat Pemeriksaan Balita Saya</span>
                </div>
                <div className="space-y-0.5 mt-1">
                  {searchResults.exams.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => handleSelectResult("/parent/riwayat")}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#dcfce7]/40 flex items-center justify-between gap-3 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px]">history_edu</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 truncate">
                            Penimbangan {ex.childName} ({ex.examDate})
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            BB: {ex.weight} kg • TB: {ex.height} cm • Status: {ex.stuntingStatus}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 group-hover:text-emerald-700 shrink-0 flex items-center">
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Jadwal & Pengumuman */}
            {searchResults.announcements.length > 0 && (
              <div className="p-2">
                <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#166534] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">event_available</span>
                  <span>Jadwal & Pengumuman Posyandu</span>
                </div>
                <div className="space-y-0.5 mt-1">
                  {searchResults.announcements.map((a) => {
                    const targetHref =
                      role === "staff" ? "/staff/pengumuman" : "/parent/pengumuman";
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => handleSelectResult(targetHref)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#dcfce7]/40 flex items-center justify-between gap-3 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 truncate">
                              {a.title}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {a.category} • {a.date} {a.location ? `• ${a.location}` : ""}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                          {a.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 5: Menu Navigasi Cepat Sesuai Role */}
            {searchResults.menus.length > 0 && (
              <div className="p-2">
                <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#166534] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">explore</span>
                  <span>Menu Pintasan {role === "staff" ? "Petugas" : "Orang Tua"}</span>
                </div>
                <div className="space-y-0.5 mt-1">
                  {searchResults.menus.map((m) => (
                    <button
                      key={m.href}
                      type="button"
                      onClick={() => handleSelectResult(m.href)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#dcfce7]/40 flex items-center justify-between gap-3 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#22c55e]/20 text-[#166534] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                            {m.title}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">{m.desc}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 group-hover:text-emerald-700 shrink-0 flex items-center">
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dropdown Footer Actions */}
            <div className="p-2.5 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
              {role === "staff" ? (
                <button
                  type="button"
                  onClick={() => handleSelectResult(`/staff/balita?search=${encodeURIComponent(query.trim())}`)}
                  className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                  <span>Buka tabel lengkap Data Balita untuk &ldquo;{query}&rdquo;</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSelectResult("/parent/grafik")}
                  className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">monitoring</span>
                  <span>Buka halaman Balita Saya</span>
                </button>
              )}
              <span className="hidden sm:inline text-slate-400">Tekan <strong>Enter ↵</strong> atau <strong>ESC</strong></span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
