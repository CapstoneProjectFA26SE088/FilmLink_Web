import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Search as SearchIcon,
  Send,
  UserRound,
} from "lucide-react"
import { SocialSidebar } from "@/components/social/social-sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function FeedSearch() {
  return (
    <div className="relative" id="search">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        aria-label="Tìm kiếm"
        className="h-9 rounded-[14px] border-border bg-muted/50 pl-11 text-[15px] shadow-none"
        placeholder="Search"
        readOnly
      />
    </div>
  )
}

function Post() {
  return (
    <Card className="flex-row items-center gap-2 rounded-2xl border-border py-2 shadow-none ring-1 ring-foreground/5">
      <CardContent className="flex min-w-0 flex-1 items-center gap-3 px-3">
        <Avatar aria-hidden="true" className="size-9 bg-muted">
          <AvatarFallback className="bg-muted text-muted-foreground">
            <UserRound aria-hidden="true" className="size-5" />
          </AvatarFallback>
        </Avatar>
        <span className="flex h-9 min-w-0 flex-1 items-center truncate text-[15px] leading-[21px] text-muted-foreground">
          What&apos;s new?
        </span>
      </CardContent>
      <Button
        className="mr-3 h-9 rounded-xl border-border px-4 text-[15px] font-semibold text-foreground disabled:opacity-100"
        disabled
        variant="outline"
      >
        Post
      </Button>
    </Card>
  )
}

function PostCard() {
  return (
    <Card className="gap-0 rounded-2xl border-border py-0 shadow-none ring-1 ring-foreground/5">
      <CardHeader className="flex-row items-center justify-between gap-3 px-5 pt-5 pb-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar aria-hidden="true" className="size-10 bg-muted">
            <AvatarFallback className="bg-muted text-muted-foreground">
              <UserRound aria-hidden="true" className="size-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-[15px] font-semibold leading-[21px] text-foreground">
              single__father__
            </span>
            <span className="shrink-0 text-[15px] leading-[21px] text-muted-foreground">18h</span>
          </div>
        </div>
        <Button aria-label="Tùy chọn bài viết" disabled size="icon-lg" variant="ghost">
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="w-full">
          <div
            aria-label="Khung ảnh bài đăng, có thể bổ sung ảnh sau"
            className="aspect-[4/5] w-full rounded-lg border border-border bg-background"
            role="img"
          />
          <p className="pt-3 text-sm leading-[19px] text-foreground">
            Thà mất 1m5 chớ k muốn đóng 600k tiền học lại 🤣
          </p>
          <section
            aria-label="Tương tác bài viết (bản khung)"
            className="flex items-center gap-5 pt-2"
          >
            <div className="flex min-h-9 items-center gap-1.5 text-[12px] font-semibold leading-[17px] text-muted-foreground">
              <Button
                aria-label="Thích bài viết"
                className="text-muted-foreground disabled:opacity-100"
                disabled
                size="icon-lg"
                variant="ghost"
              >
                <Heart aria-hidden="true" />
              </Button>
              <span>370</span>
            </div>
            <div className="flex min-h-9 items-center gap-1.5 text-[12px] font-semibold leading-[17px] text-muted-foreground">
              <Button
                aria-label="Trả lời bài viết"
                className="text-muted-foreground disabled:opacity-100"
                disabled
                size="icon-lg"
                variant="ghost"
              >
                <MessageCircle aria-hidden="true" />
              </Button>
              <span>13</span>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  )
}

function Chatbot() {
  return (
    <div
      aria-label="Vị trí nút chatbot"
      className="fixed right-5 bottom-[84px] z-20 inline-flex h-12 items-center gap-3 rounded-full border border-border bg-background px-5 text-[15px] font-semibold leading-[21px] text-foreground shadow-sm lg:bottom-6"
      role="img"
    >
      <Send aria-hidden="true" />
      <span>Chatbot</span>
    </div>
  )
}

export default function FeedLayout() {
  return (
    <div className="feed-font-stack min-h-dvh bg-background pl-[72px] text-foreground">
      <SocialSidebar activePage="feed" />

      <div className="mx-auto flex min-h-dvh w-full max-w-[1088px] justify-center px-4 pt-0 pb-28 sm:px-6 lg:px-6 lg:pb-8">
        <div className="grid w-full grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,640px)_320px] xl:gap-16">
          <section
            aria-labelledby="feed-title"
            className="mx-auto w-full max-w-[640px] min-w-0 xl:mx-0"
          >
            <header className="flex h-[72px] items-center px-1">
              <h1 className="text-xl font-semibold leading-[25px] tracking-tight" id="feed-title">
                For you
              </h1>
            </header>
            <div className="flex flex-col gap-4">
              <FeedSearch />
              <Post />
              <PostCard />
            </div>
            <p className="pt-6 text-center text-xs text-muted-foreground">
              A space for conversations, not distractions.
            </p>
          </section>
        </div>
      </div>
      <Chatbot />
    </div>
  )
}
