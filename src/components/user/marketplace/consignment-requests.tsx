import { ArrowRight, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ConsignmentRequest } from "./types";

export function ConsignmentRequests({
	requests,
	listedItems,
	search,
	onSearch,
	onNewRequest,
	onNegotiate,
	onOpenListing,
}: {
	requests: ConsignmentRequest[];
	listedItems: ConsignmentRequest[];
	search: string;
	onSearch: (value: string) => void;
	onNewRequest: () => void;
	onNegotiate: (request: ConsignmentRequest) => void;
	onOpenListing: (id: string) => void;
}) {
	const match = (item: ConsignmentRequest) =>
		`${item.product} ${item.lab} ${item.status}`.toLowerCase().includes(search.toLowerCase());
	const filteredRequests = requests.filter(match);
	const filteredListedItems = listedItems.filter(match);

	return (
		<section className="subpage-section marketplace-section">
			<p className="eyebrow">CHỢ KÝ GỬI · QUẢN LÝ CỦA BẠN</p>
			<div className="subpage-title-row">
				<div><h1>Yêu cầu ký gửi của tôi</h1><p>Theo dõi lịch hẹn, kiểm định và các sản phẩm đang trưng bày.</p></div>
				<Button type="button" onClick={onNewRequest}><Plus data-icon="inline-start" /> Đặt lịch mới</Button>
			</div>
			<label className="service-search marketplace-requests-search">
				<Search aria-hidden="true" />
				<Input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Tìm trong danh sách..." aria-label="Tìm yêu cầu ký gửi" />
			</label>
			<div className="marketplace-table-wrap">
				<table className="marketplace-table">
					<caption className="sr-only">Yêu cầu ký gửi của tôi</caption>
					<thead><tr><th>Sản phẩm</th><th>Lịch hẹn</th><th>Lab</th><th>Giá mong muốn</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
					<tbody>
						{filteredRequests.map((request) => (
							<tr key={request.id}>
								<td data-label="Sản phẩm">{request.product}</td><td data-label="Lịch hẹn">{request.appointment}</td><td data-label="Lab">{request.lab}</td><td data-label="Giá mong muốn">{request.price.toLocaleString("vi-VN")}đ</td><td data-label="Trạng thái"><span className="marketplace-status">{request.status}</span></td>
								<td data-label="Thao tác"><Button type="button" size="sm" variant="outline" onClick={() => onNegotiate(request)}>Thương lượng</Button></td>
							</tr>
						))}
						{!filteredRequests.length && <tr><td className="marketplace-no-results" colSpan={6}>Chưa có yêu cầu phù hợp.</td></tr>}
					</tbody>
				</table>
			</div>

			<div className="marketplace-listed-heading"><div><p className="eyebrow">SẢN PHẨM Ở LAB</p><h2>Hàng đang trưng bày</h2></div><span>{filteredListedItems.length} sản phẩm</span></div>
			<div className="marketplace-table-wrap">
				<table className="marketplace-table">
					<caption className="sr-only">Hàng đang trưng bày tại Film Lab</caption>
					<thead><tr><th>Tên</th><th>Giá</th><th>Xếp loại</th><th>Vị trí kho</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
					<tbody>
						{filteredListedItems.map((item) => (
							<tr key={item.id}>
								<td data-label="Tên">{item.product}</td><td data-label="Giá">{item.price.toLocaleString("vi-VN")}đ</td><td data-label="Xếp loại">{item.grade}</td><td data-label="Vị trí kho">{item.storage}</td><td data-label="Trạng thái"><span className="marketplace-status">{item.status}</span></td>
								<td data-label="Thao tác"><Button type="button" variant="ghost" size="sm" onClick={() => onOpenListing(item.id)}>Chi tiết <ArrowRight data-icon="inline-end" /></Button></td>
							</tr>
						))}
						{!filteredListedItems.length && <tr><td className="marketplace-no-results" colSpan={6}>Chưa có sản phẩm phù hợp.</td></tr>}
					</tbody>
				</table>
			</div>
			<p className="marketplace-demo-note">Yêu cầu và vị trí lưu kho được lấy từ dữ liệu minh họa.</p>
		</section>
	);
}
