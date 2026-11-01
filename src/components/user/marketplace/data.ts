import type { ConsignmentRequest, MarketplaceListing } from "./types";

export const marketplaceListings: MarketplaceListing[] = [
	{
		id: "KG-01",
		name: "Canon AE-1 Program",
		type: "Máy ảnh",
		grade: "B",
		lab: "Mộc Lab",
		price: 4_200_000,
		status: "Đang bán",
		storage: "Tủ A · Ngăn 02",
		condition: "Đo sáng ổn định, màn trập chính xác. Xước nhẹ mặt đáy.",
		returnPolicy: "Có thể yêu cầu trả hàng trong 7 ngày kể từ khi nhận sản phẩm theo chính sách của FilmLink.",
		labInfo: "Mộc Lab kiểm định và lưu giữ sản phẩm tại Quận 3, TP. Hồ Chí Minh.",
	},
	{
		id: "KG-02",
		name: "Nikkor 50mm f/1.8",
		type: "Ống kính",
		grade: "A",
		lab: "Mộc Lab",
		price: 1_800_000,
		status: "Đang bán",
		storage: "Tủ B · Ngăn 01",
		condition: "Thấu kính sạch, vòng lấy nét mượt, ngoại hình rất tốt.",
		returnPolicy: "Có thể yêu cầu trả hàng trong 7 ngày kể từ khi nhận sản phẩm theo chính sách của FilmLink.",
		labInfo: "Mộc Lab kiểm định và lưu giữ sản phẩm tại Quận 3, TP. Hồ Chí Minh.",
	},
];

export const initialRequests: ConsignmentRequest[] = [
	{
		id: "KG-REQ-01",
		product: "Nikon FM2",
		type: "Máy ảnh",
		appointment: "2026-11-04",
		lab: "Mộc Lab",
		price: 6_500_000,
		status: "Chờ kiểm định",
	},
];

export const initialListedItems: ConsignmentRequest[] = [
	{
		id: "KG-01",
		product: "Canon AE-1 Program",
		type: "Máy ảnh",
		appointment: "Đang lưu kho",
		lab: "Mộc Lab",
		price: 4_200_000,
		status: "Đang bán",
		grade: "B",
		storage: "Tủ A · Ngăn 02",
	},
	{
		id: "KG-02",
		product: "Nikkor 50mm f/1.8",
		type: "Ống kính",
		appointment: "Đang lưu kho",
		lab: "Mộc Lab",
		price: 1_800_000,
		status: "Đang bán",
		grade: "A",
		storage: "Tủ B · Ngăn 01",
	},
];
