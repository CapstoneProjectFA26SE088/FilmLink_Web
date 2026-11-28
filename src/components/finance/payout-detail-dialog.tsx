"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FilePicker } from "@/components/shared/feedback/file-picker";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import { StatePanel } from "@/components/shared/feedback/state-panel";
import { payoutItemKindLabel, recipientTypeLabel } from "@/components/shared/status/labels";
import { EnumStatusBadge } from "@/components/shared/status/status-badge";
import { formatDate, formatMoney } from "@/lib/format";
import { labOwnerApi, safeHttpUrl } from "@/lib/lab-owner-api";
import { FINANCE_PAYOUT_STATUS_MAP } from "./finance-labels";

type PayoutItem = { id: number; serviceOrderId: number | null; consignmentSaleId: number | null; amountVnd: number };
type PayoutDetail = {
	id: number; payoutCode: string; recipientType: string; filmLabId: number | null; recipientAccountId: number | null;
	amountVnd: number; status: string; bankName: string | null; bankAccountNumber: string | null; accountHolderName: string | null;
	receiptBlobKey: string | null; receiptUrl: string | null; executedByAccountId: number | null; paidAt: string | null;
	failureReason: string | null; version: number; createdAt: string; updatedAt: string; items: PayoutItem[];
};

const MAX_RECEIPT_BYTES = 10 * 1024 * 1024;
const RECEIPT_TYPES = ["image/jpeg", "image/png", "application/pdf"];

async function uploadReceipt(id: number, file: File): Promise<PayoutDetail> {
	const form = new FormData();
	form.append("receipt", file, file.name);
	// No manual content-type: the browser must add the multipart boundary.
	const response = await fetch(`/api/backend/admin/payouts/${id}/paid`, {
		method: "POST",
		body: form,
		headers: { accept: "application/json" },
		cache: "no-store",
	});
	const body = await response.json().catch(() => ({})) as Record<string, unknown>;
	if (!response.ok) {
		const message = typeof body.message === "string" ? body.message : typeof body.detail === "string" ? body.detail : "Chưa thể đánh dấu đã chi.";
		throw new Error(message);
	}
	return body as unknown as PayoutDetail;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="grid gap-0.5">
			<dt className="text-xs text-muted-foreground">{label}</dt>
			<dd className="m-0 text-sm [overflow-wrap:anywhere]">{children}</dd>
		</div>
	);
}

type Props = { payoutId: number | null; onClose: () => void; onChanged: () => void };

export function PayoutDetailDialog({ payoutId, onClose, onChanged }: Props) {
	const [payout, setPayout] = useState<PayoutDetail | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [formError, setFormError] = useState("");
	const [success, setSuccess] = useState("");
	const [pending, setPending] = useState(false);

	const load = useCallback(async (id: number, signal?: AbortSignal) => {
		setLoading(true);
		setError("");
		try {
			const data = await labOwnerApi<PayoutDetail>(`admin/payouts/${id}`, { signal });
			if (!signal?.aborted) setPayout(data);
		} catch (cause) {
			if (!signal?.aborted) setError(cause instanceof Error ? cause.message : "Không thể tải khoản chi trả.");
		} finally {
			if (!signal?.aborted) setLoading(false);
		}
	}, []);

	useEffect(() => {
		setPayout(null);
		setFile(null);
		setFormError("");
		setSuccess("");
		if (payoutId === null) return;
		const request = new AbortController();
		void load(payoutId, request.signal);
		return () => request.abort();
	}, [payoutId, load]);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!payout || pending) return;
		setFormError("");
		if (!file) return setFormError("Vui lòng chọn tệp biên lai chi trả.");
		if (!RECEIPT_TYPES.includes(file.type)) return setFormError("Biên lai chỉ nhận tệp JPG, PNG hoặc PDF.");
		if (file.size > MAX_RECEIPT_BYTES) return setFormError("Biên lai không được vượt quá 10 MB.");
		setPending(true);
		try {
			setPayout(await uploadReceipt(payout.id, file));
			setFile(null);
			setSuccess("Đã đánh dấu khoản chi trả là đã chi.");
			onChanged();
		} catch (cause) {
			setFormError(cause instanceof Error ? cause.message : "Chưa thể đánh dấu đã chi.");
		} finally {
			setPending(false);
		}
	}

	const receiptHref = safeHttpUrl(payout?.receiptUrl);

	return (
		<Dialog open={payoutId !== null} onOpenChange={(open) => { if (!open && !pending) onClose(); }}>
			<DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Chi tiết khoản chi trả{payoutId !== null ? ` #${payoutId}` : ""}</DialogTitle>
					<DialogDescription>Thông tin người nhận, các mục chi và biên lai.</DialogDescription>
				</DialogHeader>
				{error ? (
					<StatePanel variant="error" title="Không tải được khoản chi trả" description={error} onRetry={() => payoutId !== null && void load(payoutId)} />
				) : loading || !payout ? (
					<StatePanel variant="loading" rows={4} label="Đang tải khoản chi trả…" />
				) : (
					<div className="grid gap-4">
						<dl className="m-0 grid grid-cols-1 gap-3 sm:grid-cols-2">
							<Field label="Mã chi trả">{payout.payoutCode}</Field>
							<Field label="Trạng thái"><EnumStatusBadge map={FINANCE_PAYOUT_STATUS_MAP} value={payout.status} /></Field>
							<Field label="Bên nhận">
								{recipientTypeLabel(payout.recipientType)}
								{payout.filmLabId ? ` · Film Lab #${payout.filmLabId}` : ""}
								{payout.recipientAccountId ? ` · Tài khoản #${payout.recipientAccountId}` : ""}
							</Field>
							<Field label="Số tiền">{formatMoney(payout.amountVnd)}</Field>
							<Field label="Ngân hàng">{payout.bankName || "—"}</Field>
							<Field label="Số tài khoản">{payout.bankAccountNumber || "—"}</Field>
							<Field label="Chủ tài khoản">{payout.accountHolderName || "—"}</Field>
							<Field label="Ngày tạo">{formatDate(payout.createdAt)}</Field>
							<Field label="Ngày chi trả">{formatDate(payout.paidAt)}</Field>
							<Field label="Người thực hiện">{payout.executedByAccountId ? `Tài khoản #${payout.executedByAccountId}` : "—"}</Field>
							{payout.failureReason ? <Field label="Lý do thất bại">{payout.failureReason}</Field> : null}
							<Field label="Biên lai">
								{receiptHref ? (
									<a className="text-link" href={receiptHref} target="_blank" rel="noopener noreferrer">Mở biên lai</a>
								) : payout.receiptBlobKey ? "Đã có biên lai nhưng chưa có đường dẫn xem." : "Chưa có biên lai"}
							</Field>
						</dl>

						<section aria-label="Các mục chi" className="grid gap-2">
							<h3 className="m-0 text-sm font-semibold">Các mục trong khoản chi ({payout.items.length})</h3>
							{payout.items.length ? (
								<ul className="m-0 grid list-none gap-1 p-0 text-sm">
									{payout.items.map((item) => (
										<li key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
											<span>
												{item.serviceOrderId
													? `${payoutItemKindLabel("ORDER")} #${item.serviceOrderId}`
													: item.consignmentSaleId ? `${payoutItemKindLabel("SALE")} #${item.consignmentSaleId}` : payoutItemKindLabel("ADJUSTMENT")}
											</span>
											<strong>{formatMoney(item.amountVnd)}</strong>
										</li>
									))}
								</ul>
							) : <p className="m-0 text-sm text-muted-foreground">Khoản chi này chưa có mục nào.</p>}
						</section>

						{success ? <InlineMessage tone="success">{success}</InlineMessage> : null}

						{payout.status === "PENDING" ? (
							<form className="grid gap-3 rounded-lg border border-border p-3" onSubmit={(event) => void submit(event)}>
								<h3 className="m-0 text-sm font-semibold">Đánh dấu đã chi</h3>
								<p className="m-0 text-sm text-muted-foreground">
									Sau khi chuyển khoản, tải lên biên lai (JPG, PNG hoặc PDF, tối đa 10 MB). Backend bắt buộc có biên lai.
								</p>
								<FilePicker
									name="receipt"
									required
									accept="image/jpeg,image/png,application/pdf"
									disabled={pending}
									aria-label="Biên lai chi trả"
									onChange={(event) => setFile(event.currentTarget.files?.[0] ?? null)}
								/>
								{formError ? <InlineMessage tone="error">{formError}</InlineMessage> : null}
								<div className="flex justify-end">
									<Button type="submit" disabled={pending || !file}>{pending ? "Đang gửi…" : "Đánh dấu đã chi"}</Button>
								</div>
							</form>
						) : (
							<InlineMessage tone="info">Chỉ khoản chi ở trạng thái “Chờ chi trả” mới có thể đánh dấu đã chi.</InlineMessage>
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
