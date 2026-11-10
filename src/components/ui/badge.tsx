import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "normal" | "warning" | "danger" | "neutral" | "brand" | "info";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "normal",
  dot = true,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    normal: "bg-emerald-100 text-emerald-800 border-emerald-200/70",
    warning: "bg-amber-100 text-amber-800 border-amber-200/70",
    danger: "bg-rose-100 text-rose-800 border-rose-200/70",
    neutral: "bg-slate-100 text-slate-700 border-slate-200/70",
    brand: "bg-emerald-50 text-emerald-800 border-emerald-200/70",
    info: "bg-sky-100 text-sky-800 border-sky-200/70",
  };

  const dots = {
    normal: "bg-emerald-600",
    warning: "bg-amber-600",
    danger: "bg-rose-600",
    neutral: "bg-slate-500",
    brand: "bg-emerald-600",
    info: "bg-sky-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border tracking-normal",
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dots[variant])} />}
      {children}
    </span>
  );
}

// Helper function untuk render status stunting balita dengan badge seragam
export function StuntingBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s.includes("sangat pendek") || s.includes("severely")) {
    return <Badge variant="danger">{status}</Badge>;
  }
  if (s.includes("pendek") || s.includes("stunted") || s.includes("risiko")) {
    return <Badge variant="warning">{status}</Badge>;
  }
  if (s.includes("normal") || s.includes("gizi baik")) {
    return <Badge variant="normal">{status}</Badge>;
  }
  return <Badge variant="neutral">{status}</Badge>;
}
