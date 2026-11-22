"use client";

import { ChangePasswordForm } from "@/components/user/profile/change-password-form";
import { useModeratorAccount } from "../moderator-workspace";
import styles from "../moderator-workspace.module.css";

export function ModeratorAccount() {
	const account = useModeratorAccount();

	return (
		<section className={styles.page}>
			<header className={styles.heading}>
				<div>
					<p className={styles.eyebrow}>TÀI KHOẢN MODERATOR</p>
					<h1>Tài khoản</h1>
					<p>Xem thông tin đang đăng nhập và cập nhật mật khẩu bảo mật.</p>
				</div>
			</header>

			<div className={styles.accountContent}>
				<section className={styles.panel} aria-labelledby="moderator-account-heading">
					<div className={styles.panelHead}>
						<div>
							<h2 id="moderator-account-heading">Thông tin tài khoản</h2>
							<p>Thông tin từ tài khoản Moderator đã được xác thực.</p>
						</div>
					</div>
					<dl className={styles.accountDetails}>
						<div>
							<dt>Họ và tên</dt>
							<dd>{account.fullName || "Chưa cập nhật"}</dd>
						</div>
						<div>
							<dt>Email</dt>
							<dd>{account.email || "Chưa cập nhật"}</dd>
						</div>
					</dl>
				</section>

				<ChangePasswordForm />
			</div>
		</section>
	);
}
