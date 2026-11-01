import { ArrowLeft, MessageSquareText } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ConsignmentRequest, PriceOffer } from "./types";

export function PriceNegotiation({
	request,
	offers,
	onBack,
	onSendOffer,
	onAccept,
}: {
	request: ConsignmentRequest;
	offers: PriceOffer[];
	onBack: () => void;
	onSendOffer: (offer: PriceOffer) => void;
	onAccept: () => void;
}) {
	const [price, setPrice] = useState("");
	const [reason, setReason] = useState("");
	const canOffer = offers.length < 3;

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!canOffer) return;
		onSendOffer({ price: Number(price), reason: reason.trim(), by: "Bạn" });
		setPrice("");
		setReason("");
	}

	return (
		<section className="subpage-section marketplace-section">
			<p className="eyebrow">CHỢ KÝ GỬI · THỎA THUẬN GIÁ</p>
			<div className="subpage-title-row">
				<div><h1>Thương lượng giá ký gửi</h1><p>Trao đổi mức giá với lab trước khi sản phẩm được niêm yết.</p></div>
				<Button type="button" variant="outline" onClick={onBack}><ArrowLeft data-icon="inline-start" /> Quay lại</Button>
			</div>
			<div className="marketplace-negotiation-summary">
				<h2>Thương lượng · {request.product}</h2>
				<dl><div><dt>Giá đề xuất</dt><dd>{request.price.toLocaleString("vi-VN")}đ</dd></div><div><dt>Số vòng</dt><dd>{offers.length}/3</dd></div><div><dt>Trạng thái</dt><dd>{request.status}</dd></div></dl>
			</div>
			<div className="marketplace-table-wrap">
				<table className="marketplace-table">
					<caption className="sr-only">Lịch sử đề nghị mức giá</caption>
					<thead><tr><th>Giá đề nghị</th><th>Lý do</th><th>Bên đề nghị</th></tr></thead>
					<tbody>
						{offers.map((offer, index) => <tr key={`${offer.by}-${index}`}><td data-label="Giá đề nghị">{offer.price.toLocaleString("vi-VN")}đ</td><td data-label="Lý do">{offer.reason}</td><td data-label="Bên đề nghị">{offer.by}</td></tr>)}
						{!offers.length && <tr><td className="marketplace-no-results" colSpan={3}>Chưa có đề nghị giá nào.</td></tr>}
					</tbody>
				</table>
			</div>
			<form className="marketplace-negotiation-form" onSubmit={submit}>
				<h2><MessageSquareText aria-hidden="true" /> Đề nghị mức giá</h2>
				<div className="marketplace-form-grid">
					<label className="marketplace-field">Giá đề nghị (đ)<Input required type="number" min="1" max="500000000" value={price} onChange={(event) => setPrice(event.target.value)} disabled={!canOffer} /></label>
					<label className="marketplace-field marketplace-field--wide">Giải thích mức giá<textarea required minLength={5} maxLength={500} className="marketplace-textarea" value={reason} onChange={(event) => setReason(event.target.value)} disabled={!canOffer} placeholder="Chia sẻ căn cứ cho mức giá bạn đề nghị..." /></label>
				</div>
				<div className="marketplace-negotiation-actions">
					<span>{canOffer ? `Còn ${3 - offers.length} vòng trao đổi.` : "Đã đạt giới hạn 3 vòng thương lượng."}</span>
					<div><Button type="button" variant="outline" onClick={onAccept}>Chấp nhận giá hiện tại</Button><Button type="submit" disabled={!canOffer}>Gửi đề nghị</Button></div>
				</div>
			</form>
			<p className="marketplace-demo-note">Thương lượng được mô phỏng tại giao diện; chưa gửi tới Film Lab.</p>
		</section>
	);
}
