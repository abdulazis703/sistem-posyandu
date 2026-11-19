"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, signOut, UserProfile } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const parentNavItems = [
  { href: "/parent/dashboard", label: "Dashboard", icon: "grid_view", key: "dashboard" },
  { href: "/parent/grafik", label: "Balita Saya", icon: "child_care", key: "balita-saya" },
  { href: "/parent/riwayat", label: "Riwayat Pemeriksaan", icon: "clinical_notes", key: "riwayat" },
  { href: "/parent/pengumuman", label: "Pengumuman & Jadwal", icon: "event_available", key: "pengumuman" },
  { href: "/parent/profil", label: "Profil", icon: "manage_accounts", key: "profil" },
];

interface ParentSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function ParentSidebar({ collapsed: controlledCollapsed, onToggle }: ParentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    getCurrentUser().then((user) => setCurrentUser(user));
  }, []);

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
      console.warn("Logout error:", e);
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
        className="hidden lg:flex fixed left-0 top-0 h-dvh bg-white text-[#0b1c30] z-50 flex-col justify-between border-r border-[#e2ebe5] shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-[width] duration-300 overflow-hidden"
      >
        <div className="flex flex-col overflow-x-hidden">
          {/* Brand Header */}
          <div
            className={cn(
              "h-16 flex items-center gap-3 border-b border-[#f1f5f9]",
              collapsed ? "px-3 justify-center" : "px-5"
            )}
          >
            <div className="w-9 h-9 rounded-xl bg-[#b1f2be]/50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#00652c] text-[24px]">eco</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-heading text-lg font-bold text-[#00652c] leading-tight truncate">
                  TumbuhKu
                </span>
                <span className="text-[11px] text-[#4b5a53] leading-none mt-0.5 truncate">
                  Posyandu Digital
                </span>
              </div>
            )}
          </div>

          {/* Section Title */}
          {!collapsed ? (
            <div className="px-5 py-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6f7a6e]">
                Menu Utama
              </span>
            </div>
          ) : (
            <div className="mt-3" />
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-2">
            {parentNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/parent/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl text-[13px] font-medium transition-colors",
                    collapsed ? "py-2.5 justify-center" : "px-3.5 py-2.5",
                    isActive
                      ? "bg-[#22c55e]/30 text-[#166534] font-semibold"
                      : "text-[#4b5a53] hover:bg-[#dcfce7] hover:text-[#166534]"
                  )}
                >
                  <span
                    className={cn(
                      "material-symbols-outlined text-[20px] shrink-0",
                      isActive ? "text-[#166534]" : "text-[#6f7a6e]"
                    )}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Parent Profile Card */}
        {!collapsed ? (
          <div className="p-3 m-3 rounded-xl bg-[#eff4ff] border border-[#becabc]/30">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-full bg-[#b1f2be] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#12512c] text-[20px]">
                  face_3
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#0b1c30] truncate">
                  {currentUser?.fullName || "Orang Tua"}
                </span>
                <span className="text-[11px] text-[#4b5a53] truncate">Orang Tua / Wali</span>
              </div>
            </div>
            <div className="pt-1 flex items-center justify-between border-t border-[#becabc]/20">
              <span className="inline-flex items-center gap-1 text-[11px] bg-[#b1f2be]/40 text-[#00652c] px-2 py-0.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00652c]"></span>
                Akun Orang Tua
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-[#4b5a53] hover:text-[#ba1a1a] transition-colors cursor-pointer"
                title="Keluar"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center pb-4 px-2">
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-[#4b5a53] hover:text-[#ba1a1a] transition-colors rounded-lg cursor-pointer"
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