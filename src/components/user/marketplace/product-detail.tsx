import { ArrowLeft, Camera, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { MarketplaceListing } from "./types";

export function MarketplaceProductDetail({
	listing,
	onBack,
}: {
	listing: MarketplaceListing;
	onBack: () => void;
}) {
	const [tab, setTab] = useState<"condition" | "returns" | "lab">("condition");
	const [purchaseNotice, setPurchaseNotice] = useState(false);
	const tabContent = {
		condition: (
			<>
				<h2>Báo cáo tình trạng</h2>
				<p>{listing.condition}</p>
				<dl className="marketplace-condition-list">
					<div><dt>Xếp loại</dt><dd>{listing.grade}</dd></div>
					<div><dt>Vị trí lưu kho</dt><dd>{listing.storage}</dd></div>
					<div><dt>Tình trạng</dt><dd>{listing.status}</dd></div>
				</dl>
			</>
		),
		returns: <><h2>Chính sách trả hàng</h2><p>{listing.returnPolicy}</p></>,
		lab: <><h2>Thông tin lab</h2><p>{listing.labInfo}</p></>,
	};

	return (
		<section className="subpage-section marketplace-section">
			<p className="eyebrow">CHỢ KÝ GỬI · CHI TIẾT SẢN PHẨM</p>
			<div className="subpage-title-row marketplace-detail-heading">
				<div><h1>{listing.name}</h1><p>Kiểm định và lưu giữ bởi {listing.lab}</p></div>
				<Button type="button" variant="outline" onClick={onBack}><ArrowLeft data-icon="inline-start" /> Quay lại chợ</Button>
			</div>
			<div className="marketplace-product-detail">
				<div className="marketplace-product-image"><Camera aria-hidden="true" /><span>Ảnh sản phẩm minh họa</span></div>
				<div className="marketplace-product-summary">
					<span className="status-pill">{listing.status} · Grade {listing.grade}</span>
					<h2>{listing.name}</h2>
					<strong className="marketplace-product-price">{listing.price.toLocaleString("vi-VN")}đ</strong>
					<p><ShieldCheck aria-hidden="true" /> Đã được {listing.lab} kiểm định</p>
					<Button type="button" className="marketplace-buy-button" onClick={() => setPurchaseNotice(true)}>Mua sản phẩm</Button>
					{purchaseNotice && (
						<p className="marketplace-inline-notice" role="status">
							Thanh toán chưa được kết nối. Chưa có giao dịch nào được tạo.
						</p>
					)}
				</div>
			</div>
			<div className="marketplace-tabs" role="tablist" aria-label="Thông tin sản phẩm">
				<button type="button" role="tab" id="marketplace-condition-tab" aria-controls="marketplace-tab-panel" aria-selected={tab === "condition"} onClick={() => setTab("condition")}>Báo cáo tình trạng</button>
				<button type="button" role="tab" id="marketplace-returns-tab" aria-controls="marketplace-tab-panel" aria-selected={tab === "returns"} onClick={() => setTab("returns")}>Chính sách trả hàng</button>
				<button type="button" role="tab" id="marketplace-lab-tab" aria-controls="marketplace-tab-panel" aria-selected={tab === "lab"} onClick={() => setTab("lab")}>Thông tin lab</button>
			</div>
			<div className="marketplace-tab-panel" id="marketplace-tab-panel" role="tabpanel" aria-labelledby={`marketplace-${tab}-tab`} tabIndex={0}>{tabContent[tab]}</div>
		</section>
	);
}
