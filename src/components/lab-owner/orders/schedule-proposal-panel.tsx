"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import { StatusBadge } from "@/components/shared/status/status-badge";
import { formatDate, type ScheduleProposal } from "@/lib/lab-owner-api";
import styles from "../lab-owner-pages.module.css";

type Props = {
	proposal: ScheduleProposal;
	busy: boolean;
	laterDate: string;
	onLaterDateChange: (value: string) => void;
	onConfirm: () => void;
	processName: (id: number) => string;
	formatName: (id: number) => string;
};

/** "2026-11-28" -> "28/11/2026" without timezone conversion. */
function workDateLabel(value: string) {
	const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
	return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

export function ScheduleProposalPanel({ proposal, busy, laterDate, onLaterDateChange, onConfirm, processName, formatName }: Props) {
	const allocations = [...proposal.allocations].sort((a, b) => a.workDate.localeCompare(b.workDate));
	const totalRolls = allocations.reduce((sum, item) => sum + item.rollCount, 0);
	return (
		<>
			<div className={styles.detailLine}>
				<span>Kết quả lập lịch</span>
				{proposal.feasible ? <StatusBadge label="Khả thi" tone="success" /> : <StatusBadge label="Không khả thi" tone="danger" />}
			</div>
			{proposal.feasible
				? <InlineMessage tone="success">Có thể trả phim vào {formatDate(proposal.promisedReturnAt)}.</InlineMessage>
				: <InlineMessage tone="error">Chưa thể xếp lịch: {proposal.infeasibleReason || "hệ thống không nêu lý do."} Kiểm tra công suất và giờ vận hành của máy.</InlineMessage>}
			{proposal.tierCommitmentAt && <div className={styles.detailLine}><span>Hạn trả theo gói dịch vụ</span><strong>{formatDate(proposal.tierCommitmentAt)}</strong></div>}
			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<caption className="sr-only">Phân bổ cuộn phim theo ngày</caption>
					<thead><tr><th scope="col">Ngày thực hiện</th><th scope="col">Quy trình</th><th scope="col">Khổ phim</th><th scope="col">Số cuộn</th></tr></thead>
					<tbody>
						{allocations.map((item, index) => (
							<tr key={`${item.workDate}-${item.filmProcessId}-${item.filmFormatId}-${index}`}>
								<td>{workDateLabel(item.workDate)}</td>
								<td>{processName(item.filmProcessId)}</td>
								<td>{formatName(item.filmFormatId)}</td>
								<td>{item.rollCount}</td>
							</tr>
						))}
						{allocations.length === 0 && <tr><td colSpan={4} className={styles.empty}>Chưa có phân bổ theo ngày.</td></tr>}
					</tbody>
					{allocations.length > 0 && <tfoot><tr><th scope="row" colSpan={3}>Tổng số cuộn</th><td>{totalRolls}</td></tr></tfoot>}
				</table>
			</div>
			<label className={styles.fieldLabel}>Chọn ngày trả muộn hơn (tùy chọn)
				<input className={styles.field} type="datetime-local" value={laterDate} onChange={(event) => onLaterDateChange(event.target.value)} />
			</label>
			<div className={styles.tableActions}>
				<Button disabled={busy || !proposal.feasible} onClick={onConfirm}>Xác nhận lịch máy</Button>
				<Link className={buttonVariants({ variant: "outline" })} href="/lab-owner/machines">Xem công suất máy</Link>
			</div>
		</>
	);
}
