"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { demoOrders, formatVnd } from "../data/fixtures";
import styles from "../lab-owner-pages.module.css";

const steps = ["Nhận phim", "Tráng phim", "Scan", "Kiểm tra", "Bàn giao", "Hoàn tất"];

export function OrderDetailPage({ orderId }: { orderId: string }) {
	const router = useRouter();
	const original = demoOrders.find((item) => item.id === orderId);
	const [step, setStep] = useState(original?.step ?? 0);
	const [message, setMessage] = useState<string | null>(null);
	if (!original) return <div className={styles.page}><h1>Không tìm thấy đơn</h1><p>Mã đơn này không có trong dữ liệu mẫu hiện tại.</p><Button variant="outline" onClick={() => router.push("/lab-owner/orders")}>Về hàng đợi</Button></div>;
	const status = original.status === "Đã hủy" ? "Đã hủy" : step >= steps.length - 1 ? "Hoàn tất" : step >= 4 ? "Chờ bàn giao" : step === 0 ? "Chờ tiếp nhận" : "Đang xử lý";

	return <div className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>Đơn dịch vụ · {original.id}</p><h1>{original.film}</h1><p>{original.customer} · {original.rolls} cuộn · {original.format} · {original.process}</p></div><Button variant="outline" onClick={() => router.push("/lab-owner/orders")}>Về hàng đợi</Button></header>
		<p className={styles.demoNote}>Chi tiết và lịch sử dưới đây là dữ liệu prototype. Các bước xử lý thay đổi tạm thời trong phiên này.</p>
		<section className={styles.stats}><div className={styles.stat}><span>Trạng thái</span><strong>{status}</strong></div><div className={styles.stat}><span>Tổng tiền</span><strong>{formatVnd(original.total)}</strong></div><div className={styles.stat}><span>Thanh toán</span><strong>{original.paid ? "Đã thanh toán" : "Chưa thanh toán"}</strong></div><div className={styles.stat}><span>Ngày trả dự kiến</span><strong>{original.dueDate}</strong></div></section>
		<section className={styles.details}><div className={styles.stack}><article className={styles.panel}><div className={styles.panelHeader}><div><h2>Tiến độ xử lý</h2><p>Cập nhật giai đoạn khi lab hoàn tất từng công đoạn.</p></div><span className={`${styles.badge} ${status === "Hoàn tất" ? styles.badgeSuccess : status === "Chờ tiếp nhận" ? styles.badgeWarning : styles.badge}`}>{status}</span></div><div className={styles.timeline}>{steps.map((label, index) => <div className={`${styles.timelineStep} ${index <= step ? styles.timelineStepActive : ""}`} key={label}><span className={styles.timelineDot} />{label}</div>)}</div><div className={styles.detailBody}><Button disabled={status === "Hoàn tất" || status === "Đã hủy"} onClick={() => { setStep((current) => Math.min(current + 1, steps.length - 1)); setMessage("Đã cập nhật bước xử lý mẫu."); }}>{step === 0 ? "Xác nhận nhận phim & lịch máy" : step >= 4 ? "Xác nhận bàn giao" : "Chuyển sang công đoạn tiếp"}</Button>{message && <span role="status">{message}</span>}</div></article>
			<article className={styles.panel}><div className={styles.panelHeader}><div><h2>Thông tin đơn</h2><p>Thông tin cuộn phim và hình thức bàn giao.</p></div></div><div className={styles.detailBody}><div className={styles.detailLine}><span>Khách hàng</span><strong>{original.customer}</strong></div><div className={styles.detailLine}><span>Liên hệ</span><strong>{original.email}</strong></div><div className={styles.detailLine}><span>Film / quy trình</span><strong>{original.film} · {original.process}</strong></div><div className={styles.detailLine}><span>Khổ phim / số cuộn</span><strong>{original.format} · {original.rolls}</strong></div><div className={styles.detailLine}><span>Hẹn trả</span><strong>{original.dueDate}</strong></div><div className={styles.detailLine}><span>Thanh toán</span><strong>{original.paid ? "Đã thanh toán" : "Chưa thanh toán"} · {formatVnd(original.total)}</strong></div></div></article></div>
			<aside className={styles.stack}><article className={styles.panel}><div className={styles.panelHeader}><div><h2>Scan & bàn giao</h2><p>Chỉ bàn giao file sau khi kiểm tra chất lượng và xác nhận thanh toán.</p></div></div><div className={styles.detailBody}><div className={styles.notice}>Ảnh preview, liên kết ảnh gốc và ghi chú chỉ được lưu tạm ở giao diện demo.</div><Button variant="outline" disabled={!original.paid || step < 3 || status === "Đã hủy"} onClick={() => router.push(`/lab-owner/orders/${original.id}/scan`)}>Tải scan và bàn giao</Button></div></article><article className={styles.panel}><div className={styles.panelHeader}><h2>Lịch sử xử lý</h2></div><div className={styles.timeline}>{steps.slice(0, step + 1).map((label, index) => <div className={`${styles.timelineStep} ${styles.timelineStepActive}`} key={label}><span className={styles.timelineDot} />{label}<small>{index === 0 ? "01/11 · 09:10" : `01/11 · ${String(9 + index).padStart(2, "0")}:00`}</small></div>)}</div></article><Link className={styles.inlineLink} href="/lab-owner/machines">Mở lịch máy và công suất</Link></aside></section>
	</div>;
}
