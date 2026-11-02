"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Info, MapPin, UsersRound } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUserWorkspace } from "@/components/user/user-workspace";
import styles from "../expert-workspace.module.css";
import { eventFixtures, readDemoEvents, saveDemoEvents, type ExpertEvent } from "../../shared/expert-demo/demo-session";

const dateLabel = (value: string) => new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export function ExpertEvents() {
	const { account } = useUserWorkspace();
	const [events, setEvents] = useState<ExpertEvent[]>(eventFixtures);
	const [hydrated, setHydrated] = useState(false);
	const [registeredIds, setRegisteredIds] = useState<string[]>([]);
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const [location, setLocation] = useState("");
	const [capacity, setCapacity] = useState(12);
	const [description, setDescription] = useState("");
	const [message, setMessage] = useState("");
	useEffect(() => { setEvents(readDemoEvents()); setHydrated(true); }, []);
	useEffect(() => { if (hydrated) saveDemoEvents(events); }, [events, hydrated]);
	function createEvent(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!title.trim() || !location.trim() || !description.trim()) { setMessage("Hãy nhập đầy đủ tên, địa điểm và mô tả sự kiện."); return; }
		if (!date || new Date(date) <= new Date()) { setMessage("Hãy chọn thời gian trong tương lai."); return; }
		setEvents((current) => [{ id: `evt-${Date.now()}`, title: title.trim(), date, location: location.trim(), description: description.trim(), capacity, registered: 0, host: account?.fullName || "Chuyên gia FilmLink" }, ...current]);
		setTitle(""); setDate(""); setLocation(""); setDescription(""); setCapacity(12); setOpen(false); setMessage("Sự kiện demo đã được tạo và hiển thị trong danh sách.");
	}
	function toggleRegistration(eventId: string) {
		const already = registeredIds.includes(eventId);
		setEvents((current) => current.map((item) => item.id === eventId ? { ...item, registered: Math.max(0, item.registered + (already ? -1 : 1)) } : item));
		setRegisteredIds((current) => already ? current.filter((id) => id !== eventId) : [...current, eventId]);
		setMessage(already ? "Đã hủy đăng ký demo." : "Đã đăng ký tham dự demo.");
	}
	return <main className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>Expert · Hoạt động cộng đồng</p><h1>Workshop & Photowalk</h1><p>Tạo buổi gặp gỡ và xem sức chứa, số người đăng ký.</p></div><Button onClick={() => { setOpen((value) => !value); setMessage(""); }}>{open ? "Đóng biểu mẫu" : "Tạo sự kiện"}</Button></header>
		<p className={styles.note}><Info aria-hidden="true"/> Danh sách, lượt đăng ký và sự kiện hiện chỉ là prototype trong phiên; chưa được lưu hoặc gửi thông báo thật.</p>
		{message && <p className={styles.success} role="status">{message}</p>}
		{open && <section className={styles.panel}><div className={styles.panelHead}><div><h2>Tạo Workshop / Photowalk</h2><p>Thông tin sự kiện để người dùng xem và đăng ký.</p></div></div><form className={styles.form} onSubmit={createEvent}>
			<label className={styles.field}>Tên sự kiện<input className={styles.input} value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} required placeholder="Tên Workshop hoặc Photowalk"/></label>
			<label className={styles.field}>Thời gian<input className={styles.input} type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} required/></label>
			<label className={styles.field}>Địa điểm<input className={styles.input} value={location} onChange={(event) => setLocation(event.target.value)} maxLength={300} required placeholder="Địa chỉ / điểm hẹn"/></label>
			<label className={styles.field}>Sức chứa<input className={styles.input} type="number" value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} min={1} max={200} required/></label>
			<label className={styles.field}>Mô tả<textarea className={styles.textarea} value={description} onChange={(event) => setDescription(event.target.value)} maxLength={2000} required placeholder="Mục tiêu và nội dung buổi gặp…"/></label>
			<div className={styles.formActions}><Button type="submit">Tạo sự kiện demo</Button></div>
		</form></section>}
		<section className={styles.panel}><div className={styles.panelHead}><div><h2>Sự kiện sắp tới</h2><p>{events.length} sự kiện trong danh sách demo</p></div><CalendarDays size={18} aria-hidden="true"/></div><div className={styles.eventGrid}>{events.map((item) => { const full = item.registered >= item.capacity; const registered = registeredIds.includes(item.id); const owned = item.host === (account?.fullName || "") || item.host === "Chuyên gia FilmLink"; return <article className={styles.eventCard} key={item.id}><span className={styles.badge}>{owned ? "Bạn tổ chức" : "Cộng đồng"}</span><h3>{item.title}</h3><p>{item.description}</p><div className={styles.eventMeta}><span><CalendarDays/>{dateLabel(item.date)}</span><span><MapPin/>{item.location}</span><span><UsersRound/>{item.registered}/{item.capacity} người</span></div>{owned ? <small className={styles.success}>Sự kiện của bạn · trạng thái demo</small> : <Button size="sm" variant={registered ? "outline" : "default"} disabled={full && !registered} onClick={() => toggleRegistration(item.id)}>{full && !registered ? "Đã đủ chỗ" : registered ? "Hủy đăng ký" : "Đăng ký tham dự"}</Button>}</article>; })}</div></section>
		<Link className={buttonVariants({ variant: "ghost" })} href="/expert"><ArrowLeft aria-hidden="true"/>Về không gian chuyên gia</Link>
	</main>;
}
