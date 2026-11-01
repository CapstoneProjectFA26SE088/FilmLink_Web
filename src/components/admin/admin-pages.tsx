"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Building2, CircleDollarSign, ClipboardCheck, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminQueuePage } from "./components/admin-queue-page";
import { adminComplaints, adminExperts, adminKnowledgePosts, adminLabs, adminOrders, adminPayments, adminReports, formatVnd, type AdminDecision, type AdminRecord } from "./data/fixtures";
import styles from "./admin-pages.module.css";

const decisions: Record<string, AdminDecision[]> = {
	labs: [{ label: "Từ chối", status: "Từ chối", variant: "destructive" }, { label: "Duyệt hồ sơ", status: "Đã duyệt" }],
	experts: [{ label: "Từ chối", status: "Từ chối", variant: "destructive" }, { label: "Xác minh", status: "Đã xác minh" }],
	complaints: [{ label: "Đóng khiếu nại", status: "Đã xử lý" }, { label: "Chuyển tiếp", status: "Đang xử lý", variant: "outline" }],
	moderation: [{ label: "Bỏ qua báo cáo", status: "Không vi phạm", variant: "outline" }, { label: "Ẩn nội dung", status: "Đã ẩn", variant: "destructive" }],
	"knowledge-base": [{ label: "Yêu cầu chỉnh sửa", status: "Cần chỉnh sửa", variant: "outline" }, { label: "Duyệt đăng", status: "Đã xuất bản" }],
	payments: [{ label: "Đánh dấu đã đối soát", status: "Đã đối soát" }, { label: "Chi tiết", status: "Chờ đối soát", variant: "outline" }],
};

const queueConfig: Record<string, { title: string; description: string; records: AdminRecord[] }> = {
	labs: { title: "Duyệt hồ sơ Film Lab", description: "Xem xét thông tin cơ sở, thiết bị và điều kiện hoạt động.", records: adminLabs },
	experts: { title: "Duyệt hồ sơ chuyên gia", description: "Xác minh chuyên môn và kinh nghiệm của các chuyên gia.", records: adminExperts },
	complaints: { title: "Khiếu nại", description: "Theo dõi phản ánh phát sinh trong quá trình đặt và xử lý dịch vụ.", records: adminComplaints },
	moderation: { title: "Kiểm duyệt nội dung", description: "Xử lý nội dung cộng đồng được người dùng báo cáo.", records: adminReports },
	"knowledge-base": { title: "Knowledge Base", description: "Biên tập và duyệt các bài hướng dẫn nhiếp ảnh phim.", records: adminKnowledgePosts },
	payments: { title: "Thanh toán & payout", description: "Theo dõi giao dịch, phí nền tảng và các khoản cần đối soát.", records: adminPayments },
};

export function AdminQueueScreen({ section }: { section: keyof typeof queueConfig }) {
	const config = queueConfig[section];
	return <AdminQueuePage title={config.title} description={config.description} initialRecords={config.records} decisions={decisions[section]} />;
}

export function AdminDashboardPage() {
	const pending = adminLabs.filter((item) => item.status.includes("Chờ")).length + adminExperts.filter((item) => item.status.includes("Chờ")).length;
	const stats = [
		{ label: "Đơn hàng hôm nay", value: "04", icon: ClipboardCheck },
		{ label: "Đang xử lý", value: "01", icon: Building2 },
		{ label: "Doanh thu nền tảng", value: formatVnd(320000), icon: CircleDollarSign },
		{ label: "Hồ sơ chờ duyệt", value: String(pending).padStart(2, "0"), icon: UsersRound },
	];
	const actions = [["/admin/labs", "Duyệt hồ sơ lab", "Xem các hồ sơ cơ sở đang chờ"], ["/admin/experts", "Duyệt chuyên gia", "Xác minh thông tin chuyên môn"], ["/admin/payments", "Thanh toán & payout", "Đối soát giao dịch nền tảng"], ["/admin/moderation", "Báo cáo nội dung", "Xử lý báo cáo từ cộng đồng"]];
	return <div className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>Không gian quản trị</p><h1>Tổng quan FilmLink</h1><p>Tình hình vận hành và các việc cần ưu tiên hôm nay.</p></div></header>
		<p className={styles.demoNote}>Một số số liệu tổng quan đang dùng dữ liệu prototype. Các mục quản trị sẽ được nối API theo khả năng backend hiện có.</p>
		<section className={styles.metrics} aria-label="Chỉ số tổng quan">{stats.map(({ label, value, icon: Icon }) => <div className={styles.metric} key={label}><span><Icon size={16} aria-hidden="true" /> {label}</span><strong>{value}</strong></div>)}</section>
		<div className={styles.columns}>
			<section className={styles.panel}><div className={styles.panelHeader}><div><h2>Đơn hàng gần đây</h2><p>Đơn hàng mẫu từ prototype nghiệp vụ</p></div><Link className={styles.inlineLink} href="/admin/complaints">Mở xử lý <ArrowRight size={15} /></Link></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Mã đơn</th><th>Cuộn phim</th><th>Trạng thái</th><th></th></tr></thead><tbody>{adminOrders.map((order) => <tr key={order.id}><td>{order.id}</td><td>{order.film}</td><td><span className={styles.badge}>{order.status}</span></td><td><Link className={styles.tableLink} href="/admin/complaints">Xem khiếu nại</Link></td></tr>)}</tbody></table></div></section>
			<div className={styles.stack}><section className={styles.panel}><div className={styles.panelHeader}><div><h2>Thao tác nhanh</h2><p>Đi tới khu vực cần xử lý</p></div></div><div className={styles.quickLinks}>{actions.map(([href, title, subtitle]) => <Link className={styles.quickLink} href={href} key={href}><span><strong>{title}</strong><small>{subtitle}</small></span><ArrowRight size={16} /></Link>)}</div></section>
			<section className={styles.panel}><div className={styles.panelHeader}><div><h2>Doanh thu theo dịch vụ</h2><p>Phân bổ minh họa trong ngày</p></div></div><div className={styles.barList}>{[["Tráng C-41 + Scan", 72, "230.000đ"], ["Tráng đen trắng", 48, "150.000đ"], ["Scan phim", 31, "96.000đ"]].map(([label, value, amount]) => <div className={styles.barRow} key={label}><div className={styles.barLabels}><span>{label}</span><strong>{amount}</strong></div><div className={styles.progress}><span style={{ width: `${value}%` }} /></div></div>)}</div></section></div>
		</div>
	</div>;
}

type AdminUser = { id: string; name: string; email: string; role: string; status: string };
const seedUsers: AdminUser[] = [
	{ id: "USR-01", name: "Nguyễn Minh Anh", email: "minhanh@example.test", role: "USER", status: "Hoạt động" },
	{ id: "USR-02", name: "Chủ Mộc Lab", email: "moc@example.test", role: "FILM_LAB_OWNER", status: "Hoạt động" },
	{ id: "USR-03", name: "Nguyễn Hoàng Nam", email: "nam@example.test", role: "EXPERT", status: "Chờ xác minh" },
];

export function AdminUsersPage() {
	const [users, setUsers] = useState(seedUsers);
	const [query, setQuery] = useState("");
	const filtered = users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")));
	return <div className={styles.page}><header className={styles.heading}><div><p className={styles.eyebrow}>Quản trị tài khoản</p><h1>Người dùng & vai trò</h1><p>Tra cứu vai trò và trạng thái tài khoản trên nền tảng.</p></div></header><p className={styles.demoNote}>Danh sách hiện là dữ liệu prototype; backend hiện chưa cung cấp API quản trị người dùng.</p><section className={styles.panel}><div className={styles.panelHeader}><div><h2>Tài khoản</h2><p>{filtered.length} người dùng</p></div></div><div className={styles.tools}><input className={styles.search} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên, email hoặc vai trò" aria-label="Tìm người dùng" /></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Người dùng</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{filtered.map((user) => <tr key={user.id}><td>{user.name}<small>{user.id}</small></td><td>{user.email}</td><td><select className={styles.select} aria-label={`Vai trò ${user.name}`} value={user.role} onChange={(event) => setUsers((items) => items.map((item) => item.id === user.id ? { ...item, role: event.target.value } : item))}><option value="USER">Người dùng</option><option value="FILM_LAB_OWNER">Film Lab Owner</option><option value="EXPERT">Chuyên gia</option><option value="ADMIN">Admin</option></select></td><td><span className={styles.badge}>{user.status}</span></td><td><Button size="sm" variant="outline" onClick={() => setUsers((items) => items.map((item) => item.id === user.id ? { ...item, status: item.status === "Đã khóa" ? "Hoạt động" : "Đã khóa" } : item))}>{user.status === "Đã khóa" ? "Mở khóa" : "Khóa"}</Button></td></tr>)}</tbody></table></div></section></div>;
}

type CatalogItem = { id: number | string; code: string; displayName: string; description?: string; status: string };
const catalogTypes = [
	{ id: "film-processes", title: "Quy trình tráng" },
	{ id: "film-formats", title: "Khổ phim" },
	{ id: "service-types", title: "Loại dịch vụ" },
] as const;

export function AdminCatalogPage() {
	const [type, setType] = useState<string>(catalogTypes[0].id);
	const [items, setItems] = useState<CatalogItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<CatalogItem | null>(null);
	const [form, setForm] = useState({ code: "", displayName: "", description: "" });
	const activeType = catalogTypes.find((item) => item.id === type)!;
	const load = useCallback(async () => {
		setLoading(true); setError(""); setMessage("");
		try {
			const response = await fetch(`/api/backend/${type}/all`, { cache: "no-store" });
			const body = await response.json();
			if (!response.ok) throw new Error(body?.message ?? "Không tải được dữ liệu danh mục.");
			const rows = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : Array.isArray(body?.content) ? body.content : [];
			setItems(rows);
		} catch (cause) { setError(cause instanceof Error ? cause.message : "Không tải được dữ liệu danh mục."); }
		finally { setLoading(false); }
	}, [type]);
	useEffect(() => { void load(); }, [load]);
	const activeCount = useMemo(() => items.filter((item) => item.status === "ACTIVE").length, [items]);
	function openForm(item?: CatalogItem) { setEditing(item ?? null); setForm(item ? { code: item.code, displayName: item.displayName, description: item.description ?? "" } : { code: "", displayName: "", description: "" }); setFormOpen(true); setError(""); setMessage(""); }
	async function save(event: FormEvent<HTMLFormElement>) {
		event.preventDefault(); setSaving(true); setError("");
		try {
			const response = await fetch(`/api/backend/${type}${editing ? `/${editing.id}` : ""}`, { method: editing ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(editing ? { displayName: form.displayName.trim(), description: form.description.trim() } : { ...form, code: form.code.trim().toUpperCase(), displayName: form.displayName.trim(), description: form.description.trim() }) });
			const body = await response.json().catch(() => null);
			if (!response.ok) throw new Error(body?.message ?? "Không thể lưu dữ liệu danh mục.");
			setFormOpen(false); await load(); setMessage("Đã lưu thay đổi.");
		} catch (cause) { setError(cause instanceof Error ? cause.message : "Không thể lưu dữ liệu danh mục."); }
		finally { setSaving(false); }
	}
	async function toggle(item: CatalogItem) {
		setError(""); setMessage("");
		try { const response = await fetch(`/api/backend/${type}/${item.id}/status`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: item.status === "ACTIVE" ? "DISCONTINUED" : "ACTIVE" }) }); const body = await response.json().catch(() => null); if (!response.ok) throw new Error(body?.message ?? "Không thể cập nhật trạng thái."); await load(); setMessage("Đã cập nhật trạng thái."); }
		catch (cause) { setError(cause instanceof Error ? cause.message : "Không thể cập nhật trạng thái."); }
	}
	return <div className={styles.page}><header className={styles.heading}><div><p className={styles.eyebrow}>Cấu hình dữ liệu dùng chung</p><h1>Dữ liệu danh mục</h1><p>Quản lý các lựa chọn về quy trình, khổ phim và dịch vụ trên FilmLink.</p></div><Button onClick={() => openForm()}>Thêm danh mục</Button></header><div className={styles.metrics}><div className={styles.metric}><span>Tổng danh mục</span><strong>{items.length}</strong></div><div className={styles.metric}><span>Đang hoạt động</span><strong>{activeCount}</strong></div><div className={styles.metric}><span>Nhóm dữ liệu</span><strong>{catalogTypes.length}</strong></div><div className={styles.metric}><span>Nguồn dữ liệu</span><strong>Backend</strong></div></div><section className={styles.panel}><div className={styles.tabs} role="tablist" aria-label="Nhóm danh mục">{catalogTypes.map((item) => <button type="button" role="tab" aria-selected={type === item.id} className={`${styles.tab} ${type === item.id ? styles.tabActive : ""}`} key={item.id} onClick={() => setType(item.id)}>{item.title}</button>)}</div><div className={styles.panelHeader}><div><h2>{activeType.title}</h2><p>Dữ liệu đang được đọc và ghi trực tiếp qua API.</p></div></div>{error && <p className={styles.errorMessage} role="alert">{error}</p>}{message && <p className={styles.successMessage} role="status">{message}</p>}{loading ? <p className={styles.empty}>Đang tải danh mục…</p> : <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Mã</th><th>Tên hiển thị</th><th>Mô tả</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.code}</td><td>{item.displayName}</td><td>{item.description || "—"}</td><td><span className={`${styles.badge} ${item.status === "ACTIVE" ? styles.badgeSuccess : styles.badgeWarning}`}>{item.status === "ACTIVE" ? "Đang hoạt động" : "Đã ngừng"}</span></td><td><div className={styles.rowActions}><Button size="sm" variant="outline" onClick={() => openForm(item)}>Sửa</Button><Button size="sm" variant="ghost" onClick={() => void toggle(item)}>{item.status === "ACTIVE" ? "Ngừng" : "Kích hoạt"}</Button></div></td></tr>)}{items.length === 0 && <tr><td colSpan={5} className={styles.empty}>Chưa có dữ liệu trong nhóm này.</td></tr>}</tbody></table></div>}</section>{formOpen && <div className={styles.overlay} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}><form className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="catalog-title" onSubmit={save}><div><p className={styles.eyebrow}>{editing ? "Chỉnh sửa" : "Tạo mới"} · {activeType.title}</p><h2 id="catalog-title">{editing ? "Cập nhật danh mục" : "Thêm danh mục"}</h2></div>{!editing && <label className={styles.fieldLabel}>Mã danh mục<input className={styles.field} required maxLength={20} pattern="[A-Za-z0-9_-]+" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} placeholder="Ví dụ: C41" /></label>}<label className={styles.fieldLabel}>Tên hiển thị<input className={styles.field} required maxLength={100} value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} /></label><label className={styles.fieldLabel}>Mô tả<textarea className={styles.field} rows={3} maxLength={500} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>{error && <p className={styles.errorMessage} role="alert">{error}</p>}<div className={styles.formActions}><Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Hủy</Button><Button type="submit" disabled={saving}>{saving ? "Đang lưu…" : "Lưu danh mục"}</Button></div></form></div>}</div>;
}

export function AdminSettingsPage() {
	const [form, setForm] = useState({ commission: "5", cancellation: "20", returnDays: "7", closeDays: "7" });
	const [saved, setSaved] = useState(false);
	return <div className={styles.page}><header className={styles.heading}><div><p className={styles.eyebrow}>Vận hành nền tảng</p><h1>Cấu hình hệ thống</h1><p>Thiết lập các tham số ảnh hưởng đến đơn hàng và giao dịch.</p></div></header><p className={styles.demoNote}>Các tham số đang là giá trị prototype; API cấu hình quản trị chưa có trong backend.</p><section className={styles.panel}><div className={styles.panelHeader}><div><h2>Tham số nền tảng</h2><p>Thay đổi hiện lưu trong phiên làm việc.</p></div></div><form className={styles.formBody} onSubmit={(event) => { event.preventDefault(); setSaved(true); }}><div className={styles.formGrid}>{[["commission", "Phí nền tảng (%)"], ["cancellation", "Phí hủy (%)"], ["returnDays", "Thời gian trả hàng (ngày)"], ["closeDays", "Tự đóng đơn sau (ngày)"]].map(([key, label]) => <label className={styles.fieldLabel} key={key}>{label}<input className={styles.field} type="number" min="0" value={form[key as keyof typeof form]} onChange={(event) => { setSaved(false); setForm({ ...form, [key]: event.target.value }); }} /></label>)}</div>{saved && <p className={styles.successMessage} role="status">Đã lưu trong phiên trình duyệt.</p>}<div className={styles.formActions}><Button type="submit">Lưu cấu hình</Button></div></form></section></div>;
}

export function AdminSubscriptionsPage() {
	const [plans, setPlans] = useState([{ name: "Basic", price: 0, orders: 100, status: "Đang bán" }, { name: "Studio", price: 299000, orders: 1000, status: "Đang bán" }]);
	return <div className={styles.page}><header className={styles.heading}><div><p className={styles.eyebrow}>Doanh thu nền tảng</p><h1>Gói đăng ký</h1><p>Quản lý các gói dịch vụ dành cho Film Lab.</p></div></header><p className={styles.demoNote}>Gói đăng ký hiện hiển thị dữ liệu prototype; backend chưa cung cấp API quản lý gói.</p><section className={styles.metrics}>{plans.map((plan) => <div className={styles.metric} key={plan.name}><span>{plan.name}</span><strong>{plan.price ? formatVnd(plan.price) : "Miễn phí"}</strong><span>{plan.orders.toLocaleString("vi-VN")} đơn / tháng · {plan.status}</span><Button size="sm" variant="outline" onClick={() => setPlans((items) => items.map((item) => item.name === plan.name ? { ...item, status: item.status === "Đang bán" ? "Tạm ngưng" : "Đang bán" } : item))}>{plan.status === "Đang bán" ? "Tạm ngưng" : "Mở bán"}</Button></div>)}</section></div>;
}
