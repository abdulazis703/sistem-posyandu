"use client";

import React, { useState, Suspense } from "react";
import { ParentSidebar } from "@/components/common/ParentSidebar";
import { ParentHeader } from "@/components/common/ParentHeader";
import { ParentBottomBar } from "@/components/common/ParentBottomBar";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      style={{ "--sidebar-width": sidebarCollapsed ? "68px" : "260px" } as React.CSSProperties}
      className="min-h-screen bg-slate-50"
    >
      {/* Desktop Sidebar (hidden on mobile <lg) */}
      <Suspense fallback={<div className="hidden lg:block w-[260px] h-screen bg-white fixed left-0 top-0" />}>
        <ParentSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
      </Suspense>

      {/* Main Content Area — lebar kiri menyesuaikan sidebar */}
      <div className="pl-0 lg:pl-[var(--sidebar-width,260px)] transition-[padding-left] duration-300">
        {/* App Header */}
        <Suspense fallback={<div className="h-16 bg-white border-b border-[#e2ebe5]" />}>
          <ParentHeader onSearch={(q) => setSearch(q)} />
        </Suspense>

        {/* Content */}
        <main className="w-full pt-16 pb-24 lg:pb-8 min-h-screen">
          <Suspense fallback={<div className="p-8 text-xs text-[#6f7a6e]">Memuat halaman...</div>}>
            {children}
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
