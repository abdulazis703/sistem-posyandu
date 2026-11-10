"use client";

import React from "react";
import Link from "next/link";
import { HeaderCalendarWidget } from "./HeaderCalendarWidget";
import { HeaderNotificationWidget } from "./HeaderNotificationWidget";

interface ParentHeaderProps {
  onSearch?: (q: string) => void;
}

export function ParentHeader({ onSearch }: ParentHeaderProps) {
  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-white/90 backdrop-blur-xl border-b border-[#e2ebe5] shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center">
      <div className="w-full px-4 lg:px-6 flex items-center justify-between gap-3">
        {/* Left Section: Mobile Branding Logo (Visible only on mobile <lg) */}
        <div className="flex items-center gap-3">
          <Link
            href="/parent/dashboard"
            className="flex lg:hidden items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#b1f2be]/60 flex items-center justify-center text-[#00652c] shadow-xs">
              <span className="material-symbols-outlined text-[20px]">eco</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-sm font-bold text-[#00652c] leading-tight">
                TumbuhKu
              </span>
              <span className="text-[9px] text-[#4b5a53] leading-none">
                Orang Tua
              </span>
            </div>
          </Link>
        </div>

        {/* Center Section: Search Bar (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center flex-1 max-w-xs md:max-w-md mx-2">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6f7a6e] text-[18px]">
              search
            </span>
            <input
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#f8f9ff] border border-[#e2ebe5] rounded-xl text-xs text-[#0b1c30] placeholder:text-[#6f7a6e] focus:outline-none focus:ring-2 focus:ring-[#15803d]"
              placeholder="Cari data anak, jadwal, posyandu..."
              type="text"
            />
          </div>
        </div>

        {/* Right Info & Widgets */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          {/* Real-time Calendar Widget with Popover Datepicker */}
          <HeaderCalendarWidget />

          {/* Notification Bell Widget with Dropdown & Red Badge */}
          <HeaderNotificationWidget announcementHref="/parent/pengumuman" />

          {/* User Profile Avatar Link */}
          <Link
            href="/parent/profil"
            className="w-8 h-8 rounded-full bg-[#15803d] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-xs"
            title="Profil Akun"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
