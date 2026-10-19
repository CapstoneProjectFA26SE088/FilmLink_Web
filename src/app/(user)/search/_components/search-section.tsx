"use client"

import { Funnel, Search as SearchIcon, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FilmLabDirectory } from "./film-lab-directory"
import { SuggestedSearchChips } from "./suggested-search-chips"

function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="relative flex w-full items-center gap-2">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        aria-label="Tìm kiếm Film Lab theo tên, thành phố hoặc dịch vụ"
        className="h-10 rounded-[14px] border-border bg-muted/50 pr-10 pl-11 text-[15px] shadow-none focus-visible:bg-background transition-colors"
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm Film Lab theo tên (Croplab, LLab), thành phố (Hanoi, Saigon) hoặc quy trình (C-41, ECN-2)..."
        value={value}
      />
      {value && (
        <button
          aria-label="Xóa tìm kiếm"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={() => onChange("")}
          type="button"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChip, setSelectedChip] = useState("All Labs")

  const handleChipSelect = (chip: string) => {
    setSelectedChip(chip === selectedChip && chip !== "All Labs" ? "All Labs" : chip)
  }

  return (
    <section
      aria-label="Find a film lab"
      className="mx-auto flex w-full max-w-[1088px] min-w-0 flex-col gap-5 pb-12"
    >
      <header className="flex min-h-[72px] w-full items-center justify-center pt-2">
        <div className="w-full max-w-[640px]">
          <SearchBar onChange={setSearchQuery} value={searchQuery} />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[640px]">
        <SuggestedSearchChips
          activeChip={selectedChip}
          onSelectChip={handleChipSelect}
        />
      </div>

      <FilmLabDirectory filterChip={selectedChip} searchQuery={searchQuery} />

      <p className="pt-4 text-center text-xs text-muted-foreground">
        FilmLink Directory — Kết nối nhiếp ảnh gia film với các lab tráng scan uy tín toàn quốc.
      </p>
    </section>
  )
}
