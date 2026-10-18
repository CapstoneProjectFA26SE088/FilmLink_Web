"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"

const suggestedSearches = [
  "Kodak Portra 400",
  "Leica M6",
  "C-41 Home Dev",
  "Ilford HP5 Plus",
  "35mm vs 120",
  "Cinestill",
]

export function SuggestedSearchChips() {
  const viewportRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [hasMoreOnRight, setHasMoreOnRight] = useState(false)

  const updateOverflow = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const hasMore = viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft > 1
    setHasMoreOnRight((current) => (current === hasMore ? current : hasMore))
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    const content = contentRef.current
    if (!viewport || !content) return

    const observer = new ResizeObserver(updateOverflow)
    observer.observe(viewport)
    observer.observe(content)
    updateOverflow()

    return () => observer.disconnect()
  }, [updateOverflow])

  return (
    <div className="relative min-w-0">
      <section
        ref={viewportRef}
        aria-label="Suggested searches"
        className="flex min-w-0 gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset [&::-webkit-scrollbar]:hidden"
        onScroll={updateOverflow}
        style={{ scrollbarWidth: "none" }}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: The scroll region needs focus for keyboard scrolling.
        tabIndex={0}
      >
        <div className="flex w-max shrink-0 gap-2" ref={contentRef}>
          {suggestedSearches.map((search) => (
            <Badge
              className="h-9 shrink-0 rounded-full px-4 text-sm font-normal"
              key={search}
              variant="secondary"
            >
              {search}
            </Badge>
          ))}
        </div>
      </section>
      {hasMoreOnRight && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-1 right-0 w-8 bg-gradient-to-l from-background to-transparent"
        />
      )}
    </div>
  )
}
