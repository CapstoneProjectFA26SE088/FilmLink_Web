"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatDate, formatMoney, labOwnerApi, STATUS_LABELS, type OrderStatus, type OrderSummary, type PageResponse } from "@/lib/lab-owner-api";
import styles from "../lab-owner-pages.module.css";

export function OrdersPage() {
	const [data, setData] = useState<PageResponse<OrderSummary> | null>(null);
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState<"" | OrderStatus>("");
	const [page, setPage] = useState(0);
	const [reload, setReload] = useState(0);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const controller = new AbortController();
		const params = new URLSearchParams({ page: String(page), size: "20" });
		if (status) params.set("status", status);
		void labOwnerApi<PageResponse<OrderSummary>>(`lab/orders?${params}`, { signal: controller.signal })
			.then((result) => {
				if (!controller.signal.aborted) setData(result);
			})
			.catch((cause: unknown) => {
				if (controller.signal.aborted) return;
				setData(null);
				setError(cause instanceof Error ? cause.message : "Không tải được đơn.");
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});
		return () => controller.abort();
	}, [page, status, reload]);

	const search = query.trim().toLowerCase();
	const orders = (data?.content ?? []).filter((order) =>
		`${order.orderCode} ${order.id}`.toLowerCase().includes(search)
	);

	function goToPage(nextPage: number) {
		setError("");
		setLoading(true);
		setPage(nextPage);
	}

	return (
		<div className={styles.page}>
			<header className={styles.heading}>
				<div><p className={styles.eyebrow}>Vận hành Film Lab</p><h1>Hàng đợi đơn</h1><p>Theo dõi các đơn dịch vụ của lab.</p></div>
			</header>
			<section className={styles.stats}>
				<div className={styles.stat}><span>Tổng kết quả</span><strong>{!loading ? data?.totalElements ?? "—" : "—"}</strong></div>
				<div className={styles.stat}><span>Trang hiện tại</span><strong>{page + 1}</strong></div>
				<div className={styles.stat}><span>Số trang</span><strong>{!loading ? data?.totalPages ?? "—" : "—"}</strong></div>
			</section>
			<section className={styles.panel} aria-busy={loading}>
				<div className={styles.panelHeader}>
					<div><h2>Đơn dịch vụ tại lab</h2><p>{loading ? "Đang tải đơn…" : `${orders.length} đơn trên trang`}</p></div>
				</div>
				<div className={styles.tools}>
					<input className={styles.search} aria-label="Tìm đơn" placeholder="Tìm mã hoặc ID trong trang" value={query} onChange={(event) => setQuery(event.target.value)} />
					<select className={styles.select} aria-label="Trạng thái đơn" value={status} onChange={(event) => {
						setStatus(event.target.value as "" | OrderStatus);
						goToPage(0);
					}}>
						<option value="">Tất cả</option>
						{Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
					</select>
				</div>
				{error && (
					<div className={styles.detailBody}>
						<p role="alert">{error}</p>
						<Button variant="outline" onClick={() => {
							setError("");
							setLoading(true);
							setReload((value) => value + 1);
						}}>Thử lại</Button>
					</div>
				)}
				{!loading && !error && (
					<div className={styles.tableWrap}>
						<table className={styles.table}>
							<thead><tr><th>Mã đơn</th><th>Hạng dịch vụ</th><th>Cuộn</th><th>Trạng thái</th><th>Tạm tính</th><th>Ngày dự kiến</th><th><span className="sr-only">Thao tác</span></th></tr></thead>
							<tbody>
								{orders.map((order) => {
									const badge = order.status === "CANCELLED" ? styles.badgeDanger : order.status === "DELIVERED" || order.status === "CLOSED" ? styles.badgeSuccess : styles.badgeWarning;
									return (
										<tr key={order.id}>
											<td>{order.orderCode}<small>ID {order.id}</small></td>
											<td>{order.serviceTier}</td>
											<td>{order.rollCount}</td>
											<td><span className={`${styles.badge} ${badge}`}>{STATUS_LABELS[order.status] ?? order.status}</span></td>
											<td>{formatMoney(order.estimatedTotalVnd)}</td>
											<td>{formatDate(order.expectedReturnAt)}</td>
											<td><Link className={buttonVariants({ size: "sm", variant: "outline" })} href={`/lab-owner/orders/${order.id}`}>Chi tiết</Link></td>
										</tr>
									);
								})}
								{orders.length === 0 && <tr><td colSpan={7} className={styles.empty}>Không có đơn phù hợp.</td></tr>}
							</tbody>
						</table>
					</div>
				)}
				<nav className={styles.tools} aria-label="Phân trang đơn">
					<Button variant="outline" disabled={loading || page === 0} onClick={() => goToPage(page - 1)}>Trước</Button>
					<Button variant="outline" disabled={loading || !data?.hasNext} onClick={() => goToPage(page + 1)}>Sau</Button>
				</nav>
			</section>
		</div>
	);
}
