import type { Metadata } from "next"
import { Suspense } from "react"
import { FooterSection } from "@/components/landing"
import { LabsClient } from "./labs-client"

export const metadata: Metadata = {
  title: "Film Lab Directory | Find Verified Analog Labs Worldwide | FilmLink",
  description:
    "Explore verified analog film labs. Filter by C-41, B&W, ECN-2, scanning hardware (Fuji Frontier SP-3000, Noritsu), push/pull capabilities, and mail-in options worldwide.",
}

export default function FilmLabsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="size-8 animate-spin rounded-full border-2 border-zinc-200 border-t-rose-600" />
              <span className="text-xs text-zinc-500 font-medium">
                Loading film labs directory...
              </span>
            </div>
          </div>
        }
      >
        <LabsClient />
      </Suspense>

      {/* Footer */}
      <FooterSection />
    </div>
  )
}
