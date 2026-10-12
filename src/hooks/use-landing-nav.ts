"use client"

import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import type { NavKey } from "@/types"

export interface UseLandingNavReturn {
  activeSection: NavKey
  isScrolled: boolean
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  handleNavigate: (href: string) => void
}

const SECTION_IDS: { id: string; key: NavKey }[] = [
  { id: "hero", key: "home" },
  { id: "ai-features", key: "features" },
  { id: "workflow", key: "workflow" },
  { id: "film-labs", key: "labs" },
  { id: "community", key: "community" },
]

/**
 * Custom React hook to track scroll position, current active nav section,
 * route state, and handle multi-page and anchor navigation smoothly.
 */
export function useLandingNav(): UseLandingNavReturn {
  const pathname = usePathname()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<NavKey>("home")
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    // If on /labs, mark labs as active
    if (pathname.startsWith("/labs")) {
      setActiveSection("labs")
      return
    }

    if (pathname !== "/") {
      setActiveSection("home")
      return
    }

    const handleScroll = () => {
      // 1. Track scroll header elevation
      setIsScrolled(window.scrollY > 20)

      // 2. Determine active section on homepage based on scroll offset
      const scrollPosition = window.scrollY + 200

      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const item = SECTION_IDS[i]
        const element = document.getElementById(item.id)
        if (element) {
          const top = element.offsetTop
          if (scrollPosition >= top) {
            setActiveSection(item.key)
            return
          }
        }
      }

      setActiveSection("home")
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [pathname])

  const handleNavigate = useCallback(
    (href: string) => {
      setMobileMenuOpen(false)

      // 1. Full page route like /labs
      if (href === "/labs") {
        router.push("/labs")
        return
      }

      // 2. Anchor route on home (/#hero or /)
      if (href === "/" || href === "/#hero") {
        if (pathname === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" })
        } else {
          router.push("/")
        }
        return
      }

      // 3. Anchor routes like /#ai-features, /#workflow, /#community
      if (href.startsWith("/#") || href.startsWith("#")) {
        const sectionId = href.replace(/^\/?#/, "")
        if (pathname === "/") {
          const element = document.getElementById(sectionId)
          if (element) {
            const headerOffset = 80
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            })
            return
          }
        }
        // If not on homepage or element not found, navigate to home anchor
        router.push(`/#${sectionId}`)
      }
    },
    [pathname, router]
  )

  return {
    activeSection,
    isScrolled,
    mobileMenuOpen,
    setMobileMenuOpen,
    handleNavigate,
  }
}
