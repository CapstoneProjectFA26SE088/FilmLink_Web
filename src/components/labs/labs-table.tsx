"use client"

import { Clock, ExternalLink, MapPin, RotateCcw, SlidersHorizontal, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { IFilmLab } from "@/types"

interface LabsTableProps {
  labs: IFilmLab[]
  onSelectLab: (lab: IFilmLab) => void
  onResetFilters: () => void
}

export function LabsTable({ labs, onSelectLab, onResetFilters }: LabsTableProps) {
  if (labs.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-300/80 bg-zinc-50/60 p-12 sm:p-16 text-center my-6">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
          <SlidersHorizontal className="size-6" />
        </div>
        <h3 className="mt-4 text-base sm:text-lg font-bold text-zinc-900">
          No matching film labs found
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
          Try clearing your search query or loosening your process filters.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black transition-colors cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              <th className="py-3.5 pl-5 pr-4">Film Lab</th>
              <th className="py-3.5 px-4">Turnaround</th>
              <th className="py-3.5 px-4">Chemistry / Processes</th>
              <th className="py-3.5 px-4">Scanners</th>
              <th className="py-3.5 px-4">Services</th>
              <th className="py-3.5 px-4">Pricing</th>
              <th className="py-3.5 pr-5 pl-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-medium">
            {labs.map((lab) => (
              <tr
                key={lab.id}
                className="hover:bg-zinc-50/70 transition-colors group cursor-pointer"
                onClick={() => onSelectLab(lab)}
              >
                {/* Lab & Location */}
                <td className="py-4 pl-5 pr-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 text-sm group-hover:text-[#e24a4a] transition-colors">
                        {lab.name}
                      </span>
                      {lab.featuredBadge && (
                        <Badge
                          variant="outline"
                          className="text-[9px] h-4 border-rose-200 text-[#e24a4a] bg-rose-50/80"
                        >
                          {lab.featuredBadge}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mt-0.5">
                      <MapPin className="size-3 shrink-0" />
                      <span>
                        {lab.city}, {lab.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-700 text-[11px] mt-1">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <span className="font-semibold">{lab.rating.toFixed(2)}</span>
                      <span className="text-zinc-400">({lab.reviewCount})</span>
                    </div>
                  </div>
                </td>

                {/* Turnaround */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 font-semibold text-zinc-700">
                    <Clock className="size-3 text-zinc-500" />
                    <span>{lab.turnaround}</span>
                  </span>
                </td>

                {/* Processes */}
                <td className="py-4 px-4 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {lab.processes.map((proc) => (
                      <span
                        key={proc}
                        className="rounded bg-zinc-100/90 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700"
                      >
                        {proc}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Scanners */}
                <td className="py-4 px-4 max-w-[200px]">
                  {lab.scanners && lab.scanners.length > 0 ? (
                    <div className="flex flex-col gap-0.5 text-[11px] text-zinc-600 font-mono">
                      {lab.scanners.map((s) => (
                        <span key={s} className="truncate">
                          • {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>

                {/* Services */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1 text-[11px]">
                    {lab.acceptsMailIn && (
                      <span className="text-emerald-700 font-medium">✓ Mail-in</span>
                    )}
                    {lab.supportsPushPull && (
                      <span className="text-rose-700 font-medium">✓ Push/Pull</span>
                    )}
                    {lab.sellsFilm && (
                      <span className="text-purple-700 font-medium">✓ Film Stock</span>
                    )}
                  </div>
                </td>

                {/* Pricing */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="font-bold text-zinc-800">{lab.priceRange || "Competitive"}</span>
                </td>

                {/* Actions */}
                <td className="py-4 pr-5 pl-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectLab(lab)
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-800 shadow-2xs hover:bg-zinc-50 hover:text-[#e24a4a] transition-colors cursor-pointer"
                  >
                    <span>Details</span>
                    <ExternalLink className="size-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
