"use client";

import { useState } from "react";
import { ChevronRight, Clock3, Film } from "lucide-react";
import { orders as sampleOrders, type ServiceOrder } from "@/components/shared/model";
import { OrderDetail } from "./order-detail";

export function OrdersSection({ orders = sampleOrders }: { orders?: ServiceOrder[] }) {
	const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

	if (selectedOrder) {
		return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
	}

	return (
		<section className="subpage-section">
			<p className="eyebrow">HÀNH TRÌNH CUỘN PHIM</p>
			<div className="subpage-title-row">
				<div>
					<h1>Đơn hàng của bạn</h1>
					<p>Mỗi cuộn phim đang trên đường trở thành kỷ niệm.</p>
				</div>
				<span className="service-total">{orders.length} đơn hàng</span>
			</div>
			<div className="order-list order-list--page">
				{orders.length ? orders.map((order) => (
					<OrderRow key={order.id} order={order} onSelect={() => setSelectedOrder(order)} />
				)) : <p className="order-list-empty">Bạn chưa có đơn hàng nào.</p>}
			</div>
			<div className="order-note">
				<Clock3 aria-hidden="true" />
				<p>
					<strong>Mẹo nhỏ</strong>
					<br />
					Thời gian tráng có thể thay đổi tùy loại phim và lịch làm việc của
					lab.
				</p>
			</div>
		</section>
	);
}

export function OrderRow({ order, onSelect }: { order: ServiceOrder; onSelect?: () => void }) {
	const content = (
		<>
			<div className="order-row__icon">
				<Film aria-hidden="true" />
			</div>
			<div className="order-row__details">
				<div className="order-row__title">
					<strong>{order.service}</strong>
					<span
						className={`order-status${order.progress === 100 ? " order-status--done" : order.state === "Đã hủy" ? " order-status--cancelled" : ""}`}
					>
						<span />
						{order.state}
					</span>
				</div>
				<div className="order-meta">
					<span>Mã đơn {order.id}</span>
					<span>{order.film} · {order.rollCount} cuộn</span>
					<span>{order.lab}</span>
					<span>Trả dự kiến {order.dueDate}</span>
					<span>{order.total.toLocaleString("vi-VN")}đ</span>
				</div>
				{order.progress > 0 && order.progress < 100 && (
					<div className="progress-track" aria-label={`Tiến độ ${order.progress}%`}>
						<span style={{ width: `${order.progress}%` }} />
					</div>
				)}
			</div>
			<ChevronRight aria-hidden="true" className="order-row__chevron" />
		</>
	);

	if (onSelect) {
		return <button type="button" className="order-row order-row--interactive" onClick={onSelect} aria-label={`Xem chi tiết đơn ${order.id}`}>
			{content}
		</button>;
	}

	return <article className="order-row">{content}</article>;
}
