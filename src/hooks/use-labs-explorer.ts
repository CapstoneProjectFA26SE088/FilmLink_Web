"use client"

import { useMemo, useState } from "react"
import { ALL_VERIFIED_FILM_LABS, type SortOptionId } from "@/lib/labs-directory-data"
import type { FilmProcessType, IFilmLab } from "@/types"

export interface LabsFilterState {
  query: string
  process: FilmProcessType
  format: string
  location: string
  turnaround: string
  mailInOnly: boolean
  pushPullOnly: boolean
  frontierOnly: boolean
  sellsFilmOnly: boolean
  sortBy: SortOptionId
  viewMode: "grid" | "table"
}

export interface UseLabsExplorerReturn {
  filters: LabsFilterState
  filteredLabs: IFilmLab[]
  totalCount: number
  allCount: number
  activeFilterCount: number
  selectedLab: IFilmLab | null
  submitModalOpen: boolean
  setQuery: (query: string) => void
  setProcess: (process: FilmProcessType) => void
  setFormat: (format: string) => void
  setLocation: (location: string) => void
  setTurnaround: (turnaround: string) => void
  setMailInOnly: (val: boolean) => void
  setPushPullOnly: (val: boolean) => void
  setFrontierOnly: (val: boolean) => void
  setSellsFilmOnly: (val: boolean) => void
  setSortBy: (sort: SortOptionId) => void
  setViewMode: (mode: "grid" | "table") => void
  setSelectedLab: (lab: IFilmLab | null) => void
  setSubmitModalOpen: (open: boolean) => void
  resetFilters: () => void
}

const INITIAL_FILTERS: LabsFilterState = {
  query: "",
  process: "All",
  format: "All Formats",
  location: "All Locations",
  turnaround: "Any Turnaround",
  mailInOnly: false,
  pushPullOnly: false,
  frontierOnly: false,
  sellsFilmOnly: false,
  sortBy: "rating",
  viewMode: "grid",
}

export function useLabsExplorer(initialQuery = ""): UseLabsExplorerReturn {
  const [filters, setFilters] = useState<LabsFilterState>({
    ...INITIAL_FILTERS,
    query: initialQuery,
  })
  const [selectedLab, setSelectedLab] = useState<IFilmLab | null>(null)
  const [submitModalOpen, setSubmitModalOpen] = useState<boolean>(false)

  const filteredLabs = useMemo(() => {
    const trimmedQuery = filters.query.trim().toLowerCase()

    const result = ALL_VERIFIED_FILM_LABS.filter((lab) => {
      // 1. Process filter
      if (filters.process !== "All") {
        if (!lab.processes.includes(filters.process)) {
          return false
        }
      }

      // 2. Format filter
      if (filters.format !== "All Formats") {
        if (!lab.formats?.some((f) => f.toLowerCase().includes(filters.format.toLowerCase()))) {
          return false
        }
      }

      // 3. Location filter
      if (filters.location !== "All Locations") {
        const matchesLocation =
          lab.country.toLowerCase() === filters.location.toLowerCase() ||
          lab.city.toLowerCase() === filters.location.toLowerCase() ||
          (filters.location === "Vietnam" && lab.country === "Vietnam") ||
          (filters.location === "Europe" &&
            ["Germany", "Spain", "Belgium", "France", "United Kingdom"].includes(lab.country))
        if (!matchesLocation) {
          return false
        }
      }

      // 4. Turnaround filter
      if (filters.turnaround !== "Any Turnaround") {
        if (lab.turnaround !== filters.turnaround) {
          return false
        }
      }

      // 5. Checkbox toggles
      if (filters.mailInOnly && !lab.acceptsMailIn) return false
      if (filters.pushPullOnly && !lab.supportsPushPull) return false
      if (filters.frontierOnly && !lab.scanners?.some((s) => s.toLowerCase().includes("frontier")))
        return false
      if (filters.sellsFilmOnly && !lab.sellsFilm) return false

      // 6. Text Query search (matches name, city, country, address, scanners, processes)
      if (trimmedQuery.length > 0) {
        const haystack = [
          lab.name,
          lab.city,
          lab.country,
          lab.address,
          lab.tagline || "",
          lab.description || "",
          ...(lab.scanners || []),
          ...(lab.processes || []),
        ]
          .join(" ")
          .toLowerCase()

        if (!haystack.includes(trimmedQuery)) {
          return false
        }
      }

      return true
    })

    // Sorting
    return result.sort((a, b) => {
      switch (filters.sortBy) {
        case "rating":
          return b.rating - a.rating || b.reviewCount - a.reviewCount
        case "reviews":
          return b.reviewCount - a.reviewCount
        case "speed": {
          const speedRank = { "Same Day": 1, "1-2 Days": 2, "3-5 Days": 3, "1 Week": 4 }
          return (speedRank[a.turnaround] || 99) - (speedRank[b.turnaround] || 99)
        }
        case "name-asc":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
  }, [filters])

  // Count active filters (excluding defaults)
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.query) count++
    if (filters.process !== "All") count++
    if (filters.format !== "All Formats") count++
    if (filters.location !== "All Locations") count++
    if (filters.turnaround !== "Any Turnaround") count++
    if (filters.mailInOnly) count++
    if (filters.pushPullOnly) count++
    if (filters.frontierOnly) count++
    if (filters.sellsFilmOnly) count++
    return count
  }, [filters])

  const setQuery = (query: string) => setFilters((prev) => ({ ...prev, query }))
  const setProcess = (process: FilmProcessType) => setFilters((prev) => ({ ...prev, process }))
  const setFormat = (format: string) => setFilters((prev) => ({ ...prev, format }))
  const setLocation = (location: string) => setFilters((prev) => ({ ...prev, location }))
  const setTurnaround = (turnaround: string) => setFilters((prev) => ({ ...prev, turnaround }))
  const setMailInOnly = (mailInOnly: boolean) => setFilters((prev) => ({ ...prev, mailInOnly }))
  const setPushPullOnly = (pushPullOnly: boolean) =>
    setFilters((prev) => ({ ...prev, pushPullOnly }))
  const setFrontierOnly = (frontierOnly: boolean) =>
    setFilters((prev) => ({ ...prev, frontierOnly }))
  const setSellsFilmOnly = (sellsFilmOnly: boolean) =>
    setFilters((prev) => ({ ...prev, sellsFilmOnly }))
  const setSortBy = (sortBy: SortOptionId) => setFilters((prev) => ({ ...prev, sortBy }))
  const setViewMode = (viewMode: "grid" | "table") => setFilters((prev) => ({ ...prev, viewMode }))

  const resetFilters = () => {
    setFilters({
      ...INITIAL_FILTERS,
      viewMode: filters.viewMode,
    })
  }

  return {
    filters,
    filteredLabs,
    totalCount: filteredLabs.length,
    allCount: ALL_VERIFIED_FILM_LABS.length,
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
  }
}
