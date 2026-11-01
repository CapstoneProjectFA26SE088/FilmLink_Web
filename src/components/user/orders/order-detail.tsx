"use client";

import { ArrowLeft, Check, Clock3, Film, MapPin, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ServiceOrder } from "@/components/shared/model";

const trackingSteps = [
	{ title: "Chờ lab xác nhận đơn", description: "Film Lab kiểm tra yêu cầu và xác nhận khả năng tiếp nhận." },
	{ title: "Lab đã tiếp nhận phim", description: "Cuộn phim được ghi nhận tại Film Lab." },
	{ title: "Đang tráng phim", description: "Lab đang xử lý cuộn phim theo dịch vụ đã chọn." },
	{ title: "Đang scan và hoàn thiện", description: "Ảnh đang được scan, kiểm tra và chuẩn bị bàn giao." },
	{ title: "Hoàn tất", description: "Đơn đã hoàn thành và sẵn sàng nhận kết quả." },
];

function getCurrentStep(order: ServiceOrder) {
	if (order.state === "Đã hủy") return -1;
	if (order.progress >= 100 || order.state === "Hoàn tất") return trackingSteps.length - 1;
	if (order.state.includes("Đang scan")) return 3;
	if (order.state.includes("Đang tráng")) return 2;
	if (order.state.includes("Đã tiếp nhận")) return 1;
	if (order.state.includes("Chờ")) return 0;
	if (order.progress >= 75) return 3;
	if (order.progress >= 40) return 2;
	if (order.progress >= 20) return 1;
	return 0;
}

function formatOrderDate(value: string) {
	const date = new Date(`${value}T00:00:00`);
	return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export function OrderDetail({ order, onBack }: { order: ServiceOrder; onBack: () => void }) {
	const currentStep = getCurrentStep(order);
	const cancelled = currentStep < 0;

	return (
		<section className="subpage-section order-detail-page">
			<Button type="button" variant="ghost" onClick={onBack} className="order-detail-back">
				<ArrowLeft data-icon="inline-start" /> Quay lại đơn hàng
			</Button>
			<p className="eyebrow">CHI TIẾT ĐƠN HÀNG</p>
			<div className="subpage-title-row order-detail-heading">
				<div>
					<h1>{order.service}</h1>
					<p>Mã đơn <strong>{order.id}</strong> · đặt tại {order.lab}</p>
				</div>
				<span className={`order-status order-detail-status${order.progress === 100 ? " order-status--done" : cancelled ? " order-status--cancelled" : ""}`}><span />{order.state}</span>
			</div>

			<div className="order-detail-grid">
				<div className="order-detail-main">
					<section className="order-tracking-card" aria-labelledby="order-tracking-title">
						<div className="order-detail-section-heading">
							<div><p className="eyebrow">CẬP NHẬT ĐƠN</p><h2 id="order-tracking-title">Theo dõi tiến độ</h2></div>
							{!cancelled && <span className="order-tracking-percent">{order.progress}%</span>}
						</div>
						{cancelled ? (
							<div className="order-cancelled-message"><PackageCheck aria-hidden="true" /><div><strong>Đơn hàng đã hủy</strong><p>Đơn này không tiếp tục quy trình xử lý.</p></div></div>
						) : (
							<>
								<div className="order-detail-progress" role="progressbar" aria-label="Tiến độ xử lý đơn hàng" aria-valuemin={0} aria-valuemax={100} aria-valuenow={order.progress}><span style={{ width: `${order.progress}%` }} /></div>
								<ol className="order-tracking-timeline">
									{trackingSteps.map((step, index) => {
										const state = index < currentStep ? "complete" : index === currentStep ? "active" : "pending";
										return <li key={step.title} className={`order-tracking-step order-tracking-step--${state}`}>
											<span className="order-tracking-step__marker">{state === "complete" ? <Check aria-hidden="true" /> : index + 1}</span>
											<div><strong>{step.title}{state === "active" && <span className="sr-only"> — đang diễn ra</span>}</strong><p>{step.description}</p></div>
										</li>;
									})}
								</ol>
							</>
						)}
						<p className="order-tracking-note"><Clock3 aria-hidden="true" /> Tracking đang dùng trạng thái minh họa; thời gian thực sẽ được đồng bộ khi Film Lab cập nhật đơn.</p>
					</section>
				</div>

				<aside className="order-detail-summary" aria-label="Thông tin đơn hàng">
					<div className="order-detail-section-heading"><div><p className="eyebrow">THÔNG TIN</p><h2>Đơn của bạn</h2></div><span className="order-detail-summary__icon"><Film aria-hidden="true" /></span></div>
					<dl>
						<div><dt>Film Lab</dt><dd><MapPin aria-hidden="true" />{order.lab}</dd></div>
						<div><dt>Loại phim</dt><dd>{order.film}</dd></div>
						<div><dt>Dịch vụ</dt><dd>{order.service}</dd></div>
						<div><dt>Số lượng</dt><dd>{order.rollCount} cuộn</dd></div>
						<div><dt>Dự kiến hoàn tất</dt><dd>{formatOrderDate(order.dueDate)}</dd></div>
					</dl>
					<div className="order-detail-total"><span>Tổng tạm tính</span><strong>{order.total.toLocaleString("vi-VN")}đ</strong></div>
				</aside>
			</div>
		</section>
	);
}
