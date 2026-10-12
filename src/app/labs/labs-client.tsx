"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import {
  LabDetailModal,
  LabSubmitModal,
  LabsFilterBar,
  LabsGrid,
  LabsHero,
  LabsTable,
} from "@/components/labs"
import { useLabsExplorer } from "@/hooks/use-labs-explorer"
import { ALL_VERIFIED_FILM_LABS } from "@/lib/labs-directory-data"

export function LabsClient() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const initialLabId = searchParams.get("lab")

  const {
    filters,
    filteredLabs,
    totalCount,
    allCount,
    activeFilterCount,
    selectedLab,
    submitModalOpen,
    setQuery,
    setProcess,
    setFormat,
    setLocation,
    setTurnaround,
    setMailInOnly,
    setPushPullOnly,
    setFrontierOnly,
    setSellsFilmOnly,
    setSortBy,
    setViewMode,
    setSelectedLab,
    setSubmitModalOpen,
    resetFilters,
  } = useLabsExplorer(initialQuery)

  // Auto-open modal if ?lab=... query param is present
  useEffect(() => {
    if (initialLabId) {
      const target = ALL_VERIFIED_FILM_LABS.find((l) => l.id === initialLabId)
      if (target) {
        setSelectedLab(target)
      }
    }
  }, [initialLabId, setSelectedLab])

  return (
    <>
      {/* Hero with Search Bar & Stats */}
      <LabsHero
        query={filters.query}
        totalCount={totalCount}
        allCount={allCount}
        onQueryChange={setQuery}
        onSubmitLabClick={() => setSubmitModalOpen(true)}
      />

      {/* Sticky Interactive Filter Bar */}
      <LabsFilterBar
        filters={filters}
        activeFilterCount={activeFilterCount}
        totalCount={totalCount}
        onProcessChange={setProcess}
        onFormatChange={setFormat}
        onLocationChange={setLocation}
        onTurnaroundChange={setTurnaround}
        onMailInChange={setMailInOnly}
        onPushPullChange={setPushPullOnly}
        onFrontierChange={setFrontierOnly}
        onSellsFilmChange={setSellsFilmOnly}
        onSortChange={setSortBy}
        onViewModeChange={setViewMode}
        onResetFilters={resetFilters}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        {/* Results Counter Header */}
        <div className="mb-6 flex items-center justify-between text-xs text-zinc-500">
          <div>
            Showing <strong className="text-zinc-900">{totalCount}</strong> of{" "}
            <strong>{allCount}</strong> verified film labs
          </div>

          <div className="hidden sm:block text-[11px] text-zinc-400">
            Updated weekly by the analog photography community
          </div>
        </div>

        {/* View Switcher: Grid vs Table */}
        {filters.viewMode === "grid" ? (
          <LabsGrid
            labs={filteredLabs}
            onSelectLab={setSelectedLab}
            onResetFilters={resetFilters}
          />
        ) : (
          <LabsTable
            labs={filteredLabs}
            onSelectLab={setSelectedLab}
            onResetFilters={resetFilters}
          />
        )}
      </main>

      {/* Lab Details Modal */}
      <LabDetailModal
        lab={selectedLab}
        open={!!selectedLab}
        onOpenChange={(open) => {
          if (!open) setSelectedLab(null)
        }}
      />

      {/* Community Lab Submit Modal */}
      <LabSubmitModal open={submitModalOpen} onOpenChange={setSubmitModalOpen} />
    </>
  )
}
