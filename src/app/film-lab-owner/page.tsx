import { SocialPageLayout } from "@/components/social/social-page-layout"

export default function FilmLabOwnerPage() {
  return (
    <SocialPageLayout activePage="film-lab-owner" showChatbot={false}>
      <section aria-labelledby="owner-page-title" className="w-full max-w-[640px]">
        <header className="flex h-[72px] items-center px-1">
          <h1 className="text-xl font-semibold leading-[25px] tracking-tight" id="owner-page-title">
            Film Lab Owner
          </h1>
        </header>
        <section
          aria-label="Film Lab Owner content placeholder"
          className="min-h-[320px] w-full rounded-2xl border border-dashed border-border bg-background"
        />
      </section>
    </SocialPageLayout>
  )
}
