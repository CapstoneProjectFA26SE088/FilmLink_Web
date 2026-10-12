import type React from "react"
import { cn } from "@/lib/utils"

export interface SectionBadgeProps {
  children: React.ReactNode
  className?: string
  dot?: boolean
  variant?: "coral" | "dark" | "outline"
}

export function SectionBadge({
  children,
  className,
  dot = true,
  variant = "coral",
}: SectionBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider uppercase transition-colors",
        variant === "coral" &&
          "bg-rose-50 text-rose-600 border border-rose-200/60 shadow-xs",
        variant === "dark" &&
          "bg-zinc-800/80 text-rose-400 border border-zinc-700/60",
        variant === "outline" &&
          "bg-transparent text-rose-600 border border-rose-300",
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full animate-pulse",
            variant === "dark" ? "bg-rose-400" : "bg-rose-500"
          )}
        />
      )}
      <span>{children}</span>
    </div>
  )
}
