"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import { StatePanel } from "@/components/shared/feedback/state-panel";
import { StatusBadge } from "@/components/shared/status/status-badge";
import { useLabOwnerWorkspace } from "../workspace";
import styles from "../lab-owner-pages.module.css";

const weekdays = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ nhật"];
type OpeningHour = { dayOfWeek: number; closed: boolean; opensAt: string; closesAt: string };

function scheduleBar(hour: OpeningHour) {
	if (hour.closed || !hour.opensAt || !hour.closesAt) return undefined;
	const toMinutes = (time: string) => {
		const [hours, minutes] = time.split(":").map(Number);
		return hours * 60 + minutes;
	};
	const start = toMinutes(hour.opensAt);
	const end = toMinutes(hour.closesAt);
	if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return undefined;
	return { left: `${(start / 1440) * 100}%`, width: `${((end - start) / 1440) * 100}%` };
}

export function ProfilePage() {
	const { lab, setLab } = useLabOwnerWorkspace();
	const [form, setForm] = useState({ labName: "", description: "", addressLine: "", district: "", province: "", latitude: "", longitude: "", qcBufferHours: "2", expressDailyCapPercent: "" });
	const [hours, setHours] = useState<OpeningHour[]>(weekdays.map((_, index) => ({ dayOfWeek: index + 1, closed: false, opensAt: "09:00", closesAt: "19:00" })));
	const [feedback, setFeedback] = useState<{ tone: "success" | "error"; text: string } | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [imageBusy, setImageBusy] = useState(false);

	// Sync the editable form whenever the loaded lab profile changes (adjust state during render).
	const [syncedLab, setSyncedLab] = useState<typeof lab>(null);
	if (lab !== syncedLab) {
		setSyncedLab(lab);
		if (lab) {
			setForm({
				labName: lab.labName ?? "", description: lab.description ?? "", addressLine: lab.addressLine ?? "",
				district: lab.district ?? "", province: lab.province ?? "",
				latitude: lab.latitude == null ? "" : String(lab.latitude), longitude: lab.longitude == null ? "" : String(lab.longitude),
				qcBufferHours: String(lab.qcBufferHours ?? 2),
				expressDailyCapPercent: lab.expressDailyCapPercent == null ? "" : String(lab.expressDailyCapPercent),
			});
			if (lab.openingHours?.length === 7) {
				setHours(lab.openingHours.map((item) => ({
					dayOfWeek: item.dayOfWeek, closed: item.closed, opensAt: item.opensAt ?? "09:00", closesAt: item.closesAt ?? "19:00",
				})));
			}
		}
	}

	async function request(path: string, method: string, body?: unknown) {
		const response = await fetch(path, { method, cache: "no-store", headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
		if (!response.ok) {
			const details = await response.json().catch(() => null) as { message?: string; detail?: string } | null;
			throw new Error(details?.message ?? details?.detail ?? "Không thể lưu hồ sơ lab.");
		}
		return response.status === 204 ? null : await response.json();
	}

	async function saveProfile(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true); setFeedback(null);
		try {
			if (Boolean(form.latitude.trim()) !== Boolean(form.longitude.trim())) {
				throw new Error("Vui lòng điền cả vĩ độ và kinh độ, hoặc để trống cả hai.");
			}
			const saved = await request("/api/backend/film-labs/me", "PUT", {
				labName: form.labName, description: form.description, addressLine: form.addressLine, district: form.district, province: form.province,
				latitude: form.latitude ? Number(form.latitude) : null, longitude: form.longitude ? Number(form.longitude) : null,
				qcBufferHours: Number(form.qcBufferHours), expressDailyCapPercent: form.expressDailyCapPercent ? Number(form.expressDailyCapPercent) : null,
			});
			if (saved) setLab(saved);
			setFeedback({ tone: "success", text: "Đã lưu thông tin hồ sơ Film Lab." });
		} catch (cause) { setFeedback({ tone: "error", text: cause instanceof Error ? cause.message : "Không thể lưu hồ sơ lab." }); }
		finally { setSaving(false); }
	}

	async function saveHours() {
		setSaving(true); setFeedback(null);
		try {
			const saved = await request("/api/backend/film-labs/me/opening-hours", "PUT", { openingHours: hours.map((item) => ({ ...item, opensAt: item.closed ? null : item.opensAt, closesAt: item.closed ? null : item.closesAt })) });
			if (saved) setLab(saved);
			setFeedback({ tone: "success", text: "Đã cập nhật giờ mở cửa." });
		} catch (cause) { setFeedback({ tone: "error", text: cause instanceof Error ? cause.message : "Không thể cập nhật giờ mở cửa." }); }
		finally { setSaving(false); }
	}

	async function toggleOrders() {
		if (!lab) return;
		setSaving(true); setFeedback(null);
		try {
			const saved = await request("/api/backend/film-labs/me/accepting-orders", "PATCH", { acceptingOrders: !lab.acceptingOrders });
			if (saved) setLab(saved);
			setFeedback({ tone: "success", text: saved?.acceptingOrders === false ? "Đã tạm ngưng nhận đơn. Khách sẽ chưa đặt được đơn mới ở lab này." : "Đã bật nhận đơn. Khách có thể đặt đơn mới ở lab này." });
		} catch (cause) { setFeedback({ tone: "error", text: cause instanceof Error ? cause.message : "Không thể cập nhật trạng thái nhận đơn." }); }
		finally { setSaving(false); }
	}

	async function uploadImage(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!lab) return;
		const form = event.currentTarget;
		const file = new FormData(form).get("file");
		if (!(file instanceof File) || file.size === 0 || file.size > 10 * 1024 * 1024) {
			setFeedback({ tone: "error", text: "Chọn ảnh JPG hoặc PNG có dung lượng tối đa 10 MB." });
			return;
		}
		setImageBusy(true); setFeedback(null);
		try {
			const response = await fetch("/api/backend/film-labs/me/images", { method: "POST", body: new FormData(form) });
			if (!response.ok) {
				const details = await response.json().catch(() => null) as { message?: string; detail?: string } | null;
				throw new Error(details?.message ?? details?.detail ?? "Không thể tải ảnh lên.");
			}
			const image = await response.json() as { id: number; displayOrder: number; url: string };
			setLab({ ...lab, images: [...(lab.images ?? []), image].sort((a, b) => a.displayOrder - b.displayOrder) });
			form.reset();
			setFeedback({ tone: "success", text: "Đã tải ảnh mẫu lên." });
		} catch (cause) { setFeedback({ tone: "error", text: cause instanceof Error ? cause.message : "Không thể tải ảnh lên." }); }
		finally { setImageBusy(false); }
	}

	async function deleteImage(imageId: number) {
		if (!lab) return;
		setImageBusy(true); setFeedback(null);
		try {
			const response = await fetch(`/api/backend/film-labs/me/images/${imageId}`, { method: "DELETE" });
			if (!response.ok) {
				const details = await response.json().catch(() => null) as { message?: string; detail?: string } | null;
				throw new Error(details?.message ?? details?.detail ?? "Không thể xóa ảnh.");
			}
			setLab({ ...lab, images: (lab.images ?? []).filter((image) => image.id !== imageId) });
			setFeedback({ tone: "success", text: "Đã xóa ảnh mẫu." });
		} catch (cause) { setFeedback({ tone: "error", text: cause instanceof Error ? cause.message : "Không thể xóa ảnh." }); }
		finally { setImageBusy(false); }
	}

	const setField = (name: keyof typeof form, value: string) => setForm((current) => ({ ...current, [name]: value }));
	const accepting = Boolean(lab?.acceptingOrders);
	return <div className={styles.page}>
		<header className={styles.heading}>
			<div>
				<p className={styles.eyebrow}>Thông tin cơ sở</p>
				<h1>Hồ sơ Film Lab</h1>
				<p>Cập nhật thông tin khách thấy khi tìm lab và đặt dịch vụ.</p>
			</div>
			{lab ? <div className="flex flex-wrap items-center gap-3">
				<StatusBadge label={accepting ? "Đang nhận đơn" : "Tạm ngưng nhận đơn"} tone={accepting ? "success" : "warning"} />
				<Button type="button" variant={accepting ? "outline" : "default"} disabled={saving} onClick={() => setConfirmOpen(true)}>
					{accepting ? "Tạm ngưng nhận đơn" : "Bật nhận đơn"}
				</Button>
			</div> : null}
		</header>
		<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{accepting ? "Tạm ngưng nhận đơn?" : "Bật nhận đơn?"}</AlertDialogTitle>
					<AlertDialogDescription>
						{accepting
							? "Khách sẽ không đặt được đơn mới ở lab của bạn cho tới khi bạn bật lại. Các đơn đang xử lý không bị ảnh hưởng."
							: "Lab của bạn sẽ hiển thị là đang nhận đơn và khách có thể đặt đơn mới."}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Giữ nguyên</AlertDialogCancel>
					<AlertDialogAction onClick={() => void toggleOrders()}>{accepting ? "Tạm ngưng" : "Bật nhận đơn"}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
		{feedback ? <InlineMessage tone={feedback.tone}>{feedback.text}</InlineMessage> : null}
		{!lab ? <InlineMessage tone="warning" title="Chưa có hồ sơ Film Lab được duyệt">
			Tài khoản này chưa được gắn với Film Lab đã duyệt nên chưa thể lưu thay đổi.{" "}
			<Link href="/open-lab" className="font-medium underline underline-offset-2">Đăng ký hoặc tra cứu hồ sơ mở Film Lab</Link>
		</InlineMessage> : null}
		<form className={styles.panel} onSubmit={saveProfile}><div className={styles.panelHeader}><div><h2>Thông tin lab</h2><p>Thông tin liên hệ được quản lý bởi tài khoản.</p></div></div><div className={styles.detailBody}><div className={styles.fieldGrid}><label className={styles.fieldLabel}>Tên lab<input className={styles.field} required minLength={2} maxLength={150} value={form.labName} onChange={(event) => setField("labName", event.target.value)} /></label><label className={styles.fieldLabel}>Email liên hệ<input className={styles.field} value={lab?.contactEmail ?? ""} readOnly /></label><label className={styles.fieldLabel}>Số điện thoại liên hệ<input className={styles.field} value={lab?.contactPhone ?? ""} readOnly /></label><label className={styles.fieldLabel}>Địa chỉ<input className={styles.field} required maxLength={255} value={form.addressLine} onChange={(event) => setField("addressLine", event.target.value)} /></label><label className={styles.fieldLabel}>Quận / huyện<input className={styles.field} required maxLength={100} value={form.district} onChange={(event) => setField("district", event.target.value)} /></label><label className={styles.fieldLabel}>Tỉnh / thành phố<input className={styles.field} required maxLength={100} value={form.province} onChange={(event) => setField("province", event.target.value)} /></label><label className={styles.fieldLabel}>Vĩ độ<input className={styles.field} type="number" step="0.000001" min={-90} max={90} value={form.latitude} onChange={(event) => setField("latitude", event.target.value)} /></label><label className={styles.fieldLabel}>Kinh độ<input className={styles.field} type="number" step="0.000001" min={-180} max={180} value={form.longitude} onChange={(event) => setField("longitude", event.target.value)} /></label><label className={styles.fieldLabel}>Giờ đệm kiểm tra chất lượng<input className={styles.field} type="number" min="0" max="48" value={form.qcBufferHours} onChange={(event) => setField("qcBufferHours", event.target.value)} /></label><label className={styles.fieldLabel}>Giới hạn đơn express (%)<input className={styles.field} type="number" min="1" max="100" value={form.expressDailyCapPercent} onChange={(event) => setField("expressDailyCapPercent", event.target.value)} placeholder="Không giới hạn" /></label></div><label className={styles.fieldLabel}>Giới thiệu<textarea className={styles.field} required minLength={50} maxLength={2000} rows={4} value={form.description} onChange={(event) => setField("description", event.target.value)} placeholder="Giới thiệu lab, quy trình và dịch vụ nổi bật" /></label><div className={styles.dialogActions}><Button type="submit" disabled={!lab || saving}>{saving ? "Đang lưu…" : "Lưu hồ sơ"}</Button></div></div></form>
		<section className={styles.panel}>
			<div className={styles.panelHeader}>
				<div><h2>Lịch mở cửa</h2><p>Lịch tuần theo từng ngày. Mỗi ngày cấu hình một khoảng hoạt động.</p></div>
				<Button type="button" variant="outline" disabled={!lab || saving} onClick={saveHours}>{saving ? "Đang lưu…" : "Lưu lịch tuần"}</Button>
			</div>
			<div className={styles.schedule}>
				<div className={styles.scheduleAxis} aria-hidden="true"><span /> <div className={styles.scheduleAxisTimes}>{["00:00", "06:00", "12:00", "18:00", "24:00"].map((time) => <span key={time}>{time}</span>)}</div></div>
				{hours.map((hour, index) => {
					const bar = scheduleBar(hour);
					return <div className={styles.scheduleRow} key={hour.dayOfWeek}>
						<strong className={styles.scheduleDay}>{weekdays[index]}</strong>
						<label className={styles.scheduleToggle}><input type="checkbox" checked={!hour.closed} disabled={!lab || saving} onChange={(event) => setHours((current) => current.map((item) => item.dayOfWeek === hour.dayOfWeek ? { ...item, closed: !event.target.checked } : item))} />Mở cửa</label>
						<div className={styles.scheduleTrack} role="img" aria-label={bar ? `${weekdays[index]} mở ${hour.opensAt} đến ${hour.closesAt}` : `${weekdays[index]} nghỉ`}>
							{bar && <span className={styles.scheduleBar} style={bar} />}
						</div>
						<label className={styles.scheduleTime}>Từ<input className={styles.field} type="time" disabled={!lab || saving || hour.closed} value={hour.opensAt} onChange={(event) => setHours((current) => current.map((item) => item.dayOfWeek === hour.dayOfWeek ? { ...item, opensAt: event.target.value } : item))} /></label>
						<label className={styles.scheduleTime}>Đến<input className={styles.field} type="time" disabled={!lab || saving || hour.closed} value={hour.closesAt} onChange={(event) => setHours((current) => current.map((item) => item.dayOfWeek === hour.dayOfWeek ? { ...item, closesAt: event.target.value } : item))} /></label>
					</div>;
				})}
			</div>
		</section>
		<section className={styles.panel}><div className={styles.panelHeader}><div><h2>Ảnh mẫu</h2><p>JPG hoặc PNG, tối đa 10 MB mỗi ảnh và tối đa 20 ảnh.</p></div><span>{lab?.images?.length ?? 0}/20 ảnh</span></div><div className={styles.detailBody}>
			<form className={styles.fieldGrid} onSubmit={uploadImage}><label className={styles.fieldLabel}>Chọn ảnh<input className={styles.field} name="file" type="file" accept="image/jpeg,image/png" required disabled={!lab || imageBusy || (lab?.images?.length ?? 0) >= 20} /></label><div className={styles.dialogActions}><Button type="submit" disabled={!lab || imageBusy || (lab?.images?.length ?? 0) >= 20}>{imageBusy ? "Đang xử lý…" : "Tải ảnh lên"}</Button></div></form>
			{lab?.images?.length ? <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
				{lab.images.map((image) => <figure key={image.id} className="overflow-hidden rounded-xl border">
					<a href={image.url} target="_blank" rel="noreferrer" aria-label={`Mở ảnh mẫu ${image.displayOrder} ở kích thước đầy đủ`}>
						{/* eslint-disable-next-line @next/next/no-img-element -- lab images come from arbitrary backend URLs */}
						<img src={image.url} alt={`Ảnh mẫu ${image.displayOrder} của ${lab.labName ?? "Film Lab"}`} className="aspect-[4/3] w-full object-cover" />
					</a>
					<figcaption className="flex items-center justify-between p-3 text-sm">
						<span>Ảnh {image.displayOrder}</span>
						<Button type="button" variant="outline" size="sm" disabled={imageBusy} aria-label={`Xóa ảnh mẫu ${image.displayOrder}`} onClick={() => deleteImage(image.id)}>Xóa</Button>
					</figcaption>
				</figure>)}
			</div> : <StatePanel variant="empty" className="mt-5" title="Chưa có ảnh mẫu" description="Tải lên ảnh scan hoặc ảnh cơ sở để khách hình dung chất lượng dịch vụ của lab." />}
		</div></section>
	</div>;
}
