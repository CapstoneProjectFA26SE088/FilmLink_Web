import { ArrowLeft, CheckCircle2, CreditCard, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deliveryMethods, filmLabs, paymentMethods, type HandoverMethod, type PaymentMethod } from "./data";

export function ReviewStep({
	labId,
	stock,
	process,
	format,
	rollCount,
	service,
	method,
	address,
	district,
	province,
	date,
	slot,
	payment,
	baseTotal,
	deliveryFee,
	onChangePayment,
	onBack,
	onConfirm,
}: {
	labId: string;
	stock: string;
	process: string;
	format: string;
	rollCount: number;
	service: string;
	method: HandoverMethod;
	address: string;
	district: string;
	province: string;
	date: string;
	slot: string;
	payment: PaymentMethod;
	baseTotal: number;
	deliveryFee: number;
	onChangePayment: (value: PaymentMethod) => void;
	onBack: () => void;
	onConfirm: () => void;
}) {
	const lab = filmLabs.find((item) => item.id === labId) ?? filmLabs[0];
	const handover = deliveryMethods.find((item) => item.id === method) ?? deliveryMethods[0];
	const availablePayments = method === "SELF_DROP_OFF" ? paymentMethods.filter((item) => item.id !== "COD") : paymentMethods;
	const total = baseTotal + deliveryFee;

	return (
		<section className="service-step-panel" aria-labelledby="service-step-title">
			<div className="service-step-intro">
				<span><CheckCircle2 aria-hidden="true" /></span>
				<div>
					<p className="eyebrow">BƯỚC 3 · XÁC NHẬN & THANH TOÁN</p>
					<h2 id="service-step-title">Kiểm tra đơn dịch vụ</h2>
					<p>Kiểm tra thông tin trước khi tạo đơn trải nghiệm.</p>
				</div>
			</div>

			<div className="service-order-summary">
				<dl>
					<div><dt>Film Lab</dt><dd>{lab.name} · {lab.place}</dd></div>
					<div><dt>Film</dt><dd>{stock} · {format} · {process}</dd></div>
					<div><dt>Dịch vụ</dt><dd>{service}</dd></div>
					<div><dt>Số cuộn</dt><dd>{rollCount}</dd></div>
					<div><dt>Bàn giao</dt><dd>{handover.label}</dd></div>
					{method !== "SELF_DROP_OFF" && <div><dt>Địa chỉ</dt><dd>{address}, {district}, {province}</dd></div>}
					{method !== "SELF_DROP_OFF" && <div><dt>Khung giờ lấy phim</dt><dd>{date} · {slot}</dd></div>}
				</dl>
				<div className="service-price-breakdown">
					<div><span>Tráng / scan · {rollCount} cuộn</span><strong>{baseTotal.toLocaleString("vi-VN")}đ</strong></div>
					<div><span>Phí bàn giao</span><strong>{deliveryFee ? `${deliveryFee.toLocaleString("vi-VN")}đ` : "Miễn phí"}</strong></div>
					<div className="service-price-breakdown__total"><span>Tạm tính</span><strong>{total.toLocaleString("vi-VN")}đ</strong></div>
				</div>
			</div>

			<fieldset className="payment-method-group">
				<legend><CreditCard aria-hidden="true" /> Thanh toán</legend>
				<div>
					{availablePayments.map((option) => (
						<label className={`payment-method${payment === option.id ? " payment-method--selected" : ""}`} key={option.id}>
							<input type="radio" name="payment-method" value={option.id} checked={payment === option.id} onChange={() => onChangePayment(option.id)} />
							<span><strong>{option.label}</strong><small>{option.description}</small></span>
						</label>
					))}
				</div>
			</fieldset>

			<div className="service-order-final-note"><Film aria-hidden="true" /><p>Giá cuối được chốt sau khi lab kiểm đếm phim thực tế. Lab sẽ xác nhận lịch máy và ngày trả khi nhận phim. Đây là bản demo: không phát sinh thanh toán và thông tin không gửi lên backend.</p></div>
			<div className="service-step-footer">
				<Button type="button" variant="outline" onClick={onBack}><ArrowLeft data-icon="inline-start" /> Bước trước</Button>
				<Button type="button" onClick={onConfirm}>Xác nhận tạo đơn</Button>
			</div>
		</section>
	);
}
