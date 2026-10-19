import type React from "react"
import { cn } from "@/lib/utils"

export interface AuthCardProps {
  children: React.ReactNode
  className?: string
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center py-12 px-4 sm:px-6 bg-[#F8F9FA]">
      <div
        className={cn(
          "w-full max-w-[440px] rounded-3xl bg-white p-7 sm:p-9 shadow-xl shadow-zinc-200/60 border border-zinc-100/90 transition-all duration-300",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
