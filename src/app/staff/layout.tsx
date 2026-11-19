"use client";

import React, { useState, Suspense } from "react";
import { StaffSidebar } from "@/components/common/StaffSidebar";
import { StaffHeader } from "@/components/common/StaffHeader";
import { StaffBottomBar } from "@/components/common/StaffBottomBar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      style={{ "--sidebar-width": sidebarCollapsed ? "68px" : "260px" } as React.CSSProperties}
      className="min-h-dvh bg-slate-50 overflow-x-hidden"
    >
      {/* Desktop Sidebar (hidden on mobile <lg) */}
      <Suspense fallback={<div className="hidden lg:block w-[260px] h-dvh bg-white fixed left-0 top-0" />}>
        <StaffSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
      </Suspense>

      {/* Main Content Area — lebar kiri menyesuaikan sidebar */}
      <div className="pl-0 lg:pl-[var(--sidebar-width,260px)] transition-[padding-left] duration-300">
        {/* App Header */}
        <Suspense fallback={<div className="h-[calc(4rem+env(safe-area-inset-top))] bg-white border-b border-[#e2ebe5]" />}>
          <StaffHeader onSearch={(q) => setSearchQuery(q)} />
        </Suspense>

        {/* Content */}
        <main className="w-full pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-8 min-h-dvh">
          <Suspense fallback={<div className="p-8 text-xs text-[#6f7a6e]">Memuat halaman...</div>}>
            {children}
          </Suspense>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <Suspense fallback={null}>
        <StaffBottomBar />
      </Suspense>
    </div>
  );
}
