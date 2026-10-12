"use client"

import { Clock, ExternalLink, Flame, Mail, MapPin, Monitor, Package, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { IFilmLab } from "@/types"

interface LabCardDetailedProps {
  lab: IFilmLab
  onSelect: (lab: IFilmLab) => void
}

export function LabCardDetailed({ lab, onSelect }: LabCardDetailedProps) {
  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:border-zinc-300 hover:shadow-lg hover:-translate-y-1">
      {/* Top Section */}
      <div className="space-y-3.5">
        {/* Title, Badge & Rating */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-zinc-900 group-hover:text-[#e24a4a] transition-colors">
                {lab.name}
              </h3>
              {lab.featuredBadge && (
                <Badge
                  variant="outline"
                  className="text-[10px] h-5 border-rose-200 text-[#e24a4a] bg-rose-50/70 font-semibold"
                >
                  {lab.featuredBadge}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
              <MapPin className="size-3.5 text-zinc-400 shrink-0" />
              <span>
                {lab.city}, {lab.country}
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                {lab.address}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200/60 shrink-0">
            <Star className="size-3 fill-amber-500 text-amber-500" />
            <span>{lab.rating.toFixed(2)}</span>
            <span className="text-amber-600/70 text-[10px]">({lab.reviewCount})</span>
          </div>
        </div>

        {/* Tagline / Subtitle */}
        {lab.tagline && <p className="text-xs font-medium text-zinc-600 italic">"{lab.tagline}"</p>}

        {/* Badges Bar (Turnaround, Mail-in, Push/Pull) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <div className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">
            <Clock className="size-3 text-zinc-500" />
            <span>{lab.turnaround}</span>
          </div>

          {lab.acceptsMailIn && (
            <div className="flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 font-medium">
              <Mail className="size-3 text-emerald-600" />
              <span>Mail-in Accepted</span>
            </div>
          )}

          {lab.supportsPushPull && (
            <div className="flex items-center gap-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200/50 px-2 py-0.5 font-medium">
              <Flame className="size-3 text-rose-600" />
              <span>Push / Pull</span>
            </div>
          )}

          {lab.sellsFilm && (
            <div className="flex items-center gap-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200/50 px-2 py-0.5 font-medium">
              <Package className="size-3 text-purple-600" />
              <span>Film Sales</span>
            </div>
          )}
        </div>

        {/* Hardware & Scanners */}
        {lab.scanners && lab.scanners.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 pt-1">
            <Monitor className="size-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-500 text-[11px] font-medium">Scanners:</span>
            <div className="flex flex-wrap gap-1">
              {lab.scanners.map((scanner) => (
                <span
                  key={scanner}
                  className="rounded bg-zinc-100/90 px-1.5 py-0.2 text-[11px] font-mono font-medium text-zinc-700"
                >
                  {scanner}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Process Tags */}
        <div className="space-y-1.5 pt-1 border-t border-zinc-100">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Chemistry & Processes:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {lab.processes.map((proc) => (
              <span
                key={proc}
                className="rounded-md bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-700 border border-zinc-200/70"
              >
                {proc}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Price Range & CTAs */}
      <div className="mt-5 pt-3.5 border-t border-zinc-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-zinc-400 block font-medium uppercase tracking-wider">
            Pricing
          </span>
          <span className="text-xs sm:text-sm font-bold text-zinc-800">
            {lab.priceRange || "Competitive"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelect(lab)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#e24a4a] transition-all cursor-pointer group-hover:shadow-xs"
        >
          <span>View Specs & Menu</span>
          <ExternalLink className="size-3" />
        </button>
      </div>
    </Card>
  )
}
