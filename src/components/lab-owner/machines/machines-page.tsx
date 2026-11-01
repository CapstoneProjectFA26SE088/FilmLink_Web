"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { demoMachines } from "../data/fixtures";
import styles from "../lab-owner-pages.module.css";

const days = ["01/11", "02/11", "03/11", "04/11", "05/11", "06/11", "07/11"];

export function MachinesPage() {
	const [machines, setMachines] = useState(demoMachines);
	const [query, setQuery] = useState("");
	const [reportOpen, setReportOpen] = useState(false);
	const [machineId, setMachineId] = useState(demoMachines[0].id);
	const [cause, setCause] = useState("");
	const [repairDate, setRepairDate] = useState("");
	const [faults, setFaults] = useState<{ id: string; machine: string; cause: string; repairDate: string; status: string }[]>([]);
	const active = machines.filter((machine) => machine.status === "Hoạt động").length;
	const filtered = useMemo(() => machines.filter((machine) => `${machine.name} ${machine.type} ${machine.process}`.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi"))), [machines, query]);

	function reportFault(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const machine = machines.find((item) => item.id === machineId);
		if (!machine) return;
		setMachines((items) => items.map((item) => item.id === machineId ? { ...item, status: "Tạm dừng" } : item));
		setFaults((items) => [{ id: `SC-${items.length + 1}`, machine: machine.name, cause: cause.trim(), repairDate, status: "Đang xử lý" }, ...items]);
		setCause("");
		setRepairDate("");
		setReportOpen(false);
	}

	return <div className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>Công suất phòng lab</p><h1>Máy & lịch xử lý</h1><p>Chủ động phân bổ công suất để dự kiến ngày trả chính xác.</p></div><div className={styles.tableActions}><Button variant="outline" onClick={() => setReportOpen(true)}>Báo sự cố máy</Button><Button onClick={() => setMachines((items) => [...items, { id: `MC-0${items.length + 1}`, name: "Máy mới", type: "Máy scan", capacity: 12, process: "C41", status: "Hoạt động" }])}>Thêm máy</Button></div></header>
		<p className={styles.demoNote}>Lịch và công suất mẫu theo prototype. Báo sự cố ở đây chỉ thay đổi trạng thái demo, chưa gửi thông báo tới khách.</p>
		<section className={styles.stats}><div className={styles.stat}><span>Tổng số máy</span><strong>{machines.length}</strong></div><div className={styles.stat}><span>Đang hoạt động</span><strong>{active}</strong></div><div className={styles.stat}><span>Ngày có lịch gần nhất</span><strong>01/11</strong></div><div className={styles.stat}><span>Cuộn được xếp hôm nay</span><strong>2 / 40</strong></div></section>
		<section className={styles.panel}><div className={styles.panelHeader}><div><h2>Công suất theo ngày</h2><p>Số cuộn đã được phân bổ trên tổng công suất thiết bị.</p></div></div><div className={styles.tableWrap}><div className={styles.calendarGrid}><div className={`${styles.calendarCell} ${styles.calendarHead}`}>Máy / công suất</div>{days.map((day) => <div className={`${styles.calendarCell} ${styles.calendarHead}`} key={day}>{day}/2026</div>)}{machines.map((machine) => <Fragment key={machine.id}><div className={styles.calendarCell}>{machine.name}<small style={{ marginLeft: 6, color: "var(--text-muted)" }}>{machine.capacity} cuộn/ngày</small></div>{days.map((day, index) => { const assigned = machine.status === "Hoạt động" && index === 0 ? 2 : 0; const value = machine.type === "Máy tráng" ? assigned : Math.min(assigned, machine.capacity); return <div className={styles.calendarCell} key={`${machine.id}-${day}`}><div className={styles.capacity}><small>{value}/{machine.capacity} cuộn</small><div className={styles.progress}><span style={{ width: `${Math.min(value / machine.capacity * 100, 100)}%` }} /></div></div></div>; })}</Fragment>)}</div></div></section>
		<section className={styles.panel}><div className={styles.panelHeader}><div><h2>Thiết bị xử lý</h2><p>Danh sách máy, loại thiết bị và quy trình tương thích.</p></div></div><div className={styles.tools}><input className={styles.search} aria-label="Tìm máy" placeholder="Tìm theo tên máy, loại hoặc quy trình" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Thiết bị</th><th>Loại máy</th><th>Công suất</th><th>Quy trình</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{filtered.map((machine) => <tr key={machine.id}><td>{machine.name}<small>{machine.id}</small></td><td>{machine.type}</td><td>{machine.capacity} cuộn/ngày</td><td>{machine.process}</td><td><span className={`${styles.badge} ${machine.status === "Hoạt động" ? styles.badgeSuccess : styles.badgeWarning}`}>{machine.status}</span></td><td><Button size="sm" variant="outline" onClick={() => setMachines((items) => items.map((item) => item.id === machine.id ? { ...item, status: item.status === "Hoạt động" ? "Tạm dừng" : "Hoạt động" } : item))}>{machine.status === "Hoạt động" ? "Tạm dừng" : "Bật lại"}</Button></td></tr>)}</tbody></table></div></section>
		<section className={styles.panel}><div className={styles.panelHeader}><div><h2>Sự cố đã ghi nhận</h2><p>Máy tạm dừng sẽ không được tính vào công suất sẵn sàng.</p></div></div>{faults.length ? <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Máy</th><th>Nguyên nhân</th><th>Dự kiến khắc phục</th><th>Trạng thái</th></tr></thead><tbody>{faults.map((fault) => <tr key={fault.id}><td>{fault.machine}</td><td>{fault.cause}</td><td>{fault.repairDate}</td><td><span className={`${styles.badge} ${styles.badgeWarning}`}>{fault.status}</span></td></tr>)}</tbody></table></div> : <p className={styles.empty}>Chưa có sự cố được ghi nhận.</p>}</section>
		{reportOpen && <div className={styles.overlay} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setReportOpen(false); }}><form className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="fault-title" onSubmit={reportFault}><div><p className={styles.eyebrow}>Bảo trì thiết bị</p><h2 id="fault-title">Ghi nhận sự cố máy</h2><p>Thông tin demo giúp lab rà lại công suất và ngày trả bị ảnh hưởng.</p></div><label className={styles.fieldLabel}>Máy gặp sự cố<select className={styles.field} value={machineId} onChange={(event) => setMachineId(event.target.value)}>{machines.map((machine) => <option key={machine.id} value={machine.id}>{machine.name}</option>)}</select></label><label className={styles.fieldLabel}>Nguyên nhân<input className={styles.field} required value={cause} onChange={(event) => setCause(event.target.value)} placeholder="Mô tả lỗi hoặc bộ phận cần kiểm tra" /></label><label className={styles.fieldLabel}>Dự kiến khắc phục<input className={styles.field} type="date" required value={repairDate} onChange={(event) => setRepairDate(event.target.value)} /></label><div className={styles.dialogActions}><Button type="button" variant="outline" onClick={() => setReportOpen(false)}>Hủy</Button><Button type="submit">Ghi nhận sự cố</Button></div></form></div>}
	</div>;
}
