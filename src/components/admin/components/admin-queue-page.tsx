"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatVnd, type AdminDecision, type AdminRecord } from "../data/fixtures";
import styles from "../admin-pages.module.css";

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
	const selected = records.find((record) => record.id === selectedId) ?? null;
	const statuses = useMemo(() => ["Tất cả", ...new Set(records.map((record) => record.status))], [records]);
	const filtered = useMemo(() => records.filter((record) => {
		const text = `${record.id} ${record.title} ${record.summary} ${record.owner ?? ""} ${record.email ?? ""}`.toLocaleLowerCase("vi");
		return text.includes(query.trim().toLocaleLowerCase("vi")) && (status === "Tất cả" || record.status === status);
	}), [records, query, status]);

	function applyDecision(decision: AdminDecision) {
		if (!selected) return;
		setRecords((current) => current.map((record) => record.id === selected.id ? { ...record, status: decision.status } : record));
		setSelectedId(null);
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
					</div>
					<div className={styles.formActions}><Button variant="outline" onClick={() => setSelectedId(null)}>Đóng</Button>{decisions.map((decision) => <Button key={decision.status} variant={decision.variant ?? "default"} onClick={() => applyDecision(decision)}>{decision.label}</Button>)}</div>
				</section>
			</div>}
		</div>
	);
}
