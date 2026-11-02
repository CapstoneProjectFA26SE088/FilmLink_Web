"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatVnd, type AdminDecision, type AdminRecord } from "../data/fixtures";
import styles from "../admin-pages.module.css";
import { readExpertApplication, saveExpertApplication } from "@/components/shared/expert-demo/demo-session";

export function AdminQueuePage({ title, description, initialRecords, decisions }: {
	title: string;
	description: string;
	initialRecords: AdminRecord[];
	decisions: AdminDecision[];
}) {
	const [records, setRecords] = useState(initialRecords);
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState("Tất cả");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [rejectionReason, setRejectionReason] = useState("");
	const [decisionError, setDecisionError] = useState("");
	useEffect(() => {
		if (title !== "Duyệt hồ sơ chuyên gia") return;
		const application = readExpertApplication();
		if (!application) return;
		setRecords((current) => {
			const record = { id: application.id, title: application.name, summary: "Hồ sơ nâng cấp từ Photographer lên Photography Expert.", status: application.status, email: application.email, date: "Phiên hiện tại", requiresRejectionReason: true, details: [{ label: "Kinh nghiệm", value: application.experience }, ...(application.portfolio ? [{ label: "Portfolio", value: application.portfolio }] : []), { label: "Tài khoản hiện tại", value: "Photographer · vai trò chưa được thay đổi bởi bản demo" }] };
			return [record, ...current.filter((item) => item.id !== record.id && item.id !== "EX-01")];
		});
	}, [title]);
	const selected = records.find((record) => record.id === selectedId) ?? null;
	const statuses = useMemo(() => ["Tất cả", ...new Set(records.map((record) => record.status))], [records]);
	const filtered = useMemo(() => records.filter((record) => {
		const text = `${record.id} ${record.title} ${record.summary} ${record.owner ?? ""} ${record.email ?? ""}`.toLocaleLowerCase("vi");
		return text.includes(query.trim().toLocaleLowerCase("vi")) && (status === "Tất cả" || record.status === status);
	}), [records, query, status]);

	function applyDecision(decision: AdminDecision) {
		if (!selected) return;
		if (decision.status.includes("Từ chối") && selected.requiresRejectionReason && !rejectionReason.trim()) {
			setDecisionError("Cần ghi lý do từ chối hồ sơ.");
			return;
		}
		setRecords((current) => current.map((record) => record.id === selected.id ? { ...record, status: decision.status } : record));
		if (title === "Duyệt hồ sơ chuyên gia" && selected.id.startsWith("EX-") && selected.email) {
			const current = readExpertApplication();
			if (current?.id === selected.id) saveExpertApplication({ ...current, status: decision.status.includes("Từ chối") ? "Từ chối" : "Đã xác minh", rejectionReason: decision.status.includes("Từ chối") ? rejectionReason.trim() : undefined });
		}
		setSelectedId(null);
		setRejectionReason("");
		setDecisionError("");
	}

	return (
		<div className={styles.page}>
			<header className={styles.heading}>
				<div><p className={styles.eyebrow}>Vận hành FilmLink</p><h1>{title}</h1><p>{description}</p></div>
			</header>
			<p className={styles.demoNote}>Danh sách và quyết định dưới đây đang dùng dữ liệu prototype; thay đổi chỉ lưu trong phiên trình duyệt.</p>
			<section className={styles.panel} aria-labelledby="queue-title">
				<div className={styles.panelHeader}><div><h2 id="queue-title">Danh sách và quyết định xử lý</h2><p>{filtered.length} kết quả</p></div></div>
				<div className={styles.tools}>
					<input className={styles.search} aria-label="Tìm trong danh sách" placeholder="Tìm mã, nội dung hoặc người gửi" value={query} onChange={(event) => setQuery(event.target.value)} />
					<select className={styles.select} aria-label="Lọc trạng thái" value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
				</div>
				<div className={styles.tableWrap}>
					<table className={styles.table}>
						<thead><tr><th>Mã</th><th>Nội dung</th><th>Thông tin thêm</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
						<tbody>
							{filtered.map((record) => <tr key={record.id}>
				<td>{record.id}</td><td>{record.title}<small>{record.summary}</small></td>
								<td>{record.owner ?? record.channel ?? "—"}<small>{record.date ?? record.email ?? ""}</small></td>
								<td><span className={`${styles.badge} ${record.status.includes("Chờ") ? styles.badgeWarning : record.status.includes("Đã") || record.status === "Thành công" ? styles.badgeSuccess : ""}`}>{record.status}</span></td>
								<td><Button size="sm" variant="outline" onClick={() => setSelectedId(record.id)}>Chi tiết</Button></td>
							</tr>)}
							{filtered.length === 0 && <tr><td colSpan={5} className={styles.empty}>Không có nội dung phù hợp.</td></tr>}
						</tbody>
					</table>
				</div>
			</section>
			{selected && <div className={styles.overlay} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedId(null); }}>
				<section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="admin-record-title">
					<div><p className={styles.eyebrow}>{selected.id}</p><h2 id="admin-record-title">{selected.title}</h2><p>{selected.summary}</p></div>
					<div className={styles.details}>
						<div className={styles.detailLine}><span>Trạng thái</span><strong>{selected.status}</strong></div>
						{selected.owner && <div className={styles.detailLine}><span>Người gửi / phụ trách</span><strong>{selected.owner}</strong></div>}
						{selected.email && <div className={styles.detailLine}><span>Email</span><strong>{selected.email}</strong></div>}
						{selected.date && <div className={styles.detailLine}><span>Ngày nhận</span><strong>{selected.date}</strong></div>}
						{selected.amount !== undefined && <div className={styles.detailLine}><span>Số tiền</span><strong>{formatVnd(selected.amount)}</strong></div>}
						{selected.channel && <div className={styles.detailLine}><span>Hình thức</span><strong>{selected.channel}</strong></div>}
						{selected.details?.map((detail) => <div className={styles.detailLine} key={detail.label}><span>{detail.label}</span><strong>{detail.value.startsWith("https://") ? <a href={detail.value} target="_blank" rel="noreferrer">Mở portfolio</a> : detail.value}</strong></div>)}
					</div>
					{selected.requiresRejectionReason && <label className={styles.field}>Lý do từ chối (bắt buộc nếu từ chối)<textarea className={styles.field} value={rejectionReason} onChange={(event) => { setRejectionReason(event.target.value); setDecisionError(""); }} placeholder="Nêu nội dung cần bổ sung hoặc chưa đạt…" />{decisionError && <small className={styles.errorMessage}>{decisionError}</small>}</label>}
					<div className={styles.formActions}><Button variant="outline" onClick={() => { setSelectedId(null); setDecisionError(""); }}>Đóng</Button>{decisions.map((decision) => <Button key={decision.status} variant={decision.variant ?? "default"} onClick={() => applyDecision(decision)}>{selected.requiresRejectionReason && decision.status.includes("Đã") ? "Duyệt & nâng cấp Expert (demo)" : decision.label}</Button>)}</div>
				</section>
			</div>}
		</div>
	);
}
