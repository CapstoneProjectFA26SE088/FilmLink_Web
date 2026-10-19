"use client"

import { useMemo, useState } from "react"
import { Sparkles } from "lucide-react"
import { CreatePostBox } from "./create-post-box"
import { FeedSearch } from "./feed-search"
import { PostCard } from "./post-card"
import { MOCK_USER_FEED_POSTS, type UserFeedPost } from "../../mock_data"

export default function FeedSection() {
  const [posts, setPosts] = useState<UserFeedPost[]>(MOCK_USER_FEED_POSTS)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts
    const query = searchQuery.toLowerCase().trim()
    return posts.filter((p) => {
      const matchContent = p.content.toLowerCase().includes(query)
      const matchAuthor =
        p.author.name.toLowerCase().includes(query) ||
        p.author.username.toLowerCase().includes(query)
      const matchFilm =
        p.cameraMetadata?.filmStock.toLowerCase().includes(query) ||
        p.cameraMetadata?.camera.toLowerCase().includes(query)
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(query))
      return matchContent || matchAuthor || matchFilm || matchTags
    })
  }, [posts, searchQuery])

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const isLiked = !p.isLiked
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        }
      })
    )
  }

  const handleCreatePost = (newPost: UserFeedPost) => {
    setPosts((prev) => [newPost, ...prev])
  }

  return (
    <div className="feed-font-stack w-full">
      <section aria-labelledby="feed-title" className="mx-auto w-full max-w-[640px] min-w-0 pb-12">
        <header className="flex h-[72px] items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold leading-[25px] tracking-tight" id="feed-title">
              For you
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-[rgb(74,93,249)]/10 px-2.5 py-0.5 text-xs font-medium text-[rgb(74,93,249)]">
              <Sparkles className="size-3" />
              Analog Feed
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {filteredPosts.length} bài viết
          </span>
        </header>

        <div className="flex flex-col gap-4">
          <FeedSearch onChange={setSearchQuery} value={searchQuery} />
          <CreatePostBox onPostCreated={handleCreatePost} />

          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-12 text-center">
              <p className="text-sm font-semibold text-foreground">Không tìm thấy bài viết phù hợp</p>
              <p className="text-xs text-muted-foreground">
                Thử tìm theo từ khóa khác như Portra 400, Cinestill, Leica hoặc xóa bộ lọc tìm kiếm.
              </p>
              <button
                className="mt-2 text-xs font-semibold text-[rgb(74,93,249)] hover:underline cursor-pointer"
                onClick={() => setSearchQuery("")}
                type="button"
              >
                Xóa tìm kiếm
              </button>
            </div>
          ) : (
            <ul aria-label="Bảng tin cộng đồng film" className="flex flex-col gap-4 list-none p-0 m-0">
              {filteredPosts.map((post) => (
                <li key={post.id}>
                  <PostCard onToggleLike={handleToggleLike} post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="pt-8 text-center text-xs text-muted-foreground">
          FilmLink Community — A space for analog conversations, not distractions.
        </p>
      </section>
    </div>
  )
}
