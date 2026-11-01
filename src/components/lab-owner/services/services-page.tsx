"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { demoServices, formatVnd } from "../data/fixtures";
import styles from "../lab-owner-pages.module.css";

type Service = (typeof demoServices)[number];

export function ServicesPage() {
	const [services, setServices] = useState<Service[]>(demoServices);
	const [query, setQuery] = useState("");
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<Service | null>(null);
	const [form, setForm] = useState({ name: "", process: "C41", format: "35mm", days: "3", price: "80000" });
	const activeCount = services.filter((service) => service.active).length;
	const filtered = useMemo(() => services.filter((service) => `${service.name} ${service.process} ${service.format}`.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi"))), [services, query]);

	function openForm(service?: Service) {
		setEditing(service ?? null);
		setFormOpen(true);
		setForm(service ? { name: service.name, process: service.process, format: service.format, days: String(service.days), price: String(service.price) } : { name: "", process: "C41", format: "35mm", days: "3", price: "80000" });
	}
	function save(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const next = { id: editing?.id ?? `SV-${String(services.length + 1).padStart(2, "0")}`, name: form.name.trim(), process: form.process, format: form.format.trim(), days: Math.max(1, Number(form.days)), price: Math.max(0, Number(form.price)), active: editing?.active ?? true };
		if (!next.name || !next.format) return;
		setServices((items) => editing ? items.map((item) => item.id === editing.id ? next : item) : [...items, next]);
		setEditing(null); setFormOpen(false);
	}

	return <div className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>Thiết lập dịch vụ</p><h1>Dịch vụ & bảng giá</h1><p>Quản lý quy trình tráng, khổ phim, giá và thời gian trả dự kiến.</p></div><Button onClick={() => openForm()}>Thêm dịch vụ</Button></header>
		<p className={styles.demoNote}>Bảng giá mẫu đang hiển thị từ prototype. Lưu và bật/tắt dịch vụ chỉ áp dụng trong phiên này.</p>
		<section className={styles.stats}><div className={styles.stat}><span>Tổng gói dịch vụ</span><strong>{services.length}</strong></div><div className={styles.stat}><span>Đang cung cấp</span><strong>{activeCount}</strong></div><div className={styles.stat}><span>Quy trình hỗ trợ</span><strong>{new Set(services.map((service) => service.process)).size}</strong></div><div className={styles.stat}><span>Thời gian trung bình</span><strong>{Math.round(services.reduce((sum, service) => sum + service.days, 0) / (services.length || 1))} ngày</strong></div></section>
		<section className={styles.panel}><div className={styles.panelHeader}><div><h2>Gói dịch vụ</h2><p>Giá công khai cho khách trước khi đặt tráng.</p></div></div><div className={styles.tools}><input className={styles.search} placeholder="Tìm tên dịch vụ hoặc quy trình" aria-label="Tìm dịch vụ" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Tên dịch vụ</th><th>Quy trình</th><th>Khổ phim</th><th>Trả dự kiến</th><th>Giá / cuộn</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{filtered.map((service) => <tr key={service.id}><td>{service.name}<small>{service.id}</small></td><td>{service.process}</td><td>{service.format}</td><td>{service.days} ngày</td><td>{formatVnd(service.price)}</td><td><span className={`${styles.badge} ${service.active ? styles.badgeSuccess : styles.badgeWarning}`}>{service.active ? "Đang cung cấp" : "Đã tạm ngưng"}</span></td><td><div className={styles.tableActions}><Button size="sm" variant="outline" onClick={() => openForm(service)}>Sửa</Button><Button size="sm" variant="ghost" onClick={() => setServices((items) => items.map((item) => item.id === service.id ? { ...item, active: !item.active } : item))}>{service.active ? "Tạm ngưng" : "Mở lại"}</Button></div></td></tr>)}{filtered.length === 0 && <tr><td colSpan={7} className={styles.empty}>Không tìm thấy dịch vụ.</td></tr>}</tbody></table></div></section>
		{formOpen && <div className={styles.overlay} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}><form className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="service-dialog-title" onSubmit={save}><div><p className={styles.eyebrow}>{editing ? "Chỉnh sửa" : "Tạo mới"}</p><h2 id="service-dialog-title">{editing ? "Cập nhật dịch vụ" : "Thêm gói dịch vụ"}</h2><p>Điền thông tin hiển thị trong danh sách dịch vụ của lab.</p></div><label className={styles.fieldLabel}>Tên dịch vụ<input className={styles.field} required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ví dụ: Tráng C41 + Scan" /></label><div className={styles.fieldGrid}><label className={styles.fieldLabel}>Quy trình<select className={styles.field} value={form.process} onChange={(event) => setForm({ ...form, process: event.target.value })}><option>C41</option><option>B&W</option><option>E-6</option></select></label><label className={styles.fieldLabel}>Khổ phim<input className={styles.field} value={form.format} onChange={(event) => setForm({ ...form, format: event.target.value })} /></label><label className={styles.fieldLabel}>Thời gian xử lý (ngày)<input className={styles.field} type="number" min="1" value={form.days} onChange={(event) => setForm({ ...form, days: event.target.value })} /></label><label className={styles.fieldLabel}>Giá mỗi cuộn (đ)<input className={styles.field} type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label></div><div className={styles.dialogActions}><Button type="button" variant="outline" onClick={() => { setEditing(null); setFormOpen(false); }}>Hủy</Button><Button type="submit">Lưu dịch vụ</Button></div></form></div>}
	</div>;
}
