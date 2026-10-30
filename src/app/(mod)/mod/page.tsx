export default function ModeratorPage() {
  return (
    <section className="w-full max-w-3xl py-10 sm:py-14" aria-labelledby="moderator-title">
      <p className="text-sm font-medium text-muted-foreground">FilmLink community</p>
      <h1
        id="moderator-title"
        className="mt-2 text-3xl font-semibold tracking-tight text-foreground"
      >
        Moderation workspace
      </h1>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">Welcome, Moderator</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This is the shared moderation area. Moderation tools can be added here as their backend
          workflows become available.
        </p>
      </div>
    </section>
  )
}
