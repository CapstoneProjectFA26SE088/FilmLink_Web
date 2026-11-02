export type AdminRecord = {
	id: string;
	title: string;
	summary: string;
	status: string;
	owner?: string;
	email?: string;
	date?: string;
	amount?: number;
	channel?: string;
	details?: { label: string; value: string }[];
	requiresRejectionReason?: boolean;
};

export type AdminDecision = { label: string; status: string; variant?: "default" | "outline" | "destructive" };

export const adminLabs: AdminRecord[] = [
	{ id: "LAB-02", title: "Mộc Lab", summary: "Quận 3, TP. Hồ Chí Minh · Hồ sơ cơ sở và thiết bị đã gửi", status: "Chờ duyệt", owner: "Chủ Mộc Lab", email: "moc@example.test", date: "01/11/2026" },
	{ id: "LAB-01", title: "Hanoi Darkroom", summary: "Ba Đình, Hà Nội · Đã có máy tráng và máy scan", status: "Đã duyệt", owner: "Hanoi Darkroom", email: "lab@example.test", date: "28/10/2026" },
];

export const adminExperts: AdminRecord[] = [
	{ id: "EX-01", title: "Nguyễn Hoàng Nam", summary: "Hồ sơ nâng cấp từ Photographer lên Photography Expert.", status: "Chờ duyệt", email: "nam@example.test", date: "01/11/2026", requiresRejectionReason: true, details: [{ label: "Kinh nghiệm", value: "5 năm tráng và scan phim màu; từng hướng dẫn quy trình C-41 cho cộng đồng. Có kinh nghiệm đánh giá chất lượng scan và bảo quản film." }, { label: "Portfolio", value: "https://example.test/portfolio/nguyen-hoang-nam" }, { label: "Tài khoản hiện tại", value: "Photographer · vai trò chỉ được nâng sau khi Admin duyệt" }] },
];

export const adminComplaints: AdminRecord[] = [
	{ id: "KN-01", title: "Chất lượng bản scan", summary: "Khách hàng phản ánh màu scan đơn FL-1001 khác với ảnh gốc.", status: "Chờ xử lý", owner: "Nguyễn Minh Anh", date: "01/11/2026" },
];

export const adminReports: AdminRecord[] = [
	{ id: "RPT-01", title: "Bình luận công kích cá nhân", summary: "Bình luận bị báo cáo trong bài viết cộng đồng · 2 lượt báo cáo", status: "Chờ xử lý", owner: "Bài viết Photo Feed", date: "01/11/2026" },
];

export const adminKnowledgePosts: AdminRecord[] = [
	{ id: "POST-02", title: "Đọc histogram của một bản scan phim", summary: "Bài hướng dẫn nhiếp ảnh phim đang chờ biên tập và duyệt xuất bản.", status: "Chờ duyệt KB", owner: "Nguyễn Hoàng Nam", date: "31/10/2026" },
];

export const adminPayments: AdminRecord[] = [
	{ id: "TX-01", title: "Thanh toán FL-1001", summary: "Dịch vụ tráng C-41 + Scan", status: "Thành công", amount: 160000, channel: "VNPay mô phỏng", date: "01/11/2026" },
	{ id: "PAY-01", title: "Payout ký gửi KG-01", summary: "Nikon FM2 · sau thời hạn trả hàng", status: "Chờ đối soát", amount: 3780000, channel: "Chuyển khoản mô phỏng", date: "01/11/2026" },
	{ id: "TX-02", title: "Thanh toán FL-8945088", summary: "Dịch vụ tráng phim", status: "Thành công", amount: 80000, channel: "VNPay mô phỏng", date: "30/10/2026" },
];

export const adminOrders = [
	{ id: "FL-1001", film: "Kodak Gold 200", status: "Đang xử lý" },
	{ id: "FL-1002", film: "Ilford HP5+", status: "Chờ tiếp nhận" },
	{ id: "FL-1003", film: "Portra 400", status: "Hoàn tất" },
	{ id: "FL-8945088", film: "Kodak Gold 200", status: "Đã hủy" },
];

export const formatVnd = (amount: number) => `${amount.toLocaleString("vi-VN")}đ`;
