import {
	ArrowRight,
	ArrowUpRight,
	Camera,
	MapPin,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilmArtwork } from "@/components/shared/media/film-artwork";
import { type Account, orders, type Section, services } from "@/components/shared/model";
import { OrderRow } from "@/components/user/orders/orders-section";
import { ServiceCard } from "@/components/shared/services/service-card";

export function HomeSection({
	account,
	guest = false,
	onSelect,
	onBook,
}: {
	account: Account | null;
	guest?: boolean;
	onSelect: (section: Section) => void;
	onBook: (id: string) => void;
}) {
	const firstName = account?.fullName?.trim().split(/\s+/)[0];
	const guestProfileContent = (
		<>
			<span className="user-avatar user-avatar--large">FL</span>
			<span>
				<strong>Tham gia FilmLink</strong>
				<small>Lưu đơn hàng và cuộn phim</small>
			</span>
			<ArrowUpRight aria-hidden="true" />
		</>
	);
	const profileContent = (
		<>
			<span className="user-avatar user-avatar--large">FL</span>
			<span>
				<strong>{account?.fullName || "Lưu hành trình của bạn"}</strong>
				<small>
					{account
						? account.role || "Thành viên FilmLink"
						: "Tạo tài khoản miễn phí"}
				</small>
			</span>
			<ArrowUpRight aria-hidden="true" />
		</>
	);

	return (
		<>
			<section className="welcome-row">
				<div>
					<p className="eyebrow">FILMLINK · CỘNG ĐỒNG PHIM ANALOG</p>
					<h1>
						{guest ? (
							<>
								Tráng phim dễ dàng,
								<br className="desktop-break" /> giữ kỷ niệm lâu hơn.
							</>
						) : (
							<>
								Chào {firstName || "bạn"}, hôm nay mình
								<br className="desktop-break" /> đi chụp gì nhỉ?
							</>
						)}
					</h1>
					<p className="welcome-copy">
						{guest
							? "Tìm nơi tráng phù hợp, khám phá cộng đồng và hỏi FilmLink AI ngay cả khi chưa đăng nhập."
							: "Một cuộn phim mới luôn bắt đầu bằng một ý tưởng hay."}
					</p>
				</div>
				{guest ? (
					<Link href="/login" className="welcome-profile">
						{guestProfileContent}
					</Link>
				) : account ? (
					<button
						type="button"
						className="welcome-profile welcome-profile--button"
						onClick={() => onSelect("account")}
					>
						{profileContent}
					</button>
				) : (
					<Link href="/register" className="welcome-profile">
						{profileContent}
					</Link>
				)}
			</section>

			<section className="film-hero">
				<div className="film-hero__copy">
					<span className="hero-kicker">
						<Sparkles aria-hidden="true" /> Mọi cuộn phim đều đáng được nâng niu
					</span>
					<h2>
						Chụp xong rồi,
						<br />
						để FilmLink lo.
					</h2>
					<p>
						Tìm nơi tráng phim hợp gu, theo dõi hành trình từng cuộn và nhận ảnh
						thật dễ dàng.
					</p>
					<Button
						type="button"
						className="hero-button"
						onClick={() => onSelect("services")}
					>
						Tìm dịch vụ tráng phim <ArrowRight data-icon="inline-end" />
					</Button>
					<span className="hero-footnote">
						<MapPin aria-hidden="true" /> 20+ lab ảnh phim tại Việt Nam
					</span>
				</div>
				<FilmArtwork />
			</section>

			<section className="quick-section" aria-label="Lối tắt">
				<button
					className="quick-card quick-card--service"
					type="button"
					onClick={() => onSelect("services")}
				>
					<span className="quick-card__icon">
						<Camera aria-hidden="true" />
					</span>
					<span className="quick-card__body">
						<strong>Đặt tráng phim</strong>
						<small>Chọn lab và gửi cuộn phim của bạn</small>
					</span>
					<ArrowUpRight aria-hidden="true" className="quick-card__arrow" />
				</button>
				<button
					className="quick-card quick-card--ai"
					type="button"
					onClick={() => onSelect("assistant")}
				>
					<span className="quick-card__icon">
						<Sparkles aria-hidden="true" />
					</span>
					<span className="quick-card__body">
						<strong>Hỏi FilmLink AI</strong>
						<small>Chọn phim, máy ảnh, giải đáp thắc mắc</small>
					</span>
					<ArrowUpRight aria-hidden="true" className="quick-card__arrow" />
				</button>
			</section>

			<section className="section-block">
				<div className="section-heading">
					<div>
						<p className="eyebrow">BẮT ĐẦU TỪ ĐÂY</p>
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

			{guest && (
				<section
					className="section-block guest-features"
					aria-labelledby="guest-features-title"
				>
					<div className="section-heading">
						<div>
							<p className="eyebrow">BẠN CÓ THỂ BẮT ĐẦU NGAY</p>
							<h2 id="guest-features-title">Khám phá FilmLink</h2>
						</div>
					</div>
					<div className="guest-feature-list">
						<button type="button" onClick={() => onSelect("services")}>
							<Camera aria-hidden="true" />
							<span>
								<strong>Tìm dịch vụ</strong>
								<small>Tìm và lọc dịch vụ tráng, scan phim.</small>
							</span>
							<ArrowUpRight aria-hidden="true" />
						</button>
						<button type="button" onClick={() => onSelect("community")}>
							<Sparkles aria-hidden="true" />
							<span>
								<strong>Ghé cộng đồng</strong>
								<small>Xem những câu chuyện ảnh analog.</small>
							</span>
							<ArrowUpRight aria-hidden="true" />
						</button>
						<button type="button" onClick={() => onSelect("assistant")}>
							<MapPin aria-hidden="true" />
							<span>
								<strong>Hỏi FilmLink AI</strong>
								<small>Nhận gợi ý phim và nơi tráng phù hợp.</small>
							</span>
							<ArrowUpRight aria-hidden="true" />
						</button>
					</div>
				</section>
			)}

			{!guest && (
				<section className="section-block orders-preview">
					<div className="section-heading">
						<div>
							<p className="eyebrow">HÀNH TRÌNH CUỘN PHIM</p>
							<h2>Đơn hàng gần đây</h2>
						</div>
						<button
							className="text-link"
							type="button"
							onClick={() => onSelect("orders")}
						>
							Xem đơn hàng <ArrowRight aria-hidden="true" />
						</button>
					</div>
					<div className="order-list">
						{orders.slice(0, 1).map((order) => (
							<OrderRow key={order.id} order={order} />
						))}
					</div>
				</section>
			)}
		</>
	);
}
