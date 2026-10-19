import { Heart, MessageCircle, MoreHorizontal, UserRound } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function PostCard() {
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
