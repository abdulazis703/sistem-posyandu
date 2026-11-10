"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const parentNavItems = [
  { href: "/parent/dashboard", label: "Dashboard", icon: "grid_view" },
  { href: "/parent/grafik", label: "Balita Saya", icon: "child_care" },
  { href: "/parent/grafik", label: "Grafik Pertumbuhan", icon: "monitoring" },
  { href: "/parent/riwayat", label: "Riwayat Pemeriksaan", icon: "clinical_notes" },
  { href: "/parent/pengumuman", label: "Pengumuman & Jadwal", icon: "event_available" },
  { href: "/parent/profil", label: "Profil", icon: "manage_accounts" },
];

export function ParentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[260px] bg-white text-[#0b1c30] z-50 flex-col justify-between border-r border-[#e2ebe5] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-[#f1f5f9]">
          <div className="w-9 h-9 rounded-xl bg-[#b1f2be]/50 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#00652c] text-[24px]">eco</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold text-[#00652c] leading-tight">
              TumbuhKu
            </span>
            <span className="text-[11px] text-[#4b5a53] leading-none mt-0.5">
              Posyandu Digital
            </span>
          </div>
        </div>

        {/* Section Title */}
        <div className="px-5 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6f7a6e]">
            Menu Utama
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-3">
          {parentNavItems.map((item, idx) => {
            const isActive =
              pathname === item.href && (idx !== 2 || pathname === "/parent/grafik");

            return (
              <Link
                key={idx}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-[#b1f2be]/40 text-[#00652c] font-semibold"
                    : "text-[#4b5a53] hover:bg-[#eff4ff] hover:text-[#0b1c30]"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-[20px]",
                    isActive ? "text-[#00652c]" : "text-[#6f7a6e]"
                  )}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Parent Profile Card */}
      <div className="p-3 m-3 rounded-xl bg-[#eff4ff] border border-[#becabc]/30">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-full bg-[#b1f2be] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#12512c] text-[20px]">
              face_3
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-[#0b1c30] truncate">
              Sari Rahmawati
            </span>
            <span className="text-[11px] text-[#4b5a53] truncate">Orang Tua / Wali</span>
          </div>
        </div>
        <div className="pt-1 flex items-center justify-between border-t border-[#becabc]/20">
          <span className="inline-flex items-center gap-1 text-[11px] bg-[#b1f2be]/40 text-[#00652c] px-2 py-0.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00652c]"></span>
            Akun Orang Tua
          </span>
          <Link
            href="/login"
            className="text-[#4b5a53] hover:text-[#ba1a1a] transition-colors"
            title="Keluar"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

