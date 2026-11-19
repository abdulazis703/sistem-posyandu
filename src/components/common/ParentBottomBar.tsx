"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const parentBottomNavItems: NavItem[] = [
  { href: "/parent/dashboard", label: "Dashboard", icon: "grid_view" },
  { href: "/parent/grafik", label: "Pertumbuhan", icon: "monitoring" },
  { href: "/parent/riwayat", label: "Riwayat", icon: "clinical_notes" },
  { href: "/parent/pengumuman", label: "Jadwal", icon: "event_available" },
  { href: "/parent/profil", label: "Profil", icon: "account_circle" },
];

export function ParentBottomBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi Bawah Orang Tua"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-[#e2ebe5] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center">
        {parentBottomNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/parent/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-h-[44px] py-1 px-1 rounded-xl transition-all relative group touch-manipulation select-none",
                isActive
                  ? "text-[#15803d] font-bold"
                  : "text-[#6f7a6e] hover:text-[#0b1c30] font-medium"
              )}
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 bg-[#15803d] rounded-full animate-in fade-in zoom-in-75 duration-200" />
              )}

              <div
                className={cn(
                  "w-9 h-7 rounded-lg flex items-center justify-center transition-colors",
                  isActive ? "bg-[#dcfce7]/60" : "group-hover:bg-[#f1f5f9]"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-[22px] transition-transform",
                    isActive ? "scale-105 text-[#15803d]" : "text-[#6f7a6e]"
                  )}
                >
                  {item.icon}
                </span>
              </div>

              <span className="text-[10px] leading-tight mt-0.5 tracking-tight truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
