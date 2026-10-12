import { Clock, Mail, MapPin, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { IFilmLab } from "@/types"

export interface LabCardProps {
  lab: IFilmLab
}

export function LabCard({ lab }: LabCardProps) {
  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:border-zinc-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex flex-col gap-3">
        {/* Header with Title and Rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-zinc-900 group-hover:text-rose-600 transition-colors">
              {lab.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
              <MapPin className="size-3.5 text-zinc-400 shrink-0" />
              <span>
                {lab.city}, {lab.country}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200/60 shrink-0">
            <Star className="size-3 fill-amber-500 text-amber-500" />
            <span>{lab.rating.toFixed(1)}</span>
            <span className="text-amber-600/70 text-[10px]">({lab.reviewCount})</span>
          </div>
        </div>

        {/* Turnaround speed & mail-in status */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-600">
          <div className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 font-medium">
            <Clock className="size-3 text-zinc-500" />
            <span>{lab.turnaround}</span>
          </div>

          {lab.acceptsMailIn && (
            <div className="flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 font-medium">
              <Mail className="size-3 text-emerald-600" />
              <span>Mail-in Accepted</span>
            </div>
          )}

          {lab.featuredBadge && (
            <Badge variant="outline" className="text-[10px] h-5 border-rose-200 text-rose-600 bg-rose-50/50">
              {lab.featuredBadge}
            </Badge>
          )}
        </div>
      </div>

      {/* Process Tags */}
      <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap gap-1.5 items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {lab.processes.map((proc) => (
            <span
              key={proc}
              className="rounded-md bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-600 border border-zinc-200/60"
            >
              {proc}
            </span>
          ))}
        </div>

        <button
          type="button"
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors"
        >
          View Lab →
        </button>
      </div>
    </Card>
  )
}
