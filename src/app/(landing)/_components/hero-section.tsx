import { ArrowRight, Film } from "lucide-react"
import Link from "next/link"
import { SectionBadge } from "./shared/section-badge"

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pt-12 pb-8 sm:pt-20 sm:pb-12 text-center"
    >
      {/* Soft warm radial glow background */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 flex justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="h-[480px] w-[860px] rounded-full bg-gradient-to-b from-rose-200/50 via-rose-100/30 to-transparent blur-3xl opacity-80" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Eyebrow Pill */}
        <div className="mb-6">
          <SectionBadge variant="coral">Film Photography Reimagined</SectionBadge>
        </div>

        {/* Main Headline */}
        <h1
          id="hero-title"
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-900 leading-[1.1] max-w-4xl"
        >
          From Film Roll to{" "}
          <span className="block mt-1 bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-400 bg-clip-text text-transparent">
            Digital Memory
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-zinc-600 font-normal leading-relaxed">
          FilmLink is the all-in-one platform connecting film photographers, labs, and enthusiasts
          worldwide. Powered by AI.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
          <Link
            href="#ai-features"
            className="inline-flex items-center gap-2 rounded-full bg-[#e24a4a] px-6 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-200 hover:bg-[#d43f3f] hover:shadow-xl hover:shadow-rose-500/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Explore Features</span>
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="#film-labs"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-zinc-800 shadow-xs transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            <Film className="size-4 text-zinc-600" />
            <span>Find Film Labs</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
