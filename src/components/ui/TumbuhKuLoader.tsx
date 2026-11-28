"use client";

import React, { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

interface TumbuhKuLoaderProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

const emptySubscribe = () => () => {};

export function TumbuhKuLoader({
  message = "Menyiapkan Ruang TumbuhKu...",
  subMessage = "Memuat data Posyandu & KMS Digital...",
  fullScreen = true,
}: TumbuhKuLoaderProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const loaderContent = (
    <div
      role="status"
      aria-live="polite"
      className={
        fullScreen
          ? "fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center"
          : "w-full min-h-[320px] bg-white/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center px-4 py-8 text-center"
      }
    >
      {/* Orbit Ganda Emerald-Mint & Tunas TumbuhKu */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0 overflow-visible">
        {/* Soft Breathing Aura */}
        <div className="absolute inset-1 rounded-full bg-emerald-100/70 animate-tumbuhku-breathe" />

        {/* Outer Orbit Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-200/70 border-t-emerald-600 border-r-emerald-500 animate-tumbuhku-orbit" />

        {/* Inner Orbit Ring */}
        <div className="absolute inset-3 rounded-full border-2 border-emerald-100 border-b-emerald-500 animate-tumbuhku-orbit-reverse" />

        {/* Center TumbuhKu Sprout Icon */}
        <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs flex items-center justify-center text-emerald-700 animate-tumbuhku-breathe">
          <span className="material-symbols-outlined text-[28px] sm:text-[30px]">eco</span>
        </div>
      </div>

      {/* Mini Growth Curve SVG Animation */}
      <div className="w-36 sm:w-40 h-9 mt-5 shrink-0 overflow-visible">
        <svg
          viewBox="0 0 160 36"
          fill="none"
          className="w-full h-full overflow-visible"
          aria-hidden="true"
        >
          <path
            d="M6 30 Q 46 28, 76 19 T 154 6"
            stroke="#d1fae5"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M6 30 Q 46 28, 76 19 T 154 6"
            stroke="#059669"
            strokeWidth="3"
            strokeLinecap="round"
            className="animate-tumbuhku-curve"
          />
          <circle cx="154" cy="6" r="3.5" fill="#10b981" className="animate-pulse" />
        </svg>
      </div>

      {/* Status Text */}
      <div className="mt-3 text-center space-y-1 max-w-xs sm:max-w-sm px-2">
        <p className="font-heading text-sm sm:text-base font-bold text-slate-900">
          {message}
        </p>
        <p className="text-xs text-slate-500 leading-relaxed">{subMessage}</p>
      </div>
    </div>
  );

  if (fullScreen && isClient) {
    return createPortal(loaderContent, document.body);
  }

  return loaderContent;
}

