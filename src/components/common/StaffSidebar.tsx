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
  const router = useRouter();
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

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.warn("Staff logout error:", e);
    } finally {
      router.push("/login");
    }
  };

  const sidebarW = collapsed ? 68 : 260;

  return (
    <>
      {/* Sidebar */}
      <aside
        style={{ width: sidebarW }}
        className="hidden lg:flex fixed left-0 top-0 h-dvh bg-white z-50 flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#e2ebe5] transition-[width] duration-300 overflow-hidden"
      >
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* Brand Header */}
          <div
            className={cn(
              "flex items-center gap-3 border-b border-[#f1f5f9]",
              collapsed ? "px-3 py-5 justify-center" : "px-6 py-5"
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-[#15803d] flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">potted_plant</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-heading text-lg font-bold text-[#00652c] leading-tight truncate">
                  TumbuhKu
                </span>
                <span className="text-[11px] text-[#3f493f] font-medium truncate">
                  Portal Petugas & Kader
                </span>
              </div>
            )}
          </div>

          {/* Section title */}
          {!collapsed ? (
            <div className="px-4 mt-4 mb-2">
              <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#6f7a6e]">
                Menu Navigasi
              </span>
            </div>
          ) : (
            <div className="mt-3" />
          )}

          {/* Navigation */}
          <nav className="flex flex-col gap-1 px-2">
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
                    "flex items-center gap-3 rounded-lg text-[13px] font-semibold transition-all",
                    collapsed ? "py-2.5 justify-center" : "px-3.5 py-2.5",
                    isActive
                      ? "bg-[#22c55e] text-white shadow-sm"
                      : "text-[#3f493f] hover:bg-[#dcfce7] hover:text-[#166534]"
                  )}
                >
                  <span className="material-symbols-outlined text-[20px] shrink-0">
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Staff profile bar */}
        {!collapsed ? (
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
              className="p-1.5 text-[#6f7a6e] hover:text-[#ba1a1a] transition-colors rounded-lg cursor-pointer shrink-0"
              title="Keluar"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center pb-4 px-2">
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-[#6f7a6e] hover:text-[#ba1a1a] transition-colors rounded-lg cursor-pointer"
              title="Keluar"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Toggle Button — menempel di tepi kanan sidebar */}
      <button
        type="button"
        onClick={handleToggle}
        title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
        style={{
          left: sidebarW,
          transition: "left 0.3s",
        }}
        className="hidden lg:flex fixed top-1/2 -translate-y-1/2 z-[60] items-center justify-center w-5 h-10 rounded-r-lg bg-white border border-l-0 border-[#e2ebe5] shadow-md text-[#6f7a6e] hover:text-[#166534] hover:bg-[#dcfce7] transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]">
          {collapsed ? "chevron_right" : "chevron_left"}
        </span>
      </button>
    </>
  );
}
