import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  affix?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, affix, type = "text", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-[#0b1c30]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            type={type}
            ref={ref}
            className={cn(
              "w-full h-11 px-3.5 bg-white rounded-xl border border-[#cbd5e1] text-base sm:text-xs text-[#0f172a] placeholder:text-[#94a3b8] transition-all focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 disabled:bg-[#f1f5f9] disabled:cursor-not-allowed",
              affix && "pr-14",
              error && "border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/20",
              className
            )}
            {...props}
          />
          {affix && (
            <span className="absolute right-0 top-0 bottom-0 px-3 flex items-center text-xs font-medium text-[#64748b] bg-[#f8fafc] border-l border-[#e2ebe5] rounded-r-[10px]">
              {affix}
            </span>
          )}
        </div>
        {error && <span className="text-xs text-[#ba1a1a] font-medium">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

