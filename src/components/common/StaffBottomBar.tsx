"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface DrawerItem {
  href: string;
  label: string;
  desc: string;
  icon: string;
}

const moreMenuItems: DrawerItem[] = [
  {
    href: "/staff/orang-tua",
    label: "Akun Orang Tua",
    desc: "Kelola data & kontak orang tua",
    icon: "group",
  },
  {
    href: "/staff/ringkasan",
    label: "Posyandu & Wilayah",
    desc: "Cakupan RW & pos layanan",
    icon: "location_city",
  },
  {
    href: "/staff/laporan",
    label: "Laporan Rekapitulasi",
    desc: "Ekspor SKDN & data bulanan",
    icon: "bar_chart",
  },
  {
    href: "/staff/pengumuman",
    label: "Pengumuman & Jadwal",
    desc: "Publikasi info posyandu warga",
    icon: "event_available",
  },
  {
    href: "/staff/profil",
    label: "Profil Petugas",
    desc: "Data diri & pengaturan akun",
    icon: "account_circle",
  },
];

export function StaffBottomBar() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close drawer when path changes without useEffect
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMoreOpen(false);
  }

  const isMoreActive = moreMenuItems.some(
    (item) => pathname === item.href || pathname.startsWith(item.href)
  );

  return (
    <>
      {/* Bottom Sheet Drawer for "Menu Lainnya" */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMoreOpen(false)}
          />

          {/* Sheet Content */}
          <div className="relative w-full bg-white rounded-t-3xl shadow-2xl border-t border-[#e2ebe5] p-5 pb-24 z-10 animate-in slide-in-from-bottom duration-200">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-[#e2ebe5] rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f1f5f9]">
              <div>
                <h3 className="font-heading text-sm font-bold text-[#0b1c30]">
                  Menu Layanan Petugas
                </h3>
                <p className="text-[11px] text-[#6f7a6e]">
                  Akses menu manajemen dan pelaporan posyandu
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="p-1 text-[#6f7a6e] hover:text-[#0b1c30] rounded-full hover:bg-[#f1f5f9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 gap-2 max-h-[50vh] overflow-y-auto">
              {moreMenuItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={cn(
                      "flex items-center gap-3.5 p-3 rounded-2xl transition-all border",
                      isActive
                        ? "bg-[#ecfdf3] border-[#15803d]/30 text-[#15803d]"
                        : "bg-[#f8f9ff] border-[#e2ebe5] text-[#3f493f] hover:bg-white"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs",
                        isActive
                          ? "bg-[#15803d] text-white"
                          : "bg-white text-[#15803d] border border-[#e2ebe5]"
                      )}
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold leading-tight truncate">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-[#6f7a6e] truncate mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-[#94a3b8]">
                      chevron_right
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Logout Shortcut in Drawer */}
            <div className="pt-3 mt-3 border-t border-[#f1f5f9]">
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#fee2e2] bg-[#fff5f5] text-[#ba1a1a] text-xs font-bold hover:bg-[#fee2e2]/60 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Keluar dari Akun Petugas</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Primary Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Navigasi Bawah Petugas"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#e2ebe5] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 items-center">
          {/* 1. Dashboard */}
          <Link
            href="/staff/dashboard"
            className={cn(
              "flex flex-col items-center justify-center py-1 rounded-xl transition-all relative group",
              pathname === "/staff/dashboard"
                ? "text-[#15803d] font-bold"
                : "text-[#6f7a6e] hover:text-[#0b1c30] font-medium"
            )}
          >
            {pathname === "/staff/dashboard" && (
              <span className="absolute -top-1.5 w-6 h-1 bg-[#15803d] rounded-full" />
            )}
            <div
              className={cn(
                "w-9 h-7 rounded-lg flex items-center justify-center transition-colors",
                pathname === "/staff/dashboard"
                  ? "bg-[#dcfce7]/60"
                  : "group-hover:bg-[#f1f5f9]"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[22px]",
                  pathname === "/staff/dashboard" ? "text-[#15803d]" : "text-[#6f7a6e]"
                )}
              >
                space_dashboard
              </span>
            </div>
            <span className="text-[10px] leading-tight mt-0.5 truncate max-w-full">
              Dasbor
            </span>
          </Link>

          {/* 2. Data Balita */}
          <Link
            href="/staff/balita"
            className={cn(
              "flex flex-col items-center justify-center py-1 rounded-xl transition-all relative group",
              pathname.startsWith("/staff/balita")
                ? "text-[#15803d] font-bold"
                : "text-[#6f7a6e] hover:text-[#0b1c30] font-medium"
            )}
          >
            {pathname.startsWith("/staff/balita") && (
              <span className="absolute -top-1.5 w-6 h-1 bg-[#15803d] rounded-full" />
            )}
            <div
              className={cn(
                "w-9 h-7 rounded-lg flex items-center justify-center transition-colors",
                pathname.startsWith("/staff/balita")
                  ? "bg-[#dcfce7]/60"
                  : "group-hover:bg-[#f1f5f9]"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[22px]",
                  pathname.startsWith("/staff/balita")
                    ? "text-[#15803d]"
                    : "text-[#6f7a6e]"
                )}
              >
                child_care
              </span>
            </div>
            <span className="text-[10px] leading-tight mt-0.5 truncate max-w-full">
              Balita
            </span>
          </Link>

          {/* 3. Center FAB: Catat Pemeriksaan */}
          <div className="flex flex-col items-center justify-center relative">
            <Link
              href="/staff/pemeriksaan"
              className={cn(
                "w-12 h-12 -mt-5 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 border-2 border-white",
                pathname === "/staff/pemeriksaan"
                  ? "bg-[#14532d] text-white ring-2 ring-[#15803d]"
                  : "bg-[#15803d] hover:bg-[#14532d] text-white"
              )}
              title="Catat Pemeriksaan Antropometri"
            >
              <span className="material-symbols-outlined text-[26px]">add</span>
            </Link>
            <span
              className={cn(
                "text-[10px] leading-tight mt-1 truncate max-w-full font-bold",
                pathname === "/staff/pemeriksaan" ? "text-[#15803d]" : "text-[#4b5a53]"
              )}
            >
              Periksa
            </span>
          </div>

          {/* 4. Monitoring */}
          <Link
            href="/staff/monitoring"
            className={cn(
              "flex flex-col items-center justify-center py-1 rounded-xl transition-all relative group",
              pathname.startsWith("/staff/monitoring")
                ? "text-[#15803d] font-bold"
                : "text-[#6f7a6e] hover:text-[#0b1c30] font-medium"
            )}
          >
            {pathname.startsWith("/staff/monitoring") && (
              <span className="absolute -top-1.5 w-6 h-1 bg-[#15803d] rounded-full" />
            )}
            <div
              className={cn(
                "w-9 h-7 rounded-lg flex items-center justify-center transition-colors",
                pathname.startsWith("/staff/monitoring")
                  ? "bg-[#dcfce7]/60"
                  : "group-hover:bg-[#f1f5f9]"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[22px]",
                  pathname.startsWith("/staff/monitoring")
                    ? "text-[#15803d]"
                    : "text-[#6f7a6e]"
                )}
              >
                monitoring
              </span>
            </div>
            <span className="text-[10px] leading-tight mt-0.5 truncate max-w-full">
              Pantau
            </span>
          </Link>

          {/* 5. More Menu Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={cn(
              "flex flex-col items-center justify-center py-1 rounded-xl transition-all relative cursor-pointer group",
              isMoreActive || isMoreOpen
                ? "text-[#15803d] font-bold"
                : "text-[#6f7a6e] hover:text-[#0b1c30] font-medium"
            )}
          >
            {(isMoreActive || isMoreOpen) && (
              <span className="absolute -top-1.5 w-6 h-1 bg-[#15803d] rounded-full" />
            )}
            <div
              className={cn(
                "w-9 h-7 rounded-lg flex items-center justify-center transition-colors",
                isMoreActive || isMoreOpen
                  ? "bg-[#dcfce7]/60"
                  : "group-hover:bg-[#f1f5f9]"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[22px]",
                  isMoreActive || isMoreOpen ? "text-[#15803d]" : "text-[#6f7a6e]"
                )}
              >
                widgets
              </span>
            </div>
            <span className="text-[10px] leading-tight mt-0.5 truncate max-w-full">
              Menu
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}

