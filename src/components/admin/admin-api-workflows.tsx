"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import { StatePanel } from "@/components/shared/feedback/state-panel";
import { LAB_APPLICATION_STATUS_MAP, labApplicationStatusLabel } from "@/components/shared/status/labels";
import { LabApplicationStatusBadge } from "@/components/shared/status/status-badge";
import { adminApi } from "@/lib/admin-api";
import { formatDateOnly } from "@/lib/format";
import styles from "./admin-pages.module.css";

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
	BUSINESS_LICENSE: "Giấy phép kinh doanh",
	TAX_REGISTRATION: "Đăng ký thuế",
	IDENTITY_CARD: "Giấy tờ tùy thân",
	OTHER: "Tài liệu khác",
};

function documentTypeLabel(value?: string) {
	if (!value) return undefined;
	return DOCUMENT_TYPE_LABELS[value] ?? "Tài liệu xác minh";
}

type LabApplication = {
	id: number; applicationCode: string; labName: string; taxCode: string; province: string; district: string;
	contactEmail: string; contactPhone: string; status: string; isDuplicateSuspected: boolean; createdAt: string;
	addressLine?: string; latitude?: number | null; longitude?: number | null; rejectionReason?: string | null;
	version?: number; serviceTypeIds?: number[]; filmProcessIds?: number[]; filmFormatIds?: number[];
	documents?: { id?: number; documentType?: string; fileName?: string; downloadUrl?: string; url?: string }[];
};
type Page<T> = { content: T[]; page: number; size: number; totalElements: number; totalPages: number; hasNext: boolean };
type Notice = { title: string; body: string };

const REJECT_REASON_MIN = 10;
const STATUS_FILTERS = Object.entries(LAB_APPLICATION_STATUS_MAP).map(([value, entry]) => ({ value, label: entry.label }));
const isDecided = (status: string) => status === "APPROVED" || status === "REJECTED";

function LabApplicationDialog({
	application,
	saving,
	error,
	reason,
	accountEmail,
	onReasonChange,
	onAccountEmailChange,
	onClose,
	onDecide,
}: {
	application: LabApplication;
	saving: boolean;
	error: string;
	reason: string;
	accountEmail: string;
	onReasonChange: (value: string) => void;
	onAccountEmailChange: (value: string) => void;
	onClose: () => void;
	onDecide: (action: "approve" | "reject") => void;
}) {
	const decided = isDecided(application.status);
	const reasonTooShort = reason.trim().length < REJECT_REASON_MIN;
	return (
		<Dialog open onOpenChange={(open) => { if (!open && !saving) onClose(); }}>
			<DialogContent showCloseButton={false} className="max-h-[88vh] overflow-y-auto sm:max-w-xl">
				<DialogHeader>
					<p className={styles.eyebrow}>{application.applicationCode}</p>
					<DialogTitle className="text-lg">{application.labName}</DialogTitle>
					<DialogDescription>
						{[application.addressLine, application.district, application.province].filter(Boolean).join(", ")}
					</DialogDescription>
				</DialogHeader>
				<div className={styles.details}>
					<div className={styles.detailLine}><span>Mã số thuế</span><strong>{application.taxCode}</strong></div>
					<div className={styles.detailLine}><span>Email liên hệ</span><strong>{application.contactEmail}</strong></div>
					<div className={styles.detailLine}><span>Điện thoại</span><strong>{application.contactPhone}</strong></div>
					<div className={styles.detailLine}>
						<span>Trạng thái</span>
						<LabApplicationStatusBadge value={application.status} />
					</div>
					{application.rejectionReason ? (
						<div className={styles.detailLine}><span>Lý do từ chối</span><strong>{application.rejectionReason}</strong></div>
					) : null}
					{application.documents?.map((doc, index) => {
						const href = doc.downloadUrl ?? doc.url;
						return (
							<div className={styles.detailLine} key={doc.id ?? index}>
								<span>{documentTypeLabel(doc.documentType) ?? doc.fileName ?? `Tài liệu ${index + 1}`}</span>
								<strong>
									{href ? <a href={href} target="_blank" rel="noreferrer">Mở tài liệu</a> : "Không có liên kết tải"}
								</strong>
							</div>
						);
					})}
				</div>
				{application.isDuplicateSuspected ? (
					<InlineMessage tone="warning">Hồ sơ có thông tin trùng với hồ sơ khác. Hãy kiểm tra kỹ trước khi duyệt.</InlineMessage>
				) : null}
				{decided ? null : (
					<>
						<label className={styles.fieldLabel}>
							Email tài khoản Film Lab Owner
							<input
								className={styles.field}
								type="email"
								value={accountEmail}
								placeholder={application.contactEmail}
								onChange={(event) => onAccountEmailChange(event.target.value)}
							/>
							<small>Để trống sẽ dùng email liên hệ: {application.contactEmail}.</small>
						</label>
						<label className={styles.fieldLabel}>
							Lý do từ chối
							<textarea
								className={styles.field}
								minLength={REJECT_REASON_MIN}
								maxLength={500}
								value={reason}
								onChange={(event) => onReasonChange(event.target.value)}
								placeholder={`Nhập tối thiểu ${REJECT_REASON_MIN} ký tự nếu từ chối`}
							/>
						</label>
					</>
				)}
				{error ? <InlineMessage tone="error">{error}</InlineMessage> : null}
				<DialogFooter>
					<Button type="button" variant="outline" disabled={saving} onClick={onClose}>Đóng</Button>
					{decided ? null : (
						<>
							<Button
								type="button"
								variant="destructive"
								disabled={saving || reasonTooShort}
								onClick={() => onDecide("reject")}
							>
								{saving ? "Đang xử lý…" : "Từ chối"}
							</Button>
							<Button type="button" disabled={saving} onClick={() => onDecide("approve")}>
								{saving ? "Đang xử lý…" : "Duyệt hồ sơ"}
							</Button>
						</>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

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
	const [dialogError, setDialogError] = useState("");
	const [notice, setNotice] = useState<Notice | null>(null);
	const [reloadKey, setReloadKey] = useState(0);
	const detailRequest = useRef(0);
	const [openingId, setOpeningId] = useState<number | null>(null);

	useEffect(() => {
		let cancelled = false;
		const params = new URLSearchParams({ page: String(page), size: "20", sort: "createdAt,desc" });
		if (status) params.set("status", status);
		adminApi<Page<LabApplication>>(`admin/lab-applications?${params}`)
			.then((next) => {
				if (cancelled) return;
				setResult(next);
				setError("");
			})
			.catch((cause: unknown) => {
				if (cancelled) return;
				setResult(null);
				setError(cause instanceof Error ? cause.message : "Không tải được hồ sơ Film Lab.");
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => { cancelled = true; };
	}, [page, status, reloadKey]);

	function reload() {
		setLoading(true);
		setError("");
		setReloadKey((value) => value + 1);
	}

	function changeStatus(next: string) {
		setLoading(true);
		setStatus(next);
		setPage(0);
	}

	function changePage(next: number) {
		setLoading(true);
		setPage(next);
	}

	async function openDetail(id: number) {
		const request = ++detailRequest.current;
		setOpeningId(id);
		setError("");
		setDialogError("");
		setNotice(null);
		try {
			const application = await adminApi<LabApplication>(`admin/lab-applications/${id}`);
			if (request !== detailRequest.current) return;
			setReason("");
			setAccountEmail("");
			setSelected(application);
		} catch (cause) {
			if (request === detailRequest.current) {
				setError(cause instanceof Error ? cause.message : "Không tải được chi tiết hồ sơ.");
			}
		} finally {
			if (request === detailRequest.current) setOpeningId(null);
		}
	}

	async function decide(action: "approve" | "reject") {
		if (!selected || saving) return;
		if (selected.version == null) {
			setDialogError("Hồ sơ thiếu phiên bản. Hãy đóng và mở lại chi tiết trước khi xét duyệt.");
			return;
		}
		setSaving(true);
		setDialogError("");
		setNotice(null);
		try {
			const body = action === "approve"
				? { version: selected.version, accountEmail: accountEmail.trim() || null }
				: { version: selected.version, reason: reason.trim() };
			await adminApi<LabApplication>(`admin/lab-applications/${selected.id}/${action}`, {
				method: "POST",
				body: JSON.stringify(body),
			});
			const ownerEmail = accountEmail.trim() || selected.contactEmail;
			setNotice(action === "approve"
				? {
					title: `Đã duyệt hồ sơ ${selected.applicationCode}`,
					body: `Tài khoản Film Lab Owner đã được tạo cho ${ownerEmail}. Bước tiếp theo: báo chủ lab kiểm tra email này để đăng nhập và hoàn thiện hồ sơ.`,
				}
				: {
					title: `Đã từ chối hồ sơ ${selected.applicationCode}`,
					body: "Lý do từ chối đã được lưu. Người nộp hồ sơ có thể tra cứu kết quả bằng mã hồ sơ.",
				});
			setSelected(null);
			setReason("");
			setAccountEmail("");
			reload();
		} catch (cause) {
			setDialogError(cause instanceof Error ? cause.message : "Không thể xử lý hồ sơ.");
		} finally {
			setSaving(false);
		}
	}

	function closeDialog() {
		setSelected(null);
		setDialogError("");
	}

	const rows = result?.content ?? [];
	const filterLabel = status ? labApplicationStatusLabel(status) : "";

	return (
		<div className={styles.page}>
			<header className={styles.heading}>
				<div>
					<h1>Duyệt hồ sơ Film Lab</h1>
					<p>Xem hồ sơ, tài liệu đính kèm và phê duyệt đăng ký mở Film Lab.</p>
				</div>
				<Button variant="outline" disabled={loading} onClick={reload}>
					{loading ? "Đang tải…" : "Tải lại"}
				</Button>
			</header>
			{notice ? (
				<InlineMessage tone="success" title={notice.title}>{notice.body}</InlineMessage>
			) : null}
			<section className={styles.panel} aria-label="Danh sách hồ sơ Film Lab">
				<div className={styles.tools}>
					<select
						className={styles.select}
						aria-label="Lọc theo trạng thái"
						value={status}
						onChange={(event) => changeStatus(event.target.value)}
					>
						<option value="">Tất cả trạng thái</option>
						{STATUS_FILTERS.map((option) => (
							<option key={option.value} value={option.value}>{option.label}</option>
						))}
					</select>
					<span>{result?.totalElements ?? 0} hồ sơ</span>
				</div>
				{loading ? (
					<StatePanel variant="loading" rows={5} label="Đang tải hồ sơ…" className="p-4" />
				) : error && !result ? (
					<StatePanel
						variant="error"
						title="Không tải được hồ sơ"
						description={error}
						onRetry={reload}
						className="m-4"
					/>
				) : rows.length === 0 ? (
					<StatePanel
						variant="empty"
						title={status ? `Không có hồ sơ ở trạng thái “${filterLabel}”` : "Chưa có hồ sơ đăng ký nào"}
						description={status
							? "Hãy chọn trạng thái khác hoặc xem tất cả hồ sơ."
							: "Hồ sơ mở Film Lab gửi từ trang /open-lab sẽ xuất hiện ở đây để bạn xét duyệt."}
						className="m-4"
					/>
				) : (
					<div className={styles.tableWrap}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th scope="col">Mã hồ sơ</th>
									<th scope="col">Film Lab</th>
									<th scope="col">Liên hệ</th>
									<th scope="col">Khu vực</th>
									<th scope="col">Trạng thái</th>
									<th scope="col"><span className="sr-only">Thao tác</span></th>
								</tr>
							</thead>
							<tbody>
								{rows.map((item) => (
									<tr key={item.id}>
										<td>{item.applicationCode}<small>{formatDateOnly(item.createdAt)}</small></td>
										<td>
											{item.labName}
											<small>MST: {item.taxCode}{item.isDuplicateSuspected ? " · Cần kiểm tra trùng" : ""}</small>
										</td>
										<td>{item.contactEmail}<small>{item.contactPhone}</small></td>
										<td>{item.district}, {item.province}</td>
										<td><LabApplicationStatusBadge value={item.status} /></td>
										<td>
											<Button
												size="sm"
												variant="outline"
												disabled={openingId === item.id}
												onClick={() => void openDetail(item.id)}
											>
												{openingId === item.id ? "Đang mở…" : "Chi tiết"}
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				{error && result ? <InlineMessage tone="error" className="mx-4 mb-4">{error}</InlineMessage> : null}
				<div className="flex items-center justify-between border-t p-4 text-sm">
					<span>Trang {(result?.page ?? 0) + 1} / {Math.max(result?.totalPages ?? 0, 1)}</span>
					<div className="flex gap-2">
						<Button size="sm" variant="outline" disabled={page <= 0 || loading} onClick={() => changePage(page - 1)}>
							Trước
						</Button>
						<Button size="sm" variant="outline" disabled={!result?.hasNext || loading} onClick={() => changePage(page + 1)}>
							Sau
						</Button>
					</div>
				</div>
			</section>
			{selected ? (
				<LabApplicationDialog
					application={selected}
					saving={saving}
					error={dialogError}
					reason={reason}
					accountEmail={accountEmail}
					onReasonChange={setReason}
					onAccountEmailChange={setAccountEmail}
					onClose={closeDialog}
					onDecide={(action) => void decide(action)}
				/>
			) : null}
		</div>
	);
}

type SystemParameter = {
	id: number; key: string; value: string; valueType: "PERCENT" | "INTEGER" | "STRING";
	description: string; version: number; updatedAt?: string;
};

export function AdminSystemParametersPage() {
	const [items, setItems] = useState<SystemParameter[]>([]);
	const [drafts, setDrafts] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState<string | null>(null);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const [reloadKey, setReloadKey] = useState(0);

	useEffect(() => {
		let cancelled = false;
		adminApi<SystemParameter[]>("admin/system-parameters")
			.then((data) => {
				if (cancelled) return;
				setItems(data);
				setDrafts(Object.fromEntries(data.map((item) => [item.key, item.value])));
				setError("");
			})
			.catch((cause: unknown) => {
				if (!cancelled) setError(cause instanceof Error ? cause.message : "Không tải được tham số hệ thống.");
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => { cancelled = true; };
	}, [reloadKey]);

	function reload() {
		setLoading(true);
		setError("");
		setReloadKey((value) => value + 1);
	}

	async function save(item: SystemParameter) {
		setSaving(item.key);
		setError("");
		setNotice("");
		try {
			const updated = await adminApi<SystemParameter>(`admin/system-parameters/${item.key}`, {
				method: "PUT",
				body: JSON.stringify({ value: drafts[item.key], version: item.version }),
			});
			setItems((current) => current.map((entry) => (entry.key === item.key ? updated : entry)));
			setDrafts((current) => ({ ...current, [item.key]: updated.value }));
			setNotice(`Đã cập nhật ${item.key}.`);
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : `Không cập nhật được ${item.key}.`);
		} finally {
			setSaving(null);
		}
	}

	return (
		<div className={styles.page}>
			<header className={styles.heading}>
				<div>
					<h1>Cấu hình hệ thống</h1>
					<p>Tham số vận hành được tải và lưu trực tiếp qua API backend.</p>
				</div>
				<Button variant="outline" disabled={loading} onClick={reload}>Tải lại</Button>
			</header>
			{error ? <p className={styles.errorMessage} role="alert">{error}</p> : null}
			{notice ? <p className={styles.successMessage} role="status">{notice}</p> : null}
			<section className={styles.panel}>
				{loading ? (
					<p className={styles.empty}>Đang tải tham số…</p>
				) : (
					<div className={styles.tableWrap}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th>Tham số</th>
									<th>Mô tả</th>
									<th>Kiểu</th>
									<th>Giá trị</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{items.map((item) => (
									<tr key={item.key}>
										<td>{item.key}<small>Version {item.version}</small></td>
										<td>{item.description}</td>
										<td>{item.valueType}</td>
										<td>
											<input
												className={styles.field}
												type={item.valueType === "INTEGER" || item.valueType === "PERCENT" ? "number" : "text"}
												min={item.valueType === "PERCENT" ? 0 : undefined}
												max={item.valueType === "PERCENT" ? 100 : undefined}
												step={item.valueType === "PERCENT" ? "0.01" : "1"}
												value={drafts[item.key] ?? ""}
												onChange={(event) => setDrafts((current) => ({ ...current, [item.key]: event.target.value }))}
											/>
										</td>
										<td>
											<Button size="sm" disabled={saving !== null || drafts[item.key] === item.value} onClick={() => void save(item)}>
												{saving === item.key ? "Đang lưu…" : "Lưu"}
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</section>
		</div>
	);
}

export function AdminCreateAccountForm() {
	const [form, setForm] = useState({ email: "", password: "", fullName: "", phoneNumber: "" });
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setBusy(true);
		setError("");
		setNotice("");
		try {
			const created = await adminApi<{ email: string }>("admin/accounts", { method: "POST", body: JSON.stringify(form) });
			setNotice(`Đã tạo tài khoản quản trị ${created.email}.`);
			setForm({ email: "", password: "", fullName: "", phoneNumber: "" });
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Không tạo được tài khoản Admin.");
		} finally {
			setBusy(false);
		}
	}

	return (
		<section className={styles.panel}>
			<div className={styles.panelHeader}>
				<div>
					<h2>Tạo tài khoản Admin</h2>
					<p>Tạo tài khoản cho người phụ trách quản trị FilmLink.</p>
				</div>
			</div>
			<form method="post" className={styles.formBody} onSubmit={submit}>
				<div className={styles.formGrid}>
					<label className={styles.fieldLabel}>
						Họ tên
						<input className={styles.field} required minLength={2} maxLength={100} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
					</label>
					<label className={styles.fieldLabel}>
						Email
						<input className={styles.field} required type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
					</label>
					<label className={styles.fieldLabel}>
						Mật khẩu (ít nhất 8 ký tự, gồm chữ và số)
						<input className={styles.field} required type="password" minLength={8} maxLength={72} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
					</label>
					<label className={styles.fieldLabel}>
						Số điện thoại
						<input className={styles.field} maxLength={15} value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
					</label>
				</div>
				{error ? <p className={styles.errorMessage} role="alert">{error}</p> : null}
				{notice ? <p className={styles.successMessage} role="status">{notice}</p> : null}
				<div className={styles.formActions}>
					<Button type="submit" disabled={busy}>{busy ? "Đang tạo…" : "Tạo tài khoản"}</Button>
				</div>
			</form>
		</section>
	);
}
