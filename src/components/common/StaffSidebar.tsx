"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const staffNavItems = [
  { href: "/staff/dashboard", label: "Dashboard", icon: "home", useHomeIcon: true },
  { href: "/staff/balita", label: "Data Balita", icon: "child_care" },
  { href: "/staff/orang-tua", label: "Akun Orang Tua", icon: "group" },
  { href: "/staff/pemeriksaan", label: "Pemeriksaan", icon: "assignment" },
  { href: "/staff/monitoring", label: "Monitoring", icon: "monitoring" },
  { href: "/staff/laporan", label: "Laporan", icon: "bar_chart" },
  { href: "/staff/pengumuman", label: "Pengumuman & Jadwal", icon: "event_available" },
  { href: "/staff/profil", label: "Profil", icon: "account_circle" },
];

interface StaffSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function StaffSidebar({ collapsed: controlledCollapsed, onToggle }: StaffSidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = React.useState(false);

  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex fixed left-0 top-0 h-dvh bg-white z-50 flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#e2ebe5] transition-[width] duration-200 ease-out overflow-hidden shrink-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-[22px] border-b border-[#f1f5f9] shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#15803d] flex items-center justify-center text-white shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[22px]">potted_plant</span>
          </div>
          <div
            aria-hidden={collapsed}
            className={cn(
              "flex flex-col min-w-0 whitespace-nowrap overflow-hidden transition-opacity duration-150",
              collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
          >
            <span className="font-heading text-lg font-bold text-[#00652c] leading-tight whitespace-nowrap overflow-hidden">
              TumbuhKu
            </span>
            <span className="text-[11px] text-[#3f493f] font-medium whitespace-nowrap overflow-hidden">
              Portal Petugas &amp; Kader
            </span>
          </div>
        </div>

        {/* Hamburger Toggle & MENU UTAMA tepat di atas Dashboard */}
        <div className="px-3 pt-3 pb-1">
          <button
            type="button"
            onClick={handleToggle}
            title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
            aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
            className="flex items-center gap-3 w-full px-[18px] py-2 rounded-xl text-[#4b5a53] hover:bg-[#dcfce7] hover:text-[#166534] transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5 shrink-0" />
            <span
              aria-hidden={collapsed}
              className={cn(
                "text-[11px] font-semibold uppercase tracking-wider text-[#6f7a6e] whitespace-nowrap overflow-hidden transition-opacity duration-150",
                collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
            >
              MENU UTAMA
            </span>
          </button>
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
                title={collapsed ? item.label : undefined}
                className={cn(
                  "group flex items-center gap-3 px-[18px] py-2.5 rounded-xl text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-[#22c55e]/30 text-[#166534] font-semibold"
                    : "text-[#4b5a53] hover:bg-[#dcfce7] hover:text-[#166534]"
                )}
              >
                {item.useHomeIcon ? (
                  <Home
                    className={cn(
                      "w-5 h-5 shrink-0 transition-colors",
                      isActive ? "text-[#166534]" : "text-[#6f7a6e] group-hover:text-[#166534]"
                    )}
                  />
                ) : (
                  <span
                    className={cn(
                      "material-symbols-outlined text-[20px] shrink-0 transition-colors",
                      isActive ? "text-[#166534]" : "text-[#6f7a6e] group-hover:text-[#166534]"
                    )}
                  >
                    {item.icon}
                  </span>
                )}
                <span
                  aria-hidden={collapsed}
                  className={cn(
                    "whitespace-nowrap overflow-hidden transition-opacity duration-150",
                    collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Staff profile summary only (Tanpa tombol Logout) */}
      <div
        className={cn(
          "m-3 p-2.5 rounded-xl flex items-center gap-2.5 transition-colors duration-200 border",
          collapsed
            ? "bg-transparent border-transparent"
            : "bg-[#eff4ff] border-[#becabc]/30"
        )}
        title={collapsed ? "Bidan Sri Wahyuni, A.Md.Keb" : undefined}
      >
        <div className="w-9 h-9 rounded-full bg-[#2e6a41] flex items-center justify-center text-white shrink-0">
          <span className="material-symbols-outlined text-[20px]">local_hospital</span>
        </div>
        <div
          aria-hidden={collapsed}
          className={cn(
            "flex flex-col min-w-0 whitespace-nowrap overflow-hidden transition-opacity duration-150",
            collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <span className="text-xs font-bold text-[#0b1c30] whitespace-nowrap overflow-hidden">
            Bidan Sri Wahyuni, A.Md.Keb
          </span>
          <span className="text-[11px] text-[#6f7a6e] whitespace-nowrap overflow-hidden">
            Petugas Pembina
          </span>
        </div>
      </div>
    </aside>
  );
}
