"use client";
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { FilePicker } from "@/components/shared/feedback/file-picker";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { InlineMessage, type InlineMessageTone } from "@/components/shared/feedback/inline-message";
import { StatePanel } from "@/components/shared/feedback/state-panel";
import { handoverPointLabel, serviceTierLabel, stageLabel } from "@/components/shared/status/labels";
import { OrderStatusBadge, RollStatusBadge } from "@/components/shared/status/status-badge";
import { formatDate, formatMoney, labOwnerApi, LabOwnerApiError, safeHttpUrl, type OrderDetail, type ProcessingStage, type ScheduleProposal } from "@/lib/lab-owner-api";
import { scheduleConfirmationBody } from "./schedule-confirmation";
import { RejectOrderDialog } from "./reject-order-dialog";
import { ScheduleProposalPanel } from "./schedule-proposal-panel";
import { useCatalogNames } from "./use-catalog-names";
import styles from "../lab-owner-pages.module.css";
import { RollDamageForm } from "./roll-damage-form";

const stageOrder: ProcessingStage[] = ["RECEIVED", "DEVELOPING", "WASHING", "DRYING", "SCANNING", "QC"];
const filmName = (roll: OrderDetail["rolls"][number]) => roll.filmStockNameText || `Dòng phim (mã #${roll.filmStockId ?? "—"})`;
type Message = { tone: InlineMessageTone; text: string };
type LoadFailure = { text: string; notFound: boolean };

export function OrderDetailPage({ orderId }: { orderId: string }) {
	const router = useRouter();
	const lock = useRef(false);
	const hasOrder = useRef(false);
	const { processName, formatName } = useCatalogNames();
	const [order, setOrder] = useState<OrderDetail | null>(null);
	const [loadFailure, setLoadFailure] = useState<LoadFailure | null>(null);
	const [loadingProposal, setLoadingProposal] = useState(false);
	const proposalRequest = useRef(0);
	const [proposal, setProposal] = useState<ScheduleProposal | null>(null);
	const [message, setMessage] = useState<Message | null>(null);
	const [busy, setBusy] = useState(false);
	const [receipt, setReceipt] = useState<Record<number, boolean>>({});
	const [receiptNote, setReceiptNote] = useState("");
	const [receiptPhotos, setReceiptPhotos] = useState<File[]>([]);
	const [laterDate, setLaterDate] = useState("");
	const [stageNote, setStageNote] = useState("");
	const [rejectOpen, setRejectOpen] = useState(false);

	const fail = (text: string) => setMessage({ tone: "error", text });

	const loadProposal = useCallback(async () => {
		const request = ++proposalRequest.current;
		setLoadingProposal(true);
		setProposal(null);
		setLaterDate("");
		try {
			const next = await labOwnerApi<ScheduleProposal>(`lab/orders/${orderId}/schedule-proposal`);
			if (request === proposalRequest.current) setProposal(next);
		} catch (cause) {
			if (request === proposalRequest.current) setMessage({ tone: "error", text: cause instanceof Error ? cause.message : "Không tải được đề xuất lịch máy." });
		} finally {
			if (request === proposalRequest.current) setLoadingProposal(false);
		}
	}, [orderId]);

	const load = useCallback(async () => {
		try {
			const next = await labOwnerApi<OrderDetail>(`lab/orders/${orderId}`);
			setOrder(next);
			hasOrder.current = true;
			setLoadFailure(null);
			if (next.status === "AWAITING_FILM") setReceipt({});
			if (next.status === "AWAITING_MACHINE_ASSIGNMENT") await loadProposal();
			else setProposal(null);
		} catch (cause) {
			const text = cause instanceof Error ? cause.message : "Không tải được đơn.";
			if (hasOrder.current) setMessage({ tone: "error", text });
			else setLoadFailure({ text, notFound: cause instanceof LabOwnerApiError && cause.status === 404 });
		}
	}, [orderId, loadProposal]);
	useEffect(() => { void load(); }, [load]);

	function retryLoad() {
		setLoadFailure(null);
		void load();
	}

	async function mutate(path: string, init: RequestInit, success: string) {
		if (lock.current) return false;
		lock.current = true; setBusy(true); setMessage(null);
		let ok = false;
		try { await labOwnerApi(path, init); ok = true; setMessage({ tone: "success", text: success }); await load(); }
		catch (cause) { if (!ok) fail(cause instanceof Error ? cause.message : "Không thể cập nhật đơn."); if (cause instanceof LabOwnerApiError && cause.status === 409) await load(); }
		finally { lock.current = false; setBusy(false); }
		return ok;
	}

	function pickReceiptPhotos(event: ChangeEvent<HTMLInputElement>) {
		const selected = [...(event.target.files ?? [])];
		if (selected.length < 1 || selected.length > 10 || selected.some((file) => !["image/jpeg", "image/png"].includes(file.type) || file.size > 10 * 1024 * 1024)) {
			setReceiptPhotos([]); event.target.value = ""; fail("Chọn 1–10 ảnh JPG/PNG, tối đa 10 MB mỗi ảnh."); return;
		}
		setReceiptPhotos(selected); setMessage(null);
	}
	async function confirmReceipt() {
		if (!order || order.rolls.some((roll) => receipt[roll.id] === undefined) || !order.rolls.some((roll) => receipt[roll.id]) || receiptPhotos.length < 1) { fail("Chọn kết quả rõ ràng cho mỗi cuộn, ít nhất một cuộn đã nhận và 1–10 ảnh bằng chứng."); return; }
		const body = new FormData();
		body.append("data", new Blob([JSON.stringify({ rolls: order.rolls.map((roll) => ({ filmRollId: roll.id, received: receipt[roll.id] })), note: receiptNote || null })], { type: "application/json" }), "data.json");
		receiptPhotos.forEach((file) => body.append("photos", file));
		await mutate(`lab/orders/${order.id}/receipt`, { method: "POST", body }, "Đã xác nhận nhận phim.");
	}
	async function confirmSchedule() {
		if (!proposal?.feasible) return;
		const body = scheduleConfirmationBody(proposal.promisedReturnAt, laterDate);
		if (!body) {
			fail("Ngày chọn phải hợp lệ và bằng hoặc muộn hơn đề xuất.");
			return;
		}
		await mutate(`lab/orders/${orderId}/schedule-confirmation`, { method: "POST", body: JSON.stringify(body) }, "Đã xác nhận lịch máy.");
	}
	async function rejectOrder(reason: string) {
		if (!order) return;
		const ok = await mutate(`lab/orders/${order.id}/reject`, { method: "POST", body: JSON.stringify({ reason }) }, "Đã từ chối nhận đơn.");
		if (ok) setRejectOpen(false);
	}

	if (!order) {
		return <div className={styles.page}>
			<header className={styles.heading}><div><p className={styles.eyebrow}>Chi tiết đơn</p><h1>Đơn hàng</h1></div><Link className={buttonVariants({ variant: "outline" })} href="/lab-owner/orders">Về hàng đợi</Link></header>
			{loadFailure
				? <StatePanel variant="error" title={loadFailure.notFound ? "Không tìm thấy đơn" : "Không tải được đơn"} description={loadFailure.notFound ? "Đơn không tồn tại hoặc không thuộc lab của bạn." : loadFailure.text} onRetry={retryLoad} />
				: <StatePanel variant="loading" rows={4} label="Đang tải chi tiết đơn…" />}
		</div>;
	}
	const latestStage = order.stages.at(-1)?.stage;
	const stageIndex = latestStage ? stageOrder.indexOf(latestStage) : -1;
	const nextStage = stageIndex >= 0 && stageIndex < stageOrder.length - 1 ? stageOrder[stageIndex + 1] : undefined;
	const rejectError = rejectOpen && message?.tone === "error" ? message.text : undefined;
	return <div className={styles.page}>
		<header className={styles.heading}>
			<div>
				<p className={styles.eyebrow}>Chi tiết đơn</p>
				<div className={styles.titleRow}><h1>Đơn {order.orderCode}</h1><OrderStatusBadge value={order.status} /></div>
				<p>{order.rolls.length} cuộn · Gói {serviceTierLabel(order.serviceTier).toLowerCase()}</p>
			</div>
			<Button variant="outline" onClick={() => router.push("/lab-owner/orders")}>Về hàng đợi</Button>
		</header>
		{message && !rejectError && <InlineMessage tone={message.tone}>{message.text}</InlineMessage>}
		<section className={styles.stats} aria-label="Tóm tắt đơn"><div className={styles.stat}><span>Tổng tiền</span><strong>{formatMoney(order.finalTotalVnd ?? order.estimatedTotalVnd)}</strong></div><div className={styles.stat}><span>Ngày hẹn trả</span><strong>{formatDate(order.promisedReturnAt ?? order.expectedReturnAt)}</strong></div><div className={styles.stat}><span>Gói dịch vụ</span><strong>{serviceTierLabel(order.serviceTier)}</strong></div><div className={styles.stat}><span>Số cuộn</span><strong>{order.rolls.length}</strong></div></section>
		<section className={styles.details}><div className={styles.stack}>
			<article className={styles.panel}><div className={styles.panelHeader}><div><h2>Thao tác hiện tại</h2><p>Chỉ hiển thị thao tác phù hợp với trạng thái đơn.</p></div></div><div className={styles.detailBody}>
				{order.status === "AWAITING_LAB_CONFIRMATION" && <div className={styles.tableActions}>
					<Button disabled={busy} onClick={() => mutate(`lab/orders/${order.id}/accept`, { method: "POST", body: "{}" }, "Đã nhận đơn.")}>Nhận đơn</Button>
					<Button type="button" variant="outline" disabled={busy} onClick={() => { setMessage(null); setRejectOpen(true); }}>Từ chối nhận đơn</Button>
				</div>}
				{order.status === "AWAITING_FILM" && <>{order.rolls.map((roll) => <label className={styles.detailLine} key={roll.id}><span>Cuộn {roll.rollSequence} · {filmName(roll)}</span><select className={styles.select} value={receipt[roll.id] === undefined ? "" : String(receipt[roll.id])} onChange={(event) => setReceipt((current) => ({ ...current, [roll.id]: event.target.value === "true" }))}><option value="" disabled>Chọn kết quả…</option><option value="true">Đã nhận</option><option value="false">Không nhận được</option></select></label>)}<label className={styles.fieldLabel}>Ghi chú<textarea className={styles.field} maxLength={500} value={receiptNote} onChange={(event) => setReceiptNote(event.target.value)} /></label><label className={styles.fieldLabel}>Ảnh bằng chứng (1–10 ảnh JPG/PNG)<FilePicker multiple accept="image/jpeg,image/png" onChange={pickReceiptPhotos} /></label><Button disabled={busy} onClick={confirmReceipt}>Xác nhận nhận phim</Button></>}
				{order.status === "AWAITING_MACHINE_ASSIGNMENT" && !proposal && (
					loadingProposal
						? <StatePanel variant="loading" rows={2} label="Đang tính lịch máy…" />
						: <div className={styles.notice}><Button variant="outline" onClick={() => { setMessage(null); void loadProposal(); }}>Tải lại đề xuất lịch máy</Button></div>
				)}
				{order.status === "AWAITING_MACHINE_ASSIGNMENT" && proposal && <ScheduleProposalPanel proposal={proposal} busy={busy} laterDate={laterDate} onLaterDateChange={setLaterDate} onConfirm={confirmSchedule} processName={processName} formatName={formatName} />}
				{order.status === "IN_PROCESSING" && <>
					<InlineMessage tone="info">{nextStage ? `Công đoạn tiếp theo: ${stageLabel(nextStage)}` : latestStage === "QC" ? "Đã tới bước kiểm tra chất lượng; có thể mở trang scan để giao scan." : "Chưa có công đoạn nào được ghi nhận."}</InlineMessage>
					{nextStage && <><label className={styles.fieldLabel}>Ghi chú công đoạn (tùy chọn)<textarea className={styles.field} maxLength={300} value={stageNote} onChange={(event) => setStageNote(event.target.value)} /></label><Button disabled={busy} onClick={() => mutate(`lab/orders/${order.id}/stages`, { method: "POST", body: JSON.stringify({ stage: nextStage, note: stageNote || null }) }, `Đã ghi công đoạn ${stageLabel(nextStage)}.`)}>Ghi công đoạn: {stageLabel(nextStage)}</Button></>}
					<Button variant="outline" onClick={() => router.push(`/lab-owner/orders/${order.id}/scan`)}>Mở trang scan và bàn giao</Button>
				</>}
				{order.status === "READY_FOR_HANDOVER" && <Button onClick={() => router.push(`/lab-owner/orders/${order.id}/scan`)}>Trả phim hoặc giữ âm bản</Button>}
				{!["AWAITING_LAB_CONFIRMATION", "AWAITING_FILM", "AWAITING_MACHINE_ASSIGNMENT", "IN_PROCESSING", "READY_FOR_HANDOVER"].includes(order.status) && <InlineMessage tone="info">Đơn này không cần thao tác thêm từ lab ở trạng thái hiện tại.</InlineMessage>}
			</div></article>
			<article className={styles.panel}><div className={styles.panelHeader}><h2>Cuộn phim và giá chốt</h2></div><div className={styles.tableWrap}><table className={styles.table}><caption className="sr-only">Danh sách cuộn phim của đơn</caption><thead><tr><th scope="col">Cuộn</th><th scope="col">Dòng phim</th><th scope="col">Quy trình · Khổ phim</th><th scope="col">Trạng thái</th><th scope="col">Giá</th></tr></thead><tbody>{order.rolls.map((roll) => <tr key={roll.id}><td>Cuộn {roll.rollSequence}</td><td>{filmName(roll)}</td><td>{processName(roll.filmProcessId)} · {formatName(roll.filmFormatId)}</td><td><RollStatusBadge value={roll.status} /></td><td>{formatMoney(roll.unitPriceVnd + (roll.scanOptionPriceVnd ?? 0) + (roll.pushPullSurchargeVnd ?? 0) + (roll.expressSurchargeVnd ?? 0))}</td></tr>)}</tbody></table></div></article>
			{order.status === "IN_PROCESSING" && <RollDamageForm
				key={order.rolls.filter((roll) => roll.status === "RECEIVED").map((roll) => roll.id).join(",")}
				rolls={order.rolls}
				busy={busy}
				onSubmit={async (rollId, body) => { await mutate(`lab/orders/${order.id}/rolls/${rollId}/damage`, { method: "POST", body }, "Đã ghi nhận cuộn hỏng và cập nhật tổng đơn."); }}
			/>}
		</div><aside className={styles.stack}>
			<article className={styles.panel}><div className={styles.panelHeader}><h2>Khách hàng</h2></div><div className={styles.detailBody}><div className={styles.detailLine}><span>Họ tên</span><strong>{order.photographer?.fullName ?? "—"}</strong></div><div className={styles.detailLine}><span>Điện thoại</span><strong>{order.customerPhone ?? order.photographer?.phoneNumber ?? "—"}</strong></div><div className={styles.detailLine}><span>Yêu cầu đặc biệt</span><strong>{order.specialRequest ?? "—"}</strong></div></div></article>
			<article className={styles.panel}><div className={styles.panelHeader}><h2>Tiến trình xử lý</h2></div><ol className={styles.timeline}>{order.stages.length ? order.stages.map((item, index) => <li className={`${styles.timelineStep} ${styles.timelineStepActive}`} key={item.id ?? index}><span className={styles.timelineDot} aria-hidden="true" />{stageLabel(item.stage)}<small>{formatDate(item.recordedAt ?? item.createdAt)}</small></li>) : <li className={styles.empty}>Chưa có công đoạn nào được ghi nhận.</li>}</ol></article>
			<article className={styles.panel}><div className={styles.panelHeader}><h2>Lịch sử bàn giao</h2></div><div className={styles.detailBody}>{order.handovers.length ? order.handovers.map((handover) => <div className={styles.notice} key={handover.id}><div><strong>{handoverPointLabel(handover.handoverPoint)}</strong><br /><span>{handover.rollCount} cuộn · {formatDate(handover.occurredAt)} · {handover.performedByName}</span>{handover.note && <><br /><span>{handover.note}</span></>}{handover.photos.map((photo) => { const url = safeHttpUrl(photo.url); return url ? <a className={styles.inlineLink} href={url} target="_blank" rel="noreferrer" key={photo.id}>Ảnh bàn giao {photo.displayOrder}</a> : null; })}</div></div>) : <p className={styles.empty}>Chưa có bàn giao.</p>}</div></article>
		</aside></section>
		<RejectOrderDialog open={rejectOpen} onOpenChange={setRejectOpen} busy={busy} orderCode={order.orderCode} serverError={rejectError} onSubmit={(reason) => void rejectOrder(reason)} />
	</div>;
}
