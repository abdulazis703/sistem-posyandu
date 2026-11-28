"use client";

import React from "react";
import Link from "next/link";
import { HeaderCalendarWidget } from "./HeaderCalendarWidget";
import { HeaderNotificationWidget } from "./HeaderNotificationWidget";
import { HeaderRealtimeSearch } from "./HeaderRealtimeSearch";

interface ParentHeaderProps {
  onSearch?: (q: string) => void;
}

export function ParentHeader({ onSearch }: ParentHeaderProps) {
  return (
    <header className="fixed top-0 left-0 lg:left-[var(--sidebar-width,16rem)] right-0 h-[calc(4rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] bg-white/90 backdrop-blur-xl border-b border-[#e2ebe5] shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center transition-[left] duration-200 ease-out">
      <div className="w-full px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left Section: Mobile Branding Logo (Visible only on mobile <lg) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/parent/dashboard"
            className="flex lg:hidden items-center gap-2 group"
            title="TumbuhKu Orang Tua"
          >
            <div className="w-8 h-8 rounded-xl bg-[#b1f2be]/60 flex items-center justify-center text-[#00652c] shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[20px]">eco</span>
            </div>
            <div className="hidden xs:flex flex-col">
              <span className="font-heading text-sm font-bold text-[#00652c] leading-tight truncate">
                TumbuhKu
              </span>
              <span className="text-[9px] text-[#4b5a53] leading-none truncate">
                Orang Tua
              </span>
            </div>
          </Link>
        </div>

        {/* Center Section: Real-time Interactive Search Bar */}
        <HeaderRealtimeSearch
          role="parent"
          placeholder="Cari data balita saya, jadwal posyandu..."
          onSearch={onSearch}
        />

        {/* Right Info & Widgets */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
          {/* Real-time Calendar Widget with Popover Datepicker */}
          <HeaderCalendarWidget />

          {/* Notification Bell Widget with Dropdown & Red Badge */}
          <HeaderNotificationWidget announcementHref="/parent/pengumuman" />

          {/* User Profile Avatar Link */}
          <Link
            href="/parent/profil"
            className="w-8 h-8 rounded-full bg-[#15803d] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-xs shrink-0"
            title="Profil Akun"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
