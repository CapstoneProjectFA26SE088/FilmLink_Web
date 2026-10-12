"use client"

import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react"
import Link from "next/link"
import { useLabSearch } from "@/hooks/use-lab-search"
import { cn } from "@/lib/utils"
import type { FilmProcessType } from "@/types"
import { LabCard } from "./shared/lab-card"
import { SectionHeading } from "./shared/section-heading"

const PROCESS_OPTIONS: FilmProcessType[] = [
  "All",
  "Color (C-41)",
  "B&W",
  "ECN-2",
  "Slide (E-6)",
]

export function LabSearchSection() {
  const { filters, filteredLabs, totalCount, setQuery, setProcess, resetFilters } =
    useLabSearch()

  return (
    <section
      id="film-labs"
      aria-labelledby="lab-search-title"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
    >
      <SectionHeading
        badge="Global Lab Directory"
        title="Find the Right Film Lab"
        subtitle="Search top-rated labs near you or send film by mail"
      />

      {/* Search Input Bar */}
      <div className="mx-auto mt-12 max-w-2xl">
        <div className="relative flex items-center rounded-full border border-zinc-200 bg-white p-1.5 shadow-sm transition-all focus-within:border-zinc-400 focus-within:shadow-md">
          <div className="flex pl-3.5 pr-2 text-zinc-400">
            <Search className="size-5" />
          </div>

          <input
            id="lab-search-input"
            type="search"
            value={filters.query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, lab name, or country..."
            className="w-full bg-transparent text-sm sm:text-base text-zinc-900 placeholder:text-zinc-400 outline-none"
            aria-label="Search film labs by name, city, or process"
          />

          {filters.query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors mr-1"
              aria-label="Clear search query"
            >
              <X className="size-4" />
            </button>
          )}

          <button
            type="button"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white transition-all hover:bg-black active:scale-95"
            aria-label="Submit search"
          >
            <Search className="size-4" />
          </button>
        </div>

        {/* Process Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {PROCESS_OPTIONS.map((processOption) => {
            const isSelected = filters.process === processOption
            return (
              <button
                key={processOption}
                type="button"
                onClick={() => setProcess(processOption)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200",
                  isSelected
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "border border-zinc-200/80 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                )}
                aria-pressed={isSelected}
              >
                {processOption}
              </button>
            )
          })}
        </div>

        {/* Guarantee subtext */}
        <p className="mt-4 text-center text-xs text-zinc-500">
          Over 500+ verified film labs worldwide ready to process your rolls
        </p>
      </div>

      {/* Filtered Labs Results Grid */}
      <div className="mt-10">
        {filteredLabs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLabs.slice(0, 6).map((lab) => (
                <LabCard key={lab.id} lab={lab} />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href="/labs"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-xs transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm group"
              >
                <span>Explore Full Directory & Filters ({totalCount}+ Verified Labs)</span>
                <ArrowRight className="size-4 text-zinc-500 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center bg-zinc-50/50">
            <SlidersHorizontal className="mx-auto size-8 text-zinc-400" />
            <h4 className="mt-3 text-base font-bold text-zinc-800">
              No matching film labs found
            </h4>
            <p className="mt-1 text-xs text-zinc-500">
              Try adjusting your search keywords or choosing "All" process types.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 text-xs font-semibold text-rose-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
