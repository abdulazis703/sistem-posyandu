"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          "relative w-full bg-white rounded-[16px] shadow-2xl border border-[#e2ebe5] overflow-hidden z-10 transition-all",
          maxWidths[maxWidth]
        )}
      >
        {(title || description) && (
          <div className="px-6 py-5 border-b border-[#f1f5f9] flex items-start justify-between">
            <div>
              {title && (
                <h3 className="font-heading text-lg font-bold text-[#0b1c30]">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-[#64748b] mt-0.5">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-[#94a3b8] hover:text-[#0b1c30] p-1 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

