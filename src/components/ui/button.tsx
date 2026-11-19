import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none rounded-xl cursor-pointer select-none";

    const variants = {
      primary:
        "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs focus:ring-emerald-500",
      secondary:
        "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 focus:ring-emerald-600",
      outline:
        "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-slate-300 shadow-xs focus:ring-slate-400",
      danger:
        "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 focus:ring-rose-500",
      ghost:
        "bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-400",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs h-8 gap-1.5 rounded-lg",
      md: "px-4 py-2 text-sm h-10 gap-2 rounded-xl",
      lg: "px-5 py-2.5 text-base h-12 gap-2.5 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
