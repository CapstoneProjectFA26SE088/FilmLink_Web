import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Account } from "@/components/shared/model";
import { ChangePasswordForm } from "./change-password-form";

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
								? "Đăng nhập để xem hồ sơ và quản lý đơn hàng của bạn."
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
		</section>
	);
}
