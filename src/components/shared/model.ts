import {
	Camera,
	CircleDot,
	Film,
	Home,
	PackageCheck,
	ShoppingBag,
	Sparkles,
	UserRound,
	UsersRound,
} from "lucide-react";

export type Section =
	| "home"
	| "services"
	| "orders"
	| "marketplace"
	| "community"
	| "assistant"
	| "account";

export type Account = {
	id?: string | number;
	email?: string;
	fullName?: string;
	phoneNumber?: string;
	role?: string;
	status?: string;
};

export type ServiceOrder = {
	id: string;
	lab: string;
	film: string;
	service: string;
	rollCount: number;
	state: string;
	total: number;
	dueDate: string;
	progress: number;
};

export const navigation: { id: Section; label: string; icon: typeof Home }[] = [
	{ id: "home", label: "Trang chủ", icon: Home },
	{ id: "services", label: "Đặt dịch vụ", icon: Camera },
	{ id: "orders", label: "Đơn hàng", icon: PackageCheck },
	{ id: "marketplace", label: "Chợ ký gửi", icon: ShoppingBag },
	{ id: "community", label: "Cộng đồng", icon: UsersRound },
	{ id: "assistant", label: "Trợ lý AI", icon: Sparkles },
	{ id: "account", label: "Tài khoản", icon: UserRound },
];

export const services = [
	{
		id: "color",
		name: "Tráng phim màu C-41",
		description: "Màu sắc tự nhiên, nhận ảnh số trong 2–3 ngày.",
		price: "Từ 75.000đ",
		place: "Hà Nội · 8 cửa hàng",
		tone: "blue",
		icon: Film,
	},
	{
		id: "scan",
		name: "Scan ảnh độ phân giải cao",
		description: "File ảnh sắc nét, sẵn sàng chia sẻ và lưu giữ.",
		price: "Từ 45.000đ",
		place: "TP. Hồ Chí Minh · 12 cửa hàng",
		tone: "lilac",
		icon: Camera,
	},
	{
		id: "bw",
		name: "Tráng phim đen trắng",
		description: "Giữ trọn chất hạt và sắc độ đặc trưng của phim.",
		price: "Từ 90.000đ",
		place: "Toàn quốc · Gửi phim qua bưu điện",
		tone: "dark",
		icon: CircleDot,
	},
];

export const orders = [
	{
		id: "FL-1001",
		lab: "Mộc Lab",
		film: "Kodak Gold 200",
		service: "Tráng C-41 + Scan",
		rollCount: 2,
		state: "Đang tráng",
		total: 160_000,
		dueDate: "2026-11-05",
		progress: 62,
	},
	{
		id: "FL-1002",
		lab: "Mộc Lab",
		film: "Ilford HP5+",
		service: "Tráng B&W + Scan",
		rollCount: 1,
		total: 95_000,
		dueDate: "2026-11-07",
		state: "Chờ tiếp nhận",
		progress: 12,
	},
	{
		id: "FL-1003",
		lab: "Mộc Lab",
		film: "Portra 400",
		service: "Tráng C-41 + Scan",
		rollCount: 2,
		total: 160_000,
		dueDate: "2026-10-29",
		state: "Hoàn tất",
		progress: 100,
	},
	{
		id: "FL-1004",
		lab: "Mộc Lab",
		film: "Kodak Gold 200",
		service: "Chỉ tráng C-41",
		rollCount: 1,
		total: 80_000,
		dueDate: "2026-11-05",
		state: "Đã hủy",
		progress: 0,
	},
];

export const posts = [
	{
		id: "post-kodak-gold-walk",
		initials: "ML",
		name: "Minh Lâm",
		time: "2 giờ trước",
		title: "Một chiều lang thang với Kodak Gold 200",
		copy: "Ánh nắng cuối ngày lúc nào cũng khiến mình muốn chụp thêm một cuộn nữa.",
		film: "Kodak Gold 200",
		color: "community-photo-one",
		likes: 24,
		comments: 13,
	},
	{
		id: "post-ilford-hp5",
		initials: "TH",
		name: "Thu Hà",
		time: "Hôm qua",
		title: "Lần đầu tự tráng phim đen trắng",
		copy: "Có ai có mẹo để kiểm soát nhiệt độ nước ổn định hơn không?",
		film: "Ilford HP5 Plus",
		color: "community-photo-two",
		likes: 18,
		comments: 7,
	},
];
