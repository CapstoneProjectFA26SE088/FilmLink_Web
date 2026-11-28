"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, CircleDot, Film, Images, MapPin, PackageCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import {
	ORDER_STATUS_MAP,
	PROCESSING_STAGE_MAP,
	handoverMethodLabel,
	handoverPointLabel,
	paymentMethodLabel,
	paymentPurposeLabel,
	rollStatusLabel,
	stageLabel,
} from "@/components/shared/status/labels";
import { OrderStatusBadge, PaymentStatusBadge, RollStatusBadge } from "@/components/shared/status/status-badge";
import { formatDate, formatMoney } from "@/lib/format";
import { useUserWorkspace } from "../user-workspace";
import { OrderPaymentPanel } from "./order-payment-panel";
import {
	errorMessage,
	isPhotographerRole,
	PhotographerApiError,
	photographerApi,
	type OrderDetail,
	type OrderPayment,
	type OrderStatus,
	type OrderSummary,
} from "@/lib/photographer-api";

const NOT_PHOTOGRAPHER_TITLE = "Khu vực này chỉ dành cho tài khoản Photographer.";
const cancellable = new Set<OrderStatus>(["AWAITING_PAYMENT", "AWAITING_LAB_CONFIRMATION", "AWAITING_FILM"]);
/** Statuses where the processing pipeline can still move forward. */
const pipelineOpen = new Set<OrderStatus>([
	"AWAITING_PAYMENT",
	"AWAITING_LAB_CONFIRMATION",
	"AWAITING_FILM",
	"AWAITING_MACHINE_ASSIGNMENT",
	"IN_PROCESSING",
	"AWAITING_TOP_UP",
]);
const STAGE_ORDER = Object.keys(PROCESSING_STAGE_MAP);

function priceText(value: number | null) {
	return value == null ? "Chưa chốt" : formatMoney(value);
}

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
		setLoading(true);
		setError(null);
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
		return () => {
			requestVersion.current += 1;
		};
	}, [load]);

	if (!accountLoaded) {
		return <StatePanel variant="loading" label="Đang tải thông tin tài khoản…" />;
	}
	if (!isPhotographerRole(account?.role)) {
		return <StatePanel variant="empty" title={NOT_PHOTOGRAPHER_TITLE} />;
	}

	return (
		<section className="subpage-section">
			<p className="eyebrow photographer-eyebrow">Hành trình cuộn phim</p>
			<div className="subpage-title-row">
				<div>
					<h1>Đơn hàng của bạn</h1>
					<p>Theo dõi trạng thái, công đoạn và các lần bàn giao thực tế.</p>
				</div>
				<span className="service-total">{total} đơn</span>
			</div>

			<label className="photographer-field photographer-status-filter">
				<span>Trạng thái</span>
				<select
					value={status}
					onChange={(event) => {
						setStatus(event.target.value);
						setPage(0);
					}}
				>
					<option value="">Tất cả</option>
					{Object.entries(ORDER_STATUS_MAP).map(([value, entry]) => (
						<option key={value} value={value}>
							{entry.label}
						</option>
					))}
				</select>
			</label>

			<div className="photographer-list-region" aria-busy={loading}>
				{error ? (
					<StatePanel
						variant="error"
						title="Không thể tải danh sách đơn hàng"
						description={error}
						onRetry={() => void load()}
					/>
				) : loading ? (
					<StatePanel variant="loading" rows={4} label="Đang tải danh sách đơn hàng…" />
				) : orders.length ? (
					<div className="order-list order-list--page">
						{orders.map((order) => (
							<OrderRow key={order.id} order={order} />
						))}
					</div>
				) : status ? (
					<StatePanel
						variant="empty"
						title="Không có đơn ở trạng thái này"
						description="Hãy chọn trạng thái khác hoặc xem tất cả đơn hàng."
					/>
				) : (
					<StatePanel
						variant="empty"
						title="Bạn chưa có đơn hàng nào"
						description="Chọn một Film Lab và đặt dịch vụ đầu tiên của bạn."
						action={
							<Link className={buttonVariants({ variant: "outline" })} href="/services">
								Đặt dịch vụ
							</Link>
						}
					/>
				)}
			</div>

			<div className="photographer-pagination">
				<Button variant="outline" disabled={page === 0 || loading} onClick={() => setPage((value) => value - 1)}>
					Trang trước
				</Button>
				<span>Trang {page + 1}</span>
				<Button variant="outline" disabled={!hasNext || loading} onClick={() => setPage((value) => value + 1)}>
					Trang sau
				</Button>
			</div>
		</section>
	);
}

export function OrderRow({ order }: { order: OrderSummary }) {
	const due = order.promisedReturnAt || order.expectedReturnAt;
	return (
		<Link className="order-row order-row--interactive" href={`/orders/${order.id}`}>
			<div className="order-row__icon">
				<Film aria-hidden="true" />
			</div>
			<div className="order-row__details">
				<div className="order-row__title">
					<strong>{order.labName}</strong>
					<OrderStatusBadge value={order.status} />
				</div>
				<div className="order-meta">
					<span>{order.orderCode}</span>
					<span>{order.rollCount} cuộn</span>
					<span>Hẹn trả: {formatDate(due)}</span>
					<span>{priceText(order.finalTotalVnd ?? order.estimatedTotalVnd)}</span>
				</div>
			</div>
		</Link>
	);
}

type TimelineState = "done" | "current" | "upcoming";
type TimelineStep = { key: string; stage: string; state: TimelineState; recordedAt?: string; note?: string | null };

const TIMELINE_STATE_TEXT: Record<TimelineState, string> = {
	done: "Đã ghi nhận",
	current: "Công đoạn hiện tại",
	upcoming: "Sắp tới",
};

function buildTimeline(order: OrderDetail): TimelineStep[] {
	const processing = order.status === "IN_PROCESSING";
	const steps: TimelineStep[] = order.stages.map((stage, index) => ({
		key: `${stage.stage}-${stage.recordedAt}`,
		stage: stage.stage,
		state: processing && index === order.stages.length - 1 ? "current" : "done",
		recordedAt: stage.recordedAt,
		note: stage.note,
	}));
	if (pipelineOpen.has(order.status)) {
		const reached = Math.max(-1, ...order.stages.map((stage) => STAGE_ORDER.indexOf(stage.stage)));
		for (const stage of STAGE_ORDER.slice(reached + 1)) {
			steps.push({ key: `upcoming-${stage}`, stage, state: "upcoming" });
		}
	}
	return steps;
}

function CreatedNotice() {
	const params = useSearchParams();
	if (params.get("created") !== "1") return null;
	return (
		<InlineMessage tone="success" title="Đã tạo đơn thành công" className="photographer-message">
			Film Lab sẽ xác nhận đơn của bạn. Bạn có thể theo dõi trạng thái và công đoạn ngay tại trang này.
		</InlineMessage>
	);
}

export function PhotographerOrderDetail({ orderId }: { orderId: number }) {
	const { account, accountLoaded } = useUserWorkspace();
	const [order, setOrder] = useState<OrderDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [reason, setReason] = useState("");
	const [confirmOpen, setConfirmOpen] = useState(false);
	const mutation = useRef(false);

	const load = useCallback(async () => {
		if (!accountLoaded || !isPhotographerRole(account?.role)) return;
		setLoading(true);
		setError(null);
		try {
			setOrder(await photographerApi.order(orderId));
		} catch (cause) {
			setError(errorMessage(cause));
		} finally {
			setLoading(false);
		}
	}, [account?.role, accountLoaded, orderId]);

	useEffect(() => {
		void load();
	}, [load]);

	async function act(action: "cancel" | "confirm") {
		if (!order || mutation.current) return;
		mutation.current = true;
		setPending(true);
		setError(null);
		try {
			const updated =
				action === "cancel"
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

	async function confirmReceipt() {
		await act("confirm");
		setConfirmOpen(false);
	}

	if (!accountLoaded) {
		return <StatePanel variant="loading" label="Đang tải thông tin tài khoản…" />;
	}
	if (!isPhotographerRole(account?.role)) {
		return <StatePanel variant="empty" title={NOT_PHOTOGRAPHER_TITLE} />;
	}

	const backLink = (
		<Link className={`${buttonVariants({ variant: "ghost" })} order-detail-back`} href="/orders">
			<ArrowLeft aria-hidden="true" /> Quay lại đơn hàng
		</Link>
	);

	if (!order) {
		return (
			<section className="subpage-section order-detail-page">
				{backLink}
				{loading ? (
					<StatePanel variant="loading" rows={4} label="Đang tải đơn hàng…" />
				) : error ? (
					<StatePanel
						variant="error"
						title="Không thể tải đơn hàng"
						description={error}
						onRetry={() => void load()}
					/>
				) : (
					<StatePanel
						variant="empty"
						title="Không tìm thấy đơn hàng"
						description="Đơn hàng không tồn tại hoặc không thuộc tài khoản của bạn."
					/>
				)}
			</section>
		);
	}

	const finalTotal = order.finalTotalVnd ?? order.estimatedTotalVnd;
	const timeline = buildTimeline(order);
	const scannedRolls = order.rolls.filter((roll) => roll.archiveRollId);

	return (
		<section className="subpage-section order-detail-page">
			{backLink}
			<p className="eyebrow photographer-eyebrow">Chi tiết đơn hàng</p>
			<div className="subpage-title-row order-detail-heading">
				<div>
					<h1>{order.orderCode}</h1>
					<p>
						{order.lab?.labName || "Film Lab"} · tạo lúc {formatDate(order.createdAt)}
					</p>
				</div>
				<OrderStatusBadge value={order.status} />
			</div>

			<Suspense fallback={null}>
				<CreatedNotice />
			</Suspense>
			{error ? (
				<InlineMessage tone="error" className="photographer-message">
					{error}
				</InlineMessage>
			) : null}
			{loading ? <StatePanel variant="loading" rows={1} label="Đang cập nhật đơn hàng…" /> : null}

			<div className="order-detail-grid">
				<div className="order-detail-main">
					<section className="order-tracking-card" aria-labelledby="order-progress-heading">
						<div className="order-detail-section-heading">
							<div>
								<p className="eyebrow photographer-eyebrow">Công đoạn thực tế</p>
								<h2 id="order-progress-heading">Tiến độ xử lý</h2>
							</div>
						</div>
						{timeline.length ? (
							<ol className="order-tracking-timeline">
								{timeline.map((step, index) => (
									<li
										className={`order-tracking-step order-tracking-step--${
											step.state === "done" ? "complete" : step.state === "current" ? "active" : "upcoming"
										}`}
										key={step.key}
										aria-current={step.state === "current" ? "step" : undefined}
									>
										<span className="order-tracking-step__marker" aria-hidden="true">
											{step.state === "done" ? <Check /> : step.state === "current" ? <CircleDot /> : index + 1}
										</span>
										<div>
											<strong>{stageLabel(step.stage)}</strong>
											<span className="order-tracking-step__state">{TIMELINE_STATE_TEXT[step.state]}</span>
											{step.recordedAt ? (
												<p>
													{formatDate(step.recordedAt)}
													{step.note ? ` · ${step.note}` : ""}
												</p>
											) : null}
										</div>
									</li>
								))}
							</ol>
						) : (
							<p className="order-card-description">Lab chưa ghi nhận công đoạn xử lý.</p>
						)}
					</section>

					<section className="order-tracking-card" aria-labelledby="order-handover-heading">
						<div className="order-detail-section-heading">
							<div>
								<p className="eyebrow photographer-eyebrow">Bàn giao</p>
								<h2 id="order-handover-heading">Lịch sử bàn giao</h2>
							</div>
						</div>
						{order.handovers.length ? (
							order.handovers.map((handover) => (
								<article className="photographer-handover" key={handover.id}>
									<PackageCheck aria-hidden="true" />
									<div>
										<strong>
											{handoverPointLabel(handover.handoverPoint)} · {handover.rollCount} cuộn
										</strong>
										<p>
											{formatDate(handover.occurredAt)}
											{handover.note ? ` · ${handover.note}` : ""}
										</p>
									</div>
								</article>
							))
						) : (
							<p className="order-card-description">Chưa có lần bàn giao nào.</p>
						)}
					</section>

					{order.status === "AWAITING_PAYMENT" ? <OrderPaymentPanel order={order} /> : null}

					{order.status === "DELIVERED" ? (
						<section className="order-tracking-card order-confirm-card" aria-labelledby="order-confirm-heading">
							<h2 id="order-confirm-heading">Xác nhận đã nhận phim</h2>
							<p className="order-card-description">
								{order.keepNegativesAtLab
									? "Lab đã bàn giao scan và sẽ giữ âm bản giúp bạn. Hãy xác nhận khi bạn đã kiểm tra đủ ảnh."
									: "Lab đã trả phim cho bạn. Hãy chỉ xác nhận khi bạn đã nhận đủ phim."}
							</p>
							<div className="order-card-actions">
								<Button disabled={pending} onClick={() => setConfirmOpen(true)}>
									<PackageCheck data-icon="inline-start" /> Xác nhận đã nhận phim
								</Button>
							</div>
							<AlertDialog open={confirmOpen} onOpenChange={(open) => !pending && setConfirmOpen(open)}>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Xác nhận đã nhận phim?</AlertDialogTitle>
										<AlertDialogDescription>
											{order.keepNegativesAtLab
											? `Bạn xác nhận đã nhận scan của đơn ${order.orderCode} và đồng ý để lab giữ âm bản.`
											: `Bạn xác nhận đã nhận đủ phim của đơn ${order.orderCode}. Đơn sẽ được đóng.`}
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel disabled={pending}>Chưa xác nhận</AlertDialogCancel>
										<AlertDialogAction disabled={pending} onClick={() => void confirmReceipt()}>
											{pending ? "Đang xác nhận…" : "Xác nhận"}
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</section>
					) : null}

					{cancellable.has(order.status) ? (
						<section className="order-tracking-card" aria-labelledby="order-cancel-heading">
							<h2 id="order-cancel-heading">Huỷ đơn trước khi lab nhận phim</h2>
							<label className="order-cancel-field" htmlFor="order-cancel-reason">
								Lý do huỷ đơn (10 đến 500 ký tự)
							</label>
							<textarea
								id="order-cancel-reason"
								minLength={10}
								maxLength={500}
								value={reason}
								onChange={(event) => setReason(event.target.value)}
								placeholder="Nhập lý do từ 10 đến 500 ký tự"
							/>
							<div className="order-card-actions">
								<Button
									variant="destructive"
									disabled={pending || reason.trim().length < 10 || reason.trim().length > 500}
									onClick={() => void act("cancel")}
								>
									Huỷ đơn
								</Button>
							</div>
						</section>
					) : null}
				</div>

				<aside className="order-detail-summary" aria-labelledby="order-summary-heading">
					<div className="order-detail-section-heading">
						<div>
							<p className="eyebrow photographer-eyebrow">Thông tin</p>
							<h2 id="order-summary-heading">Đơn của bạn</h2>
						</div>
						<Film aria-hidden="true" />
					</div>
					<dl>
						<div>
							<dt>Film Lab</dt>
							<dd>
								<MapPin aria-hidden="true" />
								{order.lab?.labName || "—"}
							</dd>
						</div>
						<div>
							<dt>Số cuộn</dt>
							<dd>{order.rolls.length}</dd>
						</div>
						<div>
							<dt>Bàn giao</dt>
							<dd>{handoverMethodLabel(order.filmHandoverMethod)}</dd>
						</div>
						<div>
							<dt>Thanh toán</dt>
							<dd>{paymentMethodLabel(order.paymentMethod)}</dd>
						</div>
						<div>
							<dt>Dự kiến</dt>
							<dd>{formatDate(order.promisedReturnAt || order.expectedReturnAt)}</dd>
						</div>
						{order.pickupWindowStartAt ? (
							<div>
								<dt>Khung lấy phim</dt>
								<dd>
									{formatDate(order.pickupWindowStartAt)} – {formatDate(order.pickupWindowEndAt)}
								</dd>
							</div>
						) : null}
					</dl>
					<div className="order-detail-total">
						<span>{order.finalTotalVnd == null ? "Tổng tạm tính" : "Tổng đã chốt"}</span>
						<strong>{priceText(finalTotal)}</strong>
					</div>
					{order.cancelledAt ? (
						<p className="order-card-description">
							Huỷ lúc {formatDate(order.cancelledAt)} · {order.cancellationReason}
						</p>
					) : null}
				</aside>
			</div>

			<OrderPayments key={order.id} orderId={order.id} />

			{scannedRolls.length ? (
				<section className="order-tracking-card" aria-labelledby="order-scans-heading">
					<div className="order-detail-section-heading">
						<div>
							<p className="eyebrow photographer-eyebrow">Kho ảnh số</p>
							<h2 id="order-scans-heading">Ảnh scan của đơn</h2>
						</div>
						<Link className={buttonVariants({ variant: "outline" })} href="/archive">
							<Images data-icon="inline-start" /> Xem kho ảnh
						</Link>
					</div>
					<ul className="order-scan-list">
						{scannedRolls.map((roll) => (
							<li className="order-scan-row" key={roll.id}>
								<span>
									Cuộn {roll.rollSequence} <RollStatusBadge value={roll.status} />
								</span>
								<Link
									className="text-link order-scan-link"
									href={`/archive/${roll.archiveRollId}`}
									aria-label={`Xem ảnh scan cuộn ${roll.rollSequence} (${rollStatusLabel(roll.status)})`}
								>
									Xem cuộn {roll.rollSequence}
								</Link>
							</li>
						))}
					</ul>
				</section>
			) : null}
		</section>
	);
}

function OrderPayments({ orderId }: { orderId: number }) {
	const [attempt, setAttempt] = useState(0);
	const [items, setItems] = useState<OrderPayment[] | null>(null);
	const [error, setError] = useState("");

	useEffect(() => {
		const request = new AbortController();
		photographerApi
			.orderPayments(orderId, request.signal)
			.then((payments) => {
				if (!request.signal.aborted) setItems(payments);
			})
			.catch((cause: unknown) => {
				if (!request.signal.aborted) setError(errorMessage(cause));
			});
		return () => request.abort();
	}, [attempt, orderId]);

	return (
		<section className="order-tracking-card" aria-labelledby="order-payments-heading">
			<h2 id="order-payments-heading">Lịch sử thanh toán và hoàn tiền</h2>
			{error ? (
				<StatePanel
					variant="error"
					title="Không thể tải giao dịch"
					description={error}
					onRetry={() => {
						setError("");
						setAttempt(attempt + 1);
					}}
				/>
			) : items === null ? (
				<StatePanel variant="loading" rows={2} label="Đang tải giao dịch…" />
			) : items.length === 0 ? (
				<p className="order-card-description">Đơn này chưa có giao dịch được ghi nhận.</p>
			) : (
				<ul className="order-payment-list" aria-label="Giao dịch của đơn">
					{items.map((item) => (
						<li key={item.id} className="order-payment-row">
							<div>
								<strong>{paymentPurposeLabel(item.purpose)}</strong>
								<p>
									{item.transactionCode} · {formatDate(item.createdAt)}
								</p>
							</div>
							<div className="order-payment-row__side">
								<strong>{formatMoney(item.amountVnd)}</strong>
								<p>
									{paymentMethodLabel(item.method)} <PaymentStatusBadge value={item.status} />
								</p>
							</div>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
