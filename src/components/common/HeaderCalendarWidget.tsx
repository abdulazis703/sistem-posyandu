"use client";

import React, { useState, useEffect, useRef } from "react";

export function HeaderCalendarWidget() {
  const [currentDate] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [displayDateStr] = useState<string>(() => formatIndonesianDate(new Date()));
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function formatIndonesianDate(date: Date) {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${day} ${monthName} ${year}`;
  }

  // Days generator for datepicker
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setViewMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewMonth(new Date(year, month + 1, 1));
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <div className="relative" ref={popoverRef}>
      {/* Calendar Trigger Button - Mobile Compact Icon */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex md:hidden p-2 rounded-xl text-[#3f493f] hover:text-[#0b1c30] hover:bg-[#eff4ff] transition-colors cursor-pointer select-none"
        title="Buka kalender"
        aria-label="Buka kalender"
      >
        <span className="material-symbols-outlined text-[20px] text-[#15803d]">calendar_month</span>
      </button>

      {/* Calendar Trigger Button - Desktop Full */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center gap-2 text-xs text-[#3f493f] bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#e2ebe5] hover:border-[#15803d]/40 px-3 py-1.5 rounded-xl font-medium transition-all shadow-xs cursor-pointer select-none group"
        title="Klik untuk buka kalender"
      >
        <span className="material-symbols-outlined text-[18px] text-[#15803d] group-hover:scale-110 transition-transform">
          calendar_today
        </span>
        <span className="font-semibold text-[#0b1c30]">
          {displayDateStr || "Memuat tanggal..."}
        </span>
        <span className="material-symbols-outlined text-[16px] text-[#6f7a6e] transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>
          expand_more
        </span>
      </button>

      {/* Datepicker Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#e2ebe5] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Month / Year controls */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#f1f5f9]">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 text-[#6f7a6e] hover:text-[#0b1c30] hover:bg-[#f8f9ff] rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <div className="font-heading text-xs font-bold text-[#0b1c30]">
              {monthNames[month]} {year}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 text-[#6f7a6e] hover:text-[#0b1c30] hover:bg-[#f8f9ff] rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-semibold text-[#6f7a6e]">
            <span>Min</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots for month start */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const dayNum = i + 1;
              const isToday =
                currentDate.getDate() === dayNum &&
                currentDate.getMonth() === month &&
                currentDate.getFullYear() === year;

              const isSelected =
                selectedDate.getDate() === dayNum &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  onClick={() => {
                    const picked = new Date(year, month, dayNum);
                    setSelectedDate(picked);
                    setDisplayDateStr(formatIndonesianDate(picked));
                    setIsOpen(false);
                  }}
                  className={`h-8 w-8 mx-auto rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#15803d] text-white font-bold shadow-xs"
                      : isToday
                      ? "bg-[#dcfce7] text-[#15803d] font-bold border border-[#86efac]"
                      : "text-[#0b1c30] hover:bg-[#eff4ff]"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Popover footer shortcut */}
          <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setSelectedDate(now);
                setViewMonth(new Date(now.getFullYear(), now.getMonth(), 1));
                setDisplayDateStr(formatIndonesianDate(now));
                setIsOpen(false);
              }}
              className="font-bold text-[#15803d] hover:underline"
            >
              Hari Ini
            </button>
            <span className="text-[#6f7a6e]">Pilih tanggal</span>
          </div>
        </div>
      )}
    </div>
  );
}

