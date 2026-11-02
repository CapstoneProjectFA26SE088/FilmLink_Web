import { ArrowRight, Check, CircleDashed, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Account } from "@/components/shared/model";
import { ChangePasswordForm } from "./change-password-form";

const featureStatuses = [
	{
		name: "Đặt dịch vụ",
		detail: "Danh sách Film Lab, gói dịch vụ và yêu cầu đặt đang dùng dữ liệu minh họa.",
	},
	{
		name: "Đơn hàng",
		detail: "Đơn và tracking là dữ liệu mẫu, chưa đồng bộ với API đơn hàng.",
	},
	{
		name: "Chợ ký gửi",
		detail: "Tin đăng, yêu cầu ký gửi và thương lượng chỉ lưu trong phiên hiện tại.",
	},
	{
		name: "Cộng đồng",
		detail: "Bài viết mẫu, bài đăng và lượt thích chưa được lưu lên máy chủ.",
	},
	{
		name: "Trợ lý AI",
		detail: "Đang trả lời theo kịch bản trải nghiệm, chưa gọi dịch vụ AI thật.",
	},
];

export function AccountSection({
	account,
	loaded,
}: {
	account: Account | null;
	loaded: boolean;
}) {
	return (
		<section className="subpage-section account-section">
			<p className="eyebrow">GÓC CỦA BẠN</p>
			<h1>Tài khoản FilmLink</h1>
			<p className="account-description">
				{account
					? "Thông tin hồ sơ tài khoản đang đăng nhập."
					: "Tạo tài khoản để lưu đơn hàng và những cuộn phim bạn yêu thích."}
			</p>
			<div className="account-card">
				<span className="account-avatar">FL</span>
				<div>
					<h2>
						{account
							? account.fullName || account.email
							: loaded
								? "Trải nghiệm với tư cách khách"
								: "Đang tải tài khoản…"}
					</h2>
					{account ? (
						<p>
							Email: {account.email || "Chưa có"}
							<br />
							Số điện thoại: {account.phoneNumber || "Chưa cập nhật"}
							<br />
							Vai trò: {account.role || "Thành viên"}
							<br />
							Trạng thái: {account.status || "—"}
						</p>
					) : (
						<p>
							{loaded
								? "Bạn đang xem dữ liệu mẫu. Đăng ký để bắt đầu lưu hành trình phim ảnh của riêng mình."
								: "Đang lấy hồ sơ an toàn từ máy chủ…"}
						</p>
					)}
					{!account && loaded && (
						<div className="account-actions">
							<Link href="/register" className="account-primary">
								Tạo tài khoản miễn phí <ArrowRight aria-hidden="true" />
							</Link>
							<Link href="/login" className="account-secondary">
								Đã có tài khoản? Đăng nhập
							</Link>
						</div>
					)}
				</div>
			</div>
			{account && <ChangePasswordForm />}
			{account && account.role === "PHOTOGRAPHER" && (
				<div className="account-card account-expert-application">
					<span className="account-avatar"><Sparkles aria-hidden="true" /></span>
					<div><h2>Đóng góp với vai trò Expert</h2><p>Gửi kinh nghiệm và portfolio để Admin xem xét nâng cấp vai trò trên tài khoản hiện tại.</p><Link href="/expert-application" className="account-primary">Tìm hiểu và đăng ký <ArrowRight aria-hidden="true" /></Link></div>
				</div>
			)}
			<section className="account-integration" aria-labelledby="account-integration-title">
				<div className="account-integration__heading">
					<div>
						<p className="eyebrow">MINH BẠCH DỮ LIỆU</p>
						<h2 id="account-integration-title">Tình trạng tính năng</h2>
					</div>
					<span className="account-integration__connected">
						<ShieldCheck aria-hidden="true" /> Hồ sơ & bảo mật đã kết nối
					</span>
				</div>
				<p className="account-integration__description">
					Thông tin tài khoản được lấy từ backend. Đổi mật khẩu gửi yêu cầu đến API bảo mật; sau khi đổi thành công, bạn cần đăng nhập lại.
				</p>
				<ul className="account-integration__list">
					{featureStatuses.map((feature) => (
						<li key={feature.name}>
							<span className="account-integration__prototype"><CircleDashed aria-hidden="true" /> Bản trải nghiệm</span>
							<div><strong>{feature.name}</strong><p>{feature.detail}</p></div>
						</li>
					))}
				</ul>
			</section>
			<div className="account-privacy">
				<Check aria-hidden="true" />
				<span>
					Mật khẩu được gửi qua kết nối bảo mật và không lưu trong giao diện FilmLink.
				</span>
			</div>
		</section>
	);
}
