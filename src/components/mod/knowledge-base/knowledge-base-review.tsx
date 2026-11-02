"use client";

import { useEffect, useState } from "react";
import { BookOpenCheck, CircleCheck, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { articleFixtures, readDemoArticles, saveDemoArticles, type ExpertArticle } from "@/components/shared/expert-demo/demo-session";
import styles from "../moderator-workspace.module.css";

export function KnowledgeBaseReview() {
	const [articles, setArticles] = useState<ExpertArticle[]>(articleFixtures);
	const [reasons, setReasons] = useState<Record<string, string>>({});
	const [hydrated, setHydrated] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState<Record<string, string>>({});
	useEffect(() => {
		setArticles(readDemoArticles());
		setHydrated(true);
	}, []);
	useEffect(() => {
		if (hydrated) saveDemoArticles(articles);
	}, [articles, hydrated]);
	const pending = articles.filter((article) => article.status === "Công khai" && article.kb === "Chờ Moderator duyệt");

	function review(id: string, decision: "Đã duyệt" | "Từ chối") {
		const reason = reasons[id]?.trim() ?? "";
		if (decision === "Từ chối" && !reason) {
			setError((current) => ({ ...current, [id]: "Vui lòng ghi lý do từ chối đề xuất." }));
			return;
		}
		setArticles((current) => current.map((article) => article.id === id
			? { ...article, kb: decision, kbRejectionReason: decision === "Từ chối" ? reason : undefined }
			: article));
		setMessage(decision === "Đã duyệt" ? "Đã duyệt bài vào Knowledge Base trong phiên demo." : "Đã từ chối đề xuất trong phiên demo.");
		setError((current) => ({ ...current, [id]: "" }));
	}

	return (
		<main className={styles.page}>
			<header className={styles.heading}><div><p className={styles.eyebrow}>Kiểm duyệt · Knowledge Base</p><h1>Duyệt đề xuất kiến thức</h1><p>Chỉ bài viết đã công khai của Expert mới xuất hiện trong hàng chờ này.</p></div></header>
			<p className={styles.note}><Info aria-hidden="true" /> Quyết định được lưu trong sessionStorage của tab để mô phỏng luồng; chưa cập nhật backend. Việc duyệt Knowledge Base không thay đổi trạng thái xuất bản bài viết.</p>
			{message && <p className={styles.message} role="status">{message}</p>}
			<section className={styles.panel}>
				<div className={styles.panelHead}><div><h2>Chờ xem xét</h2><p>{pending.length} đề xuất</p></div><BookOpenCheck aria-hidden="true" /></div>
				{pending.length ? <div className={styles.reportList}>{pending.map((article) => <article className={styles.card} key={article.id}>
					<div className={styles.panelHead}><div><p className={styles.eyebrow}>{article.category} · {article.author}</p><h2>{article.title}</h2></div><span className={`${styles.badge} ${styles.badgeWarning}`}>Chờ duyệt</span></div>
					<p className={styles.contentQuote}>{article.content}</p>
					<div className={styles.reviewForm}>
						<label className={styles.reviewField}><span className={styles.fieldLabel}>Lý do từ chối (bắt buộc nếu từ chối)</span><textarea className={styles.textarea} maxLength={500} value={reasons[article.id] ?? ""} onChange={(event) => { setReasons((current) => ({ ...current, [article.id]: event.target.value })); setError((current) => ({ ...current, [article.id]: "" })); }} placeholder="Nêu nội dung cần bổ sung hoặc chưa phù hợp…" /></label>
						{error[article.id] && <p className={styles.error} role="alert">{error[article.id]}</p>}
						<div className={styles.formActions}><Button size="sm" variant="outline" onClick={() => review(article.id, "Từ chối")}><X data-icon="inline-start" />Từ chối</Button><Button size="sm" onClick={() => review(article.id, "Đã duyệt")}><CircleCheck data-icon="inline-start" />Duyệt vào Knowledge Base</Button></div>
					</div>
				</article>)}</div> : <p className={styles.empty}>Không có đề xuất nào đang chờ.</p>}
			</section>
		</main>
	);
}
