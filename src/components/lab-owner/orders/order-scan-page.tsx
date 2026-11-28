"use client";
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { FilePicker } from "@/components/shared/feedback/file-picker";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { InlineMessage, type InlineMessageTone } from "@/components/shared/feedback/inline-message";
import { StatePanel } from "@/components/shared/feedback/state-panel";
import { OrderStatusBadge } from "@/components/shared/status/status-badge";
import { labOwnerApi, LabOwnerApiError, safeHttpUrl, type FilmRoll, type OrderDetail, type ScanFile } from "@/lib/lab-owner-api";
import { ScanRollCard } from "./scan-roll-card";
import styles from "../lab-owner-pages.module.css";

type Message = { tone: InlineMessageTone; text: string };
type LoadFailure = { text: string; notFound: boolean };

function longSide(file: File) {
	return new Promise<number>((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const image = new Image();
		image.onload = () => { URL.revokeObjectURL(url); resolve(Math.max(image.naturalWidth, image.naturalHeight)); };
		image.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Không đọc được ${file.name}.`)); };
		image.src = url;
	});
}
const rollName = (roll: FilmRoll) => roll.filmStockNameText || `Dòng phim (mã #${roll.filmStockId ?? "—"})`;

export function OrderScanPage({ orderId }: { orderId: string }) {
	const lock = useRef(false);
	const hasOrder = useRef(false);
	const [order, setOrder] = useState<OrderDetail | null>(null);
	const [loadFailure, setLoadFailure] = useState<LoadFailure | null>(null);
	const [message, setMessage] = useState<Message | null>(null);
	const [busy, setBusy] = useState(false);
	const [files, setFiles] = useState<Record<number, File[]>>({});
	const [links, setLinks] = useState<Record<number, string>>({});
	const [uploaded, setUploaded] = useState<Record<number, ScanFile[]>>({});
	const [keep, setKeep] = useState(false);
	const [returnNote, setReturnNote] = useState("");
	const [returnPhotos, setReturnPhotos] = useState<File[]>([]);

	const fail = (text: string) => setMessage({ tone: "error", text });
	const succeed = (text: string) => setMessage({ tone: "success", text });

	const load = useCallback(async () => {
		try {
			const value = await labOwnerApi<OrderDetail>(`lab/orders/${orderId}`);
			setOrder(value);
			hasOrder.current = true;
			setLoadFailure(null);
			setLinks(Object.fromEntries(value.rolls.map((roll) => [roll.id, roll.fullResolutionLink ?? ""])));
		} catch (cause) {
			const text = cause instanceof Error ? cause.message : "Không tải được đơn.";
			if (hasOrder.current) setMessage({ tone: "error", text });
			else setLoadFailure({ text, notFound: cause instanceof LabOwnerApiError && cause.status === 404 });
		}
	}, [orderId]);
	useEffect(() => { void load(); }, [load]);

	function retryLoad() {
		setLoadFailure(null);
		void load();
	}

	async function run(action: () => Promise<void>) {
		if (lock.current) return;
		lock.current = true; setBusy(true); setMessage(null);
		try { await action(); } finally { lock.current = false; setBusy(false); }
	}
	async function validate(roll: FilmRoll, selected: File[]) {
		if (selected.length < 1 || selected.length > 40) throw new Error("Chọn 1–40 ảnh JPEG mỗi lần.");
		if ((roll.previewScanCount ?? 0) + selected.length > 100) throw new Error("Mỗi cuộn tối đa 100 ảnh xem trước.");
		for (const file of selected) {
			if (file.type !== "image/jpeg" || file.size > 5 * 1024 * 1024) throw new Error("Ảnh xem trước phải là JPEG, tối đa 5 MB.");
			if (await longSide(file) > 2048) throw new Error(`${file.name} có cạnh dài vượt 2048 px.`);
		}
	}
	async function pick(roll: FilmRoll, event: ChangeEvent<HTMLInputElement>) {
		const selected = [...(event.target.files ?? [])];
		try {
			await validate(roll, selected);
			setFiles((current) => ({ ...current, [roll.id]: selected }));
			setMessage(null);
		} catch (cause) {
			setFiles((current) => ({ ...current, [roll.id]: [] }));
			event.target.value = "";
			fail(cause instanceof Error ? cause.message : "Ảnh không hợp lệ.");
		}
	}
	async function upload(roll: FilmRoll) {
		await run(async () => {
			try {
				const selected = files[roll.id] ?? [];
				await validate(roll, selected);
				const body = new FormData();
				selected.forEach((file) => body.append("files", file));
				const result = await labOwnerApi<ScanFile[]>(`lab/orders/${orderId}/rolls/${roll.id}/scans`, { method: "POST", body });
				setUploaded((current) => ({ ...current, [roll.id]: result }));
				setFiles((current) => ({ ...current, [roll.id]: [] }));
				succeed(`Đã tải ${result.length} ảnh xem trước.`);
				await load();
			} catch (cause) {
				fail(cause instanceof Error ? cause.message : "Không tải được ảnh xem trước.");
				if (cause instanceof LabOwnerApiError && cause.status === 409) await load();
			}
		});
	}
	async function saveLink(roll: FilmRoll) {
		const url = safeHttpUrl(links[roll.id]);
		if (!url || url.length > 1000) { fail("Liên kết phải bắt đầu bằng http:// hoặc https://, tối đa 1000 ký tự."); return; }
		await run(async () => {
			try {
				await labOwnerApi(`lab/orders/${orderId}/rolls/${roll.id}/full-resolution-link`, { method: "PUT", body: JSON.stringify({ url }) });
				succeed("Đã lưu liên kết ảnh gốc.");
				await load();
			} catch (cause) { fail(cause instanceof Error ? cause.message : "Không lưu được liên kết."); }
		});
	}
	async function deliver() {
		await run(async () => {
			try {
				await labOwnerApi(`lab/orders/${orderId}/scan-delivery`, { method: "POST", body: "{}" });
				succeed("Đã giao scan.");
				await load();
			} catch (cause) {
				fail(cause instanceof Error ? cause.message : "Chưa thể giao scan.");
				if (cause instanceof LabOwnerApiError && cause.status === 409) await load();
			}
		});
	}
	function pickReturn(event: ChangeEvent<HTMLInputElement>) {
		const selected = [...(event.target.files ?? [])];
		if (selected.length < 1 || selected.length > 10 || selected.some((file) => !["image/jpeg", "image/png"].includes(file.type) || file.size > 10 * 1024 * 1024)) {
			setReturnPhotos([]); event.target.value = ""; fail("Chọn 1–10 ảnh JPG/PNG, tối đa 10 MB mỗi ảnh."); return;
		}
		setReturnPhotos(selected); setMessage(null);
	}
	async function returnFilm() {
		if (!keep && returnPhotos.length < 1) { fail("Trả phim tại lab cần ảnh bằng chứng."); return; }
		await run(async () => {
			const body = new FormData();
			body.append("data", new Blob([JSON.stringify({ keepNegativesAtLab: keep, note: returnNote || null })], { type: "application/json" }), "data.json");
			if (!keep) returnPhotos.forEach((file) => body.append("photos", file));
			try {
				await labOwnerApi(`lab/orders/${orderId}/film-return`, { method: "POST", body });
				succeed("Đã ghi nhận trả phim hoặc giữ âm bản.");
				await load();
			} catch (cause) { fail(cause instanceof Error ? cause.message : "Chưa thể hoàn tất trả phim."); }
		});
	}

	if (!order) {
		return <div className={styles.page}>
			<header className={styles.heading}><div><p className={styles.eyebrow}>Scan và bàn giao</p><h1>Đơn hàng</h1></div><Link className={buttonVariants({ variant: "outline" })} href={`/lab-owner/orders/${orderId}`}>Quay lại chi tiết đơn</Link></header>
			{loadFailure
				? <StatePanel variant="error" title={loadFailure.notFound ? "Không tìm thấy đơn" : "Không tải được đơn"} description={loadFailure.notFound ? "Đơn không tồn tại hoặc không thuộc lab của bạn." : loadFailure.text} onRetry={retryLoad} />
				: <StatePanel variant="loading" rows={3} label="Đang tải thông tin scan…" />}
		</div>;
	}
	const received = order.rolls.filter((roll) => roll.status === "RECEIVED");
	const atQc = order.stages.at(-1)?.stage === "QC";
	const processing = order.status === "IN_PROCESSING";
	return <div className={styles.page}>
		<header className={styles.heading}>
			<div>
				<p className={styles.eyebrow}>Scan và bàn giao</p>
				<div className={styles.titleRow}><h1>Đơn {order.orderCode}</h1><OrderStatusBadge value={order.status} /></div>
				<p>Mỗi cuộn đã nhận cần có ảnh xem trước và liên kết ảnh gốc trước khi giao scan.</p>
			</div>
			<Link className={buttonVariants({ variant: "outline" })} href={`/lab-owner/orders/${order.id}`}>Quay lại chi tiết đơn</Link>
		</header>
		{message && <InlineMessage tone={message.tone}>{message.text}</InlineMessage>}
		{received.map((roll) => <ScanRollCard key={roll.id} roll={roll} filmName={rollName(roll)} disabled={busy || !processing} busy={busy} selectedCount={files[roll.id]?.length ?? 0} uploaded={uploaded[roll.id]} link={links[roll.id] ?? ""} onPick={(event) => void pick(roll, event)} onUpload={() => void upload(roll)} onLinkChange={(value) => setLinks((current) => ({ ...current, [roll.id]: value }))} onSaveLink={() => void saveLink(roll)} />)}
		{processing && received.length === 0 && <StatePanel variant="empty" title="Không có cuộn nào cần scan" description="Chỉ các cuộn đã nhận mới cần ảnh xem trước." />}
		{processing && <section className={styles.panel} aria-labelledby="scan-delivery-title"><div className={styles.panelHeader}><div><h2 id="scan-delivery-title">Giao scan</h2><p>Hệ thống kiểm tra bước QC, ảnh xem trước và liên kết của từng cuộn.</p></div></div><div className={styles.detailBody}><InlineMessage tone={atQc ? "success" : "info"}>{atQc ? "Đơn đã tới bước kiểm tra chất lượng." : "Đơn chưa tới bước kiểm tra chất lượng."}</InlineMessage><Button disabled={busy || !atQc || received.length === 0 || received.some((roll) => !(roll.previewScanCount && roll.fullResolutionLink))} onClick={deliver}>Giao scan</Button></div></section>}
		{order.status === "READY_FOR_HANDOVER" && <section className={styles.panel} aria-labelledby="film-return-title"><div className={styles.panelHeader}><div><h2 id="film-return-title">Trả phim hoặc giữ âm bản</h2><p>Ghi nhận việc bàn giao phim tại lab.</p></div></div><div className={styles.detailBody}><label className={styles.scheduleToggle}><input type="checkbox" checked={keep} onChange={(event) => { setKeep(event.target.checked); if (event.target.checked) setReturnPhotos([]); }} />Lab giữ âm bản</label><label className={styles.fieldLabel}>Ghi chú<textarea className={styles.field} maxLength={500} value={returnNote} onChange={(event) => setReturnNote(event.target.value)} /></label>{!keep && <label className={styles.fieldLabel}>Ảnh bàn giao (1–10 ảnh JPG/PNG)<FilePicker accept="image/jpeg,image/png" multiple onChange={pickReturn} /></label>}<Button disabled={busy} onClick={returnFilm}>{keep ? "Xác nhận giữ âm bản" : "Xác nhận trả phim"}</Button></div></section>}
	</div>;
}
