"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import { incidentCauseLabel } from "@/components/shared/status/labels";
import { incidentCauses } from "./machine-form";
import styles from "../lab-owner-pages.module.css";

export type IncidentDraft = { cause: string; description: string; unavailableFrom: string; expectedAt: string };

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	machineCode: string;
	draft: IncidentDraft;
	onChange: (draft: IncidentDraft) => void;
	busy: boolean;
	error?: string;
	onSubmit: (event: FormEvent) => void;
};

export function IncidentDialog({ open, onOpenChange, machineCode, draft, onChange, busy, error, onSubmit }: Props) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Báo sự cố máy {machineCode}</DialogTitle>
					<DialogDescription>Hệ thống sẽ tính lại lịch cho các đơn bị ảnh hưởng và cho biết đơn nào cần khách phản hồi.</DialogDescription>
				</DialogHeader>
				<form className={styles.dialogForm} onSubmit={onSubmit}>
					<label className={styles.fieldLabel}>Nguyên nhân
						<select className={styles.select} value={draft.cause} onChange={(event) => onChange({ ...draft, cause: event.target.value })}>
							{incidentCauses.map((item) => <option key={item} value={item}>{incidentCauseLabel(item)}</option>)}
						</select>
					</label>
					<label className={styles.fieldLabel}>Mô tả{draft.cause === "OTHER" ? " (bắt buộc)" : " (tùy chọn)"}
						<textarea className={styles.field} required={draft.cause === "OTHER"} maxLength={500} value={draft.description} onChange={(event) => onChange({ ...draft, description: event.target.value })} />
					</label>
					<label className={styles.fieldLabel}>Thời điểm bắt đầu gián đoạn<input className={styles.field} required type="datetime-local" value={draft.unavailableFrom} onChange={(event) => onChange({ ...draft, unavailableFrom: event.target.value })} /></label>
					<label className={styles.fieldLabel}>Dự kiến hoạt động lại (tùy chọn)<input className={styles.field} type="datetime-local" value={draft.expectedAt} onChange={(event) => onChange({ ...draft, expectedAt: event.target.value })} /></label>
					{error && <InlineMessage tone="error">{error}</InlineMessage>}
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
						<Button disabled={busy} type="submit">Ghi nhận sự cố</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
