import { STAT_METRICS } from "../_data/landing-data"

export function StatsSection() {
  return (
    <section
      aria-label="Platform Statistics"
      className="border-y border-zinc-100 bg-zinc-50/60 py-14 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STAT_METRICS.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900">
                {stat.value}
              </span>
              <span className="mt-2 text-xs sm:text-sm font-semibold text-zinc-600 uppercase tracking-wider">
                {stat.label}
              </span>
              {stat.description && (
                <span className="mt-1 text-xs text-zinc-400 hidden sm:block">
                  {stat.description}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
