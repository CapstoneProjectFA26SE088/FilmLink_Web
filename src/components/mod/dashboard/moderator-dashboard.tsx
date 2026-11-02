"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpenCheck, ClipboardList, Info, ShieldCheck } from "lucide-react";
import { articleFixtures, readDemoArticles, type ExpertArticle } from "@/components/shared/expert-demo/demo-session";
import { reportFixtures, readModerationReports, type ModerationReport } from "@/components/mod/data/moderation-demo";
import styles from "../moderator-workspace.module.css";

export function ModeratorDashboard() {
	const [reports, setReports] = useState<ModerationReport[]>(reportFixtures);
	const [articles, setArticles] = useState<ExpertArticle[]>(articleFixtures);
	useEffect(() => {
		setReports(readModerationReports());
		setArticles(readDemoArticles());
	}, []);
	const openReports = reports.filter((report) => report.status === "OPEN").length;
	const pendingArticles = articles.filter((article) => article.status === "Công khai" && article.kb === "Chờ Moderator duyệt").length;
	const handled = reports.filter((report) => report.status !== "OPEN").slice(0, 3);

	return (
		<main className={styles.page}>
			<header className={styles.heading}>
				<div>
					<p className={styles.eyebrow}>Trung tâm kiểm duyệt</p>
					<h1>Không gian Mod</h1>
					<p>Theo dõi báo cáo cộng đồng và các đề xuất kiến thức đang chờ xử lý.</p>
				</div>
			</header>
			<p className={styles.note}><Info aria-hidden="true" /> Các số liệu và quyết định hiện là dữ liệu minh họa, được lưu trong phiên trình duyệt; chưa kết nối API kiểm duyệt.</p>
			<section className={styles.metrics} aria-label="Tổng quan hàng đợi">
				<div className={styles.metric}><span>Báo cáo chờ xử lý</span><strong>{openReports}</strong><small>Trên các nội dung cộng đồng</small></div>
				<div className={styles.metric}><span>Đề xuất Knowledge Base</span><strong>{pendingArticles}</strong><small>Bài viết đã được Expert công khai</small></div>
				<div className={styles.metric}><span>Quyết định đã ghi nhận</span><strong>{reports.filter((report) => report.status !== "OPEN").length}</strong><small>Trong phiên demo hiện tại</small></div>
			</section>
			<div className={styles.grid}>
				<section className={styles.panel}>
					<div className={styles.panelHead}><div><h2>Cần xử lý</h2><p>Ưu tiên xem xét các nội dung đang mở</p></div><ClipboardList aria-hidden="true" /></div>
					<div className={styles.panelBody}>
						{reports.filter((report) => report.status === "OPEN").slice(0, 3).map((report) => (
							<Link className={styles.linkCard} href="/moderation/reports" key={report.id}>
								<span><strong>{report.targetTitle}</strong><small>{report.id} · {report.targetLabel} · {report.violation}</small></span><ArrowRight aria-hidden="true" />
							</Link>
						))}
						{pendingArticles > 0 && <Link className={styles.linkCard} href="/moderation/knowledge-base"><span><strong>{pendingArticles} đề xuất kiến thức chờ duyệt</strong><small>Mở hàng chờ Knowledge Base</small></span><BookOpenCheck aria-hidden="true" /></Link>}
						{openReports === 0 && pendingArticles === 0 && <p className={styles.empty}>Hiện không có mục nào cần xử lý.</p>}
					</div>
				</section>
				<aside className={styles.panel}>
					<div className={styles.panelHead}><div><h2>Hoạt động gần đây</h2><p>Những quyết định trong phiên này</p></div><ShieldCheck aria-hidden="true" /></div>
					<div className={styles.panelBody}>
						{handled.length ? handled.map((report) => <div className={styles.historyItem} key={report.id}><strong>{report.decision === "KEEP" ? "Đã giữ nội dung" : report.decision === "HIDE" ? "Đã ẩn nội dung" : "Đã gỡ nội dung"} · {report.id}</strong><small>{report.reason || "Không có ghi chú"}</small></div>) : <p className={styles.empty}>Chưa có quyết định trong phiên hiện tại.</p>}
					</div>
				</aside>
			</div>
		</main>
	);
}
