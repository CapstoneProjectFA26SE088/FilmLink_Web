import { Search as SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function FeedSearch() {
  return (
    <div className="relative" id="search">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        aria-label="Tìm kiếm"
        className="h-9 rounded-[14px] border-border bg-muted/50 pl-11 text-[15px] shadow-none"
        placeholder="Search"
        readOnly
      />
    </div>
  )
}
