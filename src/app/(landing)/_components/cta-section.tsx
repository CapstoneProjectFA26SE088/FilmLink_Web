import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { SectionBadge } from "./shared/section-badge"

export function CTASection() {
  return (
    <section aria-label="Call to Action" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#0c0d12] px-6 py-20 sm:px-12 sm:py-28 text-center text-white shadow-2xl">
        {/* Subtle camera lens shutter concentric circles SVG */}
        <div
          className="pointer-events-none absolute inset-0 -z-0 flex items-center justify-center opacity-15"
          aria-hidden="true"
        >
          <div className="size-[280px] rounded-full border border-white/30" />
          <div className="absolute size-[420px] rounded-full border border-white/20" />
          <div className="absolute size-[580px] rounded-full border border-white/10" />
          <div className="absolute size-[760px] rounded-full border border-white/5" />
        </div>

        {/* Ambient red/rose soft glow behind center */}
        <div
          className="pointer-events-none absolute inset-0 -z-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="size-96 rounded-full bg-rose-600/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <div className="mb-6">
            <SectionBadge variant="dark">Start Your Journey</SectionBadge>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Start Your Film Journey Today
          </h2>

          {/* Subtitle */}
          <p className="mt-5 max-w-xl text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            Join thousands of film photographers capturing memories frame by frame.
          </p>

          {/* CTA Action Button */}
          <div className="mt-8 sm:mt-10">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm sm:text-base font-semibold text-zinc-950 shadow-lg shadow-white/10 transition-all duration-200 hover:bg-zinc-100 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Get Started Free</span>
              <ArrowRight className="size-4 text-zinc-900" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
