"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: "schedule" | "exam" | "warning" | "info";
  tabParam?: string;
  defaultPath?: string;
}

interface HeaderNotificationWidgetProps {
  announcementHref?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Jadwal Posyandu Baru Diumumkan",
    description: "Sesi penimbangan rutin & vitamin A dijadwalkan Kamis, 14 Nov di Balai RW 04.",
    time: "10 menit lalu",
    unread: true,
    type: "schedule",
    tabParam: "jadwal-posyandu",
  },
  {
    id: "notif-2",
    title: "Pemeriksaan Balita Divalidasi",
    description: "Hasil pengukuran antropometri Rayhan Al-Ghifari telah disahkan oleh Bidan.",
    time: "1 jam lalu",
    unread: true,
    type: "exam",
    defaultPath: "/parent/riwayat",
  },
  {
    id: "notif-3",
    title: "Atensi Klinis Risiko Stunting",
    description: "Terdapat balita dalam pemantauan memerlukan evaluasi PMT 90 hari.",
    time: "3 jam lalu",
    unread: true,
    type: "warning",
    defaultPath: "/staff/monitoring",
  },
  {
    id: "notif-4",
    title: "Pekan Imunisasi Polio Tambahan",
    description: "Pelaksanaan putaran kedua PIN Polio telah dibuka di 4 pos layanan.",
    time: "1 hari lalu",
    unread: false,
    type: "info",
    tabParam: "jadwal-imunisasi",
  },
];

export function HeaderNotificationWidget({
  announcementHref = "/parent/pengumuman",
}: HeaderNotificationWidgetProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const isStaffArea = announcementHref.startsWith("/staff");

  // Close popover when clicked outside
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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markItemAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  // Pastikan rute tujuan selalu merupakan rute internal dashboard yang memiliki Sidebar
  const resolveTargetUrl = (item: NotificationItem): string => {
    if (item.tabParam) {
      // Mengarah ke halaman Pengumuman ber-Sidebar sesuai konteks peran (Staff atau Parent)
      return `${announcementHref}?tab=${item.tabParam}`;
    }

    if (item.id === "notif-2") {
      // Pemeriksaan divalidasi: Orang Tua -> Riwayat, Petugas -> Data Balita
      return isStaffArea ? "/staff/balita" : "/parent/riwayat";
    }

    if (item.id === "notif-3") {
      // Atensi stunting: Petugas -> Monitoring Tindak Lanjut, Orang Tua -> Grafik Pertumbuhan
      return isStaffArea ? "/staff/monitoring" : "/parent/grafik";
    }

    return announcementHref;
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // 1. Otomatis ubah status notifikasi menjadi dibaca
    markItemAsRead(item.id);
    // 2. Tutup popover notifikasi secara otomatis
    setIsOpen(false);
    // 3. Navigasikan ke rute internal dashboard yang memiliki Sidebar
    const targetUrl = resolveTargetUrl(item);
    router.push(targetUrl);
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "schedule":
        return <span className="material-symbols-outlined text-[18px] text-[#15803d]">event</span>;
      case "exam":
        return <span className="material-symbols-outlined text-[18px] text-[#00652c]">verified</span>;
      case "warning":
        return <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">warning</span>;
      default:
        return <span className="material-symbols-outlined text-[18px] text-[#2e6a41]">notifications</span>;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-[#3f493f] hover:text-[#0b1c30] hover:bg-[#eff4ff] transition-colors cursor-pointer select-none"
        title="Notifikasi Sistem"
        aria-label="Buka notifikasi"
      >
        <span className="material-symbols-outlined text-[22px]">notifications</span>

        {/* Dynamic Red Badge if unread exists */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {/* Notification Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#e2ebe5] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-[#f1f5f9] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-sm font-bold text-[#0b1c30]">Notifikasi</h3>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold">
                  {unreadCount} Baru
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#6f7a6e] text-[10px] font-medium">
                  Semua Dibaca
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-[#15803d] hover:underline cursor-pointer"
              >
                Tandai Semua Dibaca
              </button>
            )}
          </div>

          {/* Notification Items List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#f1f5f9]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#6f7a6e]">
                Belum ada notifikasi baru.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-[#f0fdf4] group ${
                    item.unread ? "bg-[#ecfdf3]/50" : "bg-white"
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleNotificationClick(item);
                    }
                  }}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#e2ebe5] shadow-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[#15803d]/40 transition-colors">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-bold truncate transition-colors ${item.unread ? "text-[#0b1c30] group-hover:text-[#15803d]" : "text-[#4b5a53] group-hover:text-[#0b1c30]"}`}>
                        {item.title}
                      </p>
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-[#15803d] shrink-0" title="Belum dibaca" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#6f7a6e] leading-snug mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-[#94a3b8]">
                        {item.time}
                      </span>
                      <span className="text-[10px] text-[#15803d] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                        Buka Dashboard
                        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#f8f9ff] border-t border-[#e2ebe5] text-center">
            <Link
              href={announcementHref}
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-[#15803d] hover:underline inline-flex items-center gap-1"
            >
              <span>Buka Seluruh Pengumuman di Dashboard</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
