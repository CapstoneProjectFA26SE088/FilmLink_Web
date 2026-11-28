"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import styles from "../lab-owner-pages.module.css";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	busy: boolean;
	orderCode: string;
	/** Error returned by the last failed reject request, if any. */
	serverError?: string;
	onSubmit: (reason: string) => void;
};

function RejectForm({ busy, serverError, onCancel, onSubmit }: Pick<Props, "busy" | "serverError" | "onSubmit"> & { onCancel: () => void }) {
	const [reason, setReason] = useState("");
	const [error, setError] = useState("");

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const trimmed = reason.trim();
		if (trimmed.length < 10 || trimmed.length > 500) {
			setError("Nhập lý do từ 10 đến 500 ký tự.");
			return;
		}
		setError("");
		onSubmit(trimmed);
	}

	return (
		<form className={styles.detailBody} onSubmit={submit}>
			<label className={styles.fieldLabel} htmlFor="reject-reason">Lý do từ chối (10–500 ký tự)</label>
			<textarea id="reject-reason" className={styles.field} value={reason} onChange={(event) => setReason(event.target.value)} required minLength={10} maxLength={500} rows={4} aria-invalid={Boolean(error)} />
			{(error || serverError) && <InlineMessage tone="error">{error || serverError}</InlineMessage>}
			<DialogFooter>
				<Button type="button" variant="outline" onClick={onCancel}>Giữ đơn</Button>
				<Button type="submit" variant="destructive" disabled={busy}>Xác nhận từ chối đơn</Button>
			</DialogFooter>
		</form>
	);
}

export function RejectOrderDialog({ open, onOpenChange, busy, orderCode, serverError, onSubmit }: Props) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Từ chối nhận đơn {orderCode}</DialogTitle>
					<DialogDescription>Đơn sẽ bị hủy. Nếu khách đã thanh toán, hệ thống sẽ hoàn tiền theo đơn.</DialogDescription>
				</DialogHeader>
				<RejectForm busy={busy} serverError={serverError} onCancel={() => onOpenChange(false)} onSubmit={onSubmit} />
			</DialogContent>
		</Dialog>
	);
}
