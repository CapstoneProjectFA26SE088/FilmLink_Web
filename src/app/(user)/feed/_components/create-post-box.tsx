import { UserRound } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function CreatePostBox() {
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
