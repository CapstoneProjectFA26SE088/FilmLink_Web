import { Home, Search as SearchIcon, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type SocialSidebarProps = {
  activePage: "feed" | "search"
}

export function SocialSidebar({ activePage }: SocialSidebarProps) {
  return (
    <aside className="group/sidebar fixed inset-y-0 left-0 z-40 flex w-[72px] flex-col items-start justify-between overflow-hidden bg-white px-3 py-6 transition-[width] duration-200 ease-out hover:w-[245px] focus-within:w-[245px]">
      <Link
        aria-label="FilmLink feed"
        className="flex h-14 w-[220px] shrink-0 items-center gap-4 rounded-xl px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href="/feed"
      >
        <span className="flex size-6 shrink-0 items-center justify-center font-serif text-[28px] leading-none tracking-[-0.08em]">
          fl.
        </span>
      </Link>

      <nav aria-label="Điều hướng chính" className="flex w-[220px] flex-col gap-1 py-4">
        <Link
          aria-current={activePage === "feed" ? "page" : undefined}
          className={`flex h-14 shrink-0 items-center gap-4 rounded-xl px-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activePage === "feed" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          href="/feed"
        >
          <Home aria-hidden="true" className="size-6 shrink-0" />
          <span
            className={`whitespace-nowrap text-sm leading-[18px] opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100 ${activePage === "feed" ? "font-semibold" : ""}`}
          >
            Home
          </span>
        </Link>
        <Link
          aria-current={activePage === "search" ? "page" : undefined}
          className={`flex h-14 shrink-0 items-center gap-4 rounded-xl px-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activePage === "search" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          href="/search"
        >
          <SearchIcon aria-hidden="true" className="size-6 shrink-0" />
          <span
            className={`whitespace-nowrap text-sm leading-[18px] opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100 ${activePage === "search" ? "font-semibold" : ""}`}
          >
            Search
          </span>
        </Link>
      </nav>

      <Button
        aria-label="Settings"
        className="h-14 w-[220px] justify-start gap-4 rounded-xl px-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg:not([class*='size-'])]:size-6 disabled:opacity-100"
        variant="ghost"
        disabled
      >
        <Settings aria-hidden="true" />
        <span className="whitespace-nowrap text-sm leading-[18px] opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100">
          Settings
        </span>
      </Button>
    </aside>
  )
}
