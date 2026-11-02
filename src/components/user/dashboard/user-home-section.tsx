import {
	ArrowRight,
	Camera,
	CheckCircle2,
	Clock3,
	PackageCheck,
	Sparkles,
	UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Account, orders as sampleOrders, type Section, type ServiceOrder, services } from "@/components/shared/model";
import { OrderRow } from "../orders/orders-section";
import { ServiceCard } from "@/components/shared/services/service-card";
import { ExpertDashboardSummary } from "@/components/expert/dashboard/expert-dashboard-summary";

export function UserHomeSection({
	account,
	orders = sampleOrders,
	onSelect,
	onBook,
}: {
	account: Account | null;
	orders?: ServiceOrder[];
	onSelect: (section: Section) => void;
	onBook: (id: string) => void;
}) {
	const firstName = account?.fullName?.trim().split(/\s+/)[0] || "bạn";
	const inProgressOrders = orders.filter((order) => order.progress < 100 && order.state !== "Đã hủy");
	const completedOrders = orders.filter((order) => order.state === "Hoàn tất").length;
	const activeOrder = inProgressOrders[0];

	return (
		<div className="user-dashboard-home">
			<section className="user-dashboard-welcome">
				<div>
					<p className="eyebrow">KHÔNG GIAN CỦA BẠN · FILMLINK</p>
					<h1>Chào {firstName}, sẵn sàng cho cuộn phim tiếp theo?</h1>
					<p className="welcome-copy">
						Theo dõi đơn tráng, khám phá lab mới và lưu lại những khoảnh khắc
						analog của bạn.
					</p>
				</div>
				<Button type="button" onClick={() => onSelect("services")}>
					<Camera data-icon="inline-start" /> Đặt dịch vụ
				</Button>
			</section>

			<section className="dashboard-metrics" aria-label="Tổng quan tài khoản">
				<article className="dashboard-metric dashboard-metric--active">
					<span className="dashboard-metric__icon">
						<Clock3 aria-hidden="true" />
					</span>
					<div>
						<small>Đơn đang xử lý</small>
						<strong>{inProgressOrders.length}</strong>
					</div>
					<span className="dashboard-metric__detail">Theo dõi tiến độ</span>
				</article>
				<article className="dashboard-metric">
					<span className="dashboard-metric__icon">
						<CheckCircle2 aria-hidden="true" />
					</span>
					<div>
						<small>Đơn đã hoàn tất</small>
						<strong>{completedOrders}</strong>
					</div>
					<span className="dashboard-metric__detail">Sẵn sàng xem lại</span>
				</article>
				<article className="dashboard-metric">
					<span className="dashboard-metric__icon">
						<UsersRound aria-hidden="true" />
					</span>
					<div>
						<small>Cộng đồng phim</small>
						<strong>Đang mở</strong>
					</div>
					<span className="dashboard-metric__detail">
						Chia sẻ câu chuyện mới
					</span>
				</article>
			</section>
			{(account?.role === "PHOTOGRAPHY_EXPERT" || account?.role === "EXPERT") && <ExpertDashboardSummary onOpen={() => onSelect("expert")} />}

			<section
				className="dashboard-order-panel"
				aria-labelledby="dashboard-order-title"
			>
				<div className="dashboard-panel-heading">
					<div>
						<p className="eyebrow">HÀNH TRÌNH ĐANG TIẾP DIỄN</p>
						<h2 id="dashboard-order-title">Đơn tráng phim của bạn</h2>
					</div>
					<button
						className="text-link"
						type="button"
						onClick={() => onSelect("orders")}
					>
						Tất cả đơn hàng <ArrowRight aria-hidden="true" />
					</button>
				</div>
				{activeOrder ? (
					<div className="dashboard-order-content">
						<OrderRow order={activeOrder} />
						<div className="dashboard-order-footer">
							<span>Tiến độ tráng phim</span>
							<strong>{activeOrder.progress}%</strong>
						</div>
						<div className="progress-track dashboard-order-progress">
							<span style={{ width: `${activeOrder.progress}%` }} />
						</div>
						<p className="dashboard-demo-note">
							Thông tin đơn hàng đang dùng dữ liệu minh họa.
						</p>
					</div>
				) : (
					<div className="dashboard-empty-order">
						<PackageCheck aria-hidden="true" />
						<div>
							<strong>Chưa có đơn nào đang xử lý</strong>
							<span>Bắt đầu bằng cách chọn dịch vụ tráng phim phù hợp.</span>
						</div>
						<Button
							type="button"
							variant="outline"
							onClick={() => onSelect("services")}
						>
							Khám phá dịch vụ
						</Button>
					</div>
				)}
			</section>

			<section
				className="dashboard-personal-shortcuts"
				aria-label="Lối tắt cá nhân"
			>
				<button type="button" onClick={() => onSelect("assistant")}>
					<span className="dashboard-shortcut-icon dashboard-shortcut-icon--ai">
						<Sparkles aria-hidden="true" />
					</span>
					<span>
						<strong>Hỏi FilmLink AI</strong>
						<small>Chọn phim và tìm lab theo gu của bạn</small>
					</span>
					<ArrowRight aria-hidden="true" />
				</button>
				<button type="button" onClick={() => onSelect("community")}>
					<span className="dashboard-shortcut-icon">
						<UsersRound aria-hidden="true" />
					</span>
					<span>
						<strong>Ghé cộng đồng</strong>
						<small>Xem cảm hứng từ người chụp phim</small>
					</span>
					<ArrowRight aria-hidden="true" />
				</button>
			</section>

			<section className="section-block">
				<div className="section-heading">
					<div>
						<p className="eyebrow">GỢI Ý CHO BẠN</p>
						<h2>Dịch vụ được yêu thích</h2>
					</div>
					<button
						className="text-link"
						type="button"
						onClick={() => onSelect("services")}
					>
						Xem tất cả <ArrowRight aria-hidden="true" />
					</button>
				</div>
				<div className="service-grid service-grid--home">
					{services.slice(0, 2).map((service) => (
						<ServiceCard key={service.id} service={service} onBook={onBook} />
					))}
				</div>
			</section>
		</div>
	);
}
