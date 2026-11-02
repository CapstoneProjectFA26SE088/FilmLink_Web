"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpenText, ExternalLink, Info, Send, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUserWorkspace } from "@/components/user/user-workspace";
import styles from "../expert-workspace.module.css";
import { articleFixtures, readDemoArticles, saveDemoArticles, type ExpertArticle } from "../../shared/expert-demo/demo-session";


export function ExpertArticles() {
	const { account } = useUserWorkspace();
	const [articles, setArticles] = useState<ExpertArticle[]>(articleFixtures);
	const [hydrated, setHydrated] = useState(false);
	const [formOpen, setFormOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("TUTORIAL");
	const [content, setContent] = useState("");
	const [message, setMessage] = useState("");
	useEffect(() => { setArticles(readDemoArticles()); setHydrated(true); }, []);
	useEffect(() => { if (hydrated) saveDemoArticles(articles); }, [articles, hydrated]);
	function publish(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!title.trim() || !content.trim()) return;
		setArticles((current) => [{ id: `art-${Date.now()}`, title: title.trim(), category, content: content.trim(), status: "Công khai", kb: "Chưa đề xuất", author: account?.fullName || "Chuyên gia FilmLink" }, ...current]);
		setTitle(""); setContent(""); setFormOpen(false); setMessage("Bài viết đã được xuất bản trong feed demo. Bạn có thể gửi đề xuất Knowledge Base riêng.");
	}
	function propose(id: string) {
		setArticles((current) => current.map((item) => item.id === id && item.status === "Công khai" && (item.kb === "Chưa đề xuất" || item.kb === "Từ chối") ? { ...item, kb: "Chờ Moderator duyệt", kbRejectionReason: undefined } : item));
		setMessage("Đã gửi đề xuất Knowledge Base trong giao diện demo.");
	}
	return <main className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>Expert · Nội dung</p><h1>Thư viện bài viết</h1><p>Đăng bài lên cộng đồng trước; đề xuất Knowledge Base là bước độc lập sau khi bài đã công khai.</p></div><Button onClick={() => { setFormOpen((value) => !value); setMessage(""); }}><BookOpenText data-icon="inline-start"/>{formOpen ? "Đóng trình soạn" : "Soạn bài viết"}</Button></header>
		<p className={styles.note}><Info aria-hidden="true"/> Bài viết và trạng thái xét duyệt dưới đây là fixture demo trong phiên, chưa lưu lên máy chủ. Moderator duyệt nội dung vào Knowledge Base; Admin duyệt hồ sơ nâng cấp Expert.</p>
		{message && <p className={styles.success} role="status">{message}</p>}
		{formOpen && <section className={styles.panel}><div className={styles.panelHead}><div><h2>Bài viết mới</h2><p>Khi xuất bản, bài xuất hiện công khai trước khi có thể đề xuất Knowledge Base.</p></div></div><form className={styles.form} onSubmit={publish}>
			<label className={styles.field}>Tiêu đề<input className={styles.input} maxLength={180} value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Ví dụ: Cách bảo quản cuộn phim khi đi du lịch"/></label>
			<label className={styles.field}>Chuyên mục<select className={styles.select} value={category} onChange={(event) => setCategory(event.target.value)}><option value="TUTORIAL">Hướng dẫn</option><option value="FILM_REVIEW">Đánh giá film</option><option value="CAMERA_REVIEW">Đánh giá camera</option><option value="LENS_REVIEW">Đánh giá lens</option></select></label>
			<label className={styles.field}>Nội dung<textarea className={styles.textarea} maxLength={12000} value={content} onChange={(event) => setContent(event.target.value)} required placeholder="Chia sẻ kiến thức và kinh nghiệm thực tế…"/><small>{content.length}/12000 ký tự</small></label>
			<div className={styles.formActions}><Button type="submit"><Send data-icon="inline-start"/>Xuất bản bài viết</Button></div>
		</form></section>}
		<div className={styles.toolbar}><div><strong>{articles.length} bài viết</strong></div><div className={styles.toolbarGroup}><span className={styles.badge}>Công khai</span><span className={`${styles.badge} ${styles.badgeWarning}`}>Theo dõi trạng thái KB riêng</span></div></div>
		{articles.map((article) => <article className={styles.panel} key={article.id}><div className={styles.panelHead}><div><p className={styles.eyebrow}>{article.category} · {article.author}</p><h2>{article.title}</h2></div><span className={`${styles.badge} ${article.status === "Công khai" ? styles.badgeSuccess : ""}`}>{article.status}</span></div><p className={styles.articleBody}>{article.content}</p><footer className={styles.articleMeta}><span className={`${styles.badge} ${article.kb === "Đã duyệt" ? styles.badgeSuccess : article.kb === "Từ chối" ? styles.badgeDanger : styles.badgeWarning}`}>Knowledge Base: {article.kb}</span>{article.kbRejectionReason && <small className={styles.error}>Lý do: {article.kbRejectionReason}</small>}{article.status === "Công khai" && (article.kb === "Chưa đề xuất" || article.kb === "Từ chối") && <Button size="sm" variant="outline" onClick={() => propose(article.id)}><Sparkles data-icon="inline-start"/>{article.kb === "Từ chối" ? "Gửi lại đề xuất" : "Đề xuất vào Knowledge Base"}</Button>}{article.kb === "Chờ Moderator duyệt" && <Link className={styles.badge} href="/community">Mở cộng đồng <ExternalLink size={13}/></Link>}</footer></article>)}
		<Link className={buttonVariants({ variant: "ghost" })} href="/expert"><ArrowLeft aria-hidden="true"/>Về không gian chuyên gia</Link>
	</main>;
}
