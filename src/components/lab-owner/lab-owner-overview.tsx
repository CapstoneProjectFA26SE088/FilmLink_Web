"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { labOwnerOrders, labOwnerServices, type LabOwnerOrder, type LabOwnerSection } from "./dashboard-data";
import styles from "./lab-owner-dashboard.module.css";

const statuses = ["Tất cả", "Đang xử lý", "Chờ tiếp nhận", "Hoàn tất", "Đã hủy"] as const;
const statusClassName: Record<LabOwnerOrder["status"], string> = {
	"Đang xử lý": styles.statusProcessing,
	"Chờ tiếp nhận": styles.statusWaiting,
	"Hoàn tất": styles.statusComplete,
	"Đã hủy": styles.statusCancelled,
};

export function LabOwnerOverview({
	labName,
	address,
	query,
	onQueryChange,
	onNavigate,
}: {
	labName: string;
	address: string;
	query: string;
	onQueryChange: (value: string) => void;
	onNavigate: (section: LabOwnerSection) => void;
}) {
	const [status, setStatus] = useState<(typeof statuses)[number]>("Tất cả");
	const [selectedOrder, setSelectedOrder] = useState<LabOwnerOrder | null>(null);
	useEffect(() => {
		if (!selectedOrder) return;
		function closeOnEscape(event: KeyboardEvent) {
			if (event.key === "Escape") setSelectedOrder(null);
		}
		window.addEventListener("keydown", closeOnEscape);
		return () => window.removeEventListener("keydown", closeOnEscape);
	}, [selectedOrder]);
	const orders = useMemo(() => labOwnerOrders.filter((order) => {
		const matchesQuery = `${order.id} ${order.film}`.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi"));
		return matchesQuery && (status === "Tất cả" || order.status === status);
	}), [query, status]);

	return (
		<>
			<div className={styles.breadcrumb}>
				<span>FilmLink</span><span aria-hidden="true">/</span><span>Hồ sơ lab</span><span aria-hidden="true">/</span><strong>Bảng điều khiển Film Lab</strong>
			</div>
			<div className={styles.pageHeading}>
				<div>
					<h1>Bảng điều khiển Film Lab</h1>
					<p>{address || `Không gian vận hành ${labName}`}</p>
				</div>
				<Button variant="outline" type="button" onClick={() => onNavigate("overview")}>Quay lại</Button>
			</div>

			<section className={styles.metrics} aria-label="Tóm tắt hoạt động">
				<div><span>Đơn dịch vụ</span><strong>4</strong></div>
				<div><span>Đang xử lý</span><strong>1</strong></div>
				<div><span>Đã thu</span><strong>320.000đ</strong></div>
				<div><span>Hồ sơ chờ duyệt</span><strong>1</strong></div>
			</section>

			<div className={styles.dashboardColumns}>
				<section className={styles.ordersSection} aria-labelledby="recent-orders-title">
					<h2 id="recent-orders-title">Đơn dịch vụ gần đây</h2>
					<div className={styles.tableTools}>
						<label className={styles.searchBox}>
							<Search aria-hidden="true" />
							<span className={styles.visuallyHidden}>Tìm trong danh sách</span>
							<Input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Tìm trong danh sách..." />
						</label>
						<label className={styles.statusFilter}>
							<span className={styles.visuallyHidden}>Lọc trạng thái</span>
							<select value={status} onChange={(event) => setStatus(event.target.value as (typeof statuses)[number])}>
								{statuses.map((item) => <option key={item}>{item}</option>)}
							</select>
						</label>
					</div>

					<div className={styles.tableViewport}>
						<table className={styles.ordersTable}>
							<thead><tr><th>Đơn</th><th>Film</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
							<tbody>
								{orders.map((order) => (
									<tr key={order.id}>
										<td>{order.id}</td><td>{order.film}</td><td><span className={`${styles.status} ${statusClassName[order.status]}`}>{order.status}</span></td>
										<td><Button variant="outline" size="sm" type="button" onClick={() => setSelectedOrder(order)}>Xử lý đơn</Button></td>
									</tr>
								))}
								{orders.length === 0 && <tr><td colSpan={4} className={styles.emptyResults}>Không tìm thấy đơn phù hợp.</td></tr>}
							</tbody>
						</table>
					</div>
					<div className={styles.tableFooter}><span>{orders.length} kết quả</span><div><Button variant="outline" size="sm" disabled>Trước</Button><span>Trang 1 / 1</span><Button variant="outline" size="sm" disabled>Sau</Button></div></div>
				</section>

				<aside className={styles.rail}>
					<section className={styles.actionsSection} aria-labelledby="today-actions-title">
						<h2 id="today-actions-title">Tác vụ hôm nay</h2>
						<div className={styles.actionList}>
							<Button variant="outline" onClick={() => onNavigate("orders")}>Đơn cần tiếp nhận</Button>
							<Button variant="outline" onClick={() => onNavigate("machines")}>Lịch máy và công suất</Button>
							<Button variant="outline" onClick={() => onNavigate("settlements")}>Đối soát công nợ</Button>
							<Button variant="outline" onClick={() => onNavigate("consignments")}>Hàng ký gửi</Button>
						</div>
					</section>
					<section className={styles.revenueSection} aria-labelledby="service-revenue-title">
						<h2 id="service-revenue-title">Doanh thu theo dịch vụ</h2>
						{labOwnerServices.map((service) => (
							<div className={styles.revenueItem} key={service.name}>
								<div><span>{service.name}</span><strong>{service.revenue.toLocaleString("vi-VN")}đ</strong></div>
								<div className={styles.progressTrack} role="meter" aria-label={`Doanh thu ${service.name}`} aria-valuenow={service.share} aria-valuemin={0} aria-valuemax={100}>
									<span style={{ width: `${service.share}%` }} />
								</div>
							</div>
						))}
					</section>
				</aside>
			</div>

			{selectedOrder && (
				<div className={styles.dialogScrim} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedOrder(null); }}>
					<section className={styles.orderDialog} role="dialog" aria-modal="true" aria-labelledby="order-dialog-title">
						<button className={styles.dialogClose} type="button" aria-label="Đóng chi tiết đơn" onClick={() => setSelectedOrder(null)}><X aria-hidden="true" /></button>
						<p className={styles.dialogEyebrow}>Đơn dịch vụ</p>
						<h2 id="order-dialog-title">{selectedOrder.id}</h2>
						<dl><div><dt>Film</dt><dd>{selectedOrder.film}</dd></div><div><dt>Trạng thái</dt><dd>{selectedOrder.status}</dd></div></dl>
						<p className={styles.dialogNote}>Thông tin minh hoạ từ prototype. Dữ liệu đơn hàng sẽ được nạp từ API khi backend cung cấp endpoint cho Film Lab.</p>
						<Button variant="outline" type="button" onClick={() => setSelectedOrder(null)}>Đóng</Button>
					</section>
				</div>
			)}
		</>
	);
}
