"use client"

import {
  ArrowUpDown,
  CheckSquare,
  Clock,
  Globe,
  Grid,
  Layers,
  List,
  RotateCcw,
  Square,
  X,
} from "lucide-react"
import type { LabsFilterState } from "@/hooks/use-labs-explorer"
import {
  ALL_FORMAT_FILTERS,
  ALL_LOCATIONS,
  ALL_PROCESS_FILTERS,
  ALL_SORT_OPTIONS,
  ALL_TURNAROUND_FILTERS,
  type SortOptionId,
} from "@/lib/labs-directory-data"
import { cn } from "@/lib/utils"
import type { FilmProcessType } from "@/types"

interface LabsFilterBarProps {
  filters: LabsFilterState
  activeFilterCount: number
  totalCount?: number
  onProcessChange: (p: FilmProcessType) => void
  onFormatChange: (f: string) => void
  onLocationChange: (loc: string) => void
  onTurnaroundChange: (t: string) => void
  onMailInChange: (val: boolean) => void
  onPushPullChange: (val: boolean) => void
  onFrontierChange: (val: boolean) => void
  onSellsFilmChange: (val: boolean) => void
  onSortChange: (sort: SortOptionId) => void
  onViewModeChange: (mode: "grid" | "table") => void
  onResetFilters: () => void
}

export function LabsFilterBar({
  filters,
  activeFilterCount,
  onProcessChange,
  onFormatChange,
  onLocationChange,
  onTurnaroundChange,
  onMailInChange,
  onPushPullChange,
  onFrontierChange,
  onSellsFilmChange,
  onSortChange,
  onViewModeChange,
  onResetFilters,
}: LabsFilterBarProps) {
  return (
    <div className="border-b border-zinc-200/80 bg-white sticky top-[65px] z-30 shadow-2xs">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        {/* Row 1: Chemistry Pills + View Mode + Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Film Process Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="hidden sm:inline-flex text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1">
              Process:
            </span>
            {ALL_PROCESS_FILTERS.map((proc) => {
              const isSelected = filters.process === proc
              return (
                <button
                  key={proc}
                  type="button"
                  onClick={() => onProcessChange(proc)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-all shrink-0 cursor-pointer",
                    isSelected
                      ? "bg-zinc-900 text-white shadow-2xs"
                      : "border border-zinc-200 bg-zinc-50/70 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900"
                  )}
                >
                  {proc}
                </button>
              )
            })}
          </div>

          {/* Right Controls: Sort & View Toggle */}
          <div className="flex items-center gap-2.5 justify-between sm:justify-end">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor="lab-sort"
                className="text-xs text-zinc-500 font-medium hidden sm:inline"
              >
                Sort:
              </label>
              <div className="relative">
                <select
                  id="lab-sort"
                  value={filters.sortBy}
                  onChange={(e) => onSortChange(e.target.value as SortOptionId)}
                  className="rounded-lg border border-zinc-200 bg-white py-1.5 pl-2.5 pr-8 text-xs font-medium text-zinc-800 shadow-2xs focus:border-zinc-400 outline-none cursor-pointer appearance-none"
                >
                  {ALL_SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-zinc-400" />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-100/80 p-0.5">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                aria-label="Grid view"
                className={cn(
                  "p-1.5 rounded-md transition-colors cursor-pointer",
                  filters.viewMode === "grid"
                    ? "bg-white text-zinc-900 shadow-2xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-800"
                )}
              >
                <Grid className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                aria-label="List table view"
                className={cn(
                  "p-1.5 rounded-md transition-colors cursor-pointer",
                  filters.viewMode === "table"
                    ? "bg-white text-zinc-900 shadow-2xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-800"
                )}
              >
                <List className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Secondary Selectors & Photographer Checkbox Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-zinc-100 text-xs">
          {/* Dropdown Filters (Location, Format, Turnaround) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Location Select */}
            <div className="relative">
              <select
                value={filters.location}
                onChange={(e) => onLocationChange(e.target.value)}
                className={cn(
                  "rounded-lg border py-1 pl-7 pr-7 text-xs font-medium shadow-2xs outline-none cursor-pointer appearance-none",
                  filters.location !== "All Locations"
                    ? "border-rose-300 bg-rose-50/50 text-[#e24a4a] font-semibold"
                    : "border-zinc-200 bg-white text-zinc-700"
                )}
              >
                {ALL_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <Globe className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
              <ArrowUpDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-2.5 text-zinc-400" />
            </div>

            {/* Format Select */}
            <div className="relative">
              <select
                value={filters.format}
                onChange={(e) => onFormatChange(e.target.value)}
                className={cn(
                  "rounded-lg border py-1 pl-7 pr-7 text-xs font-medium shadow-2xs outline-none cursor-pointer appearance-none",
                  filters.format !== "All Formats"
                    ? "border-rose-300 bg-rose-50/50 text-[#e24a4a] font-semibold"
                    : "border-zinc-200 bg-white text-zinc-700"
                )}
              >
                {ALL_FORMAT_FILTERS.map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {fmt}
                  </option>
                ))}
              </select>
              <Layers className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
              <ArrowUpDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-2.5 text-zinc-400" />
            </div>

            {/* Turnaround Select */}
            <div className="relative">
              <select
                value={filters.turnaround}
                onChange={(e) => onTurnaroundChange(e.target.value)}
                className={cn(
                  "rounded-lg border py-1 pl-7 pr-7 text-xs font-medium shadow-2xs outline-none cursor-pointer appearance-none",
                  filters.turnaround !== "Any Turnaround"
                    ? "border-rose-300 bg-rose-50/50 text-[#e24a4a] font-semibold"
                    : "border-zinc-200 bg-white text-zinc-700"
                )}
              >
                {ALL_TURNAROUND_FILTERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <Clock className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
              <ArrowUpDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-2.5 text-zinc-400" />
            </div>
          </div>

          {/* Feature Toggle Checkbox Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => onMailInChange(!filters.mailInOnly)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                filters.mailInOnly
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              )}
            >
              {filters.mailInOnly ? (
                <CheckSquare className="size-3 text-emerald-600" />
              ) : (
                <Square className="size-3 text-zinc-400" />
              )}
              <span>Mail-in Only</span>
            </button>

            <button
              type="button"
              onClick={() => onPushPullChange(!filters.pushPullOnly)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                filters.pushPullOnly
                  ? "border-rose-300 bg-rose-50 text-[#e24a4a]"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              )}
            >
              {filters.pushPullOnly ? (
                <CheckSquare className="size-3 text-[#e24a4a]" />
              ) : (
                <Square className="size-3 text-zinc-400" />
              )}
              <span>Push / Pull</span>
            </button>

            <button
              type="button"
              onClick={() => onFrontierChange(!filters.frontierOnly)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                filters.frontierOnly
                  ? "border-amber-300 bg-amber-50 text-amber-800"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              )}
            >
              {filters.frontierOnly ? (
                <CheckSquare className="size-3 text-amber-600" />
              ) : (
                <Square className="size-3 text-zinc-400" />
              )}
              <span>Frontier SP-3000</span>
            </button>

            <button
              type="button"
              onClick={() => onSellsFilmChange(!filters.sellsFilmOnly)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                filters.sellsFilmOnly
                  ? "border-purple-300 bg-purple-50 text-purple-800"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              )}
            >
              {filters.sellsFilmOnly ? (
                <CheckSquare className="size-3 text-purple-600" />
              ) : (
                <Square className="size-3 text-zinc-400" />
              )}
              <span>Sells Film</span>
            </button>
          </div>
        </div>

        {/* Row 3: Active Filters summary bar (only when filters applied) */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-dashed border-zinc-200 text-xs text-zinc-600">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-zinc-500">Active ({activeFilterCount}):</span>

              {filters.query && (
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">
                  <span>"{filters.query}"</span>
                </span>
              )}

              {filters.process !== "All" && (
                <button
                  type="button"
                  onClick={() => onProcessChange("All")}
                  className="inline-flex items-center gap-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 hover:bg-rose-100 cursor-pointer"
                >
                  <span>{filters.process}</span>
                  <X className="size-3" />
                </button>
              )}

              {filters.location !== "All Locations" && (
                <button
                  type="button"
                  onClick={() => onLocationChange("All Locations")}
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-100 text-zinc-700 px-2 py-0.5 hover:bg-zinc-200 cursor-pointer"
                >
                  <span>{filters.location}</span>
                  <X className="size-3" />
                </button>
              )}

              {filters.format !== "All Formats" && (
                <button
                  type="button"
                  onClick={() => onFormatChange("All Formats")}
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-100 text-zinc-700 px-2 py-0.5 hover:bg-zinc-200 cursor-pointer"
                >
                  <span>{filters.format}</span>
                  <X className="size-3" />
                </button>
              )}

              {filters.turnaround !== "Any Turnaround" && (
                <button
                  type="button"
                  onClick={() => onTurnaroundChange("Any Turnaround")}
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-100 text-zinc-700 px-2 py-0.5 hover:bg-zinc-200 cursor-pointer"
                >
                  <span>{filters.turnaround}</span>
                  <X className="size-3" />
                </button>
              )}

              {filters.mailInOnly && (
                <button
                  type="button"
                  onClick={() => onMailInChange(false)}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 hover:bg-emerald-100 cursor-pointer"
                >
                  <span>Mail-in Only</span>
                  <X className="size-3" />
                </button>
              )}

              {filters.pushPullOnly && (
                <button
                  type="button"
                  onClick={() => onPushPullChange(false)}
                  className="inline-flex items-center gap-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 hover:bg-rose-100 cursor-pointer"
                >
                  <span>Push / Pull</span>
                  <X className="size-3" />
                </button>
              )}

              {filters.frontierOnly && (
                <button
                  type="button"
                  onClick={() => onFrontierChange(false)}
                  className="inline-flex items-center gap-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 hover:bg-amber-100 cursor-pointer"
                >
                  <span>Frontier</span>
                  <X className="size-3" />
                </button>
              )}

              {filters.sellsFilmOnly && (
                <button
                  type="button"
                  onClick={() => onSellsFilmChange(false)}
                  className="inline-flex items-center gap-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 hover:bg-purple-100 cursor-pointer"
                >
                  <span>Film Sales</span>
                  <X className="size-3" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              <RotateCcw className="size-3" />
              <span>Reset all</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
