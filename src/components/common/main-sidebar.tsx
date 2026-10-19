"use client"

import {
  Banknote,
  Building2,
  CircleHelp,
  ClipboardList,
  GalleryVerticalEnd,
  Home,
  type LucideIcon,
  MapPin,
  Package,
  Search,
  Settings,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LAB_OWNER_NAV, type NavRole, USER_NAV } from "@/config/navigation"

const NAV_ICONS: Record<string, LucideIcon> = {
  banknote: Banknote,
  building: Building2,
  "clipboard-list": ClipboardList,
  "gallery-vertical-end": GalleryVerticalEnd,
  home: Home,
  "map-pin": MapPin,
  package: Package,
  search: Search,
  users: Users,
}

type MainSidebarProps = {
  role: NavRole
}

export function MainSidebar({ role }: MainSidebarProps) {
  const pathname = usePathname()
  const items = role === "lab-owner" ? LAB_OWNER_NAV : USER_NAV

  return (
    <aside className="group/sidebar fixed inset-y-0 left-0 z-40 flex w-[72px] flex-col items-start justify-between overflow-hidden bg-white px-3 py-6 transition-[width] duration-200 ease-out hover:w-[245px] focus-within:w-[245px]">
      <Link
        aria-label="FilmLink feed"
        className="flex h-14 w-[220px] shrink-0 items-center gap-4 rounded-xl px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href="/feed"
      >
        <span className="flex size-6 shrink-0 items-center justify-center font-sans text-[28px] leading-none tracking-[-0.08em]">
          fl.
        </span>
      </Link>

      <nav
        aria-label="Main navigation"
        className="my-auto flex max-h-[calc(100dvh-12rem)] w-[220px] flex-col gap-1 overflow-y-auto py-4"
      >
        {items.map(({ label, href, icon }) => {
          const isActive = href ? pathname === href || pathname.startsWith(`${href}/`) : false
          const Icon = NAV_ICONS[icon] ?? CircleHelp
          const content = (
            <>
              <Icon aria-hidden="true" className="size-6 shrink-0" />
              <span
                className={`whitespace-nowrap text-sm leading-[18px] opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100 ${isActive ? "font-semibold" : ""}`}
              >
                {label}
              </span>
            </>
          )

          if (!href) {
            return (
              <Button
                className="h-14 w-full shrink-0 justify-start gap-4 rounded-xl px-3 text-muted-foreground disabled:opacity-100"
                disabled
                key={label}
                title={`${label} page is not available yet`}
                variant="ghost"
              >
                {content}
              </Button>
            )
          }

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`flex h-14 shrink-0 items-center gap-4 rounded-xl px-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              href={href}
              key={href}
            >
              {content}
            </Link>
          )
        })}
      </nav>

      <Button
        aria-label="Settings"
        className="h-14 w-[220px] justify-start gap-4 rounded-xl px-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg:not([class*='size-'])]:size-6 disabled:opacity-100"
        disabled
        variant="ghost"
      >
        <Settings aria-hidden="true" />
        <span className="whitespace-nowrap text-sm leading-[18px] opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100">
          Settings
        </span>
      </Button>
    </aside>
  )
}
