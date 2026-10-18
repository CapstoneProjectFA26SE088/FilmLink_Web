import { SocialChatbot } from "@/components/social/social-chatbot"
import { CreatePostBox } from "./create-post-box"
import { FeedSearch } from "./feed-search"
import { PostCard } from "./post-card"

export default function FeedSection() {
  return (
    <div className="feed-font-stack w-full">
      <section aria-labelledby="feed-title" className="mx-auto w-full max-w-[640px] min-w-0">
        <header className="flex h-[72px] items-center px-1">
          <h1 className="text-xl font-semibold leading-[25px] tracking-tight" id="feed-title">
            For you
          </h1>
        </header>
        <div className="flex flex-col gap-4">
          <FeedSearch />
          <CreatePostBox />
          <PostCard />
        </div>
        <p className="pt-6 text-center text-xs text-muted-foreground">
          A space for conversations, not distractions.
        </p>
      </section>
      <SocialChatbot />
    </div>
  )
}
