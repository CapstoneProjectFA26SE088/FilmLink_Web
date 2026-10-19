import Image from "next/image"
import Link from "next/link"
import { FOOTER_SECTIONS } from "../_data/landing-data"

export function FooterSection() {
  return (
    <footer className="border-t border-zinc-200/80 bg-zinc-50/60 text-zinc-600">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand info column (spans 2 on desktop) */}
          <div className="col-span-2 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative size-7 overflow-hidden rounded-md">
                <Image
                  src="/mini_logo.png"
                  alt="FilmLink Logo"
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-zinc-900">
                Film<span className="text-rose-600">Link</span>
              </span>
            </Link>

            <p className="mt-3 text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-sm">
              The complete ecosystem connecting analog photographers, commercial film labs, and
              vintage gear enthusiasts worldwide.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-zinc-500">
                All Film Processing Systems Operational
              </span>
            </div>
          </div>

          {/* Navigation link columns */}
          {FOOTER_SECTIONS.slice(0, 4).map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-zinc-500 transition-colors hover:text-zinc-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright & legal bar */}
        <div className="mt-16 pt-8 border-t border-zinc-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© 2026 FilmLink Inc. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="#privacy" className="hover:text-zinc-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#terms" className="hover:text-zinc-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="#cookies" className="hover:text-zinc-600 transition-colors">
              Cookie Preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
