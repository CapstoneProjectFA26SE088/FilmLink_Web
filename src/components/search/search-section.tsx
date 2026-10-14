import { Funnel, Search as SearchIcon, Star } from "lucide-react"
import { SocialPageLayout } from "@/components/social/social-page-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { VERIFIED_FILM_LABS } from "@/lib/landing-data"

const suggestedSearches = [
  "Kodak Portra 400",
  "Leica M6",
  "C-41 Home Dev",
  "Ilford HP5 Plus",
  "35mm vs 120",
  "Cinestill",
]

function SearchBar() {
  return (
    <div className="relative flex w-full items-center gap-2">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        aria-label="Tìm kiếm"
        className="h-9 rounded-[14px] border-border bg-muted/50 pr-11 pl-11 text-[15px] shadow-none"
        placeholder="Search"
        readOnly
      />
      <Button
        aria-label="Bộ lọc tìm kiếm"
        className="absolute right-0 size-9 text-muted-foreground disabled:opacity-100"
        disabled
        size="icon"
        variant="ghost"
      >
        <Funnel aria-hidden="true" />
      </Button>
    </div>
  )
}

function SuggestedSearchChips() {
  return (
    <section
      aria-label="Từ khóa gợi ý"
      className="flex gap-2 overflow-x-auto overflow-y-hidden py-1"
    >
      {suggestedSearches.map((search) => (
        <Badge
          className="h-9 shrink-0 rounded-full px-4 text-sm font-normal"
          key={search}
          variant="secondary"
        >
          {search}
        </Badge>
      ))}
    </section>
  )
}

function FilmLabResults() {
  return (
    <section aria-labelledby="film-lab-results-title" className="flex flex-col gap-4">
      <header className="flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <h2 className="text-base font-semibold leading-6" id="film-lab-results-title">
            Lọc Film Lab
          </h2>
          <p className="pt-1 text-sm leading-5 text-muted-foreground">
            Các lab tráng quét phim được đề xuất theo thông tin hiện có.
          </p>
        </div>
        <span className="shrink-0 pt-1 text-xs text-muted-foreground">Bộ lọc tương thích</span>
      </header>
      <ul
        aria-label="Danh sách Film Lab mẫu"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {VERIFIED_FILM_LABS.map((lab, index) => (
          <li className="list-none" key={lab.id}>
            <Card className="h-full gap-0 rounded-2xl border-border p-4 shadow-none ring-1 ring-foreground/5">
              <CardHeader className="flex-row items-start justify-between gap-3 p-0">
                <CardTitle className="text-[15px] font-semibold leading-5">{lab.name}</CardTitle>
                <span className="shrink-0 text-xs leading-5 text-muted-foreground">#{index + 1}</span>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col p-0">
                <p className="pt-2 text-sm leading-5 text-muted-foreground">
                  {lab.processes.join(", ")} · {lab.turnaround}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs leading-[18px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Star aria-hidden="true" className="size-3.5 fill-amber-400 text-amber-400" />
                    {lab.rating.toFixed(1)} ({lab.reviewCount.toLocaleString("en-US")} reviews)
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {lab.city}, {lab.country}
                  </span>
                </div>
                <div className="mt-auto flex flex-wrap justify-end gap-2 pt-4">
                  <Button
                    className="h-9 rounded-full px-4 disabled:opacity-100"
                    disabled
                    size="sm"
                    variant="outline"
                  >
                    Xem chi tiết
                  </Button>
                  <Button className="h-9 rounded-full px-4 disabled:opacity-100" disabled size="sm">
                    Chọn Lab
                  </Button>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function SearchLayout() {
  return (
    <SocialPageLayout activePage="search">
      <section
        aria-label="Tìm Film Lab"
        className="mx-auto flex w-full max-w-[1088px] min-w-0 flex-col gap-4"
      >
        <header className="flex h-[72px] w-full items-center justify-center">
          <div className="w-full max-w-[640px]">
            <SearchBar />
          </div>
        </header>
        <div className="mx-auto w-full max-w-[640px]">
          <SuggestedSearchChips />
        </div>
        <FilmLabResults />
        <p className="pt-2 text-center text-xs text-muted-foreground">
          A space for conversations, not distractions.
        </p>
      </section>
    </SocialPageLayout>
  )
}
