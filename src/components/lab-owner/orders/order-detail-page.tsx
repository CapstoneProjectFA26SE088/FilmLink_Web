"use client";
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDate, formatMoney, labOwnerApi, LabOwnerApiError, safeHttpUrl, STATUS_LABELS, STAGE_LABELS, type OrderDetail, type ProcessingStage, type ScheduleProposal } from "@/lib/lab-owner-api";
import styles from "../lab-owner-pages.module.css";

const stageOrder: ProcessingStage[] = ["RECEIVED", "DEVELOPING", "WASHING", "DRYING", "SCANNING", "QC"];
const filmName = (roll: OrderDetail["rolls"][number]) => roll.filmStockNameText || `Dòng phim #${roll.filmStockId ?? "—"}`;

export function OrderDetailPage({ orderId }: { orderId: string }) {
	const router = useRouter();
	const lock = useRef(false);
	const [order, setOrder] = useState<OrderDetail | null>(null);
	const [proposal, setProposal] = useState<ScheduleProposal | null>(null);
	const [message, setMessage] = useState("");
	const [busy, setBusy] = useState(false);
	const [receipt, setReceipt] = useState<Record<number, boolean>>({});
	const [receiptNote, setReceiptNote] = useState("");
	const [receiptPhotos, setReceiptPhotos] = useState<File[]>([]);
	const [laterDate, setLaterDate] = useState("");
	const [stageNote, setStageNote] = useState("");

	const load = useCallback(async (preserveMessage = false) => {
		if (!preserveMessage) setMessage("");
		try {
			const next = await labOwnerApi<OrderDetail>(`lab/orders/${orderId}`);
			setOrder(next);
			if (next.status === "AWAITING_FILM") setReceipt({});
			setProposal(next.status === "AWAITING_MACHINE_ASSIGNMENT" ? await labOwnerApi<ScheduleProposal>(`lab/orders/${orderId}/schedule-proposal`) : null);
		} catch (cause) { setMessage(cause instanceof Error ? cause.message : "Không tải được đơn."); }
	}, [orderId]);
	useEffect(() => { void load(); }, [load]);

	async function mutate(path: string, init: RequestInit, success: string) {
		if (lock.current) return;
		lock.current = true; setBusy(true); setMessage("");
		try { await labOwnerApi(path, init); setMessage(success); await load(true); }
		catch (cause) { setMessage(cause instanceof Error ? cause.message : "Không thể cập nhật đơn."); if (cause instanceof LabOwnerApiError && cause.status === 409) await load(true); }
		finally { lock.current = false; setBusy(false); }
	}

	function pickReceiptPhotos(event: ChangeEvent<HTMLInputElement>) {
		const selected = [...(event.target.files ?? [])];
		if (selected.length < 1 || selected.length > 10 || selected.some((file) => !["image/jpeg", "image/png"].includes(file.type) || file.size > 10 * 1024 * 1024)) {
			setReceiptPhotos([]); event.target.value = ""; setMessage("Chọn 1–10 ảnh JPG/PNG, tối đa 10 MB mỗi ảnh."); return;
		}
		setReceiptPhotos(selected); setMessage("");
	}
	async function confirmReceipt() {
		if (!order || order.rolls.some((roll) => receipt[roll.id] === undefined) || !order.rolls.some((roll) => receipt[roll.id]) || receiptPhotos.length < 1) { setMessage("Chọn kết quả rõ ràng cho mỗi cuộn, ít nhất một cuộn đã nhận và 1–10 ảnh bằng chứng."); return; }
		const body = new FormData();
		body.append("data", new Blob([JSON.stringify({ rolls: order.rolls.map((roll) => ({ filmRollId: roll.id, received: receipt[roll.id] })), note: receiptNote || null })], { type: "application/json" }), "data.json");
		receiptPhotos.forEach((file) => body.append("photos", file));
		await mutate(`lab/orders/${order.id}/receipt`, { method: "POST", body }, "Đã xác nhận nhận phim.");
	}
	async function confirmSchedule() {
		let body: Record<string, string> = {};
		if (laterDate) { const selected = new Date(laterDate); if (!proposal?.promisedReturnAt || selected < new Date(proposal.promisedReturnAt)) { setMessage("Ngày chọn phải bằng hoặc muộn hơn đề xuất."); return; } body = { promisedReturnAt: selected.toISOString() }; }
		await mutate(`lab/orders/${orderId}/schedule-confirmation`, { method: "POST", body: JSON.stringify(body) }, "Đã xác nhận lịch máy.");
	}

	if (!order) return <div className={styles.page}><h1>Chi tiết đơn</h1><p className={styles.demoNote}>{message || "Đang tải…"}</p></div>;
	const latestStage = order.stages.at(-1)?.stage;
	const stageIndex = latestStage ? stageOrder.indexOf(latestStage) : -1;
	const nextStage = stageIndex >= 0 && stageIndex < stageOrder.length - 1 ? stageOrder[stageIndex + 1] : undefined;
	return <div className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>Đơn · {order.orderCode}</p><h1>{STATUS_LABELS[order.status] ?? order.status}</h1><p>ID {order.id} · {order.rolls.length} cuộn · {order.serviceTier}</p></div><Button variant="outline" onClick={() => router.push("/lab-owner/orders")}>Về hàng đợi</Button></header>
		{message && <p className={styles.demoNote} role="status">{message}</p>}
		<section className={styles.stats}><div className={styles.stat}><span>Trạng thái</span><strong>{STATUS_LABELS[order.status]}</strong></div><div className={styles.stat}><span>Tổng tiền</span><strong>{formatMoney(order.finalTotalVnd ?? order.estimatedTotalVnd)}</strong></div><div className={styles.stat}><span>Ngày hẹn</span><strong>{formatDate(order.promisedReturnAt ?? order.expectedReturnAt)}</strong></div><div className={styles.stat}><span>Hạng</span><strong>{order.serviceTier}</strong></div></section>
		<section className={styles.details}><div className={styles.stack}>
			<article className={styles.panel}><div className={styles.panelHeader}><div><h2>Thao tác hiện tại</h2><p>Chỉ mở thao tác hợp lệ với trạng thái backend.</p></div></div><div className={styles.detailBody}>
				{order.status === "AWAITING_LAB_CONFIRMATION" && <Button disabled={busy} onClick={() => mutate(`lab/orders/${order.id}/accept`, { method: "POST", body: "{}" }, "Đã nhận đơn.")}>Nhận đơn</Button>}
				{order.status === "AWAITING_FILM" && <>{order.rolls.map((roll) => <label className={styles.detailLine} key={roll.id}><span>Cuộn {roll.rollSequence} · {filmName(roll)}</span><select className={styles.select} value={receipt[roll.id] === undefined ? "" : String(receipt[roll.id])} onChange={(event) => setReceipt((current) => ({ ...current, [roll.id]: event.target.value === "true" }))}><option value="" disabled>Chọn kết quả…</option><option value="true">Đã nhận</option><option value="false">Không nhận được</option></select></label>)}<label className={styles.fieldLabel}>Ghi chú<textarea className={styles.field} maxLength={500} value={receiptNote} onChange={(event) => setReceiptNote(event.target.value)} /></label><label className={styles.fieldLabel}>Ảnh bằng chứng<input className={styles.field} type="file" multiple accept="image/jpeg,image/png" onChange={pickReceiptPhotos} /></label><Button disabled={busy} onClick={confirmReceipt}>Xác nhận nhận phim</Button></>}
				{order.status === "AWAITING_MACHINE_ASSIGNMENT" && proposal && <><div className={styles.notice}>{proposal.feasible ? `Khả thi · đề xuất ${formatDate(proposal.promisedReturnAt)}` : `Không khả thi: ${proposal.infeasibleReason || "Không có lý do"}`}</div>{proposal.allocations.map((item, index) => <div className={styles.detailLine} key={`${item.workDate}-${index}`}><span>{item.workDate}</span><strong>Process #{item.filmProcessId} · format #{item.filmFormatId} · {item.rollCount} cuộn</strong></div>)}<label className={styles.fieldLabel}>Ngày muộn hơn (tùy chọn)<input className={styles.field} type="datetime-local" value={laterDate} onChange={(event) => setLaterDate(event.target.value)} /></label><Button disabled={busy || !proposal.feasible} onClick={confirmSchedule}>Xác nhận lịch</Button></>}
				{order.status === "IN_PROCESSING" && <><div className={styles.notice}>{nextStage ? `Công đoạn tiếp: ${STAGE_LABELS[nextStage]}` : latestStage === "QC" ? "Đã tới QC; có thể hoàn tất scan." : "Timeline chưa có công đoạn RECEIVED."}</div>{nextStage && <><label className={styles.fieldLabel}>Ghi chú<textarea className={styles.field} maxLength={300} value={stageNote} onChange={(event) => setStageNote(event.target.value)} /></label><Button disabled={busy} onClick={() => mutate(`lab/orders/${order.id}/stages`, { method: "POST", body: JSON.stringify({ stage: nextStage, note: stageNote || null }) }, `Đã ghi ${STAGE_LABELS[nextStage]}.`)}>Ghi công đoạn kế tiếp</Button></>}<Button variant="outline" onClick={() => router.push(`/lab-owner/orders/${order.id}/scan`)}>Mở scan & bàn giao</Button></>}
				{order.status === "READY_FOR_HANDOVER" && <Button onClick={() => router.push(`/lab-owner/orders/${order.id}/scan`)}>Trả phim / giữ âm bản</Button>}
				{!["AWAITING_LAB_CONFIRMATION", "AWAITING_FILM", "AWAITING_MACHINE_ASSIGNMENT", "IN_PROCESSING", "READY_FOR_HANDOVER"].includes(order.status) && <div className={styles.notice}>Không có thao tác owner tiếp theo trong API hiện tại.</div>}
			</div></article>
			<article className={styles.panel}><div className={styles.panelHeader}><h2>Cuộn phim & giá chốt</h2></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Cuộn</th><th>Film</th><th>Process / format</th><th>Trạng thái</th><th>Giá</th></tr></thead><tbody>{order.rolls.map((roll) => <tr key={roll.id}><td>#{roll.rollSequence}<small>ID {roll.id}</small></td><td>{filmName(roll)}</td><td>#{roll.filmProcessId} / #{roll.filmFormatId}</td><td>{roll.status}</td><td>{formatMoney(roll.unitPriceVnd + (roll.scanOptionPriceVnd ?? 0) + (roll.pushPullSurchargeVnd ?? 0) + (roll.expressSurchargeVnd ?? 0))}</td></tr>)}</tbody></table></div></article>
		</div><aside className={styles.stack}>
			<article className={styles.panel}><div className={styles.panelHeader}><h2>Khách hàng</h2></div><div className={styles.detailBody}><div className={styles.detailLine}><span>Họ tên</span><strong>{order.photographer?.fullName ?? "—"}</strong></div><div className={styles.detailLine}><span>Điện thoại</span><strong>{order.customerPhone ?? order.photographer?.phoneNumber ?? "—"}</strong></div><div className={styles.detailLine}><span>Yêu cầu</span><strong>{order.specialRequest ?? "—"}</strong></div></div></article>
			<article className={styles.panel}><div className={styles.panelHeader}><h2>Timeline thực tế</h2></div><div className={styles.timeline}>{order.stages.length ? order.stages.map((item, index) => <div className={`${styles.timelineStep} ${styles.timelineStepActive}`} key={item.id ?? index}><span className={styles.timelineDot} />{STAGE_LABELS[item.stage]}<small>{formatDate(item.recordedAt ?? item.createdAt)}</small></div>) : <p className={styles.empty}>Chưa có công đoạn.</p>}</div></article>
			<article className={styles.panel}><div className={styles.panelHeader}><h2>Lịch sử bàn giao</h2></div><div className={styles.detailBody}>{order.handovers.length ? order.handovers.map((handover) => <div className={styles.notice} key={handover.id}><span>{handover.handoverPoint} · {handover.rollCount} cuộn · {formatDate(handover.occurredAt)} · {handover.performedByName}</span>{handover.note && <span>{handover.note}</span>}{handover.photos.map((photo) => { const url = safeHttpUrl(photo.url); return url ? <a href={url} target="_blank" rel="noreferrer" key={photo.id}>Ảnh #{photo.displayOrder}</a> : null; })}</div>) : <p className={styles.empty}>Chưa có bàn giao.</p>}</div></article>
		</aside></section>
	</div>;
}
