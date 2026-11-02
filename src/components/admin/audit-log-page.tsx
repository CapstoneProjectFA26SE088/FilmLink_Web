"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/admin-api";
import styles from "./admin-pages.module.css";

type AuditEntry = {
	id: number;
	occurredAt: string;
	actorAccountId: number | null;
	actorRole: string | null;
	action: string;
	targetType: string;
	targetId: number | null;
	outcome: "SUCCESS" | "FAILURE";
	reason: string | null;
	beforeData: Record<string, unknown> | null;
	afterData: Record<string, unknown> | null;
	clientIp: string | null;
};
type AuditPage = { content: AuditEntry[]; page: number; size: number; totalElements: number; totalPages: number; hasNext: boolean };

const targetTypes = [
	["", "Tất cả loại đối tượng"],
	["USER_ACCOUNT", "Tài khoản"],
	["FILM_PROCESS", "Quy trình tráng"],
	["FILM_FORMAT", "Khổ phim"],
	["SERVICE_TYPE", "Loại dịch vụ"],
	["FILM_STOCK", "Dòng phim"],
	["FILM_LAB", "Film Lab"],
] as const;

function formatDate(value: string) {
	return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "medium" }).format(new Date(value));
}

export function AuditLogPage() {
	const [result, setResult] = useState<AuditPage | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [targetType, setTargetType] = useState("");
	const [targetId, setTargetId] = useState("");
	const [activeType, setActiveType] = useState("");
	const [activeId, setActiveId] = useState("");
	const [page, setPage] = useState(0);

	const load = useCallback(async () => {
		setLoading(true);
		setError("");
		const params = new URLSearchParams({ page: String(page), size: "20", sort: "occurredAt,desc" });
		if (activeType) params.set("targetType", activeType);
		if (activeId) params.set("targetId", activeId);
		try {
			setResult(await adminApi<AuditPage>(`admin/audit-logs?${params.toString()}`));
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Không tải được Audit Log.");
		} finally {
			setLoading(false);
		}
	}, [activeId, activeType, page]);

	useEffect(() => { void load(); }, [load]);

	function applyFilters(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (targetId && (!/^\d+$/.test(targetId) || Number(targetId) <= 0)) {
			setError("ID đối tượng phải là số nguyên dương.");
			return;
		}
		setActiveType(targetType);
		setActiveId(targetId.trim());
		setPage(0);
	}

	return <div className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>BR-32 · CR-16</p><h1>Nhật ký hoạt động</h1><p>Lịch sử các thao tác nhạy cảm, sắp xếp mới nhất trước.</p></div><Button variant="outline" disabled={loading} onClick={() => void load()}>{loading ? "Đang tải…" : "Tải lại"}</Button></header>
		<div className={styles.metrics}><div className={styles.metric}><span>Tổng bản ghi phù hợp</span><strong>{result?.totalElements ?? "—"}</strong></div><div className={styles.metric}><span>Trang hiện tại</span><strong>{result ? `${result.page + 1}/${Math.max(result.totalPages, 1)}` : "—"}</strong></div><div className={styles.metric}><span>Kích thước trang</span><strong>{result?.size ?? 20}</strong></div><div className={styles.metric}><span>Quyền truy cập</span><strong>ADMIN</strong></div></div>
		<section className={styles.panel}>
			<form className={styles.tools} onSubmit={applyFilters}>
				<select className={styles.select} aria-label="Lọc theo loại đối tượng" value={targetType} onChange={(event) => setTargetType(event.target.value)}>{targetTypes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>
				<input className={styles.search} type="number" min="1" step="1" placeholder="ID đối tượng" aria-label="Lọc theo ID đối tượng" value={targetId} onChange={(event) => setTargetId(event.target.value)} />
				<Button type="submit" disabled={loading}>Lọc lịch sử</Button>
				{(activeType || activeId) && <Button type="button" variant="outline" disabled={loading} onClick={() => { setTargetType(""); setTargetId(""); setActiveType(""); setActiveId(""); setPage(0); }}>Xóa bộ lọc</Button>}
			</form>
			{error && <p className={styles.errorMessage} role="alert">{error}</p>}
			{loading ? <p className={styles.empty} role="status">Đang tải lịch sử…</p> : result && <>
				<div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Thời điểm</th><th>Actor</th><th>Thao tác</th><th>Đối tượng</th><th>Kết quả</th><th>Chi tiết</th></tr></thead><tbody>
					{result.content.map((entry) => <tr key={entry.id}>
						<td>{formatDate(entry.occurredAt)}<small>#{entry.id}</small></td>
						<td>{entry.actorAccountId == null ? "System" : `#${entry.actorAccountId}`}<small>{entry.actorRole ?? "Không có role"}</small></td>
						<td>{entry.action}</td><td>{entry.targetType}<small>{entry.targetId == null ? "Theo lô" : `#${entry.targetId}`}</small></td>
						<td><span className={`${styles.badge} ${entry.outcome === "SUCCESS" ? styles.badgeSuccess : styles.badgeDanger}`}>{entry.outcome === "SUCCESS" ? "Thành công" : "Thất bại"}</span></td>
						<td><details><summary className={styles.tableLink}>Xem dữ liệu</summary><div className="mt-3 min-w-64 space-y-2 whitespace-normal"><p><strong>Lý do:</strong> {entry.reason || "—"}</p><p><strong>IP:</strong> {entry.clientIp || "—"}</p><p><strong>Trước:</strong></p><pre className="max-h-48 overflow-auto rounded-lg bg-muted p-2 text-xs">{JSON.stringify(entry.beforeData, null, 2) ?? "null"}</pre><p><strong>Sau:</strong></p><pre className="max-h-48 overflow-auto rounded-lg bg-muted p-2 text-xs">{JSON.stringify(entry.afterData, null, 2) ?? "null"}</pre></div></details></td>
					</tr>)}
					{result.content.length === 0 && <tr><td colSpan={6} className={styles.empty}>Không có bản ghi audit phù hợp bộ lọc.</td></tr>}
				</tbody></table></div>
				<div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-sm text-muted-foreground"><span>{result.totalElements.toLocaleString("vi-VN")} bản ghi</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 0 || loading} onClick={() => setPage((current) => Math.max(0, current - 1))}>Trước</Button><span className="px-2 py-1">Trang {result.page + 1} / {Math.max(result.totalPages, 1)}</span><Button variant="outline" size="sm" disabled={!result.hasNext || loading} onClick={() => setPage((current) => current + 1)}>Sau</Button></div></div>
			</>}
		</section>
		<p className={styles.demoNote}>Audit Log chỉ đọc. Dữ liệu trước/sau có thể chứa giá trị vận hành; chỉ tài khoản ADMIN mới được backend cấp quyền truy cập.</p>
	</div>;
}
