"use client"

import {
  ArrowUpDown,
  Clock,
  Filter,
  Funnel,
  MapPin,
  RotateCcw,
  Search as SearchIcon,
  Truck,
  X,
} from "lucide-react"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FilmLabDirectory } from "./film-lab-directory"
import { SuggestedSearchChips } from "./suggested-search-chips"

function SearchBar({
  value,
  onChange,
  onToggleFilter,
  isFilterOpen,
  activeFilterCount,
}: {
  value: string
  onChange: (val: string) => void
  onToggleFilter: () => void
  isFilterOpen: boolean
  activeFilterCount: number
}) {
  return (
    <div className="relative flex w-full items-center gap-2">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        aria-label="Tìm kiếm Film Lab theo tên, thành phố hoặc dịch vụ"
        className="h-10 rounded-[14px] border-border bg-muted/50 pr-20 pl-11 text-[15px] shadow-none focus-visible:bg-background transition-colors"
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm Film Lab (Croplab, LLab), thành phố (Hà Nội, Sài Gòn) hoặc quy trình (C-41, ECN-2)..."
        value={value}
      />
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {value && (
          <button
            aria-label="Xóa tìm kiếm"
            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => onChange("")}
            type="button"
          >
            <X className="size-4" />
          </button>
        )}
        <Button
          aria-label="Mở bộ lọc tìm kiếm nâng cao"
          className={`size-8 rounded-xl transition-all ${
            isFilterOpen || activeFilterCount > 0
              ? "bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)]/90"
              : "text-muted-foreground hover:bg-muted"
          }`}
          onClick={onToggleFilter}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Funnel className="size-4" />
          {activeFilterCount > 0 && !isFilterOpen && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChip, setSelectedChip] = useState("All Labs")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Advanced Filter States
  const [cityFilter, setCityFilter] = useState("all")
  const [processFilter, setProcessFilter] = useState("all")
  const [turnaroundFilter, setTurnaroundFilter] = useState("all")
  const [mailInOnly, setMailInOnly] = useState(false)
  const [sortBy, setSortBy] = useState<"rating" | "turnaround" | "reviews">("rating")

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (cityFilter !== "all") count++
    if (processFilter !== "all") count++
    if (turnaroundFilter !== "all") count++
    if (mailInOnly) count++
    if (sortBy !== "rating") count++
    return count
  }, [cityFilter, processFilter, turnaroundFilter, mailInOnly, sortBy])

  const handleChipSelect = (chip: string) => {
    setSelectedChip(chip === selectedChip && chip !== "All Labs" ? "All Labs" : chip)
  }

  const resetAllFilters = () => {
    setCityFilter("all")
    setProcessFilter("all")
    setTurnaroundFilter("all")
    setMailInOnly(false)
    setSortBy("rating")
    setSelectedChip("All Labs")
    setSearchQuery("")
  }

  return (
    <section
      aria-label="Find a film lab"
      className="mx-auto flex w-full max-w-[1088px] min-w-0 flex-col gap-5 pb-12"
    >
      <header className="flex min-h-[72px] w-full items-center justify-center pt-2">
        <div className="w-full max-w-[640px]">
          <SearchBar
            activeFilterCount={activeFilterCount}
            isFilterOpen={isFilterOpen}
            onChange={setSearchQuery}
            onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
            value={searchQuery}
          />
        </div>
      </header>

      {/* Suggested Search Chips */}
      <div className="mx-auto w-full max-w-[640px]">
        <SuggestedSearchChips
          activeChip={selectedChip}
          onSelectChip={handleChipSelect}
        />
      </div>

      {/* Advanced Lab Filter Panel */}
      {isFilterOpen && (
        <div className="mx-auto w-full max-w-[720px] rounded-2xl border border-border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-[rgb(74,93,249)]" />
              <h3 className="text-sm font-semibold text-foreground">Bộ lọc Lab chi tiết</h3>
              {activeFilterCount > 0 && (
                <Badge className="bg-[rgb(74,93,249)]/10 text-[rgb(74,93,249)] text-xs font-semibold">
                  {activeFilterCount} tiêu chí đang chọn
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={resetAllFilters}
                  type="button"
                >
                  <RotateCcw className="size-3" />
                  Đặt lại
                </button>
              )}
              <button
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setIsFilterOpen(false)}
                type="button"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3.5 text-xs">
            {/* City Filter */}
            <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-muted-foreground flex items-center gap-1">
                <MapPin className="size-3" /> Thành phố:
              </span>
              <Select value={cityFilter} onValueChange={(val) => setCityFilter(val ?? "all")}>
                <SelectTrigger aria-label="Lọc theo thành phố" className="w-full text-xs h-9 rounded-xl">
                  <SelectValue placeholder="Chọn khu vực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tất cả khu vực</SelectItem>
                    <SelectItem value="hanoi">Hà Nội</SelectItem>
                    <SelectItem value="ho chi minh">TP. Hồ Chí Minh</SelectItem>
                    <SelectItem value="da nang">Đà Nẵng</SelectItem>
                    <SelectItem value="tokyo">Tokyo (Nhật Bản)</SelectItem>
                    <SelectItem value="new york">New York (Mỹ)</SelectItem>
                    <SelectItem value="stuttgart">Stuttgart (Đức)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Process Filter */}
            <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-muted-foreground">Quy trình tráng:</span>
              <Select value={processFilter} onValueChange={(val) => setProcessFilter(val ?? "all")}>
                <SelectTrigger aria-label="Lọc theo quy trình tráng" className="w-full text-xs h-9 rounded-xl">
                  <SelectValue placeholder="Chọn quy trình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tất cả quy trình</SelectItem>
                    <SelectItem value="c-41">Color (C-41) Màu chuẩn</SelectItem>
                    <SelectItem value="b&w">B&W Đen trắng thủ công</SelectItem>
                    <SelectItem value="ecn-2">ECN-2 Điện ảnh</SelectItem>
                    <SelectItem value="e-6">Slide (E-6) Dương bản</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Turnaround Filter */}
            <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" /> Tốc độ trả file:
              </span>
              <Select value={turnaroundFilter} onValueChange={(val) => setTurnaroundFilter(val ?? "all")}>
                <SelectTrigger aria-label="Lọc theo thời gian hoàn thành" className="w-full text-xs h-9 rounded-xl">
                  <SelectValue placeholder="Chọn thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tất cả thời gian</SelectItem>
                    <SelectItem value="same_day">Lấy trong ngày (Same Day)</SelectItem>
                    <SelectItem value="1_2_days">1 - 2 Ngày</SelectItem>
                    <SelectItem value="3_5_days">3 - 5 Ngày</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-muted-foreground flex items-center gap-1">
                <ArrowUpDown className="size-3" /> Sắp xếp theo:
              </span>
              <Select value={sortBy} onValueChange={(val) => setSortBy((val as any) ?? "rating")}>
                <SelectTrigger aria-label="Sắp xếp kết quả" className="w-full text-xs h-9 rounded-xl">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="rating">Đánh giá cao nhất (Rating ↓)</SelectItem>
                    <SelectItem value="reviews">Nhiều đánh giá nhất (Reviews ↓)</SelectItem>
                    <SelectItem value="turnaround">Tốc độ xử lý nhanh nhất</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border/50 pt-3 mt-3">
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <input
                checked={mailInOnly}
                className="size-4 rounded border-border accent-[rgb(74,93,249)]"
                onChange={(e) => setMailInOnly(e.target.checked)}
                type="checkbox"
              />
              <span className="font-medium text-foreground flex items-center gap-1">
                <Truck className="size-3.5 text-muted-foreground" />
                Chỉ hiện Lab hỗ trợ nhận film qua bưu điện (Mail-in)
              </span>
            </label>

            <Button
              className="bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)]/90 text-xs h-8"
              onClick={() => setIsFilterOpen(false)}
              size="sm"
            >
              Áp dụng bộ lọc
            </Button>
          </div>
        </div>
      )}

      {/* Lab Directory with all Filter Criteria passed */}
      <FilmLabDirectory
        cityFilter={cityFilter}
        filterChip={selectedChip}
        mailInOnly={mailInOnly}
        processFilter={processFilter}
        searchQuery={searchQuery}
        sortBy={sortBy}
        turnaroundFilter={turnaroundFilter}
      />

      <p className="pt-4 text-center text-xs text-muted-foreground">
        FilmLink Directory — Tìm kiếm, so sánh và đặt tráng phim dễ dàng cùng mạng lưới lab uy tín.
      </p>
    </section>
  )
}
