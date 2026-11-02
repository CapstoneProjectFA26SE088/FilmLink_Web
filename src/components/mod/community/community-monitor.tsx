"use client";

import { useEffect, useState } from "react";
import { Activity, Info, MessageCircle, ShoppingBag, Star, UsersRound } from "lucide-react";
import { reportFixtures, readModerationReports, type ModerationReport, type ReportTarget } from "@/components/mod/data/moderation-demo";
import styles from "../moderator-workspace.module.css";

const monitoredTypes: { type: ReportTarget; label: string; description: string; icon: typeof UsersRound }[] = [
	{ type: "PHOTO_FEED_POST", label: "Bài viết Photo Feed", description: "Bài chia sẻ hình ảnh và câu chuyện nhiếp ảnh phim.", icon: UsersRound },
	{ type: "PHOTO_FEED_COMMENT", label: "Bình luận Photo Feed", description: "Trao đổi và phản hồi trong cộng đồng.", icon: MessageCircle },
	{ type: "FORUM_THREAD", label: "Chủ đề forum", description: "Câu hỏi, thảo luận và kinh nghiệm chụp phim.", icon: Activity },
	{ type: "FORUM_ANSWER", label: "Câu trả lời forum", description: "Câu trả lời trong các chủ đề cộng đồng.", icon: MessageCircle },
	{ type: "LAB_REVIEW", label: "Đánh giá Film Lab", description: "Phản hồi về trải nghiệm sử dụng dịch vụ lab.", icon: Star },
	{ type: "CONSIGNMENT_LISTING", label: "Tin ký gửi", description: "Sản phẩm được đăng bán trong chợ ký gửi.", icon: ShoppingBag },
];

export function CommunityMonitor() {
	const [reports, setReports] = useState<ModerationReport[]>(reportFixtures);
	useEffect(() => setReports(readModerationReports()), []);
	const openReports = reports.filter((report) => report.status === "OPEN");
	const resolved = reports.filter((report) => report.status !== "OPEN").sort((a, b) => (b.handledAt || "").localeCompare(a.handledAt || ""));
	return (
		<main className={styles.page}>
			<header className={styles.heading}><div><p className={styles.eyebrow}>Kiểm duyệt · Cộng đồng</p><h1>Theo dõi cộng đồng</h1><p>Tổng quan các nhóm nội dung được kiểm duyệt và hoạt động xử lý gần đây.</p></div></header>
			<p className={styles.note}><Info aria-hidden="true" /> Đây là màn giám sát kiểm duyệt, không phải Photo Feed dành cho thành viên. Dữ liệu hiện lấy từ fixture trong phiên demo.</p>
			<section className={styles.metrics} aria-label="Tình hình kiểm duyệt cộng đồng">
				<div className={styles.metric}><span>Báo cáo đang mở</span><strong>{openReports.length}</strong><small>Cần được Mod xem xét</small></div>
				<div className={styles.metric}><span>Đã có quyết định</span><strong>{resolved.length}</strong><small>Trong dữ liệu phiên hiện tại</small></div>
				<div className={styles.metric}><span>Nhóm nội dung theo dõi</span><strong>{monitoredTypes.length}</strong><small>Căn cứ các loại target trong schema</small></div>
			</section>
			<section className={styles.panel}>
				<div className={styles.panelHead}><div><h2>Phạm vi theo dõi</h2><p>Các loại nội dung có thể được gửi báo cáo</p></div><UsersRound aria-hidden="true" /></div>
				<div className={styles.activityGrid}>{monitoredTypes.map(({ type, label, description, icon: Icon }) => {
					const count = reports.filter((report) => report.targetType === type).length;
					return <article className={styles.activityCard} key={type}><Icon aria-hidden="true" className="size-4 text-primary" /><h3>{label}</h3><p>{description}</p><span className={styles.badge}>{count} báo cáo trong fixture</span></article>;
				})}</div>
			</section>
			<section className={styles.panel}>
				<div className={styles.panelHead}><div><h2>Lịch sử xử lý gần đây</h2><p>Quyết định được ghi nhận trong phiên hiện tại</p></div></div>
				<div className={styles.panelBody}>{resolved.length ? resolved.map((report) => <div className={styles.historyItem} key={report.id}><strong>{report.targetTitle} · {report.id}</strong><small>{report.decision === "KEEP" ? "Giữ nội dung / đóng báo cáo" : report.decision === "HIDE" ? "Ẩn nội dung" : "Gỡ nội dung"} · {report.handledAt || "Thời gian chưa ghi nhận"} · {report.reason || "Không có lý do"}</small></div>) : <p className={styles.empty}>Chưa có lịch sử xử lý.</p>}</div>
			</section>
		</main>
	);
}
