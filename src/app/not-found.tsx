import { Compass, Film, Home, Search } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "404 - Blank Negative | FilmLink",
  description: "The frame you are looking for has not been developed or does not exist.",
}

const SPROCKET_IDS = ["sp-1", "sp-2", "sp-3", "sp-4", "sp-5", "sp-6"]

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-b from-zinc-50 via-white to-zinc-50/50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-2xl text-center">
        {/* Analog Film Negative Graphic Frame */}
        <div className="relative mx-auto mb-8 max-w-lg overflow-hidden rounded-2xl border-2 border-zinc-900 bg-zinc-950 p-6 text-zinc-300 shadow-2xl">
          {/* Top Sprocket Holes */}
          <div
            className="flex items-center justify-between border-b border-zinc-800 pb-3"
            aria-hidden="true"
          >
            <div className="flex gap-2">
              {SPROCKET_IDS.map((id) => (
                <div
                  key={`top-left-${id}`}
                  className="size-3.5 rounded-[3px] border border-zinc-800 bg-zinc-900 shadow-inner"
                />
              ))}
            </div>
            <span className="font-mono text-[11px] tracking-widest text-amber-500/90 uppercase font-semibold">
              KODAK SAFETY FILM • EXP 404
            </span>
            <div className="flex gap-2">
              {SPROCKET_IDS.map((id) => (
                <div
                  key={`top-right-${id}`}
                  className="size-3.5 rounded-[3px] border border-zinc-800 bg-zinc-900 shadow-inner"
                />
              ))}
            </div>
          </div>

          {/* Central Negative Viewport */}
          <div className="relative my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/60 p-8 sm:p-12 overflow-hidden">
            {/* Soft Warm Halation Glow */}
            <div className="pointer-events-none absolute inset-0 bg-radial from-[#e24a4a]/15 via-transparent to-transparent opacity-80" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-3 inline-flex size-14 items-center justify-center rounded-2xl bg-zinc-800 text-rose-400 ring-1 ring-zinc-700 shadow-md">
                <Film className="size-7" />
              </div>

              <div className="font-mono text-xs uppercase tracking-widest text-amber-400/90 font-semibold mb-1">
                [ FRAME 00 / 36 • UNEXPOSED ]
              </div>

              <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                4<span className="text-[#e24a4a]">0</span>4
              </h1>

              <p className="mt-2 text-sm sm:text-base font-medium text-zinc-300">
                Blank Negative: Frame Not Found
              </p>
            </div>
          </div>

          {/* Bottom Sprocket Holes */}
          <div
            className="flex items-center justify-between border-t border-zinc-800 pt-3"
            aria-hidden="true"
          >
            <div className="flex gap-2">
              {SPROCKET_IDS.map((id) => (
                <div
                  key={`bot-left-${id}`}
                  className="size-3.5 rounded-[3px] border border-zinc-800 bg-zinc-900 shadow-inner"
                />
              ))}
            </div>
            <span className="font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
              ISO 400 • SILVER HALIDE
            </span>
            <div className="flex gap-2">
              {SPROCKET_IDS.map((id) => (
                <div
                  key={`bot-right-${id}`}
                  className="size-3.5 rounded-[3px] border border-zinc-800 bg-zinc-900 shadow-inner"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="mx-auto max-w-md text-sm sm:text-base text-zinc-600">
          The roll leader may have slipped out, or this frame was lost during fixing. Don't worry —
          your other analog memories and labs are safe in the darkroom!
        </p>

        {/* Quick Search Action */}
        <div className="mx-auto mt-6 max-w-md">
          <form
            action="/labs"
            method="get"
            className="flex items-center rounded-full border border-zinc-200 bg-white p-1.5 shadow-xs focus-within:border-zinc-400 focus-within:shadow-md transition-all"
          >
            <div className="pl-3.5 pr-2 text-zinc-400">
              <Search className="size-4" />
            </div>
            <input
              type="text"
              name="q"
              placeholder="Search labs by city, country, or process..."
              className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-400 outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-black transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Navigation Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#e24a4a] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#e24a4a]/20 transition-all hover:bg-[#cf3f3f] hover:shadow-lg hover:shadow-[#e24a4a]/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Home className="size-4" />
            <span>Return to Darkroom (Home)</span>
          </Link>

          <Link
            href="/labs"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-xs transition-all hover:border-zinc-300 hover:bg-zinc-50"
          >
            <Compass className="size-4 text-zinc-500" />
            <span>Browse Film Labs</span>
          </Link>
        </div>

        {/* Secondary Helpful Links */}
        <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
          <Link
            href="/#ai-features"
            className="hover:text-zinc-900 hover:underline transition-colors"
          >
            AI Grain & Restoration
          </Link>
          <span className="text-zinc-300">•</span>
          <Link href="/#workflow" className="hover:text-zinc-900 hover:underline transition-colors">
            Developing Workflow
          </Link>
          <span className="text-zinc-300">•</span>
          <Link
            href="/#community"
            className="hover:text-zinc-900 hover:underline transition-colors"
          >
            Analog Community
          </Link>
        </div>
      </div>
    </div>
  )
}
