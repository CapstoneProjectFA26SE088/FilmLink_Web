import { incidentCauseLabel, stepAppliedLabel } from "@/components/shared/status/labels";
import { MachineStatusBadge } from "@/components/shared/status/status-badge";
import { formatDate, type MachineIncident } from "@/lib/lab-owner-api";
import styles from "../lab-owner-pages.module.css";

export function IncidentResultsPanel({ incidents }: { incidents: MachineIncident[] }) {
	return (
		<section className={styles.panel} aria-labelledby="incident-results-title">
			<div className={styles.panelHeader}><div><h2 id="incident-results-title">Sự cố đã báo trong phiên làm việc</h2><p>Số đơn bị ảnh hưởng và thay đổi lịch do hệ thống tính.</p></div></div>
			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<caption className="sr-only">Kết quả các sự cố đã báo</caption>
					<thead><tr><th scope="col">Máy</th><th scope="col">Nguyên nhân</th><th scope="col">Máy sau sự cố</th><th scope="col">Đơn bị ảnh hưởng</th><th scope="col">Thay đổi lịch</th><th scope="col">Khách phản hồi</th></tr></thead>
					<tbody>
						{incidents.flatMap((incident) => {
							const head = (
								<>
									<td>{incident.machineCode}</td>
									<td>{incidentCauseLabel(incident.cause)}</td>
									<td><MachineStatusBadge value={incident.machineStatusAfter} /></td>
									<td>{incident.affectedOrderCount} đơn</td>
								</>
							);
							if (!incident.scheduleChanges.length) {
								return [<tr key={incident.id}>{head}<td colSpan={2}>Không có thay đổi ngày hẹn.</td></tr>];
							}
							return incident.scheduleChanges.map((change) => (
								<tr key={`${incident.id}-${change.id}`}>
									{head}
									<td>
										<strong>Mã thay đổi #{change.id}</strong> · Đơn mã #{change.serviceOrderId} · {stepAppliedLabel(change.stepApplied)}
										<small>Hẹn trả: {formatDate(change.oldPromisedAt)} → {formatDate(change.newPromisedAt)}</small>
									</td>
									<td>{change.requiresResponse ? `Cần phản hồi trước ${formatDate(change.responseDueAt)}` : "Không cần"}</td>
								</tr>
							));
						})}
					</tbody>
				</table>
			</div>
		</section>
	);
}
