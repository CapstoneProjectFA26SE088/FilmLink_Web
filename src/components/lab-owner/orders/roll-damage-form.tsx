"use client";

import { useState, type FormEvent } from "react";
import { FilePicker } from "@/components/shared/feedback/file-picker";
import { Button } from "@/components/ui/button";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import type { FilmRoll } from "@/lib/lab-owner-api";
import { buildRollDamageBody } from "@/lib/roll-damage";
import styles from "../lab-owner-pages.module.css";

type Props = {
	rolls: FilmRoll[];
	busy: boolean;
	onSubmit: (rollId: number, body: FormData) => Promise<void>;
};

export function RollDamageForm({ rolls, busy, onSubmit }: Props) {
	const [error, setError] = useState("");
	const eligible = rolls.filter((roll) => roll.status === "RECEIVED");
	if (!eligible.length) return null;

	async function report(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		const input = new FormData(event.currentTarget);
		const rollId = Number(input.get("rollId"));
		if (!eligible.some((roll) => roll.id === rollId)) {
			setError("Chọn một cuộn phim đã nhận.");
			return;
		}
		try {
			const body = buildRollDamageBody(String(input.get("note") ?? ""), input.getAll("photos"));
			await onSubmit(rollId, body);
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Không thể ghi nhận tình trạng cuộn phim.");
		}
	}

	return <details className={styles.panel}>
		<summary className={styles.panelHeader}>Báo cuộn phim hỏng</summary>
		<form className={styles.detailBody} onSubmit={report}>
			<p>Hệ thống sẽ miễn phí cuộn hỏng, tính lại tổng đơn và hoàn phần thanh toán trực tuyến dư nếu có.</p>
			<label className={styles.fieldLabel}>Cuộn phim
				<select className={styles.select} name="rollId" defaultValue="" required>
					<option value="" disabled>Chọn cuộn đã nhận</option>
					{eligible.map((roll) => <option key={roll.id} value={roll.id}>Cuộn {roll.rollSequence}{roll.filmStockNameText && ` · ${roll.filmStockNameText}`}</option>)}
				</select>
			</label>
			<label className={styles.fieldLabel}>Mô tả tình trạng hỏng
				<textarea className={styles.field} name="note" maxLength={500} required />
			</label>
			<label className={styles.fieldLabel}>Ảnh bằng chứng (1–10 ảnh JPG/PNG, tối đa 10 MB mỗi ảnh)
				<FilePicker name="photos" multiple accept="image/jpeg,image/png" required />
			</label>
			{error && <InlineMessage tone="error">{error}</InlineMessage>}
			<Button type="submit" disabled={busy}>Xác nhận cuộn hỏng và tính lại giá</Button>
		</form>
	</details>;
}
