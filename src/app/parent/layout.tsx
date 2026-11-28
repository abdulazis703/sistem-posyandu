"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase";
import { ParentSidebar } from "@/components/common/ParentSidebar";
import { ParentHeader } from "@/components/common/ParentHeader";
import { ParentBottomBar } from "@/components/common/ParentBottomBar";
import { PageTransition } from "@/components/ui/PageTransition";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isRoleMismatch, setIsRoleMismatch] = useState(false);

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((user) => {
        if (!mounted) return;
        if (user && user.role !== "parent") {
          setIsRoleMismatch(true);
          router.replace("/staff/dashboard");
          return;
        }
        setAuthChecked(true);
      })
      .catch(() => {
        if (mounted) setAuthChecked(true);
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  if (!authChecked || isRoleMismatch) {
    return (
      <div className="min-h-dvh bg-slate-50 flex items-center justify-center p-4 text-xs text-[#6f7a6e]">
        {isRoleMismatch ? "Mengalihkan ke portal Petugas..." : "Memverifikasi akses akun..."}
      </div>
    );
  }

  return (
    <div
      style={{ "--sidebar-width": sidebarCollapsed ? "5rem" : "16rem" } as React.CSSProperties}
      className="min-h-dvh bg-slate-50 overflow-x-hidden"
    >
      {/* Desktop Sidebar (hidden on mobile <lg) */}
      <Suspense fallback={<div className="hidden lg:block w-64 h-dvh bg-white fixed left-0 top-0" />}>
        <ParentSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
      </Suspense>

      {/* Main Content Area — lebar kiri menyesuaikan sidebar */}
      <div className="ml-0 lg:ml-[var(--sidebar-width,16rem)] transition-[margin-left] duration-200 ease-out min-w-0">
        {/* App Header */}
        <Suspense fallback={<div className="h-[calc(4rem+env(safe-area-inset-top))] bg-white border-b border-[#e2ebe5]" />}>
          <ParentHeader onSearch={(q) => setSearch(q)} />
        </Suspense>

        {/* Content */}
        <main className="w-full pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-8 min-h-dvh">
          <Suspense fallback={<div className="p-8 text-xs text-[#6f7a6e]">Memuat halaman...</div>}>
            <PageTransition>{children}</PageTransition>
          </Suspense>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <Suspense fallback={null}>
        <ParentBottomBar />
      </Suspense>
    </div>
  );
}
