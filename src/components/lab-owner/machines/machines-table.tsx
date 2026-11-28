"use client";

import { Button } from "@/components/ui/button";
import { machineTypeLabel } from "@/components/shared/status/labels";
import { MachineStatusBadge } from "@/components/shared/status/status-badge";
import type { CatalogOption, Machine, MachineIncident } from "@/lib/lab-owner-api";
import styles from "../lab-owner-pages.module.css";

type Props = {
	machines: Machine[];
	processes: CatalogOption[];
	formats: CatalogOption[];
	incidents: Record<number, MachineIncident>;
	busy: boolean;
	onEdit: (machine: Machine) => void;
	onReport: (machineId: number) => void;
	onResolve: (machineId: number) => void;
};

const namesOf = (ids: number[], catalog: CatalogOption[]) => ids.length ? ids.map((id) => catalog.find((item) => item.id === id)?.displayName ?? `Mã #${id}`).join(", ") : "—";

export function MachinesTable({ machines, processes, formats, incidents, busy, onEdit, onReport, onResolve }: Props) {
	return (
		<div className={styles.tableWrap}>
			<table className={styles.table}>
				<caption className="sr-only">Danh sách máy của lab</caption>
				<thead><tr><th scope="col">Máy</th><th scope="col">Loại</th><th scope="col">Công suất</th><th scope="col">Quy trình</th><th scope="col">Khổ phim</th><th scope="col">Trạng thái</th><th scope="col"><span className="sr-only">Thao tác</span></th></tr></thead>
				<tbody>
					{machines.map((machine) => {
						const open = incidents[machine.id];
						return (
							<tr key={machine.id}>
								<td>{machine.machineCode}<small>{machine.modelName || "—"}</small></td>
								<td>{machineTypeLabel(machine.machineType)}</td>
								<td>{machine.capacityPerHour} cuộn/giờ<small>{machine.dailyCapacityRolls} cuộn/ngày</small></td>
								<td>{machine.machineType === "SCANNER" ? "Không áp dụng" : namesOf(machine.filmProcessIds, processes)}</td>
								<td>{namesOf(machine.filmFormatIds, formats)}</td>
								<td><MachineStatusBadge value={machine.status} /></td>
								<td>
									<div className={styles.tableActions}>
										<Button size="sm" variant="outline" onClick={() => onEdit(machine)} aria-label={`Sửa máy ${machine.machineCode}`}>Sửa</Button>
										<Button size="sm" variant="outline" onClick={() => onReport(machine.id)} aria-label={`Báo sự cố máy ${machine.machineCode}`}>Báo sự cố</Button>
										{open && !open.resolvedAt && <Button size="sm" disabled={busy} onClick={() => onResolve(machine.id)} aria-label={`Giải quyết sự cố máy ${machine.machineCode}`}>Giải quyết sự cố</Button>}
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
