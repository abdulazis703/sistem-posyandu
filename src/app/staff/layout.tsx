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
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar (hidden on mobile <lg) */}
      <Suspense fallback={<div className="hidden lg:block w-[260px] h-screen bg-white fixed left-0 top-0" />}>
        <StaffSidebar />
      </Suspense>

      {/* Main Content Area */}
      <div className="pl-0 lg:pl-[260px] transition-[padding] duration-200">
        {/* App Header (Full-width on mobile, offset on desktop) */}
        <Suspense fallback={<div className="h-16 bg-white border-b border-[#e2ebe5]" />}>
          <StaffHeader onSearch={(q) => setSearchQuery(q)} />
        </Suspense>

        {/* Content with bottom padding on mobile to clear bottom bar */}
        <main className="w-full pt-16 pb-24 lg:pb-8 min-h-screen">
          <Suspense fallback={<div className="p-8 text-xs text-[#6f7a6e]">Memuat halaman...</div>}>
            {children}
          </Suspense>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (visible only on mobile <lg) */}
      <Suspense fallback={null}>
        <StaffBottomBar />
      </Suspense>
    </div>
  );
}
