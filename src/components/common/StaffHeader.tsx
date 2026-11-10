"use client";

import React from "react";
import Link from "next/link";
import { HeaderCalendarWidget } from "./HeaderCalendarWidget";
import { HeaderNotificationWidget } from "./HeaderNotificationWidget";

interface StaffHeaderProps {
  title?: string;
  onSearch?: (q: string) => void;
}

export function StaffHeader({ onSearch }: StaffHeaderProps) {
  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-white/90 backdrop-blur-md z-40 flex items-center justify-between px-4 lg:px-8 border-b border-[#e2ebe5] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Left: Mobile Branding or Desktop Scope Badge */}
      <div className="flex items-center gap-3">
        {/* Mobile Logo (< lg) */}
        <Link
          href="/staff/dashboard"
          className="flex lg:hidden items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#15803d] flex items-center justify-center text-white shadow-xs">
            <span className="material-symbols-outlined text-[20px]">potted_plant</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-bold text-[#00652c] leading-tight">
              TumbuhKu
            </span>
            <span className="text-[9px] text-[#3f493f] leading-none">
              Petugas Posyandu
            </span>
          </div>
        </Link>

        {/* Desktop Scope Badge */}
        <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b1f2be]/40 text-[#12512c] text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse"></span>
          <span>Wilayah: Posyandu Melati 1 s/d 4 (Kel. Sukamaju)</span>
        </div>
      </div>

      {/* Search Input (Hidden on extra small screens) */}
      <div className="hidden sm:flex flex-1 max-w-xs md:max-w-md mx-3 lg:mx-6">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#6f7a6e] pointer-events-none">
            search
          </span>
          <input
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#f8f9ff] border border-[#e2ebe5] rounded-xl text-xs text-[#0b1c30] placeholder:text-[#6f7a6e] focus:outline-none focus:ring-2 focus:ring-[#15803d]"
            placeholder="Cari balita, NIK, orang tua..."
            type="text"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
        {/* Dynamic Real-time Calendar Widget with Popover Datepicker */}
        <HeaderCalendarWidget />

        {/* Dynamic Notification Bell Widget with Popover Dropdown */}
        <HeaderNotificationWidget announcementHref="/staff/pengumuman" />

        {/* Catat Pemeriksaan Shortcut (Desktop & Tablet only; Mobile uses bottom bar FAB) */}
        <Link
          href="/staff/pemeriksaan"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#15803d] text-white text-xs font-semibold hover:bg-[#14532d] shadow-xs transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Catat Pemeriksaan</span>
        </Link>

        {/* Staff Profile Link */}
        <Link
          href="/staff/profil"
          className="w-8 h-8 rounded-full bg-[#15803d] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-xs"
          title="Profil Petugas"
        >
          <span className="material-symbols-outlined text-[18px]">person</span>
        </Link>
      </div>
    </header>
  );
}
