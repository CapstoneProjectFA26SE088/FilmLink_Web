"use client";

import { useState, type FormEvent } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import { PROCESSING_STAGE_MAP, stageLabel } from "@/components/shared/status/labels";
import { StageBadge } from "@/components/shared/status/status-badge";
import { adminApi } from "@/lib/admin-api";
import { formatDate } from "@/lib/format";
import styles from "@/components/finance/finance.module.css";

type RevertResult = {
	orderId: number;
	orderCode: string;
	previousStage: string;
	currentStage: string;
	stages: { stage: string; recordedAt: string | null; note?: string | null }[];
};

const STAGES = Object.keys(PROCESSING_STAGE_MAP);
const NOTE_MAX = 300;

export function AdminOrdersPage() {
	const [orderId, setOrderId] = useState("");
	const [stage, setStage] = useState(STAGES[0]);
	const [note, setNote] = useState("");
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");
	const [result, setResult] = useState<RevertResult | null>(null);

	const id = Number(orderId);
	const trimmedNote = note.trim();
	const valid = Number.isInteger(id) && id > 0 && trimmedNote.length > 0 && trimmedNote.length <= NOTE_MAX;

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (valid && !pending) setConfirmOpen(true);
	}

	async function revert() {
		if (!valid || pending) return;
		setPending(true);
		setError("");
		setResult(null);
		try {
			setResult(await adminApi<RevertResult>(`admin/orders/${id}/stages/revert`, {
				method: "POST",
				body: JSON.stringify({ stage, note: trimmedNote }),
			}));
			setNote("");
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Chưa thể lùi công đoạn.");
		} finally {
			setPending(false);
			setConfirmOpen(false);
		}
	}

	return (
		<div className={styles.page}>
			<header className={styles.heading}>
				<div>
					<h1>Đơn dịch vụ</h1>
					<p>Công cụ hỗ trợ vận hành cho admin.</p>
				</div>
			</header>

			<section className={styles.panel} aria-labelledby="revert-stage-title">
				<form className="grid gap-4 p-4" onSubmit={submit}>
					<div>
						<h2 id="revert-stage-title" className="m-0 text-base font-semibold">Lùi công đoạn xử lý</h2>
						<p className="m-0 mt-1 text-sm text-muted-foreground">
							Chỉ áp dụng cho đơn đang xử lý (trạng thái “Đang xử lý”). Đơn ở trạng thái khác sẽ bị backend từ chối.
							Công cụ đưa đơn về một công đoạn trước đó và ghi lại lý do.
						</p>
					</div>
					<div className="grid gap-3 sm:grid-cols-2">
						<label className="grid gap-1 text-sm">
							Mã đơn dịch vụ
							<Input
								type="number"
								min={1}
								step={1}
								inputMode="numeric"
								required
								placeholder="ID đơn"
								value={orderId}
								disabled={pending}
								onChange={(event) => setOrderId(event.target.value)}
							/>
						</label>
						<label className="grid gap-1 text-sm">
							Công đoạn muốn lùi về
							<select
								className="box-border! h-11 w-full rounded-lg border border-input bg-surface px-3 text-base sm:h-10"
								value={stage}
								disabled={pending}
								onChange={(event) => setStage(event.target.value)}
							>
								{STAGES.map((value) => <option key={value} value={value}>{stageLabel(value)}</option>)}
							</select>
						</label>
					</div>
					<label className="grid gap-1 text-sm">
						Ghi chú (bắt buộc, tối đa {NOTE_MAX} ký tự)
						<Textarea
							required
							maxLength={NOTE_MAX}
							value={note}
							disabled={pending}
							onChange={(event) => setNote(event.target.value)}
						/>
						<span className="text-xs text-muted-foreground">{note.length}/{NOTE_MAX}</span>
					</label>
					{error ? <InlineMessage tone="error" title="Không lùi được công đoạn">{error}</InlineMessage> : null}
					<div className="flex justify-end">
						<Button type="submit" disabled={!valid || pending}>{pending ? "Đang xử lý…" : "Lùi công đoạn"}</Button>
					</div>
				</form>
			</section>

			{result ? (
				<section className={styles.panel} aria-labelledby="revert-result-title">
					<div className="grid gap-3 p-4">
						<InlineMessage tone="success" title="Đã lùi công đoạn">
							Đơn {result.orderCode} (#{result.orderId}) được đưa về công đoạn mới.
						</InlineMessage>
						<h2 id="revert-result-title" className="m-0 flex flex-wrap items-center gap-2 text-base font-semibold">
							<StageBadge value={result.previousStage} /> → <StageBadge value={result.currentStage} />
						</h2>
						<ol className="m-0 grid list-none gap-1 p-0 text-sm" aria-label="Các công đoạn đã ghi nhận">
							{result.stages.map((item, index) => (
								<li key={`${item.stage}-${item.recordedAt ?? index}`} className="flex flex-wrap justify-between gap-2 rounded-lg border border-border px-3 py-2">
									<strong>{stageLabel(item.stage)}</strong>
									<span className="text-muted-foreground">
										{formatDate(item.recordedAt)}{item.note ? ` · ${item.note}` : ""}
									</span>
								</li>
							))}
						</ol>
					</div>
				</section>
			) : null}

			<AlertDialog open={confirmOpen} onOpenChange={(open) => !pending && setConfirmOpen(open)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Lùi công đoạn của đơn #{orderId}?</AlertDialogTitle>
						<AlertDialogDescription>
							Đơn sẽ được đưa về công đoạn “{stageLabel(stage)}”. Thao tác được ghi lại cùng ghi chú của bạn.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={pending}>Hủy</AlertDialogCancel>
						<AlertDialogAction disabled={pending} onClick={() => void revert()}>
							{pending ? "Đang xử lý…" : "Xác nhận lùi"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
