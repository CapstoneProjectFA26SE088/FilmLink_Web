"use client"

import { RotateCcw, SlidersHorizontal } from "lucide-react"
import type { IFilmLab } from "@/types"
import { LabCardDetailed } from "./lab-card-detailed"

interface LabsGridProps {
  labs: IFilmLab[]
  onSelectLab: (lab: IFilmLab) => void
  onResetFilters: () => void
}

export function LabsGrid({ labs, onSelectLab, onResetFilters }: LabsGridProps) {
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
          We couldn't find any labs matching your current search criteria. Try removing some filters
          or searching for another city.
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {labs.map((lab) => (
        <LabCardDetailed key={lab.id} lab={lab} onSelect={onSelectLab} />
      ))}
    </div>
  )
}
