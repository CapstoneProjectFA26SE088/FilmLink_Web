import { ArrowLeft, CalendarDays, Camera, Clock3 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AppointmentDraft, ListingType } from "./types";

export function ConsignmentBookingForm({
	onBack,
	onSubmit,
}: {
	onBack: () => void;
	onSubmit: (draft: AppointmentDraft) => void;
}) {
	const [product, setProduct] = useState("");
	const [type, setType] = useState<ListingType>("Máy ảnh");
	const [lab, setLab] = useState("Mộc Lab");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("09:00 – 10:00");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onSubmit({
			product: product.trim(),
			type,
			lab,
			date,
			time,
			price: Number(price),
			description: description.trim(),
		});
	}

	return (
		<section className="subpage-section marketplace-section">
			<p className="eyebrow">CHỢ KÝ GỬI · LỊCH HẸN</p>
			<div className="subpage-title-row marketplace-detail-heading">
				<div><h1>Đặt lịch ký gửi</h1><p>Đưa thiết bị tới Film Lab để kiểm định và tư vấn mức giá.</p></div>
				<Button type="button" variant="outline" onClick={onBack}><ArrowLeft data-icon="inline-start" /> Quay lại</Button>
			</div>
			<form className="marketplace-booking-form" onSubmit={handleSubmit}>
				<div className="marketplace-form-intro">
					<span><CalendarDays aria-hidden="true" /></span>
					<div><strong>Lịch hẹn mang thiết bị đến kiểm định</strong><small>Chọn lab, ngày và khung giờ phù hợp với bạn.</small></div>
				</div>
				<div className="marketplace-form-grid">
					<label className="marketplace-field marketplace-field--wide">Tên sản phẩm
						<Input required minLength={2} maxLength={150} value={product} onChange={(event) => setProduct(event.target.value)} placeholder="Ví dụ: Canon AE-1 Program" />
					</label>
					<label className="marketplace-field">Loại sản phẩm
						<select className="marketplace-select" value={type} onChange={(event) => setType(event.target.value as ListingType)}>
							<option>Máy ảnh</option><option>Ống kính</option><option>Film stock</option>
						</select>
					</label>
					<label className="marketplace-field">Film Lab nhận ký gửi
						<select className="marketplace-select" value={lab} onChange={(event) => setLab(event.target.value)}>
							<option>Mộc Lab</option><option>Saigon Film Lab</option><option>Lâm Lab</option>
						</select>
					</label>
					<label className="marketplace-field">Ngày hẹn
						<Input required type="date" value={date} onChange={(event) => setDate(event.target.value)} />
					</label>
					<label className="marketplace-field">Khung giờ
						<select className="marketplace-select" value={time} onChange={(event) => setTime(event.target.value)}>
							<option>09:00 – 10:00</option><option>10:00 – 11:00</option><option>14:00 – 15:00</option><option>15:00 – 16:00</option>
						</select>
					</label>
					<label className="marketplace-field">Giá mong muốn (đ)
						<Input required type="number" min="1" max="500000000" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="6500000" />
					</label>
					<label className="marketplace-field marketplace-field--wide">Mô tả và tình trạng
						<textarea required minLength={20} maxLength={2000} className="marketplace-textarea" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Mô tả tình trạng, phụ kiện đi kèm và các dấu hiệu sử dụng..." />
					</label>
					<label className="marketplace-field marketplace-field--wide">Ảnh tự chụp
						<span className="marketplace-upload"><Camera aria-hidden="true" /><input type="file" accept="image/*" multiple /><small>Thêm ảnh để lab tham khảo tình trạng trước buổi hẹn.</small></span>
					</label>
				</div>
				<div className="marketplace-booking-footer">
					<p><Clock3 aria-hidden="true" /> Lịch hẹn và yêu cầu chỉ được lưu trong phiên trải nghiệm này.</p>
					<Button type="submit">Đặt lịch ký gửi</Button>
				</div>
			</form>
		</section>
	);
}
