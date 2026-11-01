import { ArrowRight, Camera, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MarketplaceListing } from "./types";

export function MarketplaceCatalog({
	listings,
	search,
	onSearch,
	typeFilter,
	onTypeFilter,
	onSelectListing,
	onBookConsignment,
	onOpenRequests,
	onOpenBalance,
}: {
	listings: MarketplaceListing[];
	search: string;
	onSearch: (value: string) => void;
	typeFilter: string;
	onTypeFilter: (value: string) => void;
	onSelectListing: (listing: MarketplaceListing) => void;
	onBookConsignment: () => void;
	onOpenRequests: () => void;
	onOpenBalance: () => void;
}) {
	return (
		<section className="subpage-section marketplace-section">
			<p className="eyebrow">FILMLINK · CHỢ KÝ GỬI</p>
			<div className="subpage-title-row">
				<div>
					<h1>Chợ ký gửi</h1>
					<p>Mua thiết bị đã qua kiểm định hoặc gửi món đồ của bạn tới Film Lab.</p>
				</div>
				<span className="service-total">Dữ liệu trải nghiệm</span>
			</div>

			<div className="marketplace-actions" aria-label="Lối tắt chợ ký gửi">
				<Button type="button" onClick={onBookConsignment}>
					<Tag data-icon="inline-start" /> Đặt lịch ký gửi
				</Button>
				<Button type="button" variant="outline" onClick={onOpenRequests}>Yêu cầu của tôi</Button>
				<Button type="button" variant="outline" onClick={onOpenBalance}>Tiền ký gửi</Button>
			</div>

			<div className="marketplace-toolbar">
				<label className="service-search marketplace-search">
					<Search aria-hidden="true" />
					<Input
						value={search}
						onChange={(event) => onSearch(event.target.value)}
						placeholder="Tìm máy ảnh, ống kính, film stock..."
						aria-label="Tìm sản phẩm ký gửi"
					/>
				</label>
				<label className="marketplace-filter-label">
					<span className="sr-only">Lọc loại sản phẩm</span>
					<select
						className="marketplace-select"
						value={typeFilter}
						onChange={(event) => onTypeFilter(event.target.value)}
					>
						<option value="Tất cả">Tất cả loại</option>
						<option value="Máy ảnh">Máy ảnh</option>
						<option value="Ống kính">Ống kính</option>
						<option value="Film stock">Film stock</option>
					</select>
				</label>
			</div>

			{listings.length ? (
				<div className="marketplace-grid">
					{listings.map((listing) => (
						<button
							className="marketplace-card"
							key={listing.id}
							type="button"
							onClick={() => onSelectListing(listing)}
						>
							<span className="marketplace-card__art">
								<Camera aria-hidden="true" />
								<span>Grade {listing.grade}</span>
							</span>
							<span className="marketplace-card__details">
								<span className="marketplace-card__type">{listing.type} · {listing.lab}</span>
								<strong>{listing.name}</strong>
								<span className="marketplace-card__bottom">
									<strong>{listing.price.toLocaleString("vi-VN")}đ</strong>
									<span>{listing.status} <ArrowRight aria-hidden="true" /></span>
								</span>
							</span>
						</button>
					))}
				</div>
			) : (
				<div className="empty-state marketplace-empty">
					<Camera aria-hidden="true" />
					<strong>Chưa tìm thấy sản phẩm phù hợp</strong>
					<span>Thử từ khóa khác hoặc đổi bộ lọc loại sản phẩm.</span>
				</div>
			)}
			<p className="marketplace-demo-note">
				Sản phẩm và mức giá trong màn hình này là dữ liệu minh họa; giao dịch mua chưa được kết nối.
			</p>
		</section>
	);
}
