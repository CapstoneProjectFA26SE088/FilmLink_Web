"use client";
import { orderStatusLabel } from "@/components/shared/status/labels";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { labOwnerApi, STATUS_LABELS, type OrderStatus, type OrderSummary, type PageResponse } from "@/lib/lab-owner-api";
import type { LabOwnerSection } from "../dashboard-data";
import styles from "../lab-owner-dashboard.module.css";
import pageStyles from "../lab-owner-pages.module.css";

export function LabOwnerOverview({ labName, address, query, onQueryChange, onNavigate, onProfile }: { labName: string; address: string; query: string; onQueryChange: (value: string) => void; onNavigate: (section: LabOwnerSection) => void; onProfile: () => void }) {
	const router = useRouter();
	const [data, setData] = useState<PageResponse<OrderSummary> | null>(null); const [status, setStatus] = useState<"" | OrderStatus>(""); const [error, setError] = useState("");
	useEffect(() => {
		const controller = new AbortController();
		void labOwnerApi<PageResponse<OrderSummary>>(`lab/orders?page=0&size=10${status ? `&status=${status}` : ""}`, { signal: controller.signal })
			.then((result) => {
				if (controller.signal.aborted) return;
				setData(result);
				setError("");
			})
			.catch((cause) => {
				if (controller.signal.aborted) return;
				setData(null);
				setError(cause instanceof Error ? cause.message : "Không tải được đơn.");
			});
		return () => controller.abort();
	}, [status]);
	const orders = useMemo(() => (data?.content ?? []).filter((order) => `${order.orderCode} ${order.id}`.toLowerCase().includes(query.trim().toLowerCase())), [data, query]);
	const active = orders.filter((order) => ["AWAITING_LAB_CONFIRMATION", "AWAITING_FILM", "AWAITING_MACHINE_ASSIGNMENT", "IN_PROCESSING", "READY_FOR_HANDOVER"].includes(order.status)).length;
	return <><div className={styles.breadcrumb}><span>FilmLink</span><span>/</span><strong>Bảng điều khiển Film Lab</strong></div><div className={styles.pageHeading}><div><h1>Bảng điều khiển Film Lab</h1><p>{address || `Không gian vận hành ${labName}`}</p></div><Button variant="outline" onClick={onProfile}>Hồ sơ Film Lab</Button></div>{error && <p className={pageStyles.demoNote} role="alert">{error}</p>}
	<section className={styles.metrics}><div><span>Tổng đơn</span><strong>{data?.totalElements ?? 0}</strong></div><div><span>Đang cần xử lý (trang gần nhất)</span><strong>{active}</strong></div><div><span>Đơn hiển thị</span><strong>{orders.length}</strong></div><div><span>Nguồn</span><strong>Backend</strong></div></section>
	<div className={styles.dashboardColumns}><section className={styles.ordersSection}><h2>Đơn dịch vụ gần đây</h2><div className={styles.tableTools}><label className={styles.searchBox}><Search aria-hidden="true" /><Input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Tìm mã hoặc ID…" /></label><label className={styles.statusFilter}><select aria-label="Trạng thái đơn" value={status} onChange={(event) => setStatus(event.target.value as "" | OrderStatus)}><option value="">Tất cả</option>{Object.entries(STATUS_LABELS).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label></div><div className={styles.tableViewport}><table className={styles.ordersTable}><thead><tr><th>Đơn</th><th>Cuộn</th><th>Trạng thái</th><th /></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>{order.orderCode}</td><td>{order.rollCount}</td><td>{orderStatusLabel(order.status)}</td><td><Button variant="outline" size="sm" onClick={() => router.push(`/lab-owner/orders/${order.id}`)}>Xử lý</Button></td></tr>)}{orders.length === 0 && <tr><td colSpan={4} className={styles.emptyResults}>Không có đơn.</td></tr>}</tbody></table></div></section><aside className={styles.rail}><section className={styles.actionsSection}><h2>Tác vụ</h2><div className={styles.actionList}><Button variant="outline" onClick={() => onNavigate("orders")}>Hàng đợi đơn</Button><Button variant="outline" onClick={() => onNavigate("machines")}>Máy & công suất</Button></div></section><section className={styles.revenueSection}><h2>Dữ liệu chưa có API</h2><p className={pageStyles.demoNote}>Backend hiện chưa cung cấp doanh thu, thanh toán hay đối soát production; bảng điều khiển không suy diễn các số liệu này.</p></section></aside></div></>;
}
