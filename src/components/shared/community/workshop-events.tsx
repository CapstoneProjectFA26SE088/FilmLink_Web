"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Info, MapPin, UsersRound } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUserWorkspace } from "@/components/user/user-workspace";
import styles from "@/components/expert/expert-workspace.module.css";
import { eventFixtures, readDemoEvents, saveDemoEvents, type ExpertEvent } from "@/components/shared/expert-demo/demo-session";

export function WorkshopEvents() {
	const { account } = useUserWorkspace();
	const [events, setEvents] = useState<ExpertEvent[]>(eventFixtures);
	const [hydrated, setHydrated] = useState(false);
	const [registered, setRegistered] = useState<string[]>([]);
	const [notice, setNotice] = useState("");
	useEffect(() => { setEvents(readDemoEvents()); setHydrated(true); }, []);
	useEffect(() => { if (hydrated) saveDemoEvents(events); }, [events, hydrated]);
	return <main className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>Cộng đồng · Gặp gỡ ngoài đời</p><h1>Workshop & Photowalk</h1><p>Tìm buổi chụp chung và hoạt động chia sẻ về nhiếp ảnh phim.</p></div><Link className={buttonVariants({ variant: "outline" })} href="/community"><ArrowLeft aria-hidden="true"/>Về cộng đồng</Link></header>
		<p className={styles.note}><Info aria-hidden="true"/> Sự kiện và lượt đăng ký là dữ liệu prototype; thao tác chỉ phản hồi trong phiên và chưa gửi xác nhận thật.</p>
		{notice && <p role="status" className={styles.success}>{notice}</p>}
		<section className={styles.panel}><div className={styles.panelHead}><div><h2>Sự kiện đang mở</h2><p>Đăng ký giữ chỗ trong giao diện demo</p></div><CalendarDays size={18}/></div><div className={styles.eventGrid}>{events.map((item) => { const joined = registered.includes(item.id); return <article className={styles.eventCard} key={item.id}><span className={styles.badge}>Được tổ chức bởi {item.host}</span><h3>{item.title}</h3><p>{item.description}</p><div className={styles.eventMeta}><span><CalendarDays aria-hidden="true"/>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.date))}</span><span><MapPin aria-hidden="true"/>{item.location}</span><span><UsersRound aria-hidden="true"/>{item.registered + (joined ? 1 : 0)}/{item.capacity} người</span></div><Button size="sm" variant={joined ? "outline" : "default"} disabled={item.registered >= item.capacity && !joined} onClick={() => { setRegistered((current) => joined ? current.filter((id) => id !== item.id) : [...current, item.id]); setEvents((current) => current.map((event) => event.id === item.id ? { ...event, registered: Math.max(0, event.registered + (joined ? -1 : 1)) } : event)); setNotice(joined ? "Đã hủy giữ chỗ demo." : `Đã giữ chỗ demo cho ${account?.fullName || "tài khoản của bạn"}.`); }}>{item.registered >= item.capacity && !joined ? "Đã đủ chỗ" : joined ? "Hủy đăng ký" : "Đăng ký tham dự"}</Button></article>; })}</div></section>
	</main>;
}
