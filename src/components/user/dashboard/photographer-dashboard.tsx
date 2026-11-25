"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Camera, CheckCircle2, Clock3, PackageCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserWorkspace } from "../user-workspace";
import { errorMessage, isPhotographerRole, photographerApi, type OrderSummary } from "@/lib/photographer-api";
import { OrderRow } from "../orders/photographer-orders";

const complete = new Set(["CLOSED", "DELIVERED"]);
const inactive = new Set(["CLOSED", "CANCELLED"]);

export function PhotographerDashboard() {
	const router = useRouter();
	const { account, accountLoaded } = useUserWorkspace();
	const [orders, setOrders] = useState<OrderSummary[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const load = useCallback(async () => {
		if (!accountLoaded || !isPhotographerRole(account?.role)) return;
		setLoading(true); setError(null);
		try { const result = await photographerApi.orders({ page: 0, size: 20 }); setOrders(result.content); setTotal(result.totalElements); }
		catch (cause) { setError(errorMessage(cause)); }
		finally { setLoading(false); }
	}, [account?.role, accountLoaded]);
	useEffect(() => { void load(); }, [load]);
	const counts = useMemo(() => ({ active: orders.filter((order) => !inactive.has(order.status)).length, completed: orders.filter((order) => complete.has(order.status)).length }), [orders]);
	const recent = orders.slice(0, 3);
	if (!accountLoaded) return <p>Đang tải tài khoản...</p>;
	if (!isPhotographerRole(account?.role)) return <div className="empty-state"><strong>Khu vực này chỉ dành cho tài khoản Photographer.</strong></div>;
	const firstName = account?.fullName?.trim().split(/\s+/)[0] || "bạn";
	return <div className="user-dashboard-home"><section className="user-dashboard-welcome"><div><p className="eyebrow">KHÔNG GIAN CỦA BẠN · FILMLINK</p><h1>Chào {firstName}, sẵn sàng cho cuộn phim tiếp theo?</h1><p className="welcome-copy">Theo dõi đơn tráng và lưu lại những khoảnh khắc analog của bạn.</p></div><Button onClick={() => router.push("/services")}><Camera /> Đặt dịch vụ</Button></section>
		<section className="dashboard-metrics" aria-label="Tổng quan đơn hàng"><article className="dashboard-metric dashboard-metric--active"><span className="dashboard-metric__icon"><Clock3 /></span><div><small>Đơn đang xử lý (trang gần nhất)</small><strong>{loading ? "…" : counts.active}</strong></div></article><article className="dashboard-metric"><span className="dashboard-metric__icon"><CheckCircle2 /></span><div><small>Đã bàn giao/hoàn tất (trang gần nhất)</small><strong>{loading ? "…" : counts.completed}</strong></div></article><article className="dashboard-metric"><span className="dashboard-metric__icon"><PackageCheck /></span><div><small>Tổng đơn</small><strong>{loading ? "…" : total}</strong></div></article></section>
		<section className="dashboard-order-panel"><div className="dashboard-panel-heading"><div><p className="eyebrow">ĐƠN GẦN ĐÂY</p><h2>Dữ liệu từ FilmLink</h2></div><button className="text-link" onClick={() => router.push("/orders")}>Tất cả đơn hàng</button></div>{error ? <div className="empty-state"><strong>{error}</strong><Button variant="outline" onClick={() => void load()}>Tải lại</Button></div> : recent.length ? <div className="order-list">{recent.map((order) => <OrderRow key={order.id} order={order} />)}</div> : !loading ? <div className="dashboard-empty-order"><PackageCheck /><div><strong>Chưa có đơn hàng</strong><span>Chọn Film Lab và tạo đơn đầu tiên.</span></div><Button variant="outline" onClick={() => router.push("/services")}>Khám phá dịch vụ</Button></div> : <p>Đang tải đơn hàng...</p>}</section>
	</div>;
}
