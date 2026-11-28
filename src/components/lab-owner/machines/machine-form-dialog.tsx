"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import { MACHINE_TYPE_MAP } from "@/components/shared/status/labels";
import type { CatalogOption } from "@/lib/lab-owner-api";
import { weekdays, type MachineForm } from "./machine-form";
import styles from "../lab-owner-pages.module.css";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	form: MachineForm;
	onChange: (form: MachineForm) => void;
	processes: CatalogOption[];
	formats: CatalogOption[];
	busy: boolean;
	error?: string;
	onSubmit: (event: FormEvent) => void;
};

function toggleId(ids: number[], id: number, checked: boolean) {
	return checked ? [...ids, id] : ids.filter((item) => item !== id);
}

export function MachineFormDialog({ open, onOpenChange, form, onChange, processes, formats, busy, error, onSubmit }: Props) {
	const editing = form.id !== undefined;
	const setHour = (dayOfWeek: number, patch: Partial<MachineForm["workingHours"][number]>) => onChange({ ...form, workingHours: form.workingHours.map((item) => item.dayOfWeek === dayOfWeek ? { ...item, ...patch } : item) });
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>{editing ? `Sửa máy ${form.machineCode}` : "Thêm máy"}</DialogTitle>
					<DialogDescription>Khai báo công suất, quy trình, khổ phim và giờ vận hành. Công suất mỗi ngày do hệ thống tính từ giờ vận hành.</DialogDescription>
				</DialogHeader>
				<form className={styles.dialogForm} onSubmit={onSubmit}>
					<div className={styles.fieldGrid}>
						<label className={styles.fieldLabel}>Mã máy<input className={styles.field} required minLength={2} maxLength={50} readOnly={editing} value={form.machineCode} onChange={(event) => onChange({ ...form, machineCode: event.target.value })} /></label>
						<label className={styles.fieldLabel}>Loại máy
							<select className={styles.select} disabled={editing} value={form.machineType} onChange={(event) => onChange({ ...form, machineType: event.target.value as MachineForm["machineType"], filmProcessIds: event.target.value === "SCANNER" ? [] : form.filmProcessIds })}>
								{Object.entries(MACHINE_TYPE_MAP).map(([value, entry]) => <option key={value} value={value}>{entry.label}</option>)}
							</select>
						</label>
						<label className={styles.fieldLabel}>Model<input className={styles.field} maxLength={150} value={form.modelName} onChange={(event) => onChange({ ...form, modelName: event.target.value })} /></label>
						<label className={styles.fieldLabel}>Công suất mỗi giờ (cuộn)<input className={styles.field} type="number" min="1" value={form.capacityPerHour} onChange={(event) => onChange({ ...form, capacityPerHour: event.target.value })} /></label>
					</div>
					{form.machineType === "PROCESSOR" && (
						<fieldset className={styles.fieldset}><legend>Quy trình</legend>
							{processes.map((item) => <label className={styles.scheduleToggle} key={item.id}><input type="checkbox" checked={form.filmProcessIds.includes(item.id)} onChange={(event) => onChange({ ...form, filmProcessIds: toggleId(form.filmProcessIds, item.id, event.target.checked) })} />{item.displayName}</label>)}
						</fieldset>
					)}
					<fieldset className={styles.fieldset}><legend>Khổ phim</legend>
						{formats.map((item) => <label className={styles.scheduleToggle} key={item.id}><input type="checkbox" checked={form.filmFormatIds.includes(item.id)} onChange={(event) => onChange({ ...form, filmFormatIds: toggleId(form.filmFormatIds, item.id, event.target.checked) })} />{item.displayName}</label>)}
					</fieldset>
					<fieldset className={styles.fieldset}><legend>Giờ vận hành</legend>
						{form.workingHours.map((row) => {
							const day = weekdays[row.dayOfWeek - 1];
							return (
								<div className={styles.hoursRow} key={row.dayOfWeek}>
									<label className={styles.scheduleToggle}><input type="checkbox" checked={!row.closed} onChange={(event) => setHour(row.dayOfWeek, { closed: !event.target.checked, opensAt: event.target.checked ? row.opensAt ?? "09:00" : null, closesAt: event.target.checked ? row.closesAt ?? "18:00" : null })} />{day}</label>
									<input className={styles.field} type="time" aria-label={`${day}: giờ mở cửa`} disabled={row.closed} value={row.opensAt ?? ""} onChange={(event) => setHour(row.dayOfWeek, { opensAt: event.target.value })} />
									<input className={styles.field} type="time" aria-label={`${day}: giờ đóng cửa`} disabled={row.closed} value={row.closesAt ?? ""} onChange={(event) => setHour(row.dayOfWeek, { closesAt: event.target.value })} />
								</div>
							);
						})}
					</fieldset>
					{error && <InlineMessage tone="error">{error}</InlineMessage>}
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
						<Button disabled={busy} type="submit">Lưu máy</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
