"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/admin-api";
import { formatVnd } from "../data/fixtures";
import styles from "../lab-owner-pages.module.css";

type CatalogOption = { id: number; code: string; displayName: string; status: "ACTIVE" | "DISCONTINUED" };
type ScanOption = { id?: number; resolutionLabel: string; priceVnd: number };
type ServicePackage = {
	id: number; packageName: string; serviceTypeId: number; filmProcessId: number; filmFormatId: number;
	priceVnd: number; turnaroundDays: number; pushPullAvailable: boolean; pushPullSurchargePerStopVnd: number | null;
	status: "ON_SALE" | "WITHDRAWN"; scanOptions: ScanOption[];
};
type PackageForm = {
	packageName: string; serviceTypeId: string; filmProcessId: string; filmFormatId: string;
	priceVnd: string; turnaroundDays: string; pushPullAvailable: boolean; pushPullSurchargePerStopVnd: string;
	scanOptions: { resolutionLabel: string; priceVnd: string }[];
};
const emptyForm: PackageForm = { packageName: "", serviceTypeId: "", filmProcessId: "", filmFormatId: "", priceVnd: "", turnaroundDays: "3", pushPullAvailable: false, pushPullSurchargePerStopVnd: "", scanOptions: [{ resolutionLabel: "Standard", priceVnd: "" }] };
const statusLabel = (status: ServicePackage["status"]) => status === "ON_SALE" ? "Đang bán" : "Đã ngừng bán";

export function ServicesPage() {
	const [items, setItems] = useState<ServicePackage[]>([]);
	const [serviceTypes, setServiceTypes] = useState<CatalogOption[]>([]);
	const [processes, setProcesses] = useState<CatalogOption[]>([]);
	const [formats, setFormats] = useState<CatalogOption[]>([]);
	const [query, setQuery] = useState("");
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<ServicePackage | null>(null);
	const [form, setForm] = useState<PackageForm>(emptyForm);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");

	const load = useCallback(async () => {
		setLoading(true); setError("");
		try {
			const [packages, types, processRows, formatRows] = await Promise.all([
				adminApi<ServicePackage[]>("film-labs/me/packages"),
				adminApi<CatalogOption[]>("service-types"), adminApi<CatalogOption[]>("film-processes"), adminApi<CatalogOption[]>("film-formats"),
			]);
			setItems(packages); setServiceTypes(types); setProcesses(processRows); setFormats(formatRows);
		} catch (cause) { setError(cause instanceof Error ? cause.message : "Không tải được bảng giá Film Lab."); }
		finally { setLoading(false); }
	}, []);
	useEffect(() => { void load(); }, [load]);

	const serviceTypeName = (id: number) => serviceTypes.find((item) => item.id === id)?.displayName ?? `#${id}`;
	const processName = (id: number) => processes.find((item) => item.id === id)?.displayName ?? `#${id}`;
	const formatName = (id: number) => formats.find((item) => item.id === id)?.displayName ?? `#${id}`;
	const filtered = useMemo(() => items.filter((item) => `${item.packageName} ${serviceTypeName(item.serviceTypeId)} ${processName(item.filmProcessId)} ${formatName(item.filmFormatId)}`.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi"))), [items, query, serviceTypes, processes, formats]);
	const activeCount = items.filter((item) => item.status === "ON_SALE").length;

	function openForm(item?: ServicePackage) {
		setEditing(item ?? null); setError(""); setNotice("");
		setForm(item ? {
			packageName: item.packageName, serviceTypeId: String(item.serviceTypeId), filmProcessId: String(item.filmProcessId), filmFormatId: String(item.filmFormatId),
			priceVnd: String(item.priceVnd), turnaroundDays: String(item.turnaroundDays), pushPullAvailable: item.pushPullAvailable,
			pushPullSurchargePerStopVnd: item.pushPullSurchargePerStopVnd == null ? "" : String(item.pushPullSurchargePerStopVnd),
			scanOptions: item.scanOptions?.length ? item.scanOptions.map((option) => ({ resolutionLabel: option.resolutionLabel, priceVnd: String(option.priceVnd) })) : [],
		} : { ...emptyForm, serviceTypeId: String(serviceTypes.find((x) => x.status === "ACTIVE")?.id ?? ""), filmProcessId: String(processes.find((x) => x.status === "ACTIVE")?.id ?? ""), filmFormatId: String(formats.find((x) => x.status === "ACTIVE")?.id ?? "") });
		setFormOpen(true);
	}

	async function save(event: FormEvent<HTMLFormElement>) {
		event.preventDefault(); setSaving(true); setError(""); setNotice("");
		try {
			const body = {
				packageName: form.packageName.trim(), serviceTypeId: Number(form.serviceTypeId), filmProcessId: Number(form.filmProcessId), filmFormatId: Number(form.filmFormatId),
				priceVnd: Number(form.priceVnd), turnaroundDays: Number(form.turnaroundDays), pushPullAvailable: form.pushPullAvailable,
				pushPullSurchargePerStopVnd: form.pushPullAvailable ? Number(form.pushPullSurchargePerStopVnd) : null,
				scanOptions: form.scanOptions.filter((option) => option.resolutionLabel.trim() && option.priceVnd).map((option) => ({ resolutionLabel: option.resolutionLabel.trim(), priceVnd: Number(option.priceVnd) })),
			};
			await adminApi<ServicePackage>(`film-labs/me/packages${editing ? `/${editing.id}` : ""}`, { method: editing ? "PUT" : "POST", body: JSON.stringify(body) });
			setFormOpen(false); setNotice(editing ? "Đã cập nhật gói dịch vụ." : "Đã tạo gói dịch vụ."); await load();
		} catch (cause) { setError(cause instanceof Error ? cause.message : "Không thể lưu gói dịch vụ."); }
		finally { setSaving(false); }
	}

	async function toggleStatus(item: ServicePackage) {
		setSaving(true); setError(""); setNotice("");
		try {
			const status = item.status === "ON_SALE" ? "WITHDRAWN" : "ON_SALE";
			await adminApi<ServicePackage>(`film-labs/me/packages/${item.id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
			setNotice(status === "ON_SALE" ? "Đã mở bán gói dịch vụ." : "Đã ngừng bán gói dịch vụ."); await load();
		} catch (cause) { setError(cause instanceof Error ? cause.message : "Không thể đổi trạng thái gói."); }
		finally { setSaving(false); }
	}

	return <div className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>UC13 · Bảng giá</p><h1>Dịch vụ & bảng giá</h1><p>Quản lý gói tráng phim, giá, thời gian xử lý và các mức scan được cung cấp.</p></div><Button disabled={loading || saving} onClick={() => openForm()}>Thêm gói dịch vụ</Button></header>
		{error && <p className={styles.errorMessage} role="alert">{error}</p>}{notice && <p className={styles.successMessage} role="status">{notice}</p>}
		<section className={styles.stats}><div className={styles.stat}><span>Tổng gói dịch vụ</span><strong>{items.length}</strong></div><div className={styles.stat}><span>Đang bán</span><strong>{activeCount}</strong></div><div className={styles.stat}><span>Loại dịch vụ hỗ trợ</span><strong>{serviceTypes.filter((x) => x.status === "ACTIVE").length}</strong></div><div className={styles.stat}><span>Nguồn dữ liệu</span><strong>Backend</strong></div></section>
		<section className={styles.panel}><div className={styles.panelHeader}><div><h2>Gói dịch vụ</h2><p>Gói đang bán được hiển thị cho khách khi đặt dịch vụ.</p></div><Button type="button" variant="outline" disabled={loading} onClick={() => void load()}>{loading ? "Đang tải…" : "Tải lại"}</Button></div><div className={styles.tools}><input className={styles.search} placeholder="Tìm tên gói, quy trình hoặc khổ phim" aria-label="Tìm gói dịch vụ" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
		{loading ? <p className={styles.empty} role="status">Đang tải bảng giá…</p> : <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Tên gói</th><th>Dịch vụ</th><th>Quy trình / khổ phim</th><th>Thời gian</th><th>Giá</th><th>Scan</th><th>Trạng thái</th><th></th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td>{item.packageName}<small>#{item.id}</small></td><td>{serviceTypeName(item.serviceTypeId)}</td><td>{processName(item.filmProcessId)} / {formatName(item.filmFormatId)}</td><td>{item.turnaroundDays} ngày</td><td>{formatVnd(item.priceVnd)}</td><td>{item.scanOptions?.map((scan) => `${scan.resolutionLabel}: ${formatVnd(scan.priceVnd)}`).join(" · ") || "Chưa có"}</td><td><span className={`${styles.badge} ${item.status === "ON_SALE" ? styles.badgeSuccess : styles.badgeWarning}`}>{statusLabel(item.status)}</span></td><td><div className={styles.tableActions}><Button size="sm" variant="outline" disabled={saving} onClick={() => openForm(item)}>Sửa</Button><Button size="sm" variant="ghost" disabled={saving} onClick={() => void toggleStatus(item)}>{item.status === "ON_SALE" ? "Ngừng bán" : "Mở bán"}</Button></div></td></tr>)}{filtered.length === 0 && <tr><td colSpan={8} className={styles.empty}>{items.length ? "Không tìm thấy gói phù hợp." : "Lab chưa có gói dịch vụ."}</td></tr>}</tbody></table></div>}</section>
		{formOpen && <div className={styles.overlay} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setFormOpen(false); }}><form className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="package-dialog-title" onSubmit={save}>
			<div><p className={styles.eyebrow}>{editing ? "Chỉnh sửa" : "Tạo mới"} · UC13</p><h2 id="package-dialog-title">{editing ? "Cập nhật gói dịch vụ" : "Thêm gói dịch vụ"}</h2></div>
			<label className={styles.fieldLabel}>Tên gói<input className={styles.field} required minLength={2} maxLength={150} value={form.packageName} onChange={(event) => setForm({ ...form, packageName: event.target.value })} /></label>
			<div className={styles.fieldGrid}><label className={styles.fieldLabel}>Loại dịch vụ<select className={styles.field} required value={form.serviceTypeId} onChange={(event) => setForm({ ...form, serviceTypeId: event.target.value })}><option value="">Chọn dịch vụ</option>{serviceTypes.filter((x) => x.status === "ACTIVE" || x.id === editing?.serviceTypeId).map((x) => <option key={x.id} value={x.id}>{x.displayName}</option>)}</select></label><label className={styles.fieldLabel}>Quy trình<select className={styles.field} required value={form.filmProcessId} onChange={(event) => setForm({ ...form, filmProcessId: event.target.value })}><option value="">Chọn quy trình</option>{processes.filter((x) => x.status === "ACTIVE" || x.id === editing?.filmProcessId).map((x) => <option key={x.id} value={x.id}>{x.displayName}</option>)}</select></label><label className={styles.fieldLabel}>Khổ phim<select className={styles.field} required value={form.filmFormatId} onChange={(event) => setForm({ ...form, filmFormatId: event.target.value })}><option value="">Chọn khổ phim</option>{formats.filter((x) => x.status === "ACTIVE" || x.id === editing?.filmFormatId).map((x) => <option key={x.id} value={x.id}>{x.displayName}</option>)}</select></label><label className={styles.fieldLabel}>Giá gói (VND)<input className={styles.field} type="number" required min="1" max="50000000" value={form.priceVnd} onChange={(event) => setForm({ ...form, priceVnd: event.target.value })} /></label><label className={styles.fieldLabel}>Thời gian xử lý (ngày)<input className={styles.field} type="number" required min="1" max="60" value={form.turnaroundDays} onChange={(event) => setForm({ ...form, turnaroundDays: event.target.value })} /></label></div>
			<label className={styles.fieldLabel}><span className="flex items-center gap-2"><input type="checkbox" checked={form.pushPullAvailable} onChange={(event) => setForm({ ...form, pushPullAvailable: event.target.checked })} /> Hỗ trợ push/pull</span></label>{form.pushPullAvailable && <label className={styles.fieldLabel}>Phụ phí mỗi stop (VND)<input className={styles.field} type="number" required min="1" value={form.pushPullSurchargePerStopVnd} onChange={(event) => setForm({ ...form, pushPullSurchargePerStopVnd: event.target.value })} /></label>}
			<div className={styles.panelHeader}><div><h3>Mức scan</h3><p>Có thể thêm nhiều độ phân giải; giá từng mức phải lớn hơn 0.</p></div><Button type="button" size="sm" variant="outline" onClick={() => setForm({ ...form, scanOptions: [...form.scanOptions, { resolutionLabel: "", priceVnd: "" }] })}>Thêm mức scan</Button></div>{form.scanOptions.map((option, index) => <div className={styles.fieldGrid} key={index}><label className={styles.fieldLabel}>Độ phân giải<input className={styles.field} maxLength={50} value={option.resolutionLabel} onChange={(event) => setForm({ ...form, scanOptions: form.scanOptions.map((x, i) => i === index ? { ...x, resolutionLabel: event.target.value } : x) })} /></label><label className={styles.fieldLabel}>Giá scan (VND)<input className={styles.field} type="number" min="1" value={option.priceVnd} onChange={(event) => setForm({ ...form, scanOptions: form.scanOptions.map((x, i) => i === index ? { ...x, priceVnd: event.target.value } : x) })} /></label><Button type="button" variant="ghost" onClick={() => setForm({ ...form, scanOptions: form.scanOptions.filter((_, i) => i !== index) })}>Xóa mức</Button></div>)}
			{error && <p className={styles.errorMessage} role="alert">{error}</p>}<div className={styles.dialogActions}><Button type="button" variant="outline" disabled={saving} onClick={() => setFormOpen(false)}>Hủy</Button><Button type="submit" disabled={saving}>{saving ? "Đang lưu…" : "Lưu gói dịch vụ"}</Button></div>
		</form></div>}
	</div>;
}
