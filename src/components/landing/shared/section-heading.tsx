import { cn } from "@/lib/utils"
import { SectionBadge } from "./section-badge"

export interface SectionHeadingProps {
  badge?: string
  badgeVariant?: "coral" | "dark" | "outline"
  title: string
  subtitle?: string
  align?: "center" | "left"
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

export function SectionHeading({
  badge,
  badgeVariant = "coral",
  title,
  subtitle,
  align = "center",
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 max-w-3xl",
        align === "center" ? "mx-auto text-center items-center" : "text-left items-start",
        className
      )}
    >
      {badge && <SectionBadge variant={badgeVariant}>{badge}</SectionBadge>}

      <h2
        className={cn(
          "text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight",
          titleClassName
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "text-base sm:text-lg text-zinc-500 font-normal leading-relaxed max-w-2xl",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
