"use client";

import { Button } from "@/components/ui/button";
import styles from "../lab-owner-pages.module.css";

export type SchedulingSettings = { qc: string; cap: string; commitment: string };

type Props = {
	settings: SchedulingSettings;
	onChange: (settings: SchedulingSettings) => void;
	busy: boolean;
	onSave: () => void;
};

export function SchedulingSettingsPanel({ settings, onChange, busy, onSave }: Props) {
	return (
		<section className={styles.panel} aria-labelledby="scheduling-settings-title">
			<div className={styles.panelHeader}><div><h2 id="scheduling-settings-title">Tham số lập lịch</h2><p>Hệ thống chưa hiển thị cam kết Express đang áp dụng, vui lòng chọn lại trước khi lưu.</p></div></div>
			<div className={styles.detailBody}>
				<div className={styles.fieldGrid}>
					<label className={styles.fieldLabel}>Giờ đệm kiểm tra chất lượng (0–48 giờ)<input className={styles.field} type="number" min="0" max="48" value={settings.qc} onChange={(event) => onChange({ ...settings, qc: event.target.value })} /></label>
					<label className={styles.fieldLabel}>Giới hạn đơn Express mỗi ngày (%)<input className={styles.field} type="number" min="1" max="100" value={settings.cap} onChange={(event) => onChange({ ...settings, cap: event.target.value })} placeholder="Không giới hạn" /></label>
					<label className={styles.fieldLabel}>Cam kết thời gian Express
						<select className={styles.select} value={settings.commitment} onChange={(event) => onChange({ ...settings, commitment: event.target.value })}>
							<option value="unselected">Chọn cam kết…</option>
							<option value="1">1 ngày làm việc</option>
							<option value="2">2 ngày làm việc</option>
							<option value="none">Không cấu hình</option>
						</select>
					</label>
				</div>
				<div><Button disabled={busy} onClick={onSave}>Lưu tham số</Button></div>
			</div>
		</section>
	);
}
