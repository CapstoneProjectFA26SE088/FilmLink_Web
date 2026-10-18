"use client"

import { useMemo, useState } from "react"
import { VERIFIED_FILM_LABS } from "@/lib/film-labs"
import type { FilmProcessType, IFilmLab, ILabSearchState } from "@/types"

export interface UseLabSearchOptions {
  initialLabs?: IFilmLab[]
  defaultProcess?: FilmProcessType
}

/**
 * Custom React hook to manage Film Lab directory search and filtering.
 */
export function useLabSearch(options: UseLabSearchOptions = {}): ILabSearchState {
  const { initialLabs = VERIFIED_FILM_LABS, defaultProcess = "All" } = options

  const [query, setQuery] = useState<string>("")
  const [selectedProcess, setSelectedProcess] = useState<FilmProcessType>(defaultProcess)
  const [mailInOnly, setMailInOnly] = useState<boolean>(false)

  const filteredLabs = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase()

    return initialLabs.filter((lab) => {
      // 1. Process filter
      if (selectedProcess !== "All") {
        const matchesProcess = lab.processes.includes(selectedProcess)
        if (!matchesProcess) return false
      }

      // 2. Mail-in filter
      if (mailInOnly && !lab.acceptsMailIn) {
        return false
      }

      // 3. Search query filter (matches name, city, country, address)
      if (trimmedQuery.length > 0) {
        const haystack = `${lab.name} ${lab.city} ${lab.country} ${lab.address}`.toLowerCase()
        if (!haystack.includes(trimmedQuery)) return false
      }

      return true
    })
  }, [initialLabs, query, selectedProcess, mailInOnly])

  const resetFilters = () => {
    setQuery("")
    setSelectedProcess("All")
    setMailInOnly(false)
  }

  return {
    filters: {
      query,
      process: selectedProcess,
      mailInOnly,
    },
    filteredLabs,
    totalCount: filteredLabs.length,
    setQuery,
    setProcess: setSelectedProcess,
    setMailInOnly,
    resetFilters,
  }
}
