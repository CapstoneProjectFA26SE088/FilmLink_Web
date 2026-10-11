"use client"

import { cn } from "cn"
import {
  Bell,
  Bookmark,
  ChevronDown,
  Clapperboard,
  Film,
  Flame,
  LogOut,
  Menu,
  Search,
  Settings,
  Star,
  TrendingUp,
  Tv2,
  User,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Movies", href: "/movies", icon: Film },
  { label: "TV Shows", href: "/tv-shows", icon: Tv2 },
  { label: "Trending", href: "/trending", icon: TrendingUp },
  { label: "New & Hot", href: "/new-hot", icon: Flame },
]

const NOTIFICATION_COUNT = 3

// ─── Sub-components ───────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2 shrink-0" aria-label="FilmLink Home">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg shadow-rose-500/30 transition-transform duration-200 group-hover:scale-110">
        <Clapperboard className="h-4 w-4 text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight text-white">
        Film<span className="text-rose-400">Link</span>
      </span>
    </Link>
  )
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  "hover:bg-white/10 hover:text-white",
                  isActive
                    ? "text-white after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-rose-400"
                    : "text-zinc-400"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function SearchBar() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [])

  return (
    <div className="relative flex items-center">
      {!open && (
        <Button
          variant="ghost"
          size="icon"
          id="header-search-toggle"
          aria-label="Open search"
          className="text-zinc-400 hover:bg-white/10 hover:text-white"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4" />
        </Button>
      )}

      {open && (
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right-4 fade-in-0">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            id="header-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search films, shows…"
            className="w-56 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
            aria-label="Search FilmLink"
          />
          <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:block">
            ESC
          </kbd>
          <button
            type="button"
            aria-label="Close search"
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
            onClick={() => {
              setOpen(false)
              setQuery("")
            }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

function NotificationBell() {
  return (
    <Button
      variant="ghost"
      size="icon"
      id="header-notifications"
      aria-label={`${NOTIFICATION_COUNT} notifications`}
      className="relative text-zinc-400 hover:bg-white/10 hover:text-white"
    >
      <Bell className="h-4 w-4" />
      {NOTIFICATION_COUNT > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
        </span>
      )}
    </Button>
  )
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        id="header-user-menu"
        aria-label="User menu"
        className="group flex items-center gap-2 rounded-xl p-1 transition-all duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50"
      >
        <Avatar className="h-8 w-8 ring-2 ring-white/10 ring-offset-1 ring-offset-transparent transition-all group-hover:ring-rose-400/50">
          <AvatarImage src="/avatar.png" alt="User avatar" />
          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-orange-500 text-xs font-semibold text-white">
            FL
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-xl border-white/10 bg-zinc-900/95 backdrop-blur-xl"
      >
        <DropdownMenuLabel className="flex flex-col gap-0.5 px-3 py-2">
          <span className="text-sm font-medium text-white">Film Fan</span>
          <span className="text-xs text-zinc-400">filmfan@example.com</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem>
          <Link
            href="/profile"
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            href="/watchlist"
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          >
            <Bookmark className="h-4 w-4" />
            Watchlist
            <Badge
              variant="secondary"
              className="ml-auto text-[10px] h-4 bg-rose-500/20 text-rose-400 border-0"
            >
              12
            </Badge>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            href="/reviews"
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          >
            <Star className="h-4 w-4" />
            My Reviews
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem>
          <Link
            href="/settings"
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            href="/login"
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 focus:bg-rose-500/10 focus:text-rose-300"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button
          variant="ghost"
          size="icon"
          id="header-mobile-menu"
          aria-label="Open navigation menu"
          className="md:hidden text-zinc-400 hover:bg-white/10 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-72 border-white/10 bg-zinc-950/95 p-0 backdrop-blur-xl"
      >
        <SheetHeader className="border-b border-white/10 px-6 py-4">
          <SheetTitle>
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-orange-500">
                <Clapperboard className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Film<span className="text-rose-400">Link</span>
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-rose-500/15 text-rose-300"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="mx-4 border-t border-white/10 pt-4">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-gradient-to-br from-rose-500 to-orange-500 text-[10px] text-white">
                FL
              </AvatarFallback>
            </Avatar>
            Film Fan
          </Link>
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      id="site-header"
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/8 bg-zinc-950/85 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "bg-gradient-to-b from-zinc-950/90 to-transparent backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile hamburger + Logo */}
        <div className="flex items-center gap-3">
          <MobileMenu pathname={pathname} />
          <Logo />
        </div>

        {/* Center: Desktop nav */}
        <div className="hidden flex-1 md:flex md:items-center md:justify-center">
          <DesktopNav pathname={pathname} />
        </div>

        {/* Right: Search, Notifications, User */}
        <div className="ml-auto flex items-center gap-1">
          <SearchBar />
          <NotificationBell />
          <div className="ml-1">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
