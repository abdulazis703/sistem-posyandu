"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Home } from "lucide-react";
import { getCurrentUser, UserProfile } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const parentNavItems = [
  { href: "/parent/dashboard", label: "Dashboard", icon: "home", useHomeIcon: true, key: "dashboard" },
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

  return (
    <aside
      className={cn(
        "hidden lg:flex fixed left-0 top-0 h-dvh bg-white text-[#0b1c30] z-50 flex-col justify-between border-r border-[#e2ebe5] shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-[width] duration-200 ease-out overflow-hidden shrink-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-[22px] border-b border-[#f1f5f9] shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#b1f2be]/50 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#00652c] text-[24px]">eco</span>
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
            <span className="text-[11px] text-[#4b5a53] leading-none mt-0.5 whitespace-nowrap overflow-hidden">
              Posyandu Digital
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

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-3">
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
                  "flex items-center gap-3 px-[18px] py-2.5 rounded-xl text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-[#22c55e]/30 text-[#166534] font-semibold"
                    : "text-[#4b5a53] hover:bg-[#dcfce7] hover:text-[#166534]"
                )}
              >
                {item.useHomeIcon ? (
                  <Home
                    className={cn(
                      "w-5 h-5 shrink-0",
                      isActive ? "text-[#166534]" : "text-[#6f7a6e]"
                    )}
                  />
                ) : (
                  <span
                    className={cn(
                      "material-symbols-outlined text-[20px] shrink-0",
                      isActive ? "text-[#166534]" : "text-[#6f7a6e]"
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

      {/* Parent Profile Summary Only (Tanpa tombol Logout) */}
      <div
        className={cn(
          "m-3 p-2.5 rounded-xl flex items-center gap-2.5 transition-colors duration-200 border",
          collapsed
            ? "bg-transparent border-transparent"
            : "bg-[#eff4ff] border-[#becabc]/30"
        )}
        title={collapsed ? currentUser?.fullName || "Orang Tua" : undefined}
      >
        <div className="w-9 h-9 rounded-full bg-[#b1f2be] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[#12512c] text-[20px]">
            face_3
          </span>
        </div>
        <div
          aria-hidden={collapsed}
          className={cn(
            "flex flex-col min-w-0 whitespace-nowrap overflow-hidden transition-opacity duration-150",
            collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <span className="text-xs font-semibold text-[#0b1c30] whitespace-nowrap overflow-hidden">
            {currentUser?.fullName || "Orang Tua"}
          </span>
          <span className="text-[11px] text-[#4b5a53] whitespace-nowrap overflow-hidden">
            Orang Tua / Wali
          </span>
        </div>
      </div>
    </aside>
  );
}
