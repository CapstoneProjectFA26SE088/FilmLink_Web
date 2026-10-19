"use client"

import { Camera, CheckCircle2, Heart, MessageCircle, MoreHorizontal, Share2, UserRound } from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { UserFeedPost } from "../../mock_data"

interface PostCardProps {
  post: UserFeedPost
  onToggleLike?: (postId: string) => void
}

export function PostCard({ post, onToggleLike }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [commentsList, setCommentsList] = useState(post.comments || [])

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    toast.success("Đã sao chép liên kết bài viết!")
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const createdComment = {
      id: `c-${Date.now()}`,
      author: "Nguyen Hoang",
      username: "hoang_film",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
      timeAgo: "Vừa xong",
    }

    setCommentsList((prev) => [...prev, createdComment])
    setNewComment("")
    toast.success("Đã gửi bình luận!")
  }

  return (
    <Card className="gap-0 rounded-2xl border-border py-0 shadow-none ring-1 ring-foreground/5 overflow-hidden transition-all duration-200 hover:ring-foreground/10">
      <CardHeader className="flex-row items-center justify-between gap-3 px-5 pt-5 pb-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar aria-hidden="true" className="size-10 bg-muted ring-1 ring-border">
            {post.author.avatarUrl ? (
              <AvatarImage alt={post.author.name} src={post.author.avatarUrl} />
            ) : null}
            <AvatarFallback className="bg-muted text-muted-foreground">
              <UserRound aria-hidden="true" className="size-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[15px] font-semibold leading-[21px] text-foreground">
                {post.author.name}
              </span>
              {post.author.isVerified && (
                <CheckCircle2
                  aria-label="Verified creator"
                  className="size-3.5 fill-blue-500 text-background shrink-0"
                />
              )}
              <span className="truncate text-xs text-muted-foreground font-normal">
                @{post.author.username}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
          </div>
        </div>
        <Button
          aria-label="Tùy chọn bài viết"
          className="text-muted-foreground"
          size="icon-sm"
          variant="ghost"
        >
          <MoreHorizontal aria-hidden="true" className="size-4" />
        </Button>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        <div className="w-full flex flex-col gap-3">
          {post.cameraMetadata && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <Badge
                className="gap-1 rounded-md bg-muted/80 text-muted-foreground font-normal hover:bg-muted"
                variant="secondary"
              >
                <Camera className="size-3" />
                <span>{post.cameraMetadata.camera}</span>
              </Badge>
              <Badge
                className="rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 font-medium"
                variant="outline"
              >
                {post.cameraMetadata.filmStock}
              </Badge>
              {post.cameraMetadata.devProcess && (
                <Badge className="rounded-md font-normal text-muted-foreground" variant="outline">
                  {post.cameraMetadata.devProcess}
                </Badge>
              )}
              {post.cameraMetadata.lab && (
                <span className="text-[11px] text-muted-foreground pl-1">
                  @ {post.cameraMetadata.lab}
                </span>
              )}
            </div>
          )}

          <p className="text-[15px] leading-relaxed text-foreground whitespace-pre-line">
            {post.content}
          </p>

          {post.imageUrl && (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border bg-muted/40">
              <img
                alt="Ảnh chụp film đính kèm bài viết"
                className="size-full object-cover transition-transform duration-300 hover:scale-[1.01]"
                loading="lazy"
                src={post.imageUrl}
              />
              <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[11px] font-medium text-white">
                Film 35mm
              </span>
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((tag) => (
                <span className="text-xs text-[rgb(74,93,249)] hover:underline cursor-pointer" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <section
            aria-label="Tương tác bài viết"
            className="flex items-center justify-between border-t border-border pt-3 mt-1"
          >
            <div className="flex items-center gap-5">
              <button
                aria-label="Thích bài viết"
                className={`group flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  post.isLiked
                    ? "text-red-500"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => onToggleLike?.(post.id)}
                type="button"
              >
                <Heart
                  className={`size-4 transition-transform group-hover:scale-110 ${
                    post.isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{post.likesCount}</span>
              </button>

              <button
                aria-label="Bình luận bài viết"
                className="group flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                onClick={() => setShowComments(!showComments)}
                type="button"
              >
                <MessageCircle className="size-4 transition-transform group-hover:scale-110" />
                <span>{commentsList.length}</span>
              </button>
            </div>

            <button
              aria-label="Chia sẻ bài viết"
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
              onClick={handleShare}
              type="button"
            >
              <Share2 className="size-4" />
              <span>Chia sẻ</span>
            </button>
          </section>

          {showComments && (
            <div className="flex flex-col gap-3 rounded-xl bg-muted/30 p-3 mt-1 border border-border/50">
              <form className="flex items-center gap-2" onSubmit={handleAddComment}>
                <input
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận cho bài viết..."
                  value={newComment}
                />
                <Button className="h-7 rounded-lg text-xs px-3" size="sm" type="submit">
                  Gửi
                </Button>
              </form>

              {commentsList.length > 0 ? (
                <div className="flex flex-col gap-2.5 pt-1">
                  {commentsList.map((cmt) => (
                    <div className="flex items-start gap-2 text-xs" key={cmt.id}>
                      <Avatar className="size-6 shrink-0 mt-0.5">
                        <AvatarImage src={cmt.avatarUrl} />
                        <AvatarFallback>{cmt.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 rounded-lg bg-background/80 p-2 border border-border/40">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-foreground">{cmt.author}</span>
                          <span className="text-[10px] text-muted-foreground">{cmt.timeAgo}</span>
                        </div>
                        <p className="pt-0.5 text-muted-foreground">{cmt.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-muted-foreground py-1">
                  Chưa có bình luận nào. Hãy là người đầu tiên!
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
