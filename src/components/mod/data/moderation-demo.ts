export type ReportStatus = "OPEN" | "DISMISSED" | "ACTIONED";
export type ModerationDecision = "KEEP" | "HIDE" | "REMOVE";
export type AuthorSanction = "NONE" | "WARNING" | "LOCK_7_DAYS" | "LOCK_30_DAYS";
export type ReportTarget =
	| "PHOTO_FEED_POST"
	| "PHOTO_FEED_COMMENT"
	| "FORUM_THREAD"
	| "FORUM_ANSWER"
	| "LAB_REVIEW"
	| "CONSIGNMENT_LISTING";

export type ModerationReport = {
	id: string;
	targetType: ReportTarget;
	targetLabel: string;
	targetTitle: string;
	content: string;
	author: string;
	violation: string;
	reporter: string;
	description: string;
	createdAt: string;
	status: ReportStatus;
	decision?: ModerationDecision;
	reason?: string;
	sanction?: AuthorSanction;
	handledAt?: string;
};

export const MODERATION_STORAGE_KEY = "filmlink-moderation-demo-v1";

export const reportFixtures: ModerationReport[] = [
	{
		id: "RPT-01",
		targetType: "PHOTO_FEED_COMMENT",
		targetLabel: "Bình luận Photo Feed",
		targetTitle: "Bình luận công kích cá nhân",
		content: "Bạn chẳng biết gì về chụp phim mà cũng đi chia sẻ kinh nghiệm.",
		author: "Nguyễn Minh Anh",
		violation: "Nội dung không phù hợp",
		reporter: "Trần Gia Huy",
		description: "Ngôn từ thiếu tôn trọng, nhắm trực tiếp vào người đăng bài.",
		createdAt: "02/11/2026 · 09:42",
		status: "OPEN",
	},
	{
		id: "RPT-02",
		targetType: "PHOTO_FEED_POST",
		targetLabel: "Bài viết Photo Feed",
		targetTitle: "Bài đăng quảng cáo lặp lại",
		content: "Thanh lý máy ảnh film, liên hệ mua nhanh tại đường dẫn ngoài nền tảng.",
		author: "Camera Deal 24h",
		violation: "Spam",
		reporter: "Lê Hoàng Phúc",
		description: "Tài khoản đăng cùng một nội dung nhiều lần trong các nhóm cộng đồng.",
		createdAt: "02/11/2026 · 08:17",
		status: "OPEN",
	},
	{
		id: "RPT-03",
		targetType: "LAB_REVIEW",
		targetLabel: "Đánh giá Film Lab",
		targetTitle: "Đánh giá có dấu hiệu giả mạo",
		content: "Lab này làm hỏng toàn bộ cuộn phim của tôi. Đừng ai đến đây.",
		author: "filmlover_88",
		violation: "Thông tin sai lệch",
		reporter: "Saigon Film Lab",
		description: "Lab phản ánh người viết không có đơn hàng tương ứng.",
		createdAt: "01/11/2026 · 17:30",
		status: "OPEN",
	},
	{
		id: "RPT-04",
		targetType: "CONSIGNMENT_LISTING",
		targetLabel: "Tin ký gửi",
		targetTitle: "Tin bán hàng nghi có dấu hiệu lừa đảo",
		content: "Máy ảnh tình trạng hoàn hảo, yêu cầu chuyển khoản đặt cọc trước để giữ hàng.",
		author: "Vintage Camera Shop",
		violation: "Gian lận",
		reporter: "Phạm Nhật Nam",
		description: "Người báo cáo không tìm thấy thông tin xác thực người bán.",
		createdAt: "01/11/2026 · 13:05",
		status: "DISMISSED",
		decision: "KEEP",
		reason: "Chưa có bằng chứng cho thấy nội dung vi phạm; người bán đã bổ sung thông tin xác thực.",
		handledAt: "01/11/2026 · 15:20",
	},
];

export function readModerationReports(): ModerationReport[] {
	if (typeof window === "undefined") return reportFixtures;
	try {
		const stored = window.sessionStorage.getItem(MODERATION_STORAGE_KEY);
		if (!stored) return reportFixtures;
		const parsed: unknown = JSON.parse(stored);
		return Array.isArray(parsed) ? parsed as ModerationReport[] : reportFixtures;
	} catch {
		return reportFixtures;
	}
}

export function saveModerationReports(reports: ModerationReport[]) {
	if (typeof window === "undefined") return;
	try {
		window.sessionStorage.setItem(MODERATION_STORAGE_KEY, JSON.stringify(reports));
	} catch {
		// Browser storage can be disabled; the in-memory screen state remains usable.
	}
}
