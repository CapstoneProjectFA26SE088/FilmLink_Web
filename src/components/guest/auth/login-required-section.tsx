import { ArrowRight, LockKeyhole } from "lucide-react";
import Link from "next/link";

export function LoginRequiredSection({
	section,
}: {
	section: "orders" | "account" | "marketplace";
}) {
	const isOrders = section === "orders";
	const isMarketplace = section === "marketplace";

	return (
		<section
			className="login-required-section"
			aria-labelledby="login-required-title"
		>
			<span className="login-required-icon">
				<LockKeyhole aria-hidden="true" />
			</span>
			<p className="eyebrow">KHU VỰC CÁ NHÂN</p>
			<h1 id="login-required-title">
				{isOrders
					? "Theo dõi đơn hàng của bạn"
					: isMarketplace
						? "Khám phá chợ ký gửi"
						: "Lưu hành trình phim của bạn"}
			</h1>
			<p>
				{isOrders
					? "Đăng nhập để xem tiến độ tráng phim và lịch sử đơn hàng."
					: isMarketplace
						? "Đăng nhập để xem sản phẩm, đặt lịch ký gửi và theo dõi yêu cầu của bạn."
						: "Đăng nhập để xem và cập nhật thông tin tài khoản FilmLink."}
			</p>
			<Link href="/login" className="account-primary">
				Đăng nhập <ArrowRight aria-hidden="true" />
			</Link>
		</section>
	);
}
