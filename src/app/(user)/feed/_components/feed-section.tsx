"use client"

import {
  ArrowUpDown,
  Camera,
  ChevronDown,
  Clock,
  Film,
  Filter,
  Flame,
  Hash,
  MessageCircle,
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreatePostBox } from "./create-post-box"
import { FeedSearch } from "./feed-search"
import { PostCard } from "./post-card"
import {
  FEED_STYLES,
  MOCK_USER_FEED_POSTS,
  POPULAR_FEED_TAGS,
  type PhotoStyle,
  type UserFeedPost,
} from "../../mock_data"

type SortOption = "latest" | "popular" | "comments"
type FormatFilter = "all" | "35mm" | "120"
type CameraTypeFilter = "all" | "SLR" | "Rangefinder" | "TLR" | "Medium Format" | "Point & Shoot"
type ProcessFilter = "all" | "c-41" | "ecn-2" | "b&w"
type IsoFilter = "all" | "low" | "mid" | "high"

export default function FeedSection() {
  const [posts, setPosts] = useState<UserFeedPost[]>(MOCK_USER_FEED_POSTS)

  // Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStyle, setSelectedStyle] = useState<string>("all")
  const [selectedFilmStock, setSelectedFilmStock] = useState<string>("all")
  const [selectedFormat, setSelectedFormat] = useState<FormatFilter>("all")
  const [selectedCameraType, setSelectedCameraType] = useState<CameraTypeFilter>("all")
  const [selectedProcess, setSelectedProcess] = useState<ProcessFilter>("all")
  const [selectedIso, setSelectedIso] = useState<IsoFilter>("all")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortOption>("latest")

  // Toggle filter panel
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)

  // Count active filter criteria
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (searchQuery.trim().length > 0) count++
    if (selectedStyle !== "all") count++
    if (selectedFilmStock !== "all") count++
    if (selectedFormat !== "all") count++
    if (selectedCameraType !== "all") count++
    if (selectedProcess !== "all") count++
    if (selectedIso !== "all") count++
    if (selectedTag !== "all") count++
    if (sortBy !== "latest") count++
    return count
  }, [
    searchQuery,
    selectedStyle,
    selectedFilmStock,
    selectedFormat,
    selectedCameraType,
    selectedProcess,
    selectedIso,
    selectedTag,
    sortBy,
  ])

  // Filtered posts logic
  const filteredPosts = useMemo(() => {
    let result = [...posts]

    // 1. Text Search Query (Searches across content, author, camera, lens, film stock, ISO, process, lab, scanner, style, tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim().replace(/^#/, "")
      result = result.filter((p) => {
        const matchContent = p.content.toLowerCase().includes(q)
        const matchAuthor =
          p.author.name.toLowerCase().includes(q) ||
          p.author.username.toLowerCase().includes(q)
        const matchCamera = p.cameraMetadata?.camera.toLowerCase().includes(q)
        const matchLens = p.cameraMetadata?.lens?.toLowerCase().includes(q)
        const matchFilm = p.cameraMetadata?.filmStock.toLowerCase().includes(q)
        const matchProcess = p.cameraMetadata?.devProcess?.toLowerCase().includes(q)
        const matchLab = p.cameraMetadata?.lab?.toLowerCase().includes(q)
        const matchScanner = p.cameraMetadata?.scanner?.toLowerCase().includes(q)
        const matchIso = p.cameraMetadata?.iso?.toString() === q
        const matchStyle =
          p.style?.toLowerCase().includes(q) || p.styleLabel?.toLowerCase().includes(q)
        const matchTags = p.tags.some((t) => t.toLowerCase().replace(/^#/, "").includes(q))

        return (
          matchContent ||
          matchAuthor ||
          matchCamera ||
          matchLens ||
          matchFilm ||
          matchProcess ||
          matchLab ||
          matchScanner ||
          matchIso ||
          matchStyle ||
          matchTags
        )
      })
    }

    // 2. Photo Style Filter
    if (selectedStyle !== "all") {
      result = result.filter((p) => p.style === selectedStyle)
    }

    // 3. Film Stock Filter
    if (selectedFilmStock !== "all") {
      result = result.filter((p) => {
        const stock = p.cameraMetadata?.filmStock.toLowerCase() || ""
        return stock.includes(selectedFilmStock.toLowerCase())
      })
    }

    // 4. Format Filter
    if (selectedFormat !== "all") {
      result = result.filter((p) => {
        const format = p.cameraMetadata?.format?.toLowerCase() || ""
        const combined = `${p.cameraMetadata?.filmStock || ""} ${p.cameraMetadata?.camera || ""}`.toLowerCase()
        if (selectedFormat === "120") {
          return (
            format === "120" ||
            combined.includes("120") ||
            combined.includes("rolleiflex") ||
            combined.includes("hasselblad")
          )
        }
        if (selectedFormat === "35mm") {
          return (
            format === "35mm" ||
            (!combined.includes("120") &&
              !combined.includes("rolleiflex") &&
              !combined.includes("hasselblad"))
          )
        }
        return true
      })
    }

    // 5. Camera Type Filter
    if (selectedCameraType !== "all") {
      result = result.filter((p) => p.cameraMetadata?.cameraType === selectedCameraType)
    }

    // 6. Dev Process Filter
    if (selectedProcess !== "all") {
      result = result.filter((p) => {
        const proc = p.cameraMetadata?.devProcess?.toLowerCase() || ""
        if (selectedProcess === "c-41") return proc.includes("c-41") || proc.includes("color")
        if (selectedProcess === "ecn-2") return proc.includes("ecn-2")
        if (selectedProcess === "b&w") return proc.includes("b&w") || proc.includes("black")
        return true
      })
    }

    // 7. ISO Filter
    if (selectedIso !== "all") {
      result = result.filter((p) => {
        const iso = p.cameraMetadata?.iso || 400
        if (selectedIso === "low") return iso <= 200
        if (selectedIso === "mid") return iso > 200 && iso <= 400
        if (selectedIso === "high") return iso >= 800
        return true
      })
    }

    // 8. Specific Tag Filter
    if (selectedTag !== "all") {
      const cleanTag = selectedTag.toLowerCase().replace(/^#/, "")
      result = result.filter((p) =>
        p.tags.some((t) => t.toLowerCase().replace(/^#/, "") === cleanTag)
      )
    }

    // 9. Sorting
    if (sortBy === "popular") {
      result.sort((a, b) => b.likesCount - a.likesCount)
    } else if (sortBy === "comments") {
      result.sort((a, b) => b.commentsCount - a.commentsCount)
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [
    posts,
    searchQuery,
    selectedStyle,
    selectedFilmStock,
    selectedFormat,
    selectedCameraType,
    selectedProcess,
    selectedIso,
    selectedTag,
    sortBy,
  ])

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const isLiked = !p.isLiked
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        }
      })
    )
  }

  const handleCreatePost = (newPost: UserFeedPost) => {
    setPosts((prev) => [newPost, ...prev])
  }

  // Handle clicking on tags or metadata from post cards
  const handleSelectFilter = (keyword: string) => {
    if (keyword.startsWith("#")) {
      setSelectedTag(keyword === selectedTag ? "all" : keyword)
      return
    }

    // Check if keyword matches a style
    const matchedStyle = FEED_STYLES.find(
      (s) => s.id === keyword || s.label.toLowerCase().includes(keyword.toLowerCase())
    )
    if (matchedStyle && matchedStyle.id !== "all") {
      setSelectedStyle(matchedStyle.id)
      return
    }

    // Otherwise pass to text search
    setSearchQuery(keyword)
  }

  const resetAllFilters = () => {
    setSearchQuery("")
    setSelectedStyle("all")
    setSelectedFilmStock("all")
    setSelectedFormat("all")
    setSelectedCameraType("all")
    setSelectedProcess("all")
    setSelectedIso("all")
    setSelectedTag("all")
    setSortBy("latest")
  }

  return (
    <div className="feed-font-stack w-full">
      <section aria-labelledby="feed-title" className="mx-auto w-full max-w-[640px] min-w-0 pb-12">
        {/* Header */}
        <header className="flex h-[72px] items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold leading-[25px] tracking-tight" id="feed-title">
              For you
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-[rgb(74,93,249)]/10 px-2.5 py-0.5 text-xs font-semibold text-[rgb(74,93,249)]">
              <Sparkles className="size-3" />
              Analog Feed
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {filteredPosts.length} / {posts.length} bài viết
          </span>
        </header>

        <div className="flex flex-col gap-3">
          {/* Feed Search Input with live auto-suggestions & filter toggle button */}
          <FeedSearch
            activeFilterCount={activeFilterCount}
            isFilterPanelOpen={isFilterPanelOpen}
            onChange={setSearchQuery}
            onToggleFilterPanel={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            value={searchQuery}
          />

          {/* Trending Tags Quick Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none text-xs">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground shrink-0 pr-1">
              <Hash className="size-3 text-[rgb(74,93,249)]" />
              <span>Thịnh hành:</span>
            </div>
            {POPULAR_FEED_TAGS.map((tag) => {
              const isSelected = selectedTag === tag
              return (
                <button
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[rgb(74,93,249)] text-white shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? "all" : tag)}
                  type="button"
                >
                  {tag}
                </button>
              )
            })}
          </div>

          {/* Quick Style Tabs */}
          <div className="flex items-center justify-between gap-2 rounded-2xl border border-border/80 bg-muted/20 p-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 shrink-0 pl-1">
                <Palette className="size-3 text-purple-500" /> Phong cách:
              </span>
              {FEED_STYLES.map((style) => {
                const isSelected = selectedStyle === style.id
                return (
                  <button
                    className={`shrink-0 rounded-xl px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-purple-600 text-white shadow-sm"
                        : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                    }`}
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    type="button"
                  >
                    {style.label}
                  </button>
                )
              })}
            </div>

            {/* Sort Dropdown Menu */}
            <div className="shrink-0 pl-1 border-l border-border/60">
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Sắp xếp bài viết"
                  className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  {sortBy === "popular" ? (
                    <>
                      <Flame className="size-3 text-red-500" />
                      <span className="hidden sm:inline">Nhiều like</span>
                    </>
                  ) : sortBy === "comments" ? (
                    <>
                      <MessageCircle className="size-3 text-blue-500" />
                      <span className="hidden sm:inline">Thảo luận</span>
                    </>
                  ) : (
                    <>
                      <Clock className="size-3 text-muted-foreground" />
                      <span className="hidden sm:inline">Mới nhất</span>
                    </>
                  )}
                  <ChevronDown className="size-3 text-muted-foreground opacity-60" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 text-xs">
                  <DropdownMenuItem
                    className={`cursor-pointer gap-2 py-1.5 ${sortBy === "latest" ? "font-bold text-primary" : ""}`}
                    onClick={() => setSortBy("latest")}
                  >
                    <Clock className="size-3.5 text-muted-foreground" />
                    <span>Mới nhất</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`cursor-pointer gap-2 py-1.5 ${sortBy === "popular" ? "font-bold text-primary" : ""}`}
                    onClick={() => setSortBy("popular")}
                  >
                    <Flame className="size-3.5 text-red-500" />
                    <span>Nhiều like nhất</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`cursor-pointer gap-2 py-1.5 ${sortBy === "comments" ? "font-bold text-primary" : ""}`}
                    onClick={() => setSortBy("comments")}
                  >
                    <MessageCircle className="size-3.5 text-blue-500" />
                    <span>Nhiều thảo luận nhất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Advanced Metadata Filter Panel (Shadcn UI Selects) */}
          {isFilterPanelOpen && (
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-[rgb(74,93,249)]" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Bộ lọc thông số ảnh &amp; thiết bị
                  </h3>
                  {activeFilterCount > 0 && (
                    <Badge className="bg-[rgb(74,93,249)]/10 text-[rgb(74,93,249)] text-xs font-semibold">
                      {activeFilterCount} tiêu chí
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
                    onClick={() => setIsFilterPanelOpen(false)}
                    type="button"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3.5 text-xs">
                {/* 1. Dòng máy ảnh */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1">
                    <Camera className="size-3" /> Dòng máy ảnh:
                  </span>
                  <Select
                    onValueChange={(val) => setSelectedCameraType((val as any) ?? "all")}
                    value={selectedCameraType}
                  >
                    <SelectTrigger aria-label="Lọc theo dòng máy" className="w-full text-xs h-9 rounded-xl">
                      <SelectValue placeholder="Chọn dòng máy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Tất cả dòng máy</SelectItem>
                        <SelectItem value="SLR">SLR (Canon AE-1, Olympus OM-1)</SelectItem>
                        <SelectItem value="Rangefinder">Rangefinder (Leica M, Contax G)</SelectItem>
                        <SelectItem value="TLR">TLR (Rolleiflex 2.8F)</SelectItem>
                        <SelectItem value="Medium Format">Medium Format (Hasselblad)</SelectItem>
                        <SelectItem value="Point & Shoot">Point &amp; Shoot (Olympus Mju)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Khổ phim */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1">
                    <Film className="size-3" /> Khổ phim (Format):
                  </span>
                  <Select
                    onValueChange={(val) => setSelectedFormat((val as any) ?? "all")}
                    value={selectedFormat}
                  >
                    <SelectTrigger aria-label="Lọc theo khổ phim" className="w-full text-xs h-9 rounded-xl">
                      <SelectValue placeholder="Chọn khổ phim" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Tất cả khổ phim</SelectItem>
                        <SelectItem value="35mm">35mm (Khổ tiêu chuẩn 135)</SelectItem>
                        <SelectItem value="120">120 (Medium format khổ vuông/chữ nhật)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. Dòng film stock phổ biến */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1">
                    <Film className="size-3" /> Dòng Film Stock:
                  </span>
                  <Select
                    onValueChange={(val) => setSelectedFilmStock(val ?? "all")}
                    value={selectedFilmStock}
                  >
                    <SelectTrigger aria-label="Lọc theo film stock" className="w-full text-xs h-9 rounded-xl">
                      <SelectValue placeholder="Chọn film stock" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Tất cả film stock</SelectItem>
                        <SelectItem value="portra">Kodak Portra (160/400/800)</SelectItem>
                        <SelectItem value="cinestill">Cinestill (800T/50D)</SelectItem>
                        <SelectItem value="ilford">Ilford B&amp;W (HP5/Delta)</SelectItem>
                        <SelectItem value="gold">Kodak Gold 200</SelectItem>
                        <SelectItem value="fuji">Fujifilm (Pro 400H / Superia)</SelectItem>
                        <SelectItem value="ektar">Kodak Ektar 100</SelectItem>
                        <SelectItem value="tri-x">Kodak Tri-X 400</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. Quy trình tráng */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-muted-foreground">Quy trình tráng:</span>
                  <Select
                    onValueChange={(val) => setSelectedProcess((val as any) ?? "all")}
                    value={selectedProcess}
                  >
                    <SelectTrigger aria-label="Lọc theo quy trình tráng" className="w-full text-xs h-9 rounded-xl">
                      <SelectValue placeholder="Chọn quy trình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Tất cả quy trình</SelectItem>
                        <SelectItem value="c-41">Color (C-41) Màu chuẩn</SelectItem>
                        <SelectItem value="ecn-2">ECN-2 Điện ảnh</SelectItem>
                        <SelectItem value="b&w">B&amp;W Đen trắng thủ công</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* 5. Độ nhạy sáng (ISO) */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-muted-foreground">Độ nhạy sáng (ISO):</span>
                  <Select
                    onValueChange={(val) => setSelectedIso((val as any) ?? "all")}
                    value={selectedIso}
                  >
                    <SelectTrigger aria-label="Lọc theo ISO" className="w-full text-xs h-9 rounded-xl">
                      <SelectValue placeholder="Chọn dải ISO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Tất cả ISO</SelectItem>
                        <SelectItem value="low">ISO 100 - 200 (Ban ngày / Ngoài trời)</SelectItem>
                        <SelectItem value="mid">ISO 400 (Đa dụng hàng ngày)</SelectItem>
                        <SelectItem value="high">ISO 800 - 1600 (Ban đêm / Thiếu sáng)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* 6. Thứ tự sắp xếp */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1">
                    <ArrowUpDown className="size-3" /> Sắp xếp bài viết:
                  </span>
                  <Select
                    onValueChange={(val) => setSortBy((val as any) ?? "latest")}
                    value={sortBy}
                  >
                    <SelectTrigger aria-label="Sắp xếp bài viết" className="w-full text-xs h-9 rounded-xl">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="latest">Mới nhất (Thời gian ↓)</SelectItem>
                        <SelectItem value="popular">Nhiều like nhất (Yêu thích ↓)</SelectItem>
                        <SelectItem value="comments">Nhiều bình luận nhất</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/50 pt-3 mt-3">
                <span className="text-xs text-muted-foreground">
                  Đang lọc được: <strong className="text-foreground">{filteredPosts.length}</strong> bài viết
                </span>
                <Button
                  className="bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)]/90 text-xs h-8 rounded-xl"
                  onClick={() => setIsFilterPanelOpen(false)}
                  size="sm"
                >
                  Đóng &amp; Xem kết quả
                </Button>
              </div>
            </div>
          )}

          {/* Active Filter Chips Bar */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-muted/40 p-2 text-xs">
              <span className="text-muted-foreground font-semibold text-[11px] pr-1">Đang lọc:</span>

              {searchQuery && (
                <Badge
                  className="gap-1 rounded-md bg-background text-foreground border cursor-pointer hover:bg-muted"
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                >
                  <span>Tìm: &ldquo;{searchQuery}&rdquo;</span>
                  <X className="size-3" />
                </Badge>
              )}

              {selectedStyle !== "all" && (
                <Badge
                  className="gap-1 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30 cursor-pointer hover:bg-purple-500/20"
                  onClick={() => setSelectedStyle("all")}
                  variant="outline"
                >
                  <span>Phong cách: {FEED_STYLES.find((s) => s.id === selectedStyle)?.label}</span>
                  <X className="size-3" />
                </Badge>
              )}

              {selectedTag !== "all" && (
                <Badge
                  className="gap-1 rounded-md bg-[rgb(74,93,249)]/10 text-[rgb(74,93,249)] border-[rgb(74,93,249)]/30 cursor-pointer hover:bg-[rgb(74,93,249)]/20"
                  onClick={() => setSelectedTag("all")}
                  variant="outline"
                >
                  <span>Tag: {selectedTag}</span>
                  <X className="size-3" />
                </Badge>
              )}

              {selectedFormat !== "all" && (
                <Badge
                  className="gap-1 rounded-md bg-background text-foreground border cursor-pointer hover:bg-muted"
                  onClick={() => setSelectedFormat("all")}
                  variant="outline"
                >
                  <span>Khổ: {selectedFormat === "120" ? "120 Medium" : "35mm"}</span>
                  <X className="size-3" />
                </Badge>
              )}

              {selectedCameraType !== "all" && (
                <Badge
                  className="gap-1 rounded-md bg-background text-foreground border cursor-pointer hover:bg-muted"
                  onClick={() => setSelectedCameraType("all")}
                  variant="outline"
                >
                  <span>Dòng máy: {selectedCameraType}</span>
                  <X className="size-3" />
                </Badge>
              )}

              {selectedFilmStock !== "all" && (
                <Badge
                  className="gap-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 cursor-pointer hover:bg-amber-500/20"
                  onClick={() => setSelectedFilmStock("all")}
                  variant="outline"
                >
                  <span>Film: {selectedFilmStock}</span>
                  <X className="size-3" />
                </Badge>
              )}

              {selectedProcess !== "all" && (
                <Badge
                  className="gap-1 rounded-md bg-background text-foreground border cursor-pointer hover:bg-muted"
                  onClick={() => setSelectedProcess("all")}
                  variant="outline"
                >
                  <span>Quy trình: {selectedProcess.toUpperCase()}</span>
                  <X className="size-3" />
                </Badge>
              )}

              {selectedIso !== "all" && (
                <Badge
                  className="gap-1 rounded-md bg-background text-foreground border cursor-pointer hover:bg-muted"
                  onClick={() => setSelectedIso("all")}
                  variant="outline"
                >
                  <span>ISO: {selectedIso === "low" ? "100-200" : selectedIso === "mid" ? "400" : "800+"}</span>
                  <X className="size-3" />
                </Badge>
              )}

              <button
                className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-red-500 hover:underline cursor-pointer"
                onClick={resetAllFilters}
                type="button"
              >
                <RotateCcw className="size-3" />
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Create Post Box */}
          <CreatePostBox onPostCreated={handleCreatePost} />

          {/* Posts Feed or Empty State */}
          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/10 py-12 px-4 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Filter className="size-6" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Không tìm thấy bài viết nào phù hợp với bộ lọc hiện tại
                </p>
                <p className="text-xs text-muted-foreground pt-1 max-w-[400px]">
                  Thử tìm với từ khóa khác (ví dụ: &ldquo;portra&rdquo;, &ldquo;cinestill&rdquo;, &ldquo;leica&rdquo;) hoặc xóa các điều kiện lọc.
                </p>
              </div>
              <Button
                className="mt-1 text-xs rounded-xl"
                onClick={resetAllFilters}
                size="sm"
                variant="outline"
              >
                <RotateCcw className="size-3.5 mr-1" />
                Xóa tất cả bộ lọc
              </Button>
            </div>
          ) : (
            <ul aria-label="Bảng tin cộng đồng film" className="flex flex-col gap-4 list-none p-0 m-0">
              {filteredPosts.map((post) => (
                <li key={post.id}>
                  <PostCard
                    onSelectFilter={handleSelectFilter}
                    onToggleLike={handleToggleLike}
                    post={post}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="pt-8 text-center text-xs text-muted-foreground">
          FilmLink Community — Khám phá &amp; chia sẻ nhiếp ảnh film theo phong cách, thiết bị và thông số thật.
        </p>
      </section>
    </div>
  )
}
