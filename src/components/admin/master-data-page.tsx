"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/admin-api";
import styles from "./admin-pages.module.css";

type CatalogType = "film-processes" | "film-formats" | "service-types" | "film-stocks";
type CatalogRecord = {
	id: number;
	code?: string;
	displayName?: string;
	description?: string | null;
	stockName?: string;
	manufacturer?: string;
	iso?: number;
	defaultFilmProcessId?: number;
	defaultFilmProcessName?: string;
	status: "ACTIVE" | "DISCONTINUED";
};
type FilmProcess = { id: number; displayName: string; status: "ACTIVE" | "DISCONTINUED" };
type CatalogForm = {
	code: string;
	displayName: string;
	description: string;
	stockName: string;
	manufacturer: string;
	iso: string;
	defaultFilmProcessId: string;
};

const catalogTypes: { id: CatalogType; title: string; singular: string }[] = [
	{ id: "film-processes", title: "Quy trình tráng", singular: "quy trình" },
	{ id: "film-formats", title: "Khổ phim", singular: "khổ phim" },
	{ id: "service-types", title: "Loại dịch vụ", singular: "loại dịch vụ" },
	{ id: "film-stocks", title: "Dòng phim", singular: "dòng phim" },
];
const emptyForm: CatalogForm = { code: "", displayName: "", description: "", stockName: "", manufacturer: "", iso: "200", defaultFilmProcessId: "" };

export function MasterDataPage() {
	const [type, setType] = useState<CatalogType>("film-processes");
	const [items, setItems] = useState<CatalogRecord[]>([]);
	const [filmProcesses, setFilmProcesses] = useState<FilmProcess[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const [query, setQuery] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<CatalogRecord | null>(null);
	const [form, setForm] = useState<CatalogForm>(emptyForm);
	const activeType = catalogTypes.find((item) => item.id === type)!;

	const load = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const requests: Promise<unknown>[] = [adminApi<CatalogRecord[]>(`${type}/all`)];
			if (type === "film-stocks") requests.push(adminApi<FilmProcess[]>("film-processes/all"));
			const [rows, processRows] = await Promise.all(requests);
			setItems(rows as CatalogRecord[]);
			if (processRows) setFilmProcesses(processRows as FilmProcess[]);
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Không tải được danh mục.");
		} finally {
			setLoading(false);
		}
	}, [type]);

	useEffect(() => { void load(); }, [load]);
	const filtered = useMemo(() => {
		const value = query.trim().toLocaleLowerCase("vi");
		if (!value) return items;
		return items.filter((item) => [item.code, item.displayName, item.stockName, item.manufacturer, item.defaultFilmProcessName]
			.some((field) => field?.toLocaleLowerCase("vi").includes(value)));
	}, [items, query]);
	const activeCount = items.filter((item) => item.status === "ACTIVE").length;

	function openDialog(item?: CatalogRecord) {
		setEditing(item ?? null);
		setForm(item ? {
			...emptyForm,
			code: item.code ?? "",
			displayName: item.displayName ?? "",
			description: item.description ?? "",
			stockName: item.stockName ?? "",
			manufacturer: item.manufacturer ?? "",
			iso: String(item.iso ?? 200),
			defaultFilmProcessId: String(item.defaultFilmProcessId ?? ""),
		} : { ...emptyForm, defaultFilmProcessId: String(filmProcesses.find((process) => process.status === "ACTIVE")?.id ?? "") });
		setError("");
		setNotice("");
		setDialogOpen(true);
	}

	async function save(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		setError("");
		try {
			const path = `${type}${editing ? `/${editing.id}` : ""}`;
			const body = type === "film-stocks" ? {
				stockName: form.stockName.trim(),
				manufacturer: form.manufacturer.trim(),
				iso: Number(form.iso),
				defaultFilmProcessId: Number(form.defaultFilmProcessId),
			} : editing ? {
				displayName: form.displayName.trim(),
				description: form.description.trim() || null,
			} : {
				code: form.code.trim().toUpperCase(),
				displayName: form.displayName.trim(),
				description: form.description.trim() || null,
			};
			await adminApi<CatalogRecord>(path, { method: editing ? "PUT" : "POST", body: JSON.stringify(body) });
			setDialogOpen(false);
			await load();
			setNotice(`Đã ${editing ? "cập nhật" : "tạo"} ${activeType.singular}.`);
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Không thể lưu danh mục.");
		} finally {
			setSaving(false);
		}
	}

	async function toggleStatus(item: CatalogRecord) {
		setSaving(true);
		setError("");
		setNotice("");
		try {
			await adminApi<CatalogRecord>(`${type}/${item.id}/status`, { method: "PATCH", body: "{}" });
			await load();
			setNotice(`Đã đổi trạng thái ${activeType.singular}.`);
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Không thể đổi trạng thái.");
		} finally {
			setSaving(false);
		}
	}

	async function deleteItem(item: CatalogRecord) {
		const label = item.stockName ?? item.displayName ?? item.code ?? `#${item.id}`;
		if (!window.confirm(`Xóa “${label}”? Nếu dữ liệu đang được tham chiếu, backend sẽ từ chối và bạn cần ngừng hoạt động danh mục.`)) return;
		setSaving(true);
		setError("");
		setNotice("");
		try {
			await adminApi<void>(`${type}/${item.id}`, { method: "DELETE" });
			await load();
			setNotice("Đã xóa danh mục.");
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Không thể xóa danh mục.");
		} finally {
			setSaving(false);
		}
	}

	return <div className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>MD-01 · MD-02 · UC53</p><h1>Master Data</h1><p>Quản lý các thông số kỹ thuật dùng chung trên FilmLink.</p></div><Button disabled={loading || saving} onClick={() => openDialog()}>Thêm {activeType.singular}</Button></header>
		<div className={styles.metrics}><div className={styles.metric}><span>Tổng bản ghi</span><strong>{items.length}</strong></div><div className={styles.metric}><span>Đang hoạt động</span><strong>{activeCount}</strong></div><div className={styles.metric}><span>Nhóm danh mục</span><strong>{catalogTypes.length}</strong></div><div className={styles.metric}><span>Quyền thao tác</span><strong>ADMIN</strong></div></div>
		<section className={styles.panel}>
			<div className={styles.tabs} role="tablist" aria-label="Nhóm Master Data">{catalogTypes.map((item) => <button key={item.id} type="button" role="tab" aria-selected={type === item.id} className={`${styles.tab} ${type === item.id ? styles.tabActive : ""}`} onClick={() => { setType(item.id); setQuery(""); setNotice(""); }}>{item.title}</button>)}</div>
			<div className={styles.panelHeader}><div><h2>{activeType.title}</h2><p>{type === "film-stocks" ? "Tên phim, hãng, ISO và quy trình hóa chất mặc định." : "Mã danh mục không đổi sau khi tạo; có thể ngừng hoặc kích hoạt lại."}</p></div></div>
			<div className={styles.tools}><input className={styles.search} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo mã, tên hoặc hãng" aria-label="Tìm Master Data" /></div>
			{error && <p className={styles.errorMessage} role="alert">{error}</p>}{notice && <p className={styles.successMessage} role="status">{notice}</p>}
			{loading ? <p className={styles.empty} role="status">Đang tải danh mục…</p> : <div className={styles.tableWrap}><table className={styles.table}><thead><tr>{type === "film-stocks" ? <><th>Dòng phim</th><th>Hãng</th><th>ISO</th><th>Quy trình mặc định</th></> : <><th>Mã</th><th>Tên hiển thị</th><th>Mô tả</th></>}<th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}>{type === "film-stocks" ? <><td>{item.stockName}</td><td>{item.manufacturer}</td><td>ISO {item.iso}</td><td>{item.defaultFilmProcessName || `#${item.defaultFilmProcessId}`}</td></> : <><td>{item.code}</td><td>{item.displayName}</td><td>{item.description || "—"}</td></>}<td><span className={`${styles.badge} ${item.status === "ACTIVE" ? styles.badgeSuccess : styles.badgeWarning}`}>{item.status === "ACTIVE" ? "Đang hoạt động" : "Đã ngừng"}</span></td><td><div className={styles.rowActions}><Button size="sm" variant="outline" disabled={saving} onClick={() => openDialog(item)}>Sửa</Button><Button size="sm" variant="ghost" disabled={saving} onClick={() => void toggleStatus(item)}>{item.status === "ACTIVE" ? "Ngừng" : "Kích hoạt"}</Button><Button size="sm" variant="ghost" disabled={saving} onClick={() => void deleteItem(item)}>Xóa</Button></div></td></tr>)}{filtered.length === 0 && <tr><td colSpan={type === "film-stocks" ? 6 : 5} className={styles.empty}>{items.length ? "Không tìm thấy kết quả." : "Chưa có dữ liệu trong nhóm này."}</td></tr>}</tbody></table></div>}
		</section>
		{dialogOpen && <div className={styles.overlay} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogOpen(false); }}><form className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="master-data-title" onSubmit={save}>
			<div><p className={styles.eyebrow}>{editing ? "Chỉnh sửa" : "Tạo mới"} · {activeType.title}</p><h2 id="master-data-title">{editing ? `Cập nhật ${activeType.singular}` : `Thêm ${activeType.singular}`}</h2></div>
			{type === "film-stocks" ? <><label className={styles.fieldLabel}>Tên dòng phim<input className={styles.field} required maxLength={100} value={form.stockName} onChange={(event) => setForm((current) => ({ ...current, stockName: event.target.value }))} /></label><label className={styles.fieldLabel}>Hãng sản xuất<input className={styles.field} required maxLength={100} value={form.manufacturer} onChange={(event) => setForm((current) => ({ ...current, manufacturer: event.target.value }))} /></label><label className={styles.fieldLabel}>ISO<input className={styles.field} type="number" required min={1} max={32000} value={form.iso} onChange={(event) => setForm((current) => ({ ...current, iso: event.target.value }))} /></label><label className={styles.fieldLabel}>Quy trình hóa chất mặc định<select className={styles.field} required value={form.defaultFilmProcessId} onChange={(event) => setForm((current) => ({ ...current, defaultFilmProcessId: event.target.value }))}><option value="">Chọn quy trình</option>{filmProcesses.filter((process) => process.status === "ACTIVE" || process.id === editing?.defaultFilmProcessId).map((process) => <option key={process.id} value={process.id}>{process.displayName}{process.status === "DISCONTINUED" ? " · đã ngừng" : ""}</option>)}</select></label></> : <>{!editing && <label className={styles.fieldLabel}>Mã danh mục<input className={styles.field} required maxLength={20} pattern="[A-Z][A-Z0-9_]*" value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))} placeholder="Ví dụ: PROCESS_C41" /></label>}<label className={styles.fieldLabel}>Tên hiển thị<input className={styles.field} required maxLength={100} value={form.displayName} onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))} /></label><label className={styles.fieldLabel}>Mô tả<textarea className={styles.field} rows={3} maxLength={500} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></label></>}
			{error && <p className={styles.errorMessage} role="alert">{error}</p>}<div className={styles.formActions}><Button type="button" variant="outline" disabled={saving} onClick={() => setDialogOpen(false)}>Hủy</Button><Button type="submit" disabled={saving}>{saving ? "Đang lưu…" : "Lưu"}</Button></div>
		</form></div>}
	</div>;
}
