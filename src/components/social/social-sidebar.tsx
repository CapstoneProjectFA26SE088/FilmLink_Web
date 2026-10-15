import {
  Banknote,
  Building2,
  ClipboardList,
  GalleryVerticalEnd,
  Home,
  MapPin,
  Package,
  Search as SearchIcon,
  Settings,
  Users,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type SocialSidebarProps = {
  activePage: "feed" | "search" | "film-lab-owner" | "customer-orders"
}

export function SocialSidebar({ activePage }: SocialSidebarProps) {
  const navigationItems =
    activePage === "film-lab-owner" || activePage === "customer-orders"
      ? [
          {
            label: "Dashboard",
            href: "/film-lab-owner",
            page: "film-lab-owner" as const,
            Icon: Building2,
          },
          {
            label: "Customer Orders",
            href: "/film-lab-owner/customer-orders",
            page: "customer-orders" as const,
            Icon: ClipboardList,
          },
          { label: "Packages", Icon: Package },
          { label: "Lab Profile", Icon: MapPin },
          { label: "Consignment Feed", Icon: GalleryVerticalEnd },
          { label: "Customers", Icon: Users },
          { label: "Revenue", Icon: Banknote },
          { label: "Reports", Icon: ClipboardList },
        ]
      : [
          { label: "Home", href: "/feed", page: "feed" as const, Icon: Home, disabled: false },
          {
            label: "Search",
            href: "/search",
            page: "search" as const,
            Icon: SearchIcon,
            disabled: false,
          },
        ]

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
        {navigationItems.map(({ label, href, page, Icon }) => {
          const isActive = activePage === page
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
              key={page}
            >
              {content}
            </Link>
          )
        })}
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
