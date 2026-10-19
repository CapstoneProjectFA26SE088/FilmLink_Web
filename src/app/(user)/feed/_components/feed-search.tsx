"use client"

import {
  Camera,
  Film,
  Filter,
  Hash,
  MapPin,
  Palette,
  Search as SearchIcon,
  Sparkles,
  X,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface SuggestionItem {
  type: "style" | "metadata" | "tag" | "lab"
  label: string
  query: string
  badgeText: string
}

const ALL_SEARCH_SUGGESTIONS: SuggestionItem[] = [
  // Phong cách
  { type: "style", label: "Cinematic / Màu điện ảnh", query: "cinematic", badgeText: "Phong cách" },
  { type: "style", label: "Street / Nhiếp ảnh đời thường", query: "street", badgeText: "Phong cách" },
  { type: "style", label: "Portrait / Chân dung nghệ thuật", query: "portrait", badgeText: "Phong cách" },
  { type: "style", label: "B&W Grainy / Đen trắng hạt", query: "blackandwhite", badgeText: "Phong cách" },
  { type: "style", label: "Vintage / Hoài niệm thập niên 90", query: "vintage", badgeText: "Phong cách" },
  { type: "style", label: "Landscape / Phong cảnh thiên nhiên", query: "landscape", badgeText: "Phong cách" },
  { type: "style", label: "Night vibes / Đêm nghệ thuật neon", query: "nightvibes", badgeText: "Phong cách" },

  // Metadata Film & Camera
  { type: "metadata", label: "Kodak Portra 400 (Tông màu ấm chuẩn)", query: "portra 400", badgeText: "Film Stock" },
  { type: "metadata", label: "Cinestill 800T (Ánh đỏ Halation đêm)", query: "cinestill 800t", badgeText: "Film Stock" },
  { type: "metadata", label: "Ilford HP5 Plus (Đen trắng tương phản)", query: "ilford hp5", badgeText: "Film Stock" },
  { type: "metadata", label: "Kodak Gold 200 (Ấm áp hoài niệm)", query: "gold 200", badgeText: "Film Stock" },
  { type: "metadata", label: "Fujifilm Pro 400H (Pastel dịu nhẹ)", query: "pro 400h", badgeText: "Film Stock" },
  { type: "metadata", label: "Kodak Ektar 100 (Hạt siêu mịn)", query: "ektar 100", badgeText: "Film Stock" },
  { type: "metadata", label: "Leica M6 / Leica M3 (Rangefinder)", query: "leica", badgeText: "Camera" },
  { type: "metadata", label: "Olympus OM-1 (SLR cơ học)", query: "olympus om-1", badgeText: "Camera" },
  { type: "metadata", label: "Rolleiflex 2.8F (TLR Khổ vuông 120)", query: "rolleiflex", badgeText: "Camera 120" },
  { type: "metadata", label: "Hasselblad 500C/M (Medium format)", query: "hasselblad", badgeText: "Medium Format" },
  { type: "metadata", label: "Contax G2 / T2 (Carl Zeiss lens)", query: "contax", badgeText: "Camera" },

  // Tags
  { type: "tag", label: "#street", query: "#street", badgeText: "Tag" },
  { type: "tag", label: "#cinematic", query: "#cinematic", badgeText: "Tag" },
  { type: "tag", label: "#portrait", query: "#portrait", badgeText: "Tag" },
  { type: "tag", label: "#120film", query: "#120film", badgeText: "Tag" },
  { type: "tag", label: "#mediumformat", query: "#mediumformat", badgeText: "Tag" },
  { type: "tag", label: "#grainisgood", query: "#grainisgood", badgeText: "Tag" },

  // Labs
  { type: "lab", label: "Croplab Hanoi", query: "Croplab Hanoi", badgeText: "Film Lab" },
  { type: "lab", label: "LLab Saigon", query: "LLab Saigon", badgeText: "Film Lab" },
  { type: "lab", label: "Danang Film Space", query: "Danang Film Space", badgeText: "Film Lab" },
]

interface FeedSearchProps {
  value?: string
  onChange?: (value: string) => void
  onToggleFilterPanel?: () => void
  isFilterPanelOpen?: boolean
  activeFilterCount?: number
}

export function FeedSearch({
  value = "",
  onChange,
  onToggleFilterPanel,
  isFilterPanelOpen = false,
  activeFilterCount = 0,
}: FeedSearchProps) {
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Đóng suggestions khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredSuggestions = useMemo(() => {
    if (!value.trim()) {
      return ALL_SEARCH_SUGGESTIONS.slice(0, 7)
    }
    const q = value.toLowerCase().trim().replace(/^#/, "")
    return ALL_SEARCH_SUGGESTIONS.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.query.toLowerCase().includes(q) ||
        s.badgeText.toLowerCase().includes(q)
    ).slice(0, 8)
  }, [value])

  const handleSelect = (query: string) => {
    onChange?.(query)
    setIsFocused(false)
  }

  const getIcon = (type: SuggestionItem["type"]) => {
    switch (type) {
      case "style":
        return <Palette className="size-3.5 text-purple-500 shrink-0" />
      case "metadata":
        return <Camera className="size-3.5 text-amber-500 shrink-0" />
      case "tag":
        return <Hash className="size-3.5 text-[rgb(74,93,249)] shrink-0" />
      case "lab":
        return <MapPin className="size-3.5 text-emerald-500 shrink-0" />
    }
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative flex items-center gap-2">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label="Tìm kiếm bài viết theo phong cách, metadata ảnh, tag hoặc loại máy"
          className="h-10 rounded-2xl border-border bg-muted/40 pr-20 pl-11 text-xs sm:text-[14px] shadow-none focus-visible:bg-background transition-all"
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Tìm theo phong cách (cinematic), thông số (Leica, Portra 400), #tag..."
          value={value}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              aria-label="Xóa tìm kiếm"
              className="p-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              onClick={() => onChange?.("")}
              type="button"
            >
              <X className="size-4" />
            </button>
          )}

          {onToggleFilterPanel && (
            <Button
              aria-label="Mở bộ lọc phong cách và metadata ảnh"
              className={`size-8 rounded-xl transition-all cursor-pointer ${
                isFilterPanelOpen || activeFilterCount > 0
                  ? "bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)]/90 shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={onToggleFilterPanel}
              size="icon"
              title="Bộ lọc phong cách và thông số ảnh nâng cao"
              type="button"
              variant="ghost"
            >
              <Filter className="size-3.5" />
              {activeFilterCount > 0 && !isFilterPanelOpen && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Auto-suggest dropdown */}
      {isFocused && filteredSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-2xl border border-border bg-popover/95 backdrop-blur-md p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-muted-foreground border-b border-border/50">
            <span className="flex items-center gap-1">
              <Sparkles className="size-3 text-[rgb(74,93,249)]" />
              Gợi ý tìm kiếm (Phong cách, Metadata &amp; Tag)
            </span>
            <span className="text-[10px] text-muted-foreground/80">Nhấn để lọc ngay</span>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredSuggestions.map((item, idx) => (
              <button
                className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                key={`${item.type}-${item.query}-${idx}`}
                onClick={() => handleSelect(item.query)}
                type="button"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  {getIcon(item.type)}
                  <span className="truncate font-medium">{item.label}</span>
                </div>
                <Badge
                  className="shrink-0 text-[10px] font-normal bg-muted text-muted-foreground"
                  variant="secondary"
                >
                  {item.badgeText}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
