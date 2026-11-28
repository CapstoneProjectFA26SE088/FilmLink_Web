"use client";

import { useEffect, useState } from "react";
import { CreditCard, ExternalLink } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import { formatDate, formatMoney } from "@/lib/format";
import {
	errorMessage,
	isSafeHttpUrl,
	PhotographerApiError,
	photographerApi,
	type OrderDetail,
	type OrderPayment,
} from "@/lib/photographer-api";

function safeHttpUrl(value: string | null | undefined): string | null {
	const candidate = value ?? null;
	return isSafeHttpUrl(candidate) ? candidate : null;
}

/** Minimum amount accepted by POST payments/vnpay/sandbox-url (CreateVnPayPaymentUrlRequest). */
const VNPAY_MIN_AMOUNT_VND = 10_000;

/**
 * Reads a VNPay link from the order if the backend ever returns one.
 * Contract SPEC-00 §4.5 (FA26-157) is not on staging yet, so the field name is not fixed:
 * accept `order.payment.paymentUrl` or `order.payment.url`.
 */
function orderPaymentUrl(order: OrderDetail): string | null {
	const payment = order.payment;
	if (!payment || typeof payment !== "object") return null;
	const record = payment as Record<string, unknown>;
	const candidate = record.paymentUrl ?? record.url;
	return typeof candidate === "string" ? safeHttpUrl(candidate) : null;
}

type PaymentsState = { status: "loading" } | { status: "ok"; items: OrderPayment[] } | { status: "error"; message: string };

export function OrderPaymentPanel({ order }: { order: OrderDetail }) {
	const paymentUrl = orderPaymentUrl(order);
	const amount = order.finalTotalVnd ?? order.estimatedTotalVnd ?? 0;
	const [payments, setPayments] = useState<PaymentsState>({ status: "loading" });
	const [checkedAt, setCheckedAt] = useState("");
	const [sandboxPending, setSandboxPending] = useState(false);
	const [sandboxResult, setSandboxResult] = useState<{ tone: "info" | "error"; text: string } | null>(null);

	useEffect(() => {
		const request = new AbortController();
		photographerApi
			.orderPayments(order.id, request.signal)
			.then((items) => {
				if (request.signal.aborted) return;
				setPayments({ status: "ok", items });
				setCheckedAt(new Date().toISOString());
			})
			.catch((cause: unknown) => {
				if (request.signal.aborted) return;
				setPayments({ status: "error", message: errorMessage(cause) });
				setCheckedAt(new Date().toISOString());
			});
		return () => request.abort();
	}, [order.id]);

	async function openSandbox() {
		setSandboxPending(true);
		setSandboxResult(null);
		try {
			const result = await photographerApi.vnpaySandboxUrl(Math.max(amount, VNPAY_MIN_AMOUNT_VND));
			const url = safeHttpUrl(result.paymentUrl);
			if (!url) throw new Error("Backend trả về link không hợp lệ.");
			window.open(url, "_blank", "noopener,noreferrer");
			setSandboxResult({
				tone: "info",
				text: "Đã mở trang VNPay sandbox ở tab mới. Giao dịch này KHÔNG gắn với đơn, nên trạng thái đơn sẽ không đổi sau khi trả.",
			});
		} catch (cause) {
			setSandboxResult({
				tone: "error",
				text: cause instanceof PhotographerApiError ? errorMessage(cause) : cause instanceof Error ? cause.message : errorMessage(cause),
			});
		} finally {
			setSandboxPending(false);
		}
	}

	const diagnostics = {
		thoiDiemKiemTra: checkedAt || "đang kiểm tra…",
		donHang: { id: order.id, orderCode: order.orderCode, status: order.status, paymentMethod: order.paymentMethod },
		soTienCanThanhToan: amount,
		"GET orders/{id} → payment": order.payment ?? null,
		"GET payments/by-order/{id}":
			payments.status === "ok" ? payments.items : payments.status === "error" ? { loi: payments.message } : "đang tải…",
		mongDoi:
			"Khi tạo đơn ONLINE, backend gọi PaymentService.createOrderPayment và trả paymentUrl VNPay gắn với đơn (SPEC-00 §4.5).",
		thucTe: paymentUrl
			? "Đã có paymentUrl."
			: "Không có paymentUrl, chưa có giao dịch nào. ServiceOrderServiceImpl.java:282 còn TODO(FA26-157).",
	};

	return (
		<section className="order-tracking-card order-confirm-card" aria-labelledby="order-pay-heading">
			<h2 id="order-pay-heading">Thanh toán đơn hàng</h2>
			<p className="order-card-description">
				Đơn chọn thanh toán trực tuyến qua VNPay. Cần thanh toán {formatMoney(amount)} để Film Lab nhận đơn.
			</p>

			{paymentUrl ? (
				<div className="order-card-actions">
					<a className={buttonVariants()} href={paymentUrl} rel="noopener noreferrer">
						<CreditCard data-icon="inline-start" /> Thanh toán qua VNPay
					</a>
				</div>
			) : (
				<>
					<InlineMessage tone="warning" title="Chưa thanh toán được đơn này">
						Hệ thống chưa tạo link thanh toán VNPay cho đơn {order.orderCode}. Đây là phần backend đang hoàn thiện
						(FA26-157), không phải lỗi thao tác của bạn. Bạn có thể hủy đơn và đặt lại với hình thức thanh toán tại lab.
					</InlineMessage>
					<div className="order-card-actions">
						<Button disabled title="Backend chưa trả link thanh toán gắn với đơn">
							<CreditCard data-icon="inline-start" /> Thanh toán qua VNPay
						</Button>
						<Button variant="outline" disabled={sandboxPending} onClick={() => void openSandbox()}>
							<ExternalLink data-icon="inline-start" />
							{sandboxPending ? "Đang tạo link…" : "Mở VNPay sandbox (thử, không gắn đơn)"}
						</Button>
					</div>
				</>
			)}

			{sandboxResult ? <InlineMessage tone={sandboxResult.tone}>{sandboxResult.text}</InlineMessage> : null}

			<details className="order-payment-diagnostics">
				<summary>Thông tin kiểm tra cho đội backend</summary>
				<p className="order-card-description">
					Dữ liệu thật vừa đọc từ API lúc {checkedAt ? formatDate(checkedAt) : "…"}. Có thể sao chép gửi kèm báo lỗi.
				</p>
				<pre>{JSON.stringify(diagnostics, null, 2)}</pre>
			</details>
		</section>
	);
}
