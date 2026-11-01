import {
	Archive,
	CalendarDays,
	ChartColumnIncreasing,
	ClipboardList,
	LayoutDashboard,
	SlidersHorizontal,
	UsersRound,
	WalletCards,
	type LucideIcon,
} from "lucide-react";
import type { WorkspaceNotification } from "@/components/shared/layout/workspace-notifications";

export type LabOwnerSection =
	| "overview"
	| "orders"
	| "services"
	| "machines"
	| "consignments"
	| "revenue"
	| "customers"
	| "settlements";

export type LabOwnerOrder = {
	id: string;
	film: string;
	status: "Đang xử lý" | "Chờ tiếp nhận" | "Hoàn tất" | "Đã hủy";
};

export const labOwnerNavigation: { id: LabOwnerSection; label: string; icon: LucideIcon }[] = [
	{ id: "overview", label: "Tổng quan", icon: LayoutDashboard },
	{ id: "orders", label: "Hàng đợi đơn", icon: ClipboardList },
	{ id: "services", label: "Dịch vụ & bảng giá", icon: SlidersHorizontal },
	{ id: "machines", label: "Máy & lịch xử lý", icon: CalendarDays },
	{ id: "consignments", label: "Ký gửi", icon: Archive },
	{ id: "revenue", label: "Doanh thu", icon: ChartColumnIncreasing },
	{ id: "customers", label: "Khách hàng", icon: UsersRound },
	{ id: "settlements", label: "Công nợ", icon: WalletCards },
];

// Dữ liệu minh hoạ cho đến khi backend có API đơn hàng và báo cáo Film Lab.
export const labOwnerOrders: LabOwnerOrder[] = [
	{ id: "FL-1001", film: "Kodak Gold 200", status: "Đang xử lý" },
	{ id: "FL-1002", film: "Ilford HP5+", status: "Chờ tiếp nhận" },
	{ id: "FL-1003", film: "Portra 400", status: "Hoàn tất" },
	{ id: "FL-8945088", film: "Kodak Gold 200", status: "Đã hủy" },
];

export const labOwnerServices = [
	{ name: "Tráng C41 + Scan", revenue: 320_000, share: 100 },
	{ name: "Tráng B&W + Scan", revenue: 0, share: 0 },
];

// Nội dung mẫu cho đến khi backend cung cấp API thông báo theo vai trò.
export const labOwnerNotifications: WorkspaceNotification[] = [
	{
		id: "pending-order",
		title: "Có đơn phim mới cần tiếp nhận",
		description: "Đơn FL-1002 · Ilford HP5+",
		time: "10 phút trước",
	},
	{
		id: "lab-profile",
		title: "Hồ sơ Film Lab đang chờ liên kết",
		description: "Hoàn tất hồ sơ để bắt đầu nhận đơn trên FilmLink.",
		time: "Hôm nay",
	},
	{
		id: "settlement",
		title: "Có khoản đối soát mới",
		description: "Xem lại khoản thu dự kiến trong tuần này.",
		time: "Hôm qua",
	},
];

export const labOwnerSectionById = {
	...Object.fromEntries(labOwnerNavigation.map(({ id, label }) => [id, label])) as Record<LabOwnerSection, string>,
} satisfies Record<LabOwnerSection, string>;
