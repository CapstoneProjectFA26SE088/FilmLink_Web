import { Search as SearchIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface FeedSearchProps {
  value?: string
  onChange?: (value: string) => void
}

export function FeedSearch({ value = "", onChange }: FeedSearchProps) {
  return (
    <div className="relative" id="search">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        aria-label="Tìm kiếm bài viết, loại phim hoặc máy ảnh"
        className="h-10 rounded-[14px] border-border bg-muted/50 pr-9 pl-11 text-[15px] shadow-none focus-visible:bg-background transition-colors"
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Tìm kiếm bài viết, loại phim (#portra, #ilford) hoặc máy ảnh..."
        value={value}
      />
      {value && (
        <button
          aria-label="Xóa tìm kiếm"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={() => onChange?.("")}
          type="button"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
