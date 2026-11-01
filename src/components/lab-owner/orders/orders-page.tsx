"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { demoOrders, formatVnd, type ServiceOrder } from "../data/fixtures";
import styles from "../lab-owner-pages.module.css";

const statusOptions = ["Tất cả", "Chờ tiếp nhận", "Đang xử lý", "Chờ bàn giao", "Hoàn tất", "Đã hủy"];

function getBadgeClass(status: ServiceOrder["status"]) {
	if (status === "Hoàn tất") return styles.badgeSuccess;
	if (status === "Chờ tiếp nhận") return styles.badgeWarning;
	if (status === "Đã hủy") return styles.badgeDanger;
	return styles.badge;
}

export function OrdersPage() {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState("Tất cả");
	const filtered = useMemo(() => demoOrders.filter((order) => {
		const matchesQuery = `${order.id} ${order.customer} ${order.film}`
			.toLocaleLowerCase("vi")
			.includes(query.trim().toLocaleLowerCase("vi"));
		return matchesQuery && (status === "Tất cả" || order.status === status);
	}), [query, status]);
	const activeCount = demoOrders.filter((order) => !["Hoàn tất", "Đã hủy"].includes(order.status)).length;

	return (
		<div className={styles.page}>
			<header className={styles.heading}>
				<div>
					<p className={styles.eyebrow}>Vận hành Film Lab</p>
					<h1>Hàng đợi đơn</h1>
					<p>Theo dõi phim cần nhận, đang tráng và chờ bàn giao.</p>
				</div>
			</header>
			<p className={styles.demoNote}>
				Dữ liệu đơn hiện là mẫu từ prototype. Thay đổi trạng thái chỉ lưu trong phiên trình duyệt.
			</p>

			<section className={styles.stats} aria-label="Tóm tắt hàng đợi">
				<div className={styles.stat}><span>Tổng đơn mẫu</span><strong>{demoOrders.length}</strong></div>
				<div className={styles.stat}><span>Đang xử lý</span><strong>{activeCount}</strong></div>
				<div className={styles.stat}><span>Chờ tiếp nhận</span><strong>{demoOrders.filter((order) => order.status === "Chờ tiếp nhận").length}</strong></div>
				<div className={styles.stat}><span>Chờ bàn giao</span><strong>{demoOrders.filter((order) => order.status === "Chờ bàn giao").length}</strong></div>
			</section>

			<section className={styles.panel} aria-labelledby="orders-title">
				<div className={styles.panelHeader}>
					<div><h2 id="orders-title">Đơn dịch vụ tại lab</h2><p>{filtered.length} đơn phù hợp</p></div>
				</div>
				<div className={styles.tools}>
					<input
						className={styles.search}
						aria-label="Tìm đơn"
						placeholder="Tìm mã đơn, khách hoặc loại phim"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
					/>
					<select className={styles.select} aria-label="Lọc trạng thái" value={status} onChange={(event) => setStatus(event.target.value)}>
						{statusOptions.map((item) => <option key={item}>{item}</option>)}
					</select>
				</div>
				<div className={styles.tableWrap}>
					<table className={styles.table}>
						<thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Film / quy trình</th><th>Cuộn</th><th>Trạng thái</th><th>Tổng tiền</th><th>Ngày trả</th><th /></tr></thead>
						<tbody>
							{filtered.map((order) => (
								<tr key={order.id}>
									<td>{order.id}</td>
									<td>{order.customer}<small>{order.email}</small></td>
									<td>{order.film}<small>{order.process} · {order.format}</small></td>
									<td>{order.rolls}</td>
									<td><span className={`${styles.badge} ${getBadgeClass(order.status)}`}>{order.status}</span></td>
									<td>{formatVnd(order.total)}</td>
									<td>{order.dueDate}</td>
									<td><Button size="sm" variant="outline" onClick={() => router.push(`/lab-owner/orders/${order.id}`)}>Chi tiết</Button></td>
								</tr>
							))}
							{filtered.length === 0 && <tr><td colSpan={8} className={styles.empty}>Không có đơn phù hợp.</td></tr>}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
