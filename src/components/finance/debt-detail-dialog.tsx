"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import { StatePanel } from "@/components/shared/feedback/state-panel";
import { EnumStatusBadge } from "@/components/shared/status/status-badge";
import { formatDate, formatDateOnly, formatMoney } from "@/lib/format";
import { labOwnerApi, safeHttpUrl } from "@/lib/lab-owner-api";
import { FINANCE_DEBT_STATUS_MAP } from "./finance-labels";

export type DebtDetail = {
	id: number; filmLabId: number; billingPeriod: string; dueDate: string; totalAmountVnd: number; paidAmountVnd: number;
	status: string; settledAt: string | null; settledByAccountId: number | null; createdAt: string; updatedAt: string;
};

type Props = {
	debtId: number | null;
	/** "lab": the lab owner reports a transfer. "admin": the admin confirms the money was received. */
	mode: "lab" | "admin";
	onClose: () => void;
	onChanged: () => void;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="grid gap-0.5">
			<dt className="text-xs text-muted-foreground">{label}</dt>
			<dd className="m-0 text-sm [overflow-wrap:anywhere]">{children}</dd>
		</div>
	);
}

export function DebtDetailDialog({ debtId, mode, onClose, onChanged }: Props) {
	const [debt, setDebt] = useState<DebtDetail | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [receipt, setReceipt] = useState("");
	const [note, setNote] = useState("");
	const [formError, setFormError] = useState("");
	const [success, setSuccess] = useState("");
	const [pending, setPending] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);

	const load = useCallback(async (id: number, signal?: AbortSignal) => {
		setLoading(true);
		setError("");
		try {
			const data = await labOwnerApi<DebtDetail>(`commission-debts/${id}`, { signal });
			if (!signal?.aborted) setDebt(data);
		} catch (cause) {
			if (!signal?.aborted) setError(cause instanceof Error ? cause.message : "Không thể tải kỳ công nợ.");
		} finally {
			if (!signal?.aborted) setLoading(false);
		}
	}, []);

	useEffect(() => {
		setDebt(null);
		setReceipt("");
		setNote("");
		setFormError("");
		setSuccess("");
		setConfirmOpen(false);
		if (debtId === null) return;
		const request = new AbortController();
		void load(debtId, request.signal);
		return () => request.abort();
	}, [debtId, load]);

	async function report(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!debt || pending) return;
		setFormError("");
		const url = receipt.trim();
		if (!url) return setFormError("Vui lòng nhập đường dẫn ảnh biên lai.");
		if (!safeHttpUrl(url)) return setFormError("Đường dẫn biên lai phải bắt đầu bằng http:// hoặc https://.");
		setPending(true);
		try {
			const payload: { receiptBlobKey: string; note?: string } = { receiptBlobKey: url };
			if (note.trim()) payload.note = note.trim();
			setDebt(await labOwnerApi<DebtDetail>(`commission-debts/${debt.id}/payment-reports`, {
				method: "POST",
				body: JSON.stringify(payload),
			}));
			setReceipt("");
			setNote("");
			setSuccess("Đã gửi báo chuyển khoản. Khoản thanh toán đang chờ admin xác nhận.");
			onChanged();
		} catch (cause) {
			setFormError(cause instanceof Error ? cause.message : "Chưa thể gửi báo chuyển khoản.");
		} finally {
			setPending(false);
		}
	}

	async function confirm() {
		if (!debt || pending) return;
		setFormError("");
		setPending(true);
		try {
			setDebt(await labOwnerApi<DebtDetail>(`commission-debts/${debt.id}/confirmation`, { method: "POST", body: "{}" }));
			setSuccess("Đã xác nhận nhận đủ tiền. Kỳ công nợ được tất toán.");
			onChanged();
		} catch (cause) {
			setFormError(cause instanceof Error ? cause.message : "Chưa thể xác nhận.");
		} finally {
			setPending(false);
			setConfirmOpen(false);
		}
	}

	const settled = debt?.status === "PAID";

	return (
		<Dialog open={debtId !== null} onOpenChange={(open) => { if (!open && !pending) onClose(); }}>
			<DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Chi tiết kỳ công nợ{debtId !== null ? ` #${debtId}` : ""}</DialogTitle>
					<DialogDescription>
						{mode === "admin" ? "Đối chiếu và xác nhận tiền hoa hồng lab đã chuyển." : "Xem kỳ công nợ và báo cho nền tảng khi bạn đã chuyển khoản."}
					</DialogDescription>
				</DialogHeader>
				{error ? (
					<StatePanel variant="error" title="Không tải được kỳ công nợ" description={error} onRetry={() => debtId !== null && void load(debtId)} />
				) : loading || !debt ? (
					<StatePanel variant="loading" rows={3} label="Đang tải kỳ công nợ…" />
				) : (
					<div className="grid gap-4">
						<dl className="m-0 grid grid-cols-1 gap-3 sm:grid-cols-2">
							<Field label="Film Lab">#{debt.filmLabId}</Field>
							<Field label="Trạng thái"><EnumStatusBadge map={FINANCE_DEBT_STATUS_MAP} value={debt.status} /></Field>
							<Field label="Kỳ đối soát">{formatDateOnly(debt.billingPeriod)}</Field>
							<Field label="Hạn thanh toán">{formatDateOnly(debt.dueDate)}</Field>
							<Field label="Tổng công nợ">{formatMoney(debt.totalAmountVnd)}</Field>
							<Field label="Đã thanh toán">{formatMoney(debt.paidAmountVnd)}</Field>
							<Field label="Còn phải trả">{formatMoney(debt.totalAmountVnd - debt.paidAmountVnd)}</Field>
							<Field label="Tất toán lúc">{formatDate(debt.settledAt)}</Field>
							<Field label="Người xác nhận">{debt.settledByAccountId ? `Tài khoản #${debt.settledByAccountId}` : "—"}</Field>
							<Field label="Cập nhật">{formatDate(debt.updatedAt)}</Field>
						</dl>

						{success ? <InlineMessage tone="success">{success}</InlineMessage> : null}

						{settled ? (
							<InlineMessage tone="info">Kỳ công nợ đã được tất toán, không cần thao tác thêm.</InlineMessage>
						) : mode === "lab" ? (
							<form className="grid gap-3 rounded-lg border border-border p-3" onSubmit={(event) => void report(event)}>
								<h3 className="m-0 text-sm font-semibold">Báo đã chuyển khoản</h3>
								<p className="m-0 text-sm text-muted-foreground">
									Backend chưa có API tải biên lai công nợ: hãy dán đường dẫn ảnh biên lai (http/https). Admin sẽ đối chiếu rồi xác nhận.
								</p>
								<label className="grid gap-1 text-sm">
									Đường dẫn ảnh biên lai
									<Input
										type="url"
										inputMode="url"
										required
										placeholder="https://…"
										value={receipt}
										disabled={pending}
										onChange={(event) => setReceipt(event.target.value)}
									/>
								</label>
								<label className="grid gap-1 text-sm">
									Ghi chú (tùy chọn)
									<Textarea value={note} maxLength={500} disabled={pending} onChange={(event) => setNote(event.target.value)} />
								</label>
								{formError ? <InlineMessage tone="error">{formError}</InlineMessage> : null}
								<div className="flex justify-end">
									<Button type="submit" disabled={pending}>{pending ? "Đang gửi…" : "Gửi báo chuyển khoản"}</Button>
								</div>
							</form>
						) : (
							<div className="grid gap-3 rounded-lg border border-border p-3">
								<h3 className="m-0 text-sm font-semibold">Xác nhận thanh toán</h3>
								<p className="m-0 text-sm text-muted-foreground">
									Chỉ xác nhận sau khi đã kiểm tra tiền về tài khoản. Hành động này tất toán kỳ công nợ và không thể hoàn tác trên giao diện.
								</p>
								{formError ? <InlineMessage tone="error">{formError}</InlineMessage> : null}
								<div className="flex justify-end">
									<Button disabled={pending} onClick={() => setConfirmOpen(true)}>Xác nhận đã nhận đủ tiền</Button>
								</div>
								<AlertDialog open={confirmOpen} onOpenChange={(open) => !pending && setConfirmOpen(open)}>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Xác nhận đã nhận đủ tiền?</AlertDialogTitle>
											<AlertDialogDescription>
												Kỳ công nợ #{debt.id} của Film Lab #{debt.filmLabId} sẽ được tất toán ({formatMoney(debt.totalAmountVnd)}).
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel disabled={pending}>Chưa xác nhận</AlertDialogCancel>
											<AlertDialogAction disabled={pending} onClick={() => void confirm()}>
												{pending ? "Đang xác nhận…" : "Xác nhận"}
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
