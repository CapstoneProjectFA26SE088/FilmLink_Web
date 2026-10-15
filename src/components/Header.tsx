"use client"

import { ArrowRight, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useLandingNav } from "@/hooks/use-landing-nav"
import { NAV_ITEMS } from "@/lib/landing-data"
import { cn } from "@/lib/utils"

function HeaderLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg"
      aria-label="FilmLink Home"
    >
      <div className="relative size-8 overflow-hidden rounded-md">
        <Image
          src="/mini_logo.png"
          alt="FilmLink Canister Logo"
          fill
          className="object-contain"
          priority
          sizes="32px"
        />
      </div>
      <span className="text-xl font-black tracking-tight text-zinc-900">
        Film<span className="text-[#e24a4a]">Link</span>
      </span>
    </Link>
  )
}

function DesktopNavigation({
  activeSection,
  onNavigate,
}: {
  activeSection: string
  onNavigate: (href: string) => void
}) {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden md:flex items-center gap-1 rounded-full border border-zinc-200/80 bg-white/80 px-2 py-1 shadow-xs backdrop-blur-md"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.href)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer",
              isActive
                ? "bg-zinc-900 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/60"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

function HeaderCTA() {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Link
        href="/login"
        className="hidden sm:inline-flex text-xs font-semibold text-zinc-700 hover:text-zinc-950 px-2 py-1.5 transition-colors"
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className="inline-flex items-center gap-1.5 rounded-full bg-[#D94848] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-[#D94848]/20 transition-all duration-200 hover:bg-[#C83E3E] hover:shadow-lg hover:shadow-[#D94848]/30 hover:-translate-y-0.5 active:translate-y-0"
      >
        <span>Get Started</span>
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  const {
    activeSection,
    isScrolled,
    mobileMenuOpen,
    setMobileMenuOpen,
    scrollToSection,
  } = useLandingNav()

  // Distraction-free authentication pages
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/feed" ||
    pathname.startsWith("/feed/") ||
    pathname === "/search" ||
    pathname.startsWith("/search/") ||
    pathname === "/film-lab-owner" ||
    pathname.startsWith("/film-lab-owner/")
  ) {
    return null
  }

  return (
    <header
      id="site-header"
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-zinc-200/80 bg-white/90 backdrop-blur-md shadow-xs py-3"
          : "bg-transparent py-4 sm:py-5"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <HeaderLogo />
        </div>

        {/* Center: Desktop Nav Pills */}
        <div className="hidden md:flex items-center justify-center">
          <DesktopNavigation
            activeSection={activeSection}
            onNavigate={scrollToSection}
          />
        </div>

        {/* Right: CTA & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <HeaderCTA />

          {/* Mobile Menu Sheet */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger
                id="mobile-menu-trigger"
                aria-label="Open mobile navigation menu"
                className="flex size-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-xs hover:bg-zinc-50 transition-colors"
              >
                <Menu className="size-4" />
              </SheetTrigger>

              <SheetContent side="right" className="w-72 bg-white p-0 text-zinc-900 border-l border-zinc-200">
                <SheetHeader className="border-b border-zinc-100 p-6 flex flex-row items-center justify-between">
                  <SheetTitle>
                    <HeaderLogo />
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-1.5 p-4" aria-label="Mobile navigation">
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeSection === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToSection(item.href)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors text-left",
                          isActive
                            ? "bg-zinc-900 text-white"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                        )}
                      >
                        <span>{item.label}</span>
                        {isActive && <span className="size-1.5 rounded-full bg-rose-400" />}
                      </button>
                    )
                  })}
                </nav>

                <div className="mt-auto border-t border-zinc-100 p-6 flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors"
                  >
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D94848] py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#C83E3E] transition-colors"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
