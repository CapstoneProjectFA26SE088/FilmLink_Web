"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/admin-api";
import styles from "./admin-pages.module.css";

type LabApplication = {
	id: number; applicationCode: string; labName: string; taxCode: string; province: string; district: string;
	contactEmail: string; contactPhone: string; status: string; isDuplicateSuspected: boolean; createdAt: string;
	addressLine?: string; latitude?: number | null; longitude?: number | null; rejectionReason?: string | null;
	version?: number; serviceTypeIds?: number[]; filmProcessIds?: number[]; filmFormatIds?: number[];
	documents?: { id?: number; documentType?: string; fileName?: string; downloadUrl?: string; url?: string }[];
};
type Page<T> = { content: T[]; page: number; size: number; totalElements: number; totalPages: number; hasNext: boolean };

const statusLabels: Record<string, string> = {
	PENDING_REVIEW: "Chờ duyệt", AWAITING_INFORMATION: "Chờ bổ sung thông tin", APPROVED: "Đã duyệt", REJECTED: "Từ chối",
};

export function AdminLabApplicationsPage() {
	const [result, setResult] = useState<Page<LabApplication> | null>(null);
	const [status, setStatus] = useState("");
	const [page, setPage] = useState(0);
	const [selected, setSelected] = useState<LabApplication | null>(null);
	const [reason, setReason] = useState("");
	const [accountEmail, setAccountEmail] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");

	const load = useCallback(async () => {
		setLoading(true); setError("");
		try {
			const params = new URLSearchParams({ page: String(page), size: "20", sort: "createdAt,desc" });
			if (status) params.set("status", status);
			setResult(await adminApi<Page<LabApplication>>(`admin/lab-applications?${params}`));
		} catch (cause) { setError(cause instanceof Error ? cause.message : "Không tải được hồ sơ Film Lab."); }
		finally { setLoading(false); }
	}, [page, status]);
	useEffect(() => { void load(); }, [load]);

	async function openDetail(id: number) {
		setError(""); setNotice("");
		try { setSelected(await adminApi<LabApplication>(`admin/lab-applications/${id}`)); }
		catch (cause) { setError(cause instanceof Error ? cause.message : "Không tải được chi tiết hồ sơ."); }
	}
	async function decide(action: "approve" | "reject") {
		if (selected?.version == null) return;
		setSaving(true); setError(""); setNotice("");
		try {
			const body = action === "approve" ? { version: selected.version, accountEmail: accountEmail.trim() || null } : { version: selected.version, reason: reason.trim() };
			await adminApi<LabApplication>(`admin/lab-applications/${selected.id}/${action}`, { method: "POST", body: JSON.stringify(body) });
			setSelected(null); setReason(""); setAccountEmail(""); setNotice(action === "approve" ? "Đã duyệt hồ sơ và tạo tài khoản Film Lab Owner." : "Đã từ chối hồ sơ.");
			await load();
		} catch (cause) { setError(cause instanceof Error ? cause.message : "Không thể xử lý hồ sơ."); }
		finally { setSaving(false); }
	}

	return <div className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>UC08 · Admin</p><h1>Duyệt hồ sơ Film Lab</h1><p>Xem hồ sơ, tài liệu đính kèm và phê duyệt đăng ký mở Film Lab.</p></div><Button variant="outline" disabled={loading} onClick={() => void load()}>{loading ? "Đang tải…" : "Tải lại"}</Button></header>
		{error && <p className={styles.errorMessage} role="alert">{error}</p>}{notice && <p className={styles.successMessage} role="status">{notice}</p>}
		<section className={styles.panel}><div className={styles.tools}><select className={styles.select} aria-label="Lọc trạng thái" value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }}><option value="">Tất cả trạng thái</option><option value="PENDING_REVIEW">Chờ duyệt</option><option value="AWAITING_INFORMATION">Chờ bổ sung</option><option value="APPROVED">Đã duyệt</option><option value="REJECTED">Từ chối</option></select><span>{result?.totalElements ?? 0} hồ sơ</span></div>
		{loading ? <p className={styles.empty} role="status">Đang tải hồ sơ…</p> : <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Mã hồ sơ</th><th>Film Lab</th><th>Liên hệ</th><th>Khu vực</th><th>Trạng thái</th><th></th></tr></thead><tbody>{result?.content.map((item) => <tr key={item.id}><td>{item.applicationCode}<small>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</small></td><td>{item.labName}<small>MST: {item.taxCode}{item.isDuplicateSuspected ? " · Cần kiểm tra trùng" : ""}</small></td><td>{item.contactEmail}<small>{item.contactPhone}</small></td><td>{item.district}, {item.province}</td><td><span className={`${styles.badge} ${item.status === "PENDING_REVIEW" ? styles.badgeWarning : item.status === "APPROVED" ? styles.badgeSuccess : ""}`}>{statusLabels[item.status] ?? item.status}</span></td><td><Button size="sm" variant="outline" onClick={() => void openDetail(item.id)}>Chi tiết</Button></td></tr>)}{!result?.content.length && <tr><td className={styles.empty} colSpan={6}>Không có hồ sơ phù hợp.</td></tr>}</tbody></table></div>}
		<div className="flex items-center justify-between border-t p-4 text-sm"><span>Trang {(result?.page ?? 0) + 1} / {Math.max(result?.totalPages ?? 0, 1)}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 0 || loading} onClick={() => setPage((value) => value - 1)}>Trước</Button><Button size="sm" variant="outline" disabled={!result?.hasNext || loading} onClick={() => setPage((value) => value + 1)}>Sau</Button></div></div></section>
		{selected && <div className={styles.overlay} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="lab-application-title"><div><p className={styles.eyebrow}>{selected.applicationCode}</p><h2 id="lab-application-title">{selected.labName}</h2><p>{selected.addressLine}, {selected.district}, {selected.province}</p></div><div className={styles.details}><div className={styles.detailLine}><span>Mã số thuế</span><strong>{selected.taxCode}</strong></div><div className={styles.detailLine}><span>Email liên hệ</span><strong>{selected.contactEmail}</strong></div><div className={styles.detailLine}><span>Điện thoại</span><strong>{selected.contactPhone}</strong></div><div className={styles.detailLine}><span>Trạng thái</span><strong>{statusLabels[selected.status] ?? selected.status}</strong></div>{selected.isDuplicateSuspected && <p className={styles.errorMessage}>Cảnh báo: hồ sơ có thông tin trùng cần kiểm tra kỹ.</p>}{selected.documents?.map((doc, i) => <div className={styles.detailLine} key={doc.id ?? i}><span>{doc.documentType ?? doc.fileName ?? `Tài liệu ${i + 1}`}</span><strong>{doc.downloadUrl || doc.url ? <a href={doc.downloadUrl ?? doc.url} target="_blank" rel="noreferrer">Mở tài liệu</a> : "Không có liên kết tải"}</strong></div>)}</div>
		{selected.status !== "APPROVED" && selected.status !== "REJECTED" && <><label className={styles.fieldLabel}>Email tài khoản Film Lab Owner (để trống sẽ dùng email liên hệ)<input className={styles.field} type="email" value={accountEmail} onChange={(event) => setAccountEmail(event.target.value)} /></label><label className={styles.fieldLabel}>Lý do từ chối<textarea className={styles.field} minLength={10} maxLength={500} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Nhập tối thiểu 10 ký tự nếu từ chối" /></label></>}{error && <p className={styles.errorMessage} role="alert">{error}</p>}<div className={styles.formActions}><Button variant="outline" disabled={saving} onClick={() => setSelected(null)}>Đóng</Button>{selected.status !== "APPROVED" && selected.status !== "REJECTED" && <><Button variant="destructive" disabled={saving || reason.trim().length < 10} onClick={() => void decide("reject")}>{saving ? "Đang xử lý…" : "Từ chối"}</Button><Button disabled={saving} onClick={() => void decide("approve")}>{saving ? "Đang xử lý…" : "Duyệt hồ sơ"}</Button></>}</div></section></div>}
	</div>;
}

type SystemParameter = { id: number; key: string; value: string; valueType: "PERCENT" | "INTEGER" | "STRING"; description: string; version: number; updatedAt?: string };
export function AdminSystemParametersPage() {
	const [items, setItems] = useState<SystemParameter[]>([]);
	const [drafts, setDrafts] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState<string | null>(null);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const load = useCallback(async () => { setLoading(true); setError(""); try { const data = await adminApi<SystemParameter[]>("admin/system-parameters"); setItems(data); setDrafts(Object.fromEntries(data.map((x) => [x.key, x.value]))); } catch (cause) { setError(cause instanceof Error ? cause.message : "Không tải được tham số hệ thống."); } finally { setLoading(false); } }, []);
	useEffect(() => { void load(); }, [load]);
	async function save(item: SystemParameter) { setSaving(item.key); setError(""); setNotice(""); try { const result = await adminApi<SystemParameter>(`admin/system-parameters/${item.key}`, { method: "PUT", body: JSON.stringify({ value: drafts[item.key], version: item.version }) }); setItems((current) => current.map((x) => x.key === item.key ? result : x)); setDrafts((current) => ({ ...current, [item.key]: result.value })); setNotice(`Đã cập nhật ${item.key}.`); } catch (cause) { setError(cause instanceof Error ? cause.message : `Không cập nhật được ${item.key}.`); } finally { setSaving(null); } }
	return <div className={styles.page}><header className={styles.heading}><div><p className={styles.eyebrow}>UC54 · BR-38</p><h1>Cấu hình hệ thống</h1><p>Tham số vận hành được tải và lưu trực tiếp qua API backend.</p></div><Button variant="outline" disabled={loading} onClick={() => void load()}>Tải lại</Button></header>{error && <p className={styles.errorMessage} role="alert">{error}</p>}{notice && <p className={styles.successMessage} role="status">{notice}</p>}<section className={styles.panel}>{loading ? <p className={styles.empty}>Đang tải tham số…</p> : <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Tham số</th><th>Mô tả</th><th>Kiểu</th><th>Giá trị</th><th></th></tr></thead><tbody>{items.map((item) => <tr key={item.key}><td>{item.key}<small>Version {item.version}</small></td><td>{item.description}</td><td>{item.valueType}</td><td><input className={styles.field} type={item.valueType === "INTEGER" || item.valueType === "PERCENT" ? "number" : "text"} min={item.valueType === "PERCENT" ? 0 : undefined} max={item.valueType === "PERCENT" ? 100 : undefined} step={item.valueType === "PERCENT" ? "0.01" : "1"} value={drafts[item.key] ?? ""} onChange={(event) => setDrafts((current) => ({ ...current, [item.key]: event.target.value }))} /></td><td><Button size="sm" disabled={saving !== null || drafts[item.key] === item.value} onClick={() => void save(item)}>{saving === item.key ? "Đang lưu…" : "Lưu"}</Button></td></tr>)}</tbody></table></div>}</section></div>;
}

export function AdminCreateAccountForm() {
	const [form, setForm] = useState({ email: "", password: "", fullName: "", phoneNumber: "" });
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(""); setNotice(""); try { const created = await adminApi<{ email: string }>("admin/accounts", { method: "POST", body: JSON.stringify(form) }); setNotice(`Đã tạo tài khoản quản trị ${created.email}.`); setForm({ email: "", password: "", fullName: "", phoneNumber: "" }); } catch (cause) { setError(cause instanceof Error ? cause.message : "Không tạo được tài khoản Admin."); } finally { setBusy(false); } }
	return <section className={styles.panel}><div className={styles.panelHeader}><div><h2>Tạo tài khoản Admin</h2><p>API backend chỉ hỗ trợ tạo Admin; hiện chưa có API danh sách, khóa/mở khóa hoặc đổi role người dùng.</p></div></div><form className={styles.formBody} onSubmit={submit}><div className={styles.formGrid}><label className={styles.fieldLabel}>Họ tên<input className={styles.field} required minLength={2} maxLength={100} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label><label className={styles.fieldLabel}>Email<input className={styles.field} required type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label className={styles.fieldLabel}>Mật khẩu (ít nhất 8 ký tự, gồm chữ và số)<input className={styles.field} required type="password" minLength={8} maxLength={72} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><label className={styles.fieldLabel}>Số điện thoại<input className={styles.field} maxLength={15} value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} /></label></div>{error && <p className={styles.errorMessage} role="alert">{error}</p>}{notice && <p className={styles.successMessage} role="status">{notice}</p>}<div className={styles.formActions}><Button disabled={busy}>{busy ? "Đang tạo…" : "Tạo tài khoản"}</Button></div></form></section>;
}
