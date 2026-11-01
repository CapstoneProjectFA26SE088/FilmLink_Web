"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { demoCustomer, formatVnd } from "../data/fixtures";
import styles from "../lab-owner-pages.module.css";

export function CustomersPage() {
	const [selected, setSelected] = useState(false);
	const customer = demoCustomer;
	return <div className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>Tệp khách hàng</p><h1>Khách hàng</h1><p>Xem liên hệ và lịch sử các đơn đã xử lý tại lab.</p></div></header>
		<p className={styles.demoNote}>Danh sách khách và lịch sử đơn hiện là dữ liệu mẫu; chưa tải từ API khách hàng.</p>
		<section className={styles.stats}><div className={styles.stat}><span>Khách hàng mẫu</span><strong>1</strong></div><div className={styles.stat}><span>Đơn dịch vụ</span><strong>{customer.orders.length}</strong></div><div className={styles.stat}><span>Đơn hoàn tất</span><strong>{customer.orders.filter((order) => order.status === "Hoàn tất").length}</strong></div><div className={styles.stat}><span>Đã thanh toán</span><strong>{formatVnd(customer.orders.filter((order) => order.paid).reduce((sum, order) => sum + order.total, 0))}</strong></div></section>
		<section className={styles.panel}><div className={styles.panelHeader}><div><h2>Khách hàng của lab</h2><p>Thông tin liên hệ và hoạt động gần đây.</p></div></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Khách hàng</th><th>Email</th><th>Số điện thoại</th><th>Số đơn</th><th>Hoạt động</th></tr></thead><tbody><tr><td>{customer.name}<small>Thành viên FilmLink</small></td><td>{customer.email}</td><td>{customer.phone}</td><td>{customer.orders.length}</td><td><Button size="sm" variant="outline" onClick={() => setSelected((value) => !value)}>{selected ? "Ẩn lịch sử" : "Xem lịch sử"}</Button></td></tr></tbody></table></div></section>
		{selected && <section className={styles.panel}><div className={styles.panelHeader}><div><h2>Lịch sử đơn · {customer.name}</h2><p>Các đơn gần nhất của khách tại lab.</p></div></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Mã đơn</th><th>Film / quy trình</th><th>Số cuộn</th><th>Ngày trả</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead><tbody>{customer.orders.map((order) => <tr key={order.id}><td>{order.id}</td><td>{order.film}<small>{order.process} · {order.format}</small></td><td>{order.rolls}</td><td>{order.dueDate}</td><td>{formatVnd(order.total)}</td><td><span className={`${styles.badge} ${order.status === "Hoàn tất" ? styles.badgeSuccess : order.status === "Chờ tiếp nhận" ? styles.badgeWarning : styles.badge}`}>{order.status}</span></td></tr>)}</tbody></table></div></section>}
	</div>;
}
