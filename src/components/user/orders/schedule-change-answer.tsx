"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import {
	errorMessage,
	photographerApi,
	PhotographerApiError,
	type ScheduleChangeChoice,
} from "@/lib/photographer-api";

const NOTE_MAX = 300;

const CHOICES: { value: ScheduleChangeChoice; label: string; supported: boolean }[] = [
	{ value: "WAIT", label: "Chờ lab xử lý", supported: true },
	{ value: "CANCEL", label: "Hủy đơn", supported: false },
	{ value: "TRANSFER", label: "Chuyển lab", supported: false },
];

/** Collapsible form that lets a photographer answer a schedule change caused by a machine incident. */
export function ScheduleChangeAnswer({ orderId }: { orderId: number }) {
	const [changeId, setChangeId] = useState("");
	const [choice, setChoice] = useState<ScheduleChangeChoice>("WAIT");
	const [note, setNote] = useState("");
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const id = Number(changeId);
	const valid = Number.isInteger(id) && id > 0 && note.length <= NOTE_MAX;

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!valid || pending) return;
		setPending(true);
		setError("");
		setSuccess("");
		try {
			const trimmed = note.trim();
			await photographerApi.answerScheduleChange(orderId, id, { choice, ...(trimmed ? { note: trimmed } : {}) });
			setSuccess(`Đã gửi phản hồi “Chờ lab xử lý” cho thay đổi lịch #${id}.`);
			setNote("");
		} catch (cause) {
			setError(
				cause instanceof PhotographerApiError && cause.status === 422
					? `${cause.message} (Backend chưa hỗ trợ lựa chọn này.)`
					: errorMessage(cause),
			);
		} finally {
			setPending(false);
		}
	}

	return (
		<details className="order-tracking-card group">
			<summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-semibold">
				<span>Trả lời thay đổi lịch do sự cố máy</span>
				<ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
			</summary>
			<form className="mt-3 grid gap-3" onSubmit={(event) => void submit(event)}>
				<InlineMessage tone="info">
					Backend chưa có API liệt kê thay đổi lịch cho khách. Mã thay đổi lịch phải lấy từ kết quả báo sự cố của lab
					(mục “Mã thay đổi #…”).
				</InlineMessage>
				<label className="grid gap-1 text-sm">
					Mã thay đổi lịch
					<Input
						type="number"
						min={1}
						step={1}
						inputMode="numeric"
						required
						value={changeId}
						disabled={pending}
						onChange={(event) => setChangeId(event.target.value)}
					/>
				</label>
				<fieldset className="grid gap-2 border-0 p-0">
					<legend className="mb-1 text-sm">Lựa chọn của bạn</legend>
					{CHOICES.map((item) => (
						<label key={item.value} className="flex items-center gap-2 text-sm">
							<input
								type="radio"
								name={`schedule-choice-${orderId}`}
								value={item.value}
								checked={choice === item.value}
								disabled={!item.supported || pending}
								onChange={() => setChoice(item.value)}
							/>
							<span>{item.label}</span>
							{item.supported ? null : <span className="text-xs text-muted-foreground">Backend chưa hỗ trợ</span>}
						</label>
					))}
				</fieldset>
				<label className="grid gap-1 text-sm">
					Ghi chú (tùy chọn, tối đa {NOTE_MAX} ký tự)
					<Textarea maxLength={NOTE_MAX} value={note} disabled={pending} onChange={(event) => setNote(event.target.value)} />
				</label>
				{error ? <InlineMessage tone="error">{error}</InlineMessage> : null}
				{success ? <InlineMessage tone="success">{success}</InlineMessage> : null}
				<div className="flex justify-end">
					<Button type="submit" disabled={!valid || pending}>{pending ? "Đang gửi…" : "Gửi phản hồi"}</Button>
				</div>
			</form>
		</details>
	);
}
