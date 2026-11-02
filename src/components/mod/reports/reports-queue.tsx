"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reportFixtures, readModerationReports, saveModerationReports, type AuthorSanction, type ModerationDecision, type ModerationReport, type ReportTarget } from "@/components/mod/data/moderation-demo";
import styles from "../moderator-workspace.module.css";

const targetOptions: { value: "ALL" | ReportTarget; label: string }[] = [
	{ value: "ALL", label: "Tất cả nội dung" },
	{ value: "PHOTO_FEED_POST", label: "Bài Photo Feed" },
	{ value: "PHOTO_FEED_COMMENT", label: "Bình luận Photo Feed" },
	{ value: "FORUM_THREAD", label: "Chủ đề forum" },
	{ value: "FORUM_ANSWER", label: "Câu trả lời forum" },
	{ value: "LAB_REVIEW", label: "Đánh giá Film Lab" },
	{ value: "CONSIGNMENT_LISTING", label: "Tin ký gửi" },
];

const decisions: { value: ModerationDecision; label: string }[] = [
	{ value: "KEEP", label: "Giữ nội dung" },
	{ value: "HIDE", label: "Ẩn nội dung" },
	{ value: "REMOVE", label: "Gỡ nội dung" },
];

const sanctions: { value: AuthorSanction; label: string }[] = [
	{ value: "NONE", label: "Không áp dụng" },
	{ value: "WARNING", label: "Cảnh cáo" },
	{ value: "LOCK_7_DAYS", label: "Khóa 7 ngày" },
	{ value: "LOCK_30_DAYS", label: "Khóa 30 ngày" },
];

function statusLabel(report: ModerationReport) {
	if (report.status === "OPEN") return "Chờ xử lý";
	if (report.decision === "KEEP") return "Đã bỏ qua báo cáo";
	return "Đã xử lý nội dung";
}

export function ReportsQueue() {
	const [reports, setReports] = useState<ModerationReport[]>(reportFixtures);
	const [hydrated, setHydrated] = useState(false);
	const [statusFilter, setStatusFilter] = useState("OPEN");
	const [targetFilter, setTargetFilter] = useState<"ALL" | ReportTarget>("ALL");
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [decision, setDecision] = useState<ModerationDecision>("KEEP");
	const [sanction, setSanction] = useState<AuthorSanction>("NONE");
	const [reason, setReason] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	useEffect(() => {
		setReports(readModerationReports());
		setHydrated(true);
	}, []);
	useEffect(() => {
		if (hydrated) saveModerationReports(reports);
	}, [hydrated, reports]);

	const filtered = useMemo(() => reports.filter((report) => {
		const statusMatch = statusFilter === "ALL" || (statusFilter === "OPEN" ? report.status === "OPEN" : report.status !== "OPEN");
		const targetMatch = targetFilter === "ALL" || report.targetType === targetFilter;
		const searchText = `${report.id} ${report.targetTitle} ${report.author} ${report.reporter} ${report.violation}`.toLocaleLowerCase("vi");
		return statusMatch && targetMatch && searchText.includes(query.trim().toLocaleLowerCase("vi"));
	}), [query, reports, statusFilter, targetFilter]);
	const selected = reports.find((report) => report.id === selectedId);

	function openReview(report: ModerationReport) {
		setSelectedId((current) => current === report.id ? null : report.id);
		setDecision(report.decision ?? "KEEP");
		setSanction(report.sanction ?? "NONE");
		setReason("");
		setError("");
		setMessage("");
	}

	function submitReview() {
		if (!selected || selected.status !== "OPEN") return;
		if ((decision === "HIDE" || decision === "REMOVE") && (reason.trim().length < 10 || reason.trim().length > 500)) {
			setError("Lý do ẩn hoặc gỡ nội dung cần từ 10 đến 500 ký tự.");
			return;
		}
		const now = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date());
		setReports((current) => current.map((report) => report.id === selected.id ? {
			...report,
			status: decision === "KEEP" ? "DISMISSED" : "ACTIONED",
			decision,
			reason: reason.trim() || "Không tìm thấy vi phạm theo quy định cộng đồng.",
			sanction,
			handledAt: now,
		} : report));
		setMessage(`Đã ghi nhận quyết định “${decisions.find((item) => item.value === decision)?.label}” trong phiên demo.`);
		setError("");
	}

	return (
		<main className={styles.page}>
			<header className={styles.heading}><div><p className={styles.eyebrow}>Kiểm duyệt · Báo cáo</p><h1>Hàng đợi báo cáo nội dung</h1><p>Xem ngữ cảnh báo cáo, căn cứ xử lý và lịch sử của từng nội dung.</p></div></header>
			<p className={styles.note}><Info aria-hidden="true" /> Fixture và quyết định chỉ được lưu trong sessionStorage của tab. Mọi thay đổi chưa được gửi đến backend.</p>
			<section className={styles.panel}>
				<div className={styles.panelHead}><div><h2>Báo cáo cộng đồng</h2><p>{reports.filter((report) => report.status === "OPEN").length} mục đang chờ · {reports.length} báo cáo tổng cộng</p></div><ClipboardList aria-hidden="true" /></div>
				<div className={styles.toolbar}>
					<div className={styles.toolbarGroup}>
						<label className="sr-only" htmlFor="report-search">Tìm báo cáo</label>
						<div className="relative"><Search aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input id="report-search" className={`${styles.search} pl-9`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm nội dung hoặc người dùng" /></div>
						<label className="sr-only" htmlFor="report-status">Lọc trạng thái</label><select className={styles.select} id="report-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="OPEN">Chờ xử lý</option><option value="CLOSED">Đã xử lý</option><option value="ALL">Tất cả trạng thái</option></select>
						<label className="sr-only" htmlFor="report-target">Lọc loại nội dung</label><select className={styles.select} id="report-target" value={targetFilter} onChange={(event) => setTargetFilter(event.target.value as "ALL" | ReportTarget)}>{targetOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
					</div>
				</div>
				{filtered.length ? <div className={styles.reportList}>
					{filtered.map((report) => <div key={report.id}>
						<button type="button" className={styles.reportRow} aria-expanded={selectedId === report.id} onClick={() => openReview(report)}>
							<span className={styles.reportCopy}><strong>{report.targetTitle}</strong><small>{report.id} · {report.targetLabel} · Báo cáo bởi {report.reporter}</small></span>
							<span className={`${styles.badge} ${report.status === "OPEN" ? styles.badgeWarning : report.status === "ACTIONED" ? styles.badgeDanger : styles.badgeSuccess}`}>{statusLabel(report)}</span>
						</button>
						{selectedId === report.id && selected && <section className={styles.reportDetails} aria-label={`Chi tiết ${report.id}`}>
							<div className={styles.detailGrid}>
								<div className={styles.detailField}><span>Mã và loại nội dung</span><strong>{report.id} · {report.targetLabel}</strong></div>
								<div className={styles.detailField}><span>Vi phạm được báo cáo</span><strong>{report.violation}</strong></div>
								<div className={styles.detailField}><span>Tác giả nội dung</span><strong>{report.author}</strong></div>
								<div className={styles.detailField}><span>Người gửi báo cáo · thời gian</span><strong>{report.reporter} · {report.createdAt}</strong></div>
							</div>
							<div className={styles.detailField}><span>Nội dung bị báo cáo</span><blockquote className={styles.contentQuote}>{report.content}</blockquote></div>
							<div className={styles.detailField}><span>Lý do và ngữ cảnh</span><strong>{report.description}</strong></div>
							{report.status === "OPEN" ? <div className={styles.reviewForm}>
								<div className={styles.formRow}>
									<label className={styles.reviewField}><span className={styles.fieldLabel}>Quyết định</span><select className={styles.select} value={decision} onChange={(event) => { setDecision(event.target.value as ModerationDecision); setError(""); }} aria-label="Quyết định kiểm duyệt">{decisions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>
									<label className={styles.reviewField}><span className={styles.fieldLabel}>Biện pháp với tác giả (tùy chọn)</span><select className={styles.select} value={sanction} onChange={(event) => setSanction(event.target.value as AuthorSanction)} aria-label="Biện pháp với tác giả">{sanctions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>
								</div>
								<label className={styles.reviewField}><span className={styles.fieldLabel}>Lý do quyết định {decision !== "KEEP" && "(bắt buộc, 10–500 ký tự)"}</span><textarea className={styles.textarea} maxLength={500} value={reason} onChange={(event) => { setReason(event.target.value); setError(""); }} placeholder={decision === "KEEP" ? "Ghi chú xử lý (không bắt buộc)…" : "Nêu căn cứ ẩn hoặc gỡ nội dung…"} /></label>
								{error && <p className={styles.error} role="alert">{error}</p>}
								{message && <p className={styles.message} role="status">{message}</p>}
								<div className={styles.formActions}><Button variant="outline" onClick={() => setSelectedId(null)}>Đóng chi tiết</Button><Button onClick={submitReview}>Ghi nhận quyết định</Button></div>
							</div> : <div className={styles.detailGrid}><div className={styles.detailField}><span>Quyết định</span><strong>{decisions.find((item) => item.value === report.decision)?.label}</strong></div><div className={styles.detailField}><span>Thời gian xử lý</span><strong>{report.handledAt || "—"}</strong></div><div className={styles.detailField}><span>Lý do</span><strong>{report.reason || "—"}</strong></div><div className={styles.detailField}><span>Biện pháp với tác giả</span><strong>{sanctions.find((item) => item.value === report.sanction)?.label || "Không áp dụng"}</strong></div>{message && <p className={styles.message} role="status">{message}</p>}</div>}
						</section>}
					</div>)}
				</div> : <p className={styles.empty}>Không tìm thấy báo cáo phù hợp với bộ lọc.</p>}
			</section>
		</main>
	);
}
