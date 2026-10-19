"use client"

import { Camera, Film, Image as ImageIcon, Send, Sparkles, UserRound } from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MOCK_CURRENT_USER, type UserFeedPost } from "../../mock_data"

interface CreatePostBoxProps {
  onPostCreated?: (post: UserFeedPost) => void
}

const QUICK_FILM_STOCKS = ["Kodak Portra 400", "Cinestill 800T", "Ilford HP5 Plus", "Kodak Gold 200", "Fuji C200"]

export function CreatePostBox({ onPostCreated }: CreatePostBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState("")
  const [selectedFilm, setSelectedFilm] = useState("Kodak Portra 400")
  const [camera, setCamera] = useState("Olympus OM-1")

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!content.trim()) return

    const newPost: UserFeedPost = {
      id: `post-${Date.now()}`,
      author: {
        id: MOCK_CURRENT_USER.id,
        name: MOCK_CURRENT_USER.name,
        username: MOCK_CURRENT_USER.username,
        avatarUrl: MOCK_CURRENT_USER.avatarUrl,
        isVerified: true,
      },
      createdAt: new Date().toISOString(),
      timeAgo: "Vừa xong",
      content: content.trim(),
      cameraMetadata: {
        camera,
        filmStock: selectedFilm,
        devProcess: selectedFilm.includes("Ilford") ? "B&W" : selectedFilm.includes("800T") ? "ECN-2" : "Color (C-41)",
        lab: "Croplab Hanoi",
      },
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: true,
      tags: [`#${selectedFilm.toLowerCase().replace(/\s+/g, "")}`, "#filmcommunity"],
    }

    onPostCreated?.(newPost)
    setContent("")
    setIsExpanded(false)
    toast.success("Đã đăng bài viết mới thành công!")
  }

  return (
    <Card className="rounded-2xl border-border py-3 shadow-none ring-1 ring-foreground/5 transition-all">
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="flex items-start gap-3">
          <Avatar aria-hidden="true" className="size-10 bg-muted shrink-0 mt-0.5">
            <AvatarImage alt={MOCK_CURRENT_USER.name} src={MOCK_CURRENT_USER.avatarUrl} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              <UserRound aria-hidden="true" className="size-5" />
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {!isExpanded ? (
              <button
                className="flex h-10 w-full items-center rounded-xl bg-muted/40 px-4 text-left text-[15px] text-muted-foreground transition-colors hover:bg-muted/70 cursor-pointer"
                onClick={() => setIsExpanded(true)}
                type="button"
              >
                Chia sẻ cảm nghĩ, cuộn phim vừa chụp hoặc mẹo chụp film hôm nay...
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <textarea
                  autoFocus
                  className="w-full resize-none rounded-xl border border-border bg-background p-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Chia sẻ cảm nghĩ, cuộn phim vừa chụp hoặc mẹo chụp film hôm nay..."
                  rows={3}
                  value={content}
                />

                <div className="flex flex-col gap-2 rounded-xl bg-muted/30 p-2.5 border border-border/40 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Film className="size-3.5" />
                    <span>Chọn loại phim đính kèm:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_FILM_STOCKS.map((film) => (
                      <Badge
                        className={`cursor-pointer transition-all ${
                          selectedFilm === film
                            ? "bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)]"
                            : "bg-background text-muted-foreground hover:bg-muted"
                        }`}
                        key={film}
                        onClick={() => setSelectedFilm(film)}
                        variant="outline"
                      >
                        {film}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Camera className="size-3.5" />
                    <span>Máy: Olympus OM-1</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setIsExpanded(false)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      Hủy
                    </Button>
                    <Button
                      className="bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)]"
                      disabled={!content.trim()}
                      onClick={() => handleSubmit()}
                      size="sm"
                      type="button"
                    >
                      <Send className="size-3.5 mr-1" />
                      Đăng bài
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
