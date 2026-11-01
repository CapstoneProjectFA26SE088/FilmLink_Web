export type LabServicePackage = {
	id: string;
	name: string;
	service: string;
	process: string;
	format: string;
	unitPrice: number;
	turnaroundDays: number;
};

export type FilmLab = {
	id: string;
	name: string;
	district: string;
	city: "TP. Hồ Chí Minh" | "Hà Nội";
	place: string;
	distance: string;
	rating: number;
	reviewCount: number;
	turnaroundDays: number;
	priceFrom: number;
	equipment: string;
	openHours: string;
	description: string;
	packages: LabServicePackage[];
};

export const filmLabs: FilmLab[] = [
	{
		id: "moc",
		name: "Mộc Lab",
		district: "Quận 3",
		city: "TP. Hồ Chí Minh",
		place: "Quận 3, TP. Hồ Chí Minh",
		distance: "2,4 km",
		rating: 4.9,
		reviewCount: 128,
		turnaroundDays: 3,
		priceFrom: 80_000,
		equipment: "Noritsu HS-1800 · Frontier SP3000",
		openHours: "09:00 – 19:00",
		description: "Lab phim thân thiện, chú trọng màu sắc tự nhiên và scan kỹ từng cuộn.",
		packages: [
			{ id: "moc-c41-35", name: "Tráng C41 + Scan", service: "Tráng + Scan", process: "C41", format: "35mm", unitPrice: 80_000, turnaroundDays: 3 },
			{ id: "moc-bw-120", name: "Tráng B&W + Scan", service: "Tráng + Scan", process: "B&W", format: "120", unitPrice: 95_000, turnaroundDays: 4 },
			{ id: "moc-e6-35", name: "Tráng E-6 + Scan", service: "Tráng + Scan", process: "E6", format: "35mm", unitPrice: 120_000, turnaroundDays: 5 },
		],
	},
	{
		id: "saigon",
		name: "Saigon Film Lab",
		district: "Bình Thạnh",
		city: "TP. Hồ Chí Minh",
		place: "Bình Thạnh, TP. Hồ Chí Minh",
		distance: "4,1 km",
		rating: 4.8,
		reviewCount: 96,
		turnaroundDays: 2,
		priceFrom: 70_000,
		equipment: "Fujifilm Frontier · Noritsu HS-1800",
		openHours: "08:30 – 20:00",
		description: "Nhận tráng nhanh nội thành, có nhiều lựa chọn scan cho ảnh cần chia sẻ sớm.",
		packages: [
			{ id: "saigon-c41-35", name: "Tráng C41 + Scan", service: "Tráng + Scan", process: "C41", format: "35mm", unitPrice: 70_000, turnaroundDays: 2 },
			{ id: "saigon-bw-35", name: "Tráng B&W + Scan", service: "Tráng + Scan", process: "B&W", format: "35mm", unitPrice: 90_000, turnaroundDays: 3 },
			{ id: "saigon-c41-120", name: "Tráng C41 + Scan 120", service: "Tráng + Scan", process: "C41", format: "120", unitPrice: 90_000, turnaroundDays: 3 },
		],
	},
	{
		id: "lam",
		name: "Lâm Lab",
		district: "Hai Bà Trưng",
		city: "Hà Nội",
		place: "Hai Bà Trưng, Hà Nội",
		distance: "—",
		rating: 4.7,
		reviewCount: 74,
		turnaroundDays: 4,
		priceFrom: 90_000,
		equipment: "Noritsu QSS · Hasselblad Flextight",
		openHours: "09:00 – 18:00",
		description: "Không gian lab độc lập với dịch vụ scan độ phân giải cao và tư vấn trực tiếp.",
		packages: [
			{ id: "lam-c41-35", name: "Tráng C41 + Scan", service: "Tráng + Scan", process: "C41", format: "35mm", unitPrice: 90_000, turnaroundDays: 4 },
			{ id: "lam-bw-120", name: "Tráng B&W + Scan", service: "Tráng + Scan", process: "B&W", format: "120", unitPrice: 110_000, turnaroundDays: 5 },
		],
	},
];

export const filmStocks = [
	{ name: "Kodak Gold 200", process: "C41" },
	{ name: "Kodak ColorPlus 200", process: "C41" },
	{ name: "Kodak Portra 400", process: "C41" },
	{ name: "Fujifilm 400", process: "C41" },
	{ name: "Ilford HP5+", process: "B&W" },
	{ name: "Kodak Tri-X 400", process: "B&W" },
	{ name: "Kodak Ektachrome E100", process: "E6" },
];

export const deliveryMethods = [
	{
		id: "SELF_DROP_OFF",
		label: "Tự mang đến lab",
		description: "Chủ động gửi cuộn phim trực tiếp tại Film Lab.",
		fee: 0,
	},
	{
		id: "PICKUP",
		label: "Lấy phim nội thành",
		description: "Đơn vị vận chuyển đến lấy phim theo khung giờ bạn chọn.",
		fee: 30_000,
	},
	{
		id: "PARCEL_SHIPPING",
		label: "Gửi phim liên tỉnh",
		description: "Bạn tự gửi phim tới lab; phí vận chuyển ước tính.",
		fee: 45_000,
	},
] as const;

export const paymentMethods = [
	{ id: "ONLINE", label: "VNPay mô phỏng", description: "Thanh toán online sẽ được tích hợp sau." },
	{ id: "PAY_AT_LAB", label: "Thanh toán tại lab", description: "Thanh toán khi mang phim đến Film Lab." },
	{ id: "COD", label: "Thanh toán khi lấy phim", description: "Chỉ áp dụng với lấy phim hoặc gửi liên tỉnh." },
] as const;

export type HandoverMethod = (typeof deliveryMethods)[number]["id"];
export type PaymentMethod = (typeof paymentMethods)[number]["id"];
