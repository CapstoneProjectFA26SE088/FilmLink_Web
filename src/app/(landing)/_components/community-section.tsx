import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { COMMUNITY_FEATURES } from "../_data/landing-data"
import { SectionHeading } from "./shared/section-heading"

export function CommunitySection() {
  return (
    <section
      id="community"
      aria-labelledby="community-title"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
    >
      <SectionHeading
        badge="Connect & Share"
        title="Built Around the Film Community"
        subtitle="A dedicated space for analog lovers to discuss gear, share recipes, and trade film equipment"
      />

      {/* 4 Community Feature Columns */}
      <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {COMMUNITY_FEATURES.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.id}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:border-zinc-300 hover:shadow-md hover:-translate-y-1"
            >
              <div>
                <div className="flex size-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 transition-colors group-hover:bg-rose-50 group-hover:text-rose-600">
                  <Icon className="size-5 transition-transform group-hover:scale-110 duration-200" />
                </div>

                <h3 className="mt-5 text-base font-bold text-zinc-900 group-hover:text-rose-600 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs text-zinc-600 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  {item.tag}
                </span>
                <span className="text-xs font-semibold text-rose-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Explore <ArrowRight className="size-3" />
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Community CTA Button */}
      <div className="mt-12 flex justify-center">
        <Link
          href="#join"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 shadow-xs transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Join the Community</span>
          <ArrowRight className="size-4 text-zinc-500" />
        </Link>
      </div>
    </section>
  )
}
