"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, CircleCheck, Info } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUserWorkspace } from "@/components/user/user-workspace";
import styles from "../expert-workspace.module.css";
import { readExpertApplication, saveExpertApplication } from "../../shared/expert-demo/demo-session";

export function ExpertApplication() {
	const { account } = useUserWorkspace();
	const [experience, setExperience] = useState("");
	const [portfolio, setPortfolio] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [applicationStatus, setApplicationStatus] = useState("Chờ duyệt");
	const [error, setError] = useState("");
	useEffect(() => {
		const application = readExpertApplication();
		if (application && application.email === account?.email) {
			setApplicationStatus(application.status);
			setSubmitted(true);
		}
	}, [account?.email]);
	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault(); setError("");
		if (!experience.trim()) { setError("Hãy mô tả kinh nghiệm nhiếp ảnh hoặc chuyên môn của bạn."); return; }
		if (portfolio && !/^https?:\/\//i.test(portfolio)) { setError("Liên kết portfolio cần bắt đầu bằng http:// hoặc https://."); return; }
		saveExpertApplication({ id: `EX-${Date.now()}`, name: account?.fullName || "Photographer", email: account?.email || "", experience: experience.trim(), portfolio: portfolio.trim(), status: "Chờ duyệt" });
		setApplicationStatus("Chờ duyệt");
		setSubmitted(true);
	}
	return <main className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>Nâng cấp vai trò</p><h1>Đăng ký trở thành Expert</h1><p>Gửi kinh nghiệm và portfolio để Admin xem xét trên tài khoản Photographer hiện tại.</p></div></header>
		{submitted ? <section className={styles.panel}><div className={styles.panelBody}><CircleCheck color="var(--success-foreground)"/><h2 style={{ margin: 0 }}>Hồ sơ Expert: {applicationStatus}</h2><p style={{ margin: 0, color: "var(--text-secondary)", fontSize: ".8rem" }}>{applicationStatus === "Đã xác minh" ? "Admin đã duyệt trạng thái demo. Quyền tài khoản thật chưa thay đổi vì backend chưa có API cấp vai trò Expert." : applicationStatus === "Từ chối" ? "Hồ sơ demo bị từ chối. Hãy xem lý do trong hàng chờ Admin; có thể gửi lại sau khi cập nhật hồ sơ." : "Hồ sơ đang chờ Admin xem xét trong bản demo. Dữ liệu nằm trong phiên trình duyệt, chưa gửi hoặc lưu trên backend."}</p><Link className={buttonVariants()} href="/dashboard">Về trang Photographer <ArrowRight aria-hidden="true"/></Link></div></section> : <>
		<p className={styles.note}><Info aria-hidden="true"/> Đây là luồng minh họa cho hồ sơ nâng cấp. Backend hiện chưa có API Expert; chưa có thay đổi vai trò thật nào được thực hiện.</p>
		<section className={styles.panel}><div className={styles.panelHead}><div><h2>Thông tin hồ sơ</h2><p>Tên lấy từ tài khoản đang đăng nhập, không tạo tài khoản Expert riêng.</p></div></div>
		<form className={styles.form} onSubmit={submit}>
			<label className={styles.field}>Họ và tên<input className={styles.input} value={account?.fullName ?? ""} readOnly aria-label="Họ và tên tài khoản"/></label>
			<label className={styles.field}>Email<input className={styles.input} value={account?.email ?? ""} readOnly aria-label="Email tài khoản"/></label>
			<label className={styles.field}>Kinh nghiệm / chuyên môn<textarea className={styles.textarea} maxLength={2000} value={experience} onChange={(event) => setExperience(event.target.value)} placeholder="Mô tả kinh nghiệm chụp, tráng, scan, máy ảnh hoặc chuyên môn bạn muốn chia sẻ…" required/><small>{experience.length}/2000 ký tự</small></label>
			<label className={styles.field}>Portfolio / minh chứng (không bắt buộc)<input className={styles.input} type="url" maxLength={500} value={portfolio} onChange={(event) => setPortfolio(event.target.value)} placeholder="https://…"/><small>Có thể là portfolio cá nhân, trang ảnh hoặc hồ sơ công việc.</small></label>
			{error && <p className={styles.error} role="alert">{error}</p>}
			<div className={styles.formActions}><Button type="submit">Gửi hồ sơ demo</Button></div>
		</form></section></>}
	</main>;
}
