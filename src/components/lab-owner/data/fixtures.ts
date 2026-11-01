export type ServiceOrder = {
	id: string;
	customer: string;
	email: string;
	film: string;
	rolls: number;
	process: string;
	format: string;
	status: "Chờ tiếp nhận" | "Đang xử lý" | "Chờ bàn giao" | "Hoàn tất" | "Đã hủy";
	total: number;
	dueDate: string;
	paid: boolean;
	step: number;
};

export const demoOrders: ServiceOrder[] = [
	{ id: "FL-1001", customer: "Nguyễn Minh Anh", email: "minh@example.test", film: "Kodak Gold 200", rolls: 2, process: "C41", format: "35mm", status: "Đang xử lý", total: 160000, dueDate: "2026-11-05", paid: true, step: 2 },
	{ id: "FL-1002", customer: "Nguyễn Minh Anh", email: "minh@example.test", film: "Ilford HP5+", rolls: 1, process: "B&W", format: "120", status: "Chờ tiếp nhận", total: 95000, dueDate: "2026-11-07", paid: false, step: 0 },
	{ id: "FL-1003", customer: "Nguyễn Minh Anh", email: "minh@example.test", film: "Portra 400", rolls: 2, process: "C41", format: "35mm", status: "Hoàn tất", total: 160000, dueDate: "2026-10-29", paid: true, step: 5 },
	{ id: "FL-8945088", customer: "Lương Thành Huy", email: "huy@example.test", film: "Kodak Gold 200", rolls: 1, process: "C41", format: "35mm", status: "Đã hủy", total: 80000, dueDate: "2026-11-05", paid: true, step: 0 },
];

export const demoServices = [
	{ id: "SV-01", name: "Tráng C41 + Scan", process: "C41", format: "35mm", days: 3, price: 80000, active: true },
	{ id: "SV-02", name: "Tráng B&W + Scan", process: "B&W", format: "120", days: 4, price: 95000, active: true },
];

export const demoMachines = [
	{ id: "MC-01", name: "Noritsu V30", type: "Máy tráng", capacity: 16, process: "C41", status: "Hoạt động" },
	{ id: "MC-02", name: "Frontier SP3000", type: "Máy scan", capacity: 24, process: "C41", status: "Hoạt động" },
];

export const demoConsignments = [
	{ id: "KG-01", name: "Nikon FM2", price: 6500000, grade: "Chờ kiểm định", storage: "Khu kiểm định", date: "2026-11-04", owner: "Trần Gia Bảo" },
	{ id: "KG-02", name: "Canon AE-1 Program", price: 4200000, grade: "Đang bán", storage: "Tủ A · Ngăn 02", date: "2026-10-28", owner: "Lê Khánh Linh" },
	{ id: "KG-03", name: "Nikkor 50mm f/1.8", price: 1800000, grade: "Đang bán", storage: "Tủ B · Ngăn 01", date: "2026-10-30", owner: "Phạm Quốc Việt" },
];

export const demoPayments = [
	{ id: "TX-01", subject: "Thanh toán FL-1001", amount: 160000, channel: "VNPay mô phỏng", status: "Thành công", date: "01/11/2026" },
	{ id: "PAY-01", subject: "Payout ký gửi KG-01", amount: 3780000, channel: "Chuyển khoản mô phỏng", status: "Chờ đối soát", date: "01/11/2026" },
	{ id: "TX-02", subject: "Thanh toán FL-8945088", amount: 80000, channel: "VNPay mô phỏng", status: "Thành công", date: "30/10/2026" },
];

export const demoCustomer = { name: "Nguyễn Minh Anh", email: "minh@example.test", phone: "090 123 4567", orders: demoOrders.slice(0, 3) };

export const formatVnd = (amount: number) => `${amount.toLocaleString("vi-VN")}đ`;
