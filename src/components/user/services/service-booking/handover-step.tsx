import { type FormEvent } from "react";
import { ArrowLeft, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deliveryMethods, type HandoverMethod } from "./data";

export function HandoverStep({
	method,
	address,
	district,
	province,
	phone,
	date,
	slot,
	onChange,
	onBack,
	onContinue,
}: {
	method: HandoverMethod;
	address: string;
	district: string;
	province: string;
	phone: string;
	date: string;
	slot: string;
	onChange: (field: string, value: string) => void;
	onBack: () => void;
	onContinue: () => void;
}) {
	function continueAfterValidation(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onContinue();
	}

	return (
		<form className="service-step-panel" onSubmit={continueAfterValidation} aria-labelledby="service-step-title">
			<div className="service-step-intro">
				<span><Truck aria-hidden="true" /></span>
				<div>
					<p className="eyebrow">BƯỚC 2 · BÀN GIAO PHIM</p>
					<h2 id="service-step-title">Chọn cách gửi phim</h2>
					<p>Chọn phương thức thuận tiện để lab nhận cuộn phim của bạn.</p>
				</div>
			</div>

			<fieldset className="handover-choice-list">
				<legend className="sr-only">Phương thức bàn giao phim</legend>
				{deliveryMethods.map((item) => (
					<label
						key={item.id}
						className={`handover-choice${method === item.id ? " handover-choice--selected" : ""}`}
					>
						<input type="radio" name="handover-method" value={item.id} checked={method === item.id} onChange={() => onChange("method", item.id)} />
						<span className="handover-choice__copy"><strong>{item.label}</strong><small>{item.description}</small></span>
						<strong className="handover-choice__fee">{item.fee ? `+${item.fee.toLocaleString("vi-VN")}đ` : "Miễn phí"}</strong>
					</label>
				))}
			</fieldset>

			{method !== "SELF_DROP_OFF" && (
				<div className="service-order-form-grid handover-address-grid">
					<label className="service-order-field service-order-field--wide">Địa chỉ nhận phim
						<Input required minLength={5} maxLength={255} value={address} onChange={(event) => onChange("address", event.target.value)} placeholder="Số nhà, tên đường" />
					</label>
					<label className="service-order-field">Quận / huyện
						<Input required maxLength={100} value={district} onChange={(event) => onChange("district", event.target.value)} placeholder="Ví dụ: Quận 3" />
					</label>
					<label className="service-order-field">Tỉnh / thành phố
						<Input required maxLength={100} value={province} onChange={(event) => onChange("province", event.target.value)} placeholder="Ví dụ: TP. Hồ Chí Minh" />
					</label>
					<label className="service-order-field">Số điện thoại liên hệ
						<Input required type="tel" minLength={9} maxLength={15} value={phone} onChange={(event) => onChange("phone", event.target.value)} placeholder="09xxxxxxxx" />
					</label>
					<label className="service-order-field">Ngày lấy phim
						<Input required type="date" value={date} onChange={(event) => onChange("date", event.target.value)} />
					</label>
					<label className="service-order-field">Khung giờ
						<select value={slot} onChange={(event) => onChange("slot", event.target.value)}>
							<option>09:00 – 11:00</option><option>11:00 – 13:00</option><option>14:00 – 16:00</option><option>16:00 – 18:00</option>
						</select>
					</label>
				</div>
			)}

			{method === "SELF_DROP_OFF" && (
				<div className="handover-lab-note"><MapPin aria-hidden="true" /><span>Mang phim đến Film Lab sau khi tạo đơn. Lab sẽ xác nhận thời gian tiếp nhận.</span></div>
			)}
			<p className="handover-prototype-note">Phí vận chuyển đang là mức mô phỏng: nội thành 30.000đ, liên tỉnh 45.000đ.</p>
			<div className="service-step-footer">
				<Button type="button" variant="outline" onClick={onBack}><ArrowLeft data-icon="inline-start" /> Bước trước</Button>
				<Button type="submit">Tiếp tục</Button>
			</div>
		</form>
	);
}
