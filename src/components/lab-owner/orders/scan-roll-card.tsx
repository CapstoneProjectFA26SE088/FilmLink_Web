"use client";

import type { ChangeEvent } from "react";
import { FilePicker } from "@/components/shared/feedback/file-picker";
import { Button } from "@/components/ui/button";
import { RollStatusBadge } from "@/components/shared/status/status-badge";
import { safeHttpUrl, type FilmRoll, type ScanFile } from "@/lib/lab-owner-api";
import styles from "../lab-owner-pages.module.css";

type Props = {
	roll: FilmRoll;
	filmName: string;
	disabled: boolean;
	busy: boolean;
	selectedCount: number;
	uploaded: ScanFile[] | undefined;
	link: string;
	onPick: (event: ChangeEvent<HTMLInputElement>) => void;
	onUpload: () => void;
	onLinkChange: (value: string) => void;
	onSaveLink: () => void;
};

export function ScanRollCard({ roll, filmName, disabled, busy, selectedCount, uploaded, link, onPick, onUpload, onLinkChange, onSaveLink }: Props) {
	return (
		<section className={styles.panel} aria-labelledby={`scan-roll-${roll.id}`}>
			<div className={styles.panelHeader}>
				<div>
					<h2 id={`scan-roll-${roll.id}`}>Cuộn {roll.rollSequence} · {filmName}</h2>
					<p>{roll.previewScanCount ?? 0}/100 ảnh xem trước đã tải</p>
				</div>
				<RollStatusBadge value={roll.status} />
			</div>
			<div className={styles.detailBody}>
				<label className={styles.fieldLabel}>Ảnh xem trước JPEG (1–40 ảnh, mỗi ảnh tối đa 5 MB, cạnh dài tối đa 2048 px)
					<FilePicker accept="image/jpeg" multiple disabled={disabled} onChange={onPick} />
				</label>
				<Button disabled={busy || selectedCount === 0} onClick={onUpload}>Tải lên {selectedCount} ảnh xem trước</Button>
				{uploaded?.length ? (
					<div className={styles.notice}>
						<span>Đã tải lên:</span>
						{uploaded.map((item) => {
							const url = safeHttpUrl(item.url);
							return url
								? <a className={styles.inlineLink} key={item.id} href={url} target="_blank" rel="noreferrer">Khung {item.frameNumber} ({item.widthPx}×{item.heightPx})</a>
								: <span key={item.id}>Khung {item.frameNumber}</span>;
						})}
					</div>
				) : null}
				<label className={styles.fieldLabel}>Liên kết ảnh gốc (độ phân giải đầy đủ)
					<input className={styles.field} type="url" maxLength={1000} value={link} onChange={(event) => onLinkChange(event.target.value)} />
				</label>
				<Button variant="outline" disabled={busy || disabled} onClick={onSaveLink}>Kiểm tra và lưu liên kết</Button>
			</div>
		</section>
	);
}
