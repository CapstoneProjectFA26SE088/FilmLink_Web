"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BookOpenText, CalendarDays, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { articleFixtures, eventFixtures, readDemoArticles, readDemoEvents } from "@/components/shared/expert-demo/demo-session";
import styles from "../expert-workspace.module.css";

export function ExpertDashboardSummary({ onOpen }: { onOpen: () => void }) {
	const [summary, setSummary] = useState(() => ({
		publishedArticles: articleFixtures.filter((article) => article.status === "Công khai").length,
		pendingKnowledgeBase: articleFixtures.filter((article) => article.kb === "Chờ Moderator duyệt").length,
		upcomingEvents: eventFixtures.length,
	}));
	useEffect(() => {
		const now = Date.now();
		setSummary({
			publishedArticles: readDemoArticles().filter((article) => article.status === "Công khai").length,
			pendingKnowledgeBase: readDemoArticles().filter((article) => article.kb === "Chờ Moderator duyệt").length,
			upcomingEvents: readDemoEvents().filter((event) => new Date(event.date).getTime() > now).length,
		});
	}, []);
	return <section className={styles.panel} aria-labelledby="expert-dashboard-summary-title">
		<div className={styles.panelHead}><div><p className={styles.eyebrow}>KHU VỰC CHUYÊN GIA</p><h2 id="expert-dashboard-summary-title">Tóm tắt hoạt động Expert</h2></div><Sparkles size={18} aria-hidden="true"/></div>
		<div className={styles.metrics}>
			<div className={styles.metric}><span><BookOpenText size={15} aria-hidden="true"/> Bài viết công khai</span><strong>{summary.publishedArticles}</strong></div>
			<div className={styles.metric}><span>Knowledge Base chờ duyệt</span><strong>{summary.pendingKnowledgeBase}</strong></div>
			<div className={styles.metric}><span><CalendarDays size={15} aria-hidden="true"/> Sự kiện sắp tới</span><strong>{summary.upcomingEvents}</strong></div>
		</div>
		<div className={styles.panelBody}><p style={{ margin: 0, color: "var(--text-muted)", fontSize: ".7rem" }}>Số liệu minh họa trong phiên, chưa lấy từ API.</p><Button type="button" variant="outline" onClick={onOpen}>Mở Không gian chuyên gia <ArrowRight data-icon="inline-end"/></Button></div>
	</section>;
}
