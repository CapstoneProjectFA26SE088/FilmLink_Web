import { Funnel, Search as SearchIcon } from "lucide-react"
import { SocialChatbot } from "@/components/social/social-chatbot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FilmLabDirectory } from "./film-lab-directory"
import { SuggestedSearchChips } from "./suggested-search-chips"

function SearchBar() {
  return (
    <div className="relative flex w-full items-center gap-2">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        aria-label="Search"
        className="h-9 rounded-[14px] border-border bg-muted/50 pr-11 pl-11 text-[15px] shadow-none"
        placeholder="Search"
        readOnly
      />
      <Button
        aria-label="Search filters"
        className="absolute right-0 size-9 text-muted-foreground disabled:opacity-100"
        disabled
        size="icon"
        variant="ghost"
      >
        <Funnel aria-hidden="true" />
      </Button>
    </div>
  )
}

export default function SearchSection() {
  return (
    <>
      <section
        aria-label="Find a film lab"
        className="mx-auto flex w-full max-w-[1088px] min-w-0 flex-col gap-4"
      >
        <header className="flex h-[72px] w-full items-center justify-center">
          <div className="w-full max-w-[640px]">
            <SearchBar />
          </div>
        </header>
        <div className="mx-auto w-full max-w-[640px]">
          <SuggestedSearchChips />
        </div>
        <FilmLabDirectory />
        <p className="pt-2 text-center text-xs text-muted-foreground">
          A space for conversations, not distractions.
        </p>
      </section>
      <SocialChatbot />
    </>
  )
}
