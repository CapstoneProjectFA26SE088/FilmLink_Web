"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Clock3, Film, LoaderCircle, MapPin, PackageCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUserWorkspace } from "../user-workspace";
import { errorMessage, isPhotographerRole, PhotographerApiError, photographerApi, type OrderDetail, type OrderStatus, type OrderSummary } from "@/lib/photographer-api";

export const statusLabel: Record<OrderStatus, string> = {
	AWAITING_PAYMENT: "Chờ thanh toán", AWAITING_LAB_CONFIRMATION: "Chờ lab xác nhận", AWAITING_FILM: "Chờ nhận phim",
	AWAITING_MACHINE_ASSIGNMENT: "Chờ xếp máy", IN_PROCESSING: "Đang xử lý", AWAITING_TOP_UP: "Chờ thanh toán bổ sung",
	READY_FOR_HANDOVER: "Sẵn sàng bàn giao", DELIVERED: "Đã bàn giao", CLOSED: "Đã hoàn tất", CANCELLED: "Đã huỷ", SUSPENDED: "Tạm dừng",
};
const cancellable = new Set<OrderStatus>(["AWAITING_PAYMENT", "AWAITING_LAB_CONFIRMATION", "AWAITING_FILM"]);
const stageLabel: Record<string, string> = { RECEIVED: "Đã nhận phim", DEVELOPING: "Tráng phim", WASHING: "Rửa phim", DRYING: "Sấy phim", SCANNING: "Scan", QC: "Kiểm tra chất lượng" };
const money = (value: number | null) => value == null ? "Chưa chốt" : `${value.toLocaleString("vi-VN")}đ`;
const date = (value: string | null) => value ? new Date(value).toLocaleString("vi-VN") : "Chưa có";

export function PhotographerOrders() {
	const { account, accountLoaded } = useUserWorkspace();
	const [orders, setOrders] = useState<OrderSummary[]>([]);
	const [status, setStatus] = useState("");
	const [page, setPage] = useState(0);
	const [hasNext, setHasNext] = useState(false);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const requestVersion = useRef(0);
	const load = useCallback(async () => {
		if (!accountLoaded || !isPhotographerRole(account?.role)) return;
		const version = ++requestVersion.current;
		setLoading(true); setError(null);
		try {
			const result = await photographerApi.orders({ status, page, size: 20 });
			if (version !== requestVersion.current) return;
			setOrders(result.content);
			setHasNext(result.hasNext);
			setTotal(result.totalElements);
		} catch (cause) {
			if (version === requestVersion.current) setError(errorMessage(cause));
		} finally {
			if (version === requestVersion.current) setLoading(false);
		}
	}, [account?.role, accountLoaded, page, status]);
	useEffect(() => {
		void load();
		return () => { requestVersion.current += 1; };
	}, [load]);
	if (!accountLoaded) return <Loading />;
	if (!isPhotographerRole(account?.role)) return <Notice text="Khu vực này chỉ dành cho tài khoản Photographer." />;
	return <section className="subpage-section"><p className="eyebrow">HÀNH TRÌNH CUỘN PHIM</p><div className="subpage-title-row"><div><h1>Đơn hàng của bạn</h1><p>Theo dõi trạng thái, công đoạn và các lần bàn giao thực tế.</p></div><span className="service-total">{total} đơn</span></div>
		<label className="photographer-field photographer-status-filter"><span>Trạng thái</span><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }}><option value="">Tất cả</option>{Object.entries(statusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
		{error ? <Notice text={error} action={load} /> : null}{loading ? <Loading /> : <div className="order-list order-list--page">{orders.map((order) => <OrderRow key={order.id} order={order} />)}{orders.length === 0 ? <p className="order-list-empty">Bạn chưa có đơn phù hợp.</p> : null}</div>}
		<div className="photographer-pagination"><Button variant="outline" disabled={page === 0 || loading} onClick={() => setPage((value) => value - 1)}>Trang trước</Button><span>Trang {page + 1}</span><Button variant="outline" disabled={!hasNext || loading} onClick={() => setPage((value) => value + 1)}>Trang sau</Button></div>
	</section>;
}

export function OrderRow({ order }: { order: OrderSummary }) {
	const due = order.promisedReturnAt || order.expectedReturnAt;
	return <Link className="order-row order-row--interactive" href={`/orders/${order.id}`}><div className="order-row__icon"><Film /></div><div className="order-row__details"><div className="order-row__title"><strong>{order.labName}</strong><span className={`order-status${order.status === "CLOSED" ? " order-status--done" : order.status === "CANCELLED" ? " order-status--cancelled" : ""}`}><span />{statusLabel[order.status]}</span></div><div className="order-meta"><span>{order.orderCode}</span><span>{order.rollCount} cuộn</span><span>Hẹn trả: {date(due)}</span><span>{money(order.finalTotalVnd ?? order.estimatedTotalVnd)}</span></div></div></Link>;
}

export function PhotographerOrderDetail({ orderId }: { orderId: number }) {
	const { account, accountLoaded } = useUserWorkspace();
	const [order, setOrder] = useState<OrderDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [reason, setReason] = useState("");
	const load = useCallback(async () => { if (!accountLoaded || !isPhotographerRole(account?.role)) return; setLoading(true); setError(null); try { setOrder(await photographerApi.order(orderId)); } catch (cause) { setError(errorMessage(cause)); } finally { setLoading(false); } }, [account?.role, accountLoaded, orderId]);
	useEffect(() => { void load(); }, [load]);
	const mutation = useRef(false);
	async function act(action: "cancel" | "confirm") {
		if (!order || mutation.current) return;
		mutation.current = true;
		setPending(true);
		setError(null);
		try {
			const updated = action === "cancel"
				? await photographerApi.cancelOrder(order.id, reason.trim())
				: await photographerApi.confirmReceipt(order.id);
			setOrder(updated);
			setReason("");
		} catch (cause) {
			if (cause instanceof PhotographerApiError && cause.status === 409) await load();
			setError(errorMessage(cause));
		} finally {
			mutation.current = false;
			setPending(false);
		}
	}
	if (!accountLoaded || loading) return <Loading />;
	if (!isPhotographerRole(account?.role)) return <Notice text="Khu vực này chỉ dành cho tài khoản Photographer." />;
	if (!order) return <section className="subpage-section"><Notice text={error || "Không tìm thấy đơn hàng."} action={load} /></section>;
	const finalTotal = order.finalTotalVnd ?? order.estimatedTotalVnd;
	return <section className="subpage-section order-detail-page"><Link className={buttonVariants({ variant: "ghost" })} href="/orders"><ArrowLeft /> Quay lại đơn hàng</Link><p className="eyebrow">CHI TIẾT ĐƠN HÀNG</p><div className="subpage-title-row order-detail-heading"><div><h1>{order.orderCode}</h1><p>{order.lab?.labName || "Film Lab"} · tạo lúc {date(order.createdAt)}</p></div><span className="order-status order-detail-status"><span />{statusLabel[order.status]}</span></div>
		{error ? <Notice text={error} /> : null}<div className="order-detail-grid"><div className="order-detail-main">
			<section className="order-tracking-card"><div className="order-detail-section-heading"><div><p className="eyebrow">CÔNG ĐOẠN THỰC TẾ</p><h2>Tiến độ xử lý</h2></div></div>{order.stages.length ? <ol className="order-tracking-timeline">{order.stages.map((stage, index) => <li className="order-tracking-step order-tracking-step--complete" key={`${stage.stage}-${stage.recordedAt}`}><span className="order-tracking-step__marker"><Check /></span><div><strong>{stageLabel[stage.stage] || stage.stage}</strong><p>{date(stage.recordedAt)}{stage.note ? ` · ${stage.note}` : ""}</p></div></li>)}</ol> : <p>Lab chưa ghi nhận công đoạn xử lý.</p>}</section>
			<section className="order-tracking-card"><div className="order-detail-section-heading"><div><p className="eyebrow">BÀN GIAO</p><h2>Lịch sử bàn giao</h2></div></div>{order.handovers.length ? order.handovers.map((handover) => <article className="photographer-handover" key={handover.id}><PackageCheck /><div><strong>{handover.handoverPoint} · {handover.rollCount} cuộn</strong><p>{date(handover.occurredAt)}{handover.note ? ` · ${handover.note}` : ""}</p></div></article>) : <p>Chưa có lần bàn giao nào.</p>}</section>
			{cancellable.has(order.status) ? <section className="order-tracking-card"><h2>Huỷ đơn trước khi lab nhận phim</h2><textarea minLength={10} maxLength={500} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Nhập lý do từ 10 đến 500 ký tự" /><Button variant="destructive" disabled={pending || reason.trim().length < 10 || reason.trim().length > 500} onClick={() => void act("cancel")}>Huỷ đơn</Button></section> : null}
			{order.status === "DELIVERED" ? <Button disabled={pending} onClick={() => void act("confirm")}>Xác nhận đã nhận phim / đồng ý lab giữ âm bản</Button> : null}
		</div><aside className="order-detail-summary"><div className="order-detail-section-heading"><div><p className="eyebrow">THÔNG TIN</p><h2>Đơn của bạn</h2></div><Film /></div><dl><div><dt>Film Lab</dt><dd><MapPin />{order.lab?.labName || "—"}</dd></div><div><dt>Số cuộn</dt><dd>{order.rolls.length}</dd></div><div><dt>Bàn giao</dt><dd>{order.filmHandoverMethod}</dd></div><div><dt>Thanh toán</dt><dd>{order.paymentMethod === "PAY_AT_LAB" ? "Tại lab" : order.paymentMethod}</dd></div><div><dt>Dự kiến</dt><dd>{date(order.promisedReturnAt || order.expectedReturnAt)}</dd></div>{order.pickupWindowStartAt ? <div><dt>Khung lấy phim</dt><dd>{date(order.pickupWindowStartAt)} – {date(order.pickupWindowEndAt)}</dd></div> : null}</dl><div className="order-detail-total"><span>{order.finalTotalVnd == null ? "Tổng tạm tính" : "Tổng đã chốt"}</span><strong>{money(finalTotal)}</strong></div>{order.cancelledAt ? <p>Huỷ lúc {date(order.cancelledAt)} · {order.cancellationReason}</p> : null}</aside></div>
		{order.rolls.some((roll) => roll.archiveRollId) && (
			<section className="order-tracking-card mt-4">
				<h2>Ảnh scan của đơn</h2>
				<ul>
					{order.rolls.filter((roll) => roll.archiveRollId).map((roll) => (
						<li key={roll.id}>
							<Link className="text-link" href={`/archive/${roll.archiveRollId}`}>Xem cuộn {roll.rollSequence}</Link>
						</li>
					))}
				</ul>
			</section>
		)}
	</section>;
}

function Loading() { return <div className="photographer-loading"><LoaderCircle className="photographer-spin" /> Đang tải đơn hàng...</div>; }
function Notice({ text, action }: { text: string; action?: () => void | Promise<void> }) { return <div className="empty-state"><Clock3 /><strong>{text}</strong>{action ? <Button variant="outline" onClick={() => void action()}>Tải lại</Button> : null}</div>; }
