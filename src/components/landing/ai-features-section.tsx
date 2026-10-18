import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AI_FEATURES } from "@/lib/landing-data"
import { SectionHeading } from "./shared/section-heading"

export function AIFeaturesSection() {
  return (
    <section
      id="ai-features"
      aria-labelledby="ai-features-title"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
    >
      <SectionHeading
        badge="Smart Film Processing"
        title="AI Built for Film Photographers"
        subtitle="Identify film stocks, color calibrate scans, and upscale your analog shots with precision"
      />

      <div className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {AI_FEATURES.map((feature) => {
          const Icon = feature.icon
          return (
            <Card
              key={feature.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200/80 bg-white p-7 sm:p-8 shadow-xs transition-all duration-300 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/50 hover:-translate-y-1"
            >
              <div>
                {/* Icon wrapper */}
                <div className="flex size-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-500 group-hover:text-white">
                  <Icon className="size-6 transition-transform group-hover:scale-110 duration-200" />
                </div>

                {/* Title & subtitle */}
                <h3 className="mt-6 text-xl font-bold tracking-tight text-zinc-900 group-hover:text-rose-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-rose-500 uppercase tracking-wider">
                  {feature.subtitle}
                </p>

                {/* Description */}
                <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{feature.description}</p>
              </div>

              {/* Supported tags */}
              <div className="mt-6 pt-5 border-t border-zinc-100 flex flex-wrap gap-1.5">
                {feature.supportedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-[11px] font-normal border-zinc-200 text-zinc-600 bg-zinc-50 group-hover:border-rose-200/80 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
