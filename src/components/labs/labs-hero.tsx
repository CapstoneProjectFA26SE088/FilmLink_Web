"use client"

import { FlaskConical, MapPin, Plus, Search, Sparkles, X } from "lucide-react"

interface LabsHeroProps {
  query: string
  totalCount: number
  allCount: number
  onQueryChange: (q: string) => void
  onSubmitLabClick: () => void
}

export function LabsHero({
  query,
  totalCount,
  allCount,
  onQueryChange,
  onSubmitLabClick,
}: LabsHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-zinc-200/80 bg-gradient-to-b from-zinc-50/70 via-white to-white py-12 sm:py-16">
      {/* Background soft ambient halation */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-radial from-rose-100/40 via-transparent to-transparent opacity-70 blur-2xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top Badges & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-3 py-1 text-xs font-semibold text-[#e24a4a]">
              <FlaskConical className="size-3.5" />
              <span>Verified Film Labs</span>
            </span>
            <span className="text-xs text-zinc-500 font-medium">Worldwide Analog Directory</span>
          </div>

          <button
            type="button"
            onClick={onSubmitLabClick}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 transition-all cursor-pointer"
          >
            <Plus className="size-3.5 text-[#e24a4a]" />
            <span>Submit a Film Lab</span>
          </button>
        </div>

        {/* Headline */}
        <div className="mt-6 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950">
            Find the Perfect Lab for Your <span className="text-[#e24a4a]">Analog Rolls</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 leading-relaxed">
            From local walk-in darkrooms in Hanoi and Saigon to world-class cinema ECN-2 processors
            in Tokyo and Stuttgart. Filter by chemistry, scanning hardware, push/pull options, and
            turnaround speed.
          </p>
        </div>

        {/* Global Live Search Bar */}
        <div className="mt-8 max-w-3xl">
          <div className="relative flex items-center rounded-2xl border border-zinc-200/90 bg-white p-2 shadow-sm focus-within:border-zinc-400 focus-within:shadow-md transition-all">
            <div className="flex pl-3 pr-2 text-zinc-400">
              <Search className="size-5" />
            </div>

            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by lab name, city, country, scanner (e.g. 'Frontier', 'Hanoi', 'ECN-2')..."
              className="w-full bg-transparent text-sm sm:text-base text-zinc-900 placeholder:text-zinc-400 outline-none"
              aria-label="Search verified film labs"
            />

            {query && (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 transition-colors mr-1 cursor-pointer"
                aria-label="Clear search query"
              >
                <X className="size-4" />
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 border-l border-zinc-200 pl-3 pr-2 text-xs text-zinc-500 font-medium">
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-600">
                {totalCount}
              </span>
              <span>of {allCount} labs</span>
            </div>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-zinc-600">
          <div className="flex items-center gap-1.5 rounded-lg bg-zinc-100/70 px-2.5 py-1 font-medium">
            <Sparkles className="size-3.5 text-amber-500" />
            <span>Master Scanners: Fuji Frontier SP-3000 & Noritsu HS-1800</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-zinc-100/70 px-2.5 py-1 font-medium">
            <MapPin className="size-3.5 text-rose-500" />
            <span>Local Drop-offs & Tracked Mail-in Worldwide</span>
          </div>
        </div>
      </div>
    </div>
  )
}
