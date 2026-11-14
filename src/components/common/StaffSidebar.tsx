"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const staffNavItems = [
  { href: "/staff/dashboard", label: "Dashboard", icon: "space_dashboard" },
  { href: "/staff/balita", label: "Data Balita", icon: "child_care" },
  { href: "/staff/orang-tua", label: "Akun Orang Tua", icon: "group" },
  { href: "/staff/pemeriksaan", label: "Pemeriksaan", icon: "assignment" },
  { href: "/staff/monitoring", label: "Monitoring", icon: "monitoring" },
  { href: "/staff/ringkasan", label: "Posyandu & Wilayah", icon: "location_city" },
  { href: "/staff/laporan", label: "Laporan", icon: "bar_chart" },
  { href: "/staff/pengumuman", label: "Pengumuman & Jadwal", icon: "event_available" },
  { href: "/staff/profil", label: "Profil", icon: "account_circle" },
];

export function StaffSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.warn("Staff logout error:", e);
    } finally {
      router.push("/login");
    }
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[260px] bg-white z-50 flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#e2ebe5]">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#15803d] flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[24px]">potted_plant</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold text-[#00652c] leading-tight">
              TumbuhKu
            </span>
            <span className="text-[11px] text-[#3f493f] font-medium">
              Portal Petugas & Kader
            </span>
          </div>
        </div>

        {/* Section title */}
        <div className="px-4 mb-2">
          <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#6f7a6e]">
            Menu Navigasi
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3">
          {staffNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/staff/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-semibold transition-all",
                  isActive
                    ? "bg-[#15803d] text-white shadow-sm"
                    : "text-[#3f493f] hover:bg-[#eff4ff] hover:text-[#0b1c30]"
                )}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Staff profile bar */}
      <div className="p-3 bg-[#eff4ff] m-3 rounded-xl flex items-center justify-between border border-[#becabc]/30">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-[#2e6a41] flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-[20px]">local_hospital</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[#0b1c30] truncate">
              Bidan Sri Wahyuni, A.Md.Keb
            </span>
            <span className="text-[11px] text-[#6f7a6e] truncate">Petugas Pembina</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="p-1.5 text-[#6f7a6e] hover:text-[#ba1a1a] transition-colors rounded-lg cursor-pointer"
          title="Keluar"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
    </aside>
  );
}
