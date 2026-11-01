"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Heart, MapPin, MessageCircle, Search, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { posts as initialPosts } from "@/components/shared/model";

type FeedPost = {
	id: string;
	initials: string;
	name: string;
	time: string;
	title: string;
	copy: string;
	film: string;
	color: string;
	likes: number;
	comments: number;
};

export function CommunitySection({
	likedPosts,
	onLike,
	accountName,
	onExploreLabs,
	onOpenAssistant,
}: {
	likedPosts: string[];
	onLike: (id: string) => void;
	accountName?: string;
	onExploreLabs?: () => void;
	onOpenAssistant?: () => void;
}) {
	const [search, setSearch] = useState("");
	const [draft, setDraft] = useState("");
	const [localPosts, setLocalPosts] = useState<FeedPost[]>([]);
	const feedPosts = useMemo(() => {
		const query = search.trim().toLocaleLowerCase("vi-VN");
		return [...localPosts, ...initialPosts].filter((post) =>
			!query || `${post.name} ${post.title} ${post.copy} ${post.film}`.toLocaleLowerCase("vi-VN").includes(query),
		);
	}, [localPosts, search]);
	const userInitials = accountName?.split(/\s+/).slice(-2).map((word) => word[0]).join("").toLocaleUpperCase("vi-VN") || "FL";

	function publishPost(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const content = draft.trim();
		if (!content || !accountName) return;
		setLocalPosts((current) => [{
			id: `post-${Date.now()}`,
			initials: userInitials,
			name: accountName,
			time: "Vừa xong",
			title: content,
			copy: "",
			film: "Chia sẻ cộng đồng",
			color: "community-photo-new",
			likes: 0,
			comments: 0,
		}, ...current]);
		setDraft("");
	}

	return (
		<section className="subpage-section community-feed-page">
			<div className="community-feed-layout">
				<div className="community-feed-column">
					<div className="community-feed-heading">
						<div><p className="eyebrow">GÓC NHỎ ANALOG</p><h1>Cộng đồng</h1></div>
						<span className="community-feed-tab" aria-current="page">For you</span>
					</div>

					<label className="community-feed-search">
						<Search aria-hidden="true" />
						<Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm bài viết, thành viên hoặc cuộn phim..." aria-label="Tìm trong cộng đồng" />
					</label>

					{accountName ? (
						<form className="community-composer" onSubmit={publishPost}>
							<span className="community-feed-avatar community-feed-avatar--self" aria-hidden="true">{userInitials}</span>
							<Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="What's new? Chia sẻ một khoảnh khắc phim..." aria-label="Nội dung bài viết" maxLength={500} />
							<Button type="submit" disabled={!draft.trim()}><Send data-icon="inline-start" /> Đăng</Button>
						</form>
					) : (
						<div className="community-composer community-composer--guest">
							<span className="community-feed-avatar community-feed-avatar--self" aria-hidden="true">FL</span>
							<span className="community-composer__prompt">What's new? Chia sẻ một khoảnh khắc phim...</span>
							<Link href="/login" className="community-composer__login">Đăng nhập để đăng</Link>
						</div>
					)}

					<div className="community-feed-list" aria-label="Bài viết cộng đồng">
						{feedPosts.map((post, index) => {
							const liked = likedPosts.includes(post.id);
							return (
								<article className="community-feed-post" key={post.id}>
									<header className="community-feed-post__author">
										<span className={`community-feed-avatar community-feed-avatar--${index % 2}`} aria-hidden="true">{post.initials}</span>
										<div><strong>{post.name}</strong><small>{post.time}</small></div>
									</header>
									<div className="community-feed-post__copy">
										<strong>{post.title}</strong>
										{post.copy && <p>{post.copy}</p>}
									</div>
									<div className={`community-feed-media community-feed-media--${post.color}`} role="img" aria-label={`Ảnh minh họa cho bài viết về ${post.film}`}>
										<span className="community-feed-media__label">{post.film}</span>
										<div className="community-flower" aria-hidden="true">
											{Array.from({ length: 6 }, (_, petal) => <span className="community-flower__petal" key={petal} style={{ transform: `rotate(${petal * 60}deg)` }} />)}
											<span className="community-flower__center" />
										</div>
									</div>
									<footer className="community-feed-post__actions">
										<button type="button" className={`community-feed-action${liked ? " is-liked" : ""}`} onClick={() => onLike(post.id)} aria-pressed={liked}>
											<Heart aria-hidden="true" /> {post.likes + (liked ? 1 : 0)}
										</button>
										<span className="community-feed-action"><MessageCircle aria-hidden="true" /> {post.comments}</span>
									</footer>
								</article>
							);
						})}
						{feedPosts.length === 0 && <div className="community-feed-empty"><Search aria-hidden="true" /><strong>Chưa tìm thấy bài viết</strong><span>Thử tìm bằng tên thành viên hoặc loại phim khác.</span></div>}
					</div>
					<p className="community-feed-footnote">A space for film enthusiasts, not algorithms.</p>
				</div>

				<aside className="community-feed-aside">
					<section className="community-suggest-card">
						<div className="community-suggest-card__heading"><strong>Suggest Film Lab</strong><MapPin aria-hidden="true" /></div>
						<div className="community-suggest-empty"><span><MapPin aria-hidden="true" /></span><strong>Chưa có gợi ý phù hợp</strong><p>Chọn khu vực để tìm lab tráng phim gần bạn.</p></div>
						{onExploreLabs && <Button type="button" variant="outline" onClick={onExploreLabs}>Khám phá Film Lab <ArrowRight data-icon="inline-end" /></Button>}
					</section>
					{onOpenAssistant && <Button type="button" variant="outline" className="community-chatbot" onClick={onOpenAssistant}><Sparkles data-icon="inline-start" /> Chatbot FilmLink</Button>}
				</aside>
			</div>
		</section>
	);
}
