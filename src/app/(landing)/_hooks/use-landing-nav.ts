"use client"

import { useCallback, useEffect, useState } from "react"
import type { NavKey } from "@/types"

export interface UseLandingNavReturn {
  activeSection: NavKey
  isScrolled: boolean
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  scrollToSection: (sectionId: string) => void
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
 * and handle navigation interactions.
 */
export function useLandingNav(): UseLandingNavReturn {
  const [activeSection, setActiveSection] = useState<NavKey>("home")
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      // 1. Track scroll header elevation
      setIsScrolled(window.scrollY > 20)

      // 2. Determine active section based on scroll offset
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
  }, [])

  const scrollToSection = useCallback((sectionId: string) => {
    setMobileMenuOpen(false)
    const cleanId = sectionId.replace("#", "")
    const element = document.getElementById(cleanId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }, [])

  return {
    activeSection,
    isScrolled,
    mobileMenuOpen,
    setMobileMenuOpen,
    scrollToSection,
  }
}
