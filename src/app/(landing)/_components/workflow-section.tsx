import { WORKFLOW_STEPS } from "../_data/landing-data"
import { SectionHeading } from "./shared/section-heading"

export function WorkflowSection() {
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-title"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
    >
      <SectionHeading
        badge="End-to-End Experience"
        title="One continuous workflow"
        subtitle="Everything you need from your first shutter click to digital archive"
      />

      {/* Horizontal Workflow Stepper */}
      <div className="relative mt-16 sm:mt-20">
        {/* Subtle horizontal connecting line on desktop */}
        <div
          className="hidden lg:block absolute top-7 inset-x-12 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent -z-10"
          aria-hidden="true"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {WORKFLOW_STEPS.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.id}
                className="group flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-1"
              >
                {/* Circular Icon with subtle border and shadow */}
                <div className="relative flex size-14 sm:size-16 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-xs transition-all duration-300 group-hover:border-rose-400 group-hover:shadow-md group-hover:shadow-rose-100">
                  <Icon className="size-6 text-zinc-700 transition-colors group-hover:text-rose-600" />
                  <span className="sr-only">{step.highlightBadge}</span>
                </div>

                {/* Step Title */}
                <h3 className="mt-4 text-sm sm:text-base font-bold text-zinc-900 group-hover:text-rose-600 transition-colors">
                  {step.title}
                </h3>

                {/* Step Subtitle */}
                <p className="mt-1 text-xs text-zinc-500 leading-snug line-clamp-2 max-w-[140px]">
                  {step.subtitle}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
