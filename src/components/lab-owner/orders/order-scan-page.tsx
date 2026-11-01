"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { demoOrders } from "../data/fixtures";
import styles from "../lab-owner-pages.module.css";

export function OrderScanPage({ orderId }: { orderId: string }) {
	const router = useRouter();
	const order = demoOrders.find((item) => item.id === orderId);
	const [fileName, setFileName] = useState("");
	const [link, setLink] = useState("");
	const [note, setNote] = useState("");
	const [saved, setSaved] = useState(false);
	if (!order) return <div className={styles.page}><h1>Không tìm thấy đơn</h1><Button variant="outline" onClick={() => router.push("/lab-owner/orders")}>Về hàng đợi</Button></div>;

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!order.paid) return;
		setSaved(true);
	}

	return <div className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>Bàn giao scan · {order.id}</p><h1>Ảnh scan của {order.film}</h1><p>Kiểm tra độ nét, bụi và màu trước khi gửi kết quả cho khách.</p></div><Button variant="outline" onClick={() => router.push(`/lab-owner/orders/${order.id}`)}>Quay lại chi tiết</Button></header>
		<p className={styles.demoNote}>File và liên kết không được tải lên server trong phiên prototype.</p>
		<form className={styles.panel} onSubmit={submit}><div className={styles.panelHeader}><div><h2>Thông tin bàn giao</h2><p>Đơn chỉ được bàn giao khi đã thanh toán đầy đủ.</p></div></div><div className={styles.detailBody}><label className={styles.fieldLabel}>Ảnh preview scan<input className={styles.field} type="file" accept="image/jpeg,image/png,image/webp" required onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} />{fileName && <span>{fileName}</span>}</label><label className={styles.fieldLabel}>Liên kết ảnh độ phân giải gốc<input className={styles.field} type="url" required value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://…" /></label><label className={styles.fieldLabel}>Ghi chú kiểm tra scan<textarea className={styles.field} rows={4} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ghi chú về màu sắc, độ nét hoặc bụi film" /></label><div className={styles.dialogActions}><Button type="button" variant="outline" onClick={() => router.push(`/lab-owner/orders/${order.id}`)}>Hủy</Button><Button type="submit" disabled={!order.paid}>{saved ? "Đã lưu bản demo" : "Bàn giao kết quả"}</Button></div>{!order.paid && <p className={styles.notice}>Đơn chưa thanh toán. Chỉ bàn giao kết quả sau khi đã thu đủ tiền.</p>}{saved && <p className={styles.demoNote} role="status">Thông tin scan đã được ghi nhận tạm thời trong màn hình này.</p>}</div></form>
	</div>;
}
