"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { demoPayments, formatVnd } from "../data/fixtures";
import styles from "../lab-owner-pages.module.css";

export function SettlementsPage() {
	const [requested, setRequested] = useState(false);
	const payout = demoPayments.find((payment) => payment.id === "PAY-01")!;
	return <div className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>Đối soát thanh toán</p><h1>Công nợ & hoa hồng</h1><p>Kiểm tra các khoản phải thu, phí nền tảng và lịch payout.</p></div></header>
		<p className={styles.demoNote}>Các khoản dưới đây là dữ liệu minh họa. Yêu cầu đối soát chưa gửi tới cổng thanh toán hoặc backend.</p>
		<section className={styles.stats}><div className={styles.stat}><span>Hoa hồng nền tảng</span><strong>5%</strong></div><div className={styles.stat}><span>Chờ đối soát</span><strong>{formatVnd(payout.amount)}</strong></div><div className={styles.stat}><span>Giao dịch đã thu</span><strong>{demoPayments.filter((payment) => payment.status === "Thành công").length}</strong></div><div className={styles.stat}><span>Chu kỳ</span><strong>Tháng 11/2026</strong></div></section>
		<section className={styles.panel}><div className={styles.panelHeader}><div><h2>Khoản cần đối soát</h2><p>Tiền ký gửi được chi sau thời hạn trả hàng 7 ngày; phí lab và nền tảng được tính theo giao dịch.</p></div><Button disabled={requested} onClick={() => setRequested(true)}>{requested ? "Đã gửi yêu cầu mẫu" : "Yêu cầu đối soát"}</Button></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Mã</th><th>Nội dung</th><th>Giá trị</th><th>Phí lab</th><th>Hoa hồng</th><th>Thực nhận</th><th>Trạng thái</th></tr></thead><tbody><tr><td>PAY-01</td><td>Payout ký gửi KG-01<small>Nikon FM2 · trả sau 7 ngày</small></td><td>{formatVnd(4200000)}</td><td>{formatVnd(210000)}</td><td>{formatVnd(210000)}</td><td>{formatVnd(payout.amount)}</td><td><span className={`${styles.badge} ${requested ? styles.badgeSuccess : styles.badgeWarning}`}>{requested ? "Đã gửi yêu cầu" : "Chờ đối soát"}</span></td></tr></tbody></table></div></section>
		<section className={styles.panel}><div className={styles.panelHeader}><div><h2>Lịch sử giao dịch</h2><p>Đối chiếu thanh toán đơn dịch vụ và payout.</p></div></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Mã giao dịch</th><th>Nội dung</th><th>Số tiền</th><th>Kênh thanh toán</th><th>Trạng thái</th></tr></thead><tbody>{demoPayments.map((payment) => <tr key={payment.id}><td>{payment.id}</td><td>{payment.subject}</td><td>{formatVnd(payment.amount)}</td><td>{payment.channel}</td><td><span className={`${styles.badge} ${payment.status === "Thành công" ? styles.badgeSuccess : styles.badgeWarning}`}>{payment.status}</span></td></tr>)}</tbody></table></div></section>
	</div>;
}
