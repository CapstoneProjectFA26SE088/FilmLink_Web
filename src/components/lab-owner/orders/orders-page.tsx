"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { StatePanel } from "@/components/shared/feedback/state-panel";
import { OrderStatusBadge } from "@/components/shared/status/status-badge";
import { serviceTierLabel } from "@/components/shared/status/labels";
import { formatDate, formatMoney, labOwnerApi, STATUS_LABELS, type OrderStatus, type OrderSummary, type PageResponse } from "@/lib/lab-owner-api";
import styles from "../lab-owner-pages.module.css";

const NEEDS_ACTION: OrderStatus[] = ["AWAITING_LAB_CONFIRMATION", "AWAITING_FILM", "AWAITING_MACHINE_ASSIGNMENT"];
const countOf = (orders: OrderSummary[], statuses: OrderStatus[]) => orders.filter((order) => statuses.includes(order.status)).length;

export function OrdersPage() {
	const [data, setData] = useState<PageResponse<OrderSummary> | null>(null);
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState<"" | OrderStatus>("");
	const [page, setPage] = useState(0);
	const [reload, setReload] = useState(0);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	const refresh = useCallback(() => {
		setError("");
		setLoading(true);
		setReload((value) => value + 1);
	}, []);

	useEffect(() => {
		function refreshOnReturn() {
			if (document.visibilityState === "visible") refresh();
		}
		document.addEventListener("visibilitychange", refreshOnReturn);
		return () => document.removeEventListener("visibilitychange", refreshOnReturn);
	}, [refresh]);

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
	const loaded = data?.content ?? [];
	const orders = loaded.filter((order) => order.orderCode.toLowerCase().includes(search));
	const hasStats = !loading && !error && data !== null;
	const stat = (value: number) => (hasStats ? value : "—");

	function goToPage(nextPage: number) {
		setError("");
		setLoading(true);
		setPage(nextPage);
	}

	return (
		<div className={styles.page}>
			<header className={styles.heading}>
				<div><p className={styles.eyebrow}>Vận hành Film Lab</p><h1>Hàng đợi đơn</h1><p>Theo dõi và xử lý các đơn dịch vụ của lab.</p></div>
			</header>
			<section className={styles.stats} aria-label="Thống kê đơn trên trang này">
				<div className={styles.stat}><span>Cần lab xử lý (trên trang này)</span><strong>{stat(countOf(loaded, NEEDS_ACTION))}</strong></div>
				<div className={styles.stat}><span>Đang xử lý (trên trang này)</span><strong>{stat(countOf(loaded, ["IN_PROCESSING"]))}</strong></div>
				<div className={styles.stat}><span>Chờ bàn giao (trên trang này)</span><strong>{stat(countOf(loaded, ["READY_FOR_HANDOVER"]))}</strong></div>
				<div className={styles.stat}><span>Tổng số đơn theo bộ lọc</span><strong>{hasStats ? data.totalElements : "—"}</strong></div>
			</section>
			<section className={styles.panel} aria-busy={loading}>
				<div className={styles.panelHeader}>
					<div><h2>Đơn dịch vụ tại lab</h2><p>{loading ? "Đang tải đơn…" : error ? "Chưa tải được danh sách" : `${orders.length} đơn hiển thị · trang ${page + 1}/${Math.max(data?.totalPages ?? 1, 1)}`}</p></div>
					<Button type="button" variant="outline" disabled={loading} onClick={refresh}>Làm mới danh sách</Button>
				</div>
				<div className={styles.tools}>
					<input className={styles.search} type="search" aria-label="Tìm theo mã đơn trong trang này" placeholder="Tìm theo mã đơn trong trang này" value={query} onChange={(event) => setQuery(event.target.value)} />
					<select className={styles.select} aria-label="Lọc theo trạng thái đơn" value={status} onChange={(event) => {
						setStatus(event.target.value as "" | OrderStatus);
						goToPage(0);
					}}>
						<option value="">Tất cả trạng thái</option>
						{Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
					</select>
				</div>
				<div className={styles.detailBody}>
					{loading && <StatePanel variant="loading" rows={5} label="Đang tải danh sách đơn…" />}
					{!loading && error && <StatePanel variant="error" title="Không tải được danh sách đơn" description={error} onRetry={refresh} />}
					{!loading && !error && orders.length === 0 && (
						<StatePanel
							variant="empty"
							title={loaded.length === 0 ? (status ? "Không có đơn ở trạng thái này" : "Chưa có đơn nào") : "Không có đơn khớp mã đã nhập"}
							description={loaded.length === 0 ? "Đơn mới của khách sẽ xuất hiện tại đây." : "Thử xóa từ khóa hoặc chuyển sang trang khác."}
							action={query ? <Button type="button" variant="outline" onClick={() => setQuery("")}>Xóa từ khóa</Button> : undefined}
						/>
					)}
				</div>
				{!loading && !error && orders.length > 0 && (
					<div className={styles.tableWrap}>
						<table className={styles.table}>
							<caption className="sr-only">Danh sách đơn dịch vụ của lab</caption>
							<thead><tr><th scope="col">Mã đơn</th><th scope="col">Gói dịch vụ</th><th scope="col">Số cuộn</th><th scope="col">Trạng thái</th><th scope="col">Tạm tính</th><th scope="col">Ngày dự kiến trả</th><th scope="col"><span className="sr-only">Thao tác</span></th></tr></thead>
							<tbody>
								{orders.map((order) => (
									<tr key={order.id}>
										<td>{order.orderCode}</td>
										<td>{serviceTierLabel(order.serviceTier)}</td>
										<td>{order.rollCount}</td>
										<td><OrderStatusBadge value={order.status} /></td>
										<td>{formatMoney(order.estimatedTotalVnd)}</td>
										<td>{formatDate(order.expectedReturnAt)}</td>
										<td><Link className={buttonVariants({ size: "sm", variant: "outline" })} href={`/lab-owner/orders/${order.id}`} aria-label={`Xem chi tiết đơn ${order.orderCode}`}>Chi tiết</Link></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				<nav className={styles.tools} aria-label="Phân trang đơn">
					<Button variant="outline" disabled={loading || page === 0} onClick={() => goToPage(page - 1)}>Trang trước</Button>
					<Button variant="outline" disabled={loading || !data?.hasNext} onClick={() => goToPage(page + 1)}>Trang sau</Button>
				</nav>
			</section>
		</div>
	);
}
