import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarDays, FileCheck2, Info, MessageCircleQuestion, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import styles from "../expert-workspace.module.css";

const shortcuts = [
	{ href: "/expert-articles", title: "Bài viết chuyên môn", text: "Xuất bản bài viết và gửi nội dung phù hợp để xét duyệt Knowledge Base.", icon: BookOpenText },
	{ href: "/expert-events", title: "Workshop & Photowalk", text: "Tạo buổi gặp gỡ, quản lý sức chứa và theo dõi đăng ký minh họa.", icon: CalendarDays },
	{ href: "/community", title: "Trả lời cộng đồng", text: "Tiếp tục thảo luận và hỗ trợ người chụp phim trong feed.", icon: MessageCircleQuestion },
];

export function ExpertOverview() {
	return <main className={styles.page}>
		<header className={styles.heading}><div><p className={styles.eyebrow}>FilmLink · Expert</p><h1>Không gian chuyên gia</h1><p>Chia sẻ kiến thức, hỗ trợ cộng đồng và tổ chức hoạt động nhiếp ảnh phim.</p></div><Link className={buttonVariants()} href="/expert-articles">Soạn bài viết <ArrowRight aria-hidden="true" /></Link></header>
		<p className={styles.note}><Info aria-hidden="true" /> Bản trải nghiệm này đang dùng dữ liệu và trạng thái demo trong phiên; nội dung chưa được gửi lên máy chủ hoặc lưu thành hồ sơ thật.</p>
		<section className={styles.metrics} aria-label="Tổng quan hoạt động"><div className={styles.metric}><span>Bài viết công khai</span><strong>03</strong></div><div className={styles.metric}><span>Đề xuất Knowledge Base</span><strong>01</strong></div><div className={styles.metric}><span>Sự kiện sắp tới</span><strong>01</strong></div></section>
		<div className={styles.grid}><section className={styles.panel}><div className={styles.panelHead}><div><h2>Bắt đầu công việc</h2><p>Các công cụ riêng của vai trò chuyên gia</p></div><Sparkles size={18} aria-hidden="true" /></div><div className={styles.panelBody}>{shortcuts.map(({ href, title, text, icon: Icon }) => <Link className={styles.quickLink} href={href} key={href}><Icon aria-hidden="true"/><span><strong>{title}</strong><small>{text}</small></span><ArrowRight aria-hidden="true"/></Link>)}</div></section>
			<div className={styles.stack}><section className={styles.panel}><div className={styles.panelHead}><div><h2>Quy trình nội dung</h2><p>Bài công khai và Knowledge Base có trạng thái riêng</p></div></div><div className={styles.panelBody}><div className={styles.listItem}><span className={styles.listCopy}><strong>Đăng bài cộng đồng</strong><small>Bài được xuất bản trên feed trước.</small></span><span className={`${styles.badge} ${styles.badgeSuccess}`}>Công khai</span></div><div className={styles.listItem}><span className={styles.listCopy}><strong>Đề xuất vào Knowledge Base</strong><small>Moderator sẽ xem xét riêng sau khi bài đã đăng.</small></span><span className={`${styles.badge} ${styles.badgeWarning}`}>Tùy chọn</span></div></div></section>
				<section className={styles.panel}><div className={styles.panelHead}><div><h2>Quyền chuyên gia</h2><p>Vai trò được cấp sau khi Admin duyệt hồ sơ</p></div><FileCheck2 size={18} aria-hidden="true" /></div><div className={styles.panelBody}><p style={{ margin: 0, color: "var(--text-secondary)", fontSize: ".76rem", lineHeight: 1.55 }}>Tài khoản Expert vẫn kế thừa các chức năng Photographer như đặt dịch vụ, theo dõi đơn, ký gửi, cộng đồng, trợ lý AI và quản lý tài khoản.</p></div></section></div>
		</div>
	</main>;
}
