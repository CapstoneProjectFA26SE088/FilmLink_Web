"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/admin-api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import { StatePanel } from "@/components/shared/feedback/state-panel";
import { StatusBadge } from "@/components/shared/status/status-badge";
import { formatMoney } from "@/lib/format";
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
const PACKAGE_STATUS: Record<ServicePackage["status"], { label: string; tone: "success" | "neutral" }> = {
	ON_SALE: { label: "Đang bán", tone: "success" },
	WITHDRAWN: { label: "Đã ngừng bán", tone: "neutral" },
};

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

	const [reloadKey, setReloadKey] = useState(0);

	useEffect(() => {
		let cancelled = false;
		Promise.all([
			adminApi<ServicePackage[]>("film-labs/me/packages"),
			adminApi<CatalogOption[]>("service-types"), adminApi<CatalogOption[]>("film-processes"), adminApi<CatalogOption[]>("film-formats"),
		])
			.then(([packages, types, processRows, formatRows]) => {
				if (cancelled) return;
				setItems(packages); setServiceTypes(types); setProcesses(processRows); setFormats(formatRows);
				setError("");
			})
			.catch((cause: unknown) => {
				if (!cancelled) setError(cause instanceof Error ? cause.message : "Không tải được bảng giá Film Lab.");
			})
			.finally(() => { if (!cancelled) setLoading(false); });
		return () => { cancelled = true; };
	}, [reloadKey]);

	function load() {
		setLoading(true);
		setError("");
		setReloadKey((value) => value + 1);
	}

	const serviceTypeName = (id: number) => serviceTypes.find((item) => item.id === id)?.displayName ?? `#${id}`;
	const processName = (id: number) => processes.find((item) => item.id === id)?.displayName ?? `#${id}`;
	const formatName = (id: number) => formats.find((item) => item.id === id)?.displayName ?? `#${id}`;
	const needle = query.trim().toLocaleLowerCase("vi");
	const filtered = items.filter((item) => `${item.packageName} ${serviceTypeName(item.serviceTypeId)} ${processName(item.filmProcessId)} ${formatName(item.filmFormatId)}`.toLocaleLowerCase("vi").includes(needle));
	const activeCount = items.filter((item) => item.status === "ON_SALE").length;
	const withdrawnCount = items.length - activeCount;

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
			setFormOpen(false); setNotice(editing ? "Đã cập nhật gói dịch vụ." : "Đã tạo gói dịch vụ."); load();
		} catch (cause) { setError(cause instanceof Error ? cause.message : "Không thể lưu gói dịch vụ."); }
		finally { setSaving(false); }
	}

	async function toggleStatus(item: ServicePackage) {
		setSaving(true); setError(""); setNotice("");
		try {
			const status = item.status === "ON_SALE" ? "WITHDRAWN" : "ON_SALE";
			await adminApi<ServicePackage>(`film-labs/me/packages/${item.id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
			setNotice(status === "ON_SALE" ? "Đã mở bán gói dịch vụ." : "Đã ngừng bán gói dịch vụ."); load();
		} catch (cause) { setError(cause instanceof Error ? cause.message : "Không thể đổi trạng thái gói."); }
		finally { setSaving(false); }
	}

	const numeric = "text-right tabular-nums";
	return <div className={styles.page}>
		<header className={styles.heading}>
			<div>
				<h1>Dịch vụ & bảng giá</h1>
				<p>Quản lý gói tráng phim, giá, thời gian xử lý và các mức scan được cung cấp.</p>
			</div>
			<Button disabled={loading || saving} onClick={() => openForm()}>Thêm gói dịch vụ</Button>
		</header>
		{!formOpen && error ? <InlineMessage tone="error">{error}</InlineMessage> : null}
		{notice ? <InlineMessage tone="success">{notice}</InlineMessage> : null}
		<section className={styles.stats} aria-label="Tổng quan gói dịch vụ">
			<div className={styles.stat}><span>Tổng gói dịch vụ</span><strong>{items.length}</strong></div>
			<div className={styles.stat}><span>Đang bán</span><strong>{activeCount}</strong></div>
			<div className={styles.stat}><span>Đã ngừng bán</span><strong>{withdrawnCount}</strong></div>
			<div className={styles.stat}><span>Loại dịch vụ hỗ trợ</span><strong>{serviceTypes.filter((x) => x.status === "ACTIVE").length}</strong></div>
		</section>
		<section className={styles.panel}>
			<div className={styles.panelHeader}>
				<div><h2>Gói dịch vụ</h2><p>Gói đang bán được hiển thị cho khách khi đặt dịch vụ.</p></div>
				<Button type="button" variant="outline" disabled={loading} onClick={load}>{loading ? "Đang tải…" : "Tải lại"}</Button>
			</div>
			<div className={styles.tools}>
				<input className={styles.search} placeholder="Tìm tên gói, quy trình hoặc khổ phim" aria-label="Tìm gói dịch vụ" value={query} onChange={(event) => setQuery(event.target.value)} />
			</div>
			{loading ? <StatePanel variant="loading" rows={4} label="Đang tải bảng giá…" className="p-4" />
				: filtered.length === 0 ? (error && !items.length
					? <StatePanel variant="error" title="Không tải được bảng giá" description={error} onRetry={() => void load()} className="m-4" />
					: <StatePanel
						variant="empty"
						title={items.length ? "Không tìm thấy gói phù hợp" : "Lab chưa có gói dịch vụ"}
						description={items.length ? "Thử từ khóa khác hoặc xóa ô tìm kiếm." : "Thêm gói đầu tiên để khách có thể đặt dịch vụ tại lab của bạn."}
						action={items.length ? undefined : <Button onClick={() => openForm()}>Thêm gói dịch vụ</Button>}
						className="m-4"
					/>)
				: <div className={styles.tableWrap}><table className={styles.table}>
					<thead><tr>
						<th scope="col">Tên gói</th><th scope="col">Dịch vụ</th><th scope="col">Quy trình / khổ phim</th>
						<th scope="col" className={numeric}>Thời gian</th><th scope="col" className={numeric}>Giá</th><th scope="col">Scan</th>
						<th scope="col">Trạng thái</th><th scope="col"><span className="sr-only">Thao tác</span></th>
					</tr></thead>
					<tbody>{filtered.map((item) => {
						const state = PACKAGE_STATUS[item.status] ?? { label: "Không xác định", tone: "neutral" as const };
						return <tr key={item.id}>
							<td>{item.packageName}<small>#{item.id}</small></td>
							<td>{serviceTypeName(item.serviceTypeId)}</td>
							<td>{processName(item.filmProcessId)} / {formatName(item.filmFormatId)}</td>
							<td className={numeric}>{item.turnaroundDays} ngày</td>
							<td className={numeric}>{formatMoney(item.priceVnd)}</td>
							<td>{item.scanOptions?.map((scan) => `${scan.resolutionLabel}: ${formatMoney(scan.priceVnd)}`).join(" · ") || "Chưa có"}</td>
							<td><StatusBadge label={state.label} tone={state.tone} /></td>
							<td><div className={styles.tableActions}>
								<Button size="sm" variant="outline" disabled={saving} aria-label={`Sửa gói ${item.packageName}`} onClick={() => openForm(item)}>Sửa</Button>
								<Button size="sm" variant="ghost" disabled={saving} aria-label={`${item.status === "ON_SALE" ? "Ngừng bán" : "Mở bán"} gói ${item.packageName}`} onClick={() => void toggleStatus(item)}>{item.status === "ON_SALE" ? "Ngừng bán" : "Mở bán"}</Button>
							</div></td>
						</tr>;
					})}</tbody>
				</table></div>}
		</section>
		<Dialog open={formOpen} onOpenChange={(open) => { if (!saving) setFormOpen(open); }}>
			<DialogContent showCloseButton={false} className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
				<form className="grid gap-4" onSubmit={save}>
					<DialogHeader>
						<DialogTitle className="text-lg">{editing ? "Cập nhật gói dịch vụ" : "Thêm gói dịch vụ"}</DialogTitle>
						<DialogDescription>Gói đang bán được hiển thị cho khách khi đặt dịch vụ.</DialogDescription>
					</DialogHeader>
					<label className={styles.fieldLabel}>Tên gói<input className={styles.field} required minLength={2} maxLength={150} value={form.packageName} onChange={(event) => setForm({ ...form, packageName: event.target.value })} /></label>
					<div className={styles.fieldGrid}>
						<label className={styles.fieldLabel}>Loại dịch vụ<select className={styles.field} required value={form.serviceTypeId} onChange={(event) => setForm({ ...form, serviceTypeId: event.target.value })}><option value="">Chọn dịch vụ</option>{serviceTypes.filter((x) => x.status === "ACTIVE" || x.id === editing?.serviceTypeId).map((x) => <option key={x.id} value={x.id}>{x.displayName}</option>)}</select></label>
						<label className={styles.fieldLabel}>Quy trình<select className={styles.field} required value={form.filmProcessId} onChange={(event) => setForm({ ...form, filmProcessId: event.target.value })}><option value="">Chọn quy trình</option>{processes.filter((x) => x.status === "ACTIVE" || x.id === editing?.filmProcessId).map((x) => <option key={x.id} value={x.id}>{x.displayName}</option>)}</select></label>
						<label className={styles.fieldLabel}>Khổ phim<select className={styles.field} required value={form.filmFormatId} onChange={(event) => setForm({ ...form, filmFormatId: event.target.value })}><option value="">Chọn khổ phim</option>{formats.filter((x) => x.status === "ACTIVE" || x.id === editing?.filmFormatId).map((x) => <option key={x.id} value={x.id}>{x.displayName}</option>)}</select></label>
						<label className={styles.fieldLabel}>Giá gói (VND)<input className={styles.field} type="number" required min="1" max="50000000" value={form.priceVnd} onChange={(event) => setForm({ ...form, priceVnd: event.target.value })} /></label>
						<label className={styles.fieldLabel}>Thời gian xử lý (ngày)<input className={styles.field} type="number" required min="1" max="60" value={form.turnaroundDays} onChange={(event) => setForm({ ...form, turnaroundDays: event.target.value })} /></label>
					</div>
					<label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" className="size-4" checked={form.pushPullAvailable} onChange={(event) => setForm({ ...form, pushPullAvailable: event.target.checked })} /> Hỗ trợ push/pull</label>
					{form.pushPullAvailable && <label className={styles.fieldLabel}>Phụ phí mỗi stop (VND)<input className={styles.field} type="number" required min="1" value={form.pushPullSurchargePerStopVnd} onChange={(event) => setForm({ ...form, pushPullSurchargePerStopVnd: event.target.value })} /></label>}
					<div className="flex items-start justify-between gap-3">
						<div><h3 className="text-base font-semibold">Mức scan</h3><p className="text-sm text-muted-foreground">Có thể thêm nhiều độ phân giải; giá từng mức phải lớn hơn 0.</p></div>
						<Button type="button" size="sm" variant="outline" onClick={() => setForm({ ...form, scanOptions: [...form.scanOptions, { resolutionLabel: "", priceVnd: "" }] })}>Thêm mức scan</Button>
					</div>
					{form.scanOptions.map((option, index) => <div className={styles.fieldGrid} key={index}>
						<label className={styles.fieldLabel}>Độ phân giải<input className={styles.field} maxLength={50} value={option.resolutionLabel} onChange={(event) => setForm({ ...form, scanOptions: form.scanOptions.map((x, i) => i === index ? { ...x, resolutionLabel: event.target.value } : x) })} /></label>
						<label className={styles.fieldLabel}>Giá scan (VND)<input className={styles.field} type="number" min="1" value={option.priceVnd} onChange={(event) => setForm({ ...form, scanOptions: form.scanOptions.map((x, i) => i === index ? { ...x, priceVnd: event.target.value } : x) })} /></label>
						<Button type="button" variant="ghost" onClick={() => setForm({ ...form, scanOptions: form.scanOptions.filter((_, i) => i !== index) })}>Xóa mức</Button>
					</div>)}
					{error ? <InlineMessage tone="error">{error}</InlineMessage> : null}
					<DialogFooter>
						<Button type="button" variant="outline" disabled={saving} onClick={() => setFormOpen(false)}>Hủy</Button>
						<Button type="submit" disabled={saving}>{saving ? "Đang lưu…" : "Lưu gói dịch vụ"}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	</div>;
}
