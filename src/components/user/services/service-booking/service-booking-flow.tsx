"use client";

import { useState } from "react";
import { ArrowLeft, Check, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ServiceOrder } from "@/components/shared/model";
import { deliveryMethods, filmLabs, filmStocks, type HandoverMethod, type PaymentMethod } from "./data";
import { FilmServiceStep } from "./film-service-step";
import { HandoverStep } from "./handover-step";
import { ReviewStep } from "./review-step";

const steps = ["Cuộn phim & dịch vụ", "Bàn giao phim", "Xác nhận & thanh toán"];

export function ServiceBookingFlow({
	labId,
	packageId,
	phoneNumber,
	onBack,
	onComplete,
}: {
	labId: string;
	packageId: string;
	phoneNumber?: string;
	onBack: () => void;
	onComplete: (order: ServiceOrder) => void;
}) {
	const lab = filmLabs.find((item) => item.id === labId) ?? filmLabs[0];
	const servicePackage = lab.packages.find((item) => item.id === packageId) ?? lab.packages[0];
	const [step, setStep] = useState(1);
	const [stock, setStock] = useState(() => filmStocks.find((item) => item.process === servicePackage.process)?.name ?? filmStocks[0].name);
	const [rollCount, setRollCount] = useState(1);
	const [method, setMethod] = useState<HandoverMethod>("SELF_DROP_OFF");
	const [address, setAddress] = useState("");
	const [district, setDistrict] = useState("");
	const [province, setProvince] = useState("");
	const [phone, setPhone] = useState(phoneNumber ?? "");
	const [date, setDate] = useState("");
	const [slot, setSlot] = useState("09:00 – 11:00");
	const [payment, setPayment] = useState<PaymentMethod>("PAY_AT_LAB");

	const baseTotal = servicePackage.unitPrice * rollCount;
	const deliveryFee = deliveryMethods.find((item) => item.id === method)?.fee ?? 0;
	const total = baseTotal + deliveryFee;

	function changeFilmField(field: string, value: string | number) {
		if (field === "stock") setStock(String(value));
		if (field === "rollCount") setRollCount(Math.min(20, Math.max(1, Number(value) || 1)));
	}

	function changeHandoverField(field: string, value: string) {
		if (field === "method") {
			const nextMethod = value as HandoverMethod;
			setMethod(nextMethod);
			if (nextMethod === "SELF_DROP_OFF" && payment === "COD") setPayment("PAY_AT_LAB");
		}
		if (field === "address") setAddress(value);
		if (field === "district") setDistrict(value);
		if (field === "province") setProvince(value);
		if (field === "phone") setPhone(value);
		if (field === "date") setDate(value);
		if (field === "slot") setSlot(value);
	}

	function confirmOrder() {
		const expectedReturn = new Date();
		expectedReturn.setDate(expectedReturn.getDate() + servicePackage.turnaroundDays);
		onComplete({
			id: `FL-${String(Date.now()).slice(-7)}`,
			lab: lab.name,
			film: stock,
			service: servicePackage.name,
			rollCount,
			state: "Chờ xác nhận · demo",
			total,
			dueDate: expectedReturn.toISOString().slice(0, 10),
			progress: 0,
		});
	}

	return (
		<section className="service-booking-page">
			<div className="service-booking-page-heading">
				<Button type="button" variant="ghost" onClick={onBack}><ArrowLeft data-icon="inline-start" /> Quay lại dịch vụ</Button>
				<p className="eyebrow">{lab.name.toLocaleUpperCase("vi-VN")} · {servicePackage.name.toLocaleUpperCase("vi-VN")}</p>
				<h1>Tạo đơn và khai báo cuộn phim</h1>
				<p>Mỗi cuộn phim, một câu chuyện. Chọn dịch vụ để bắt đầu.</p>
			</div>

			<ol className="service-booking-steps" aria-label="Các bước tạo đơn">
				{steps.map((label, index) => {
					const number = index + 1;
					return (
						<li key={label} className={step === number ? "is-active" : step > number ? "is-complete" : ""} aria-current={step === number ? "step" : undefined}>
							<span>{step > number ? <Check aria-hidden="true" /> : number}</span><small>{label}</small>
						</li>
					);
				})}
			</ol>

			<div className="service-booking-layout">
				<div className="service-booking-main">
					{step === 1 && <FilmServiceStep lab={lab} servicePackage={servicePackage} stock={stock} rollCount={rollCount} onChange={changeFilmField} onContinue={() => setStep(2)} />}
					{step === 2 && <HandoverStep method={method} address={address} district={district} province={province} phone={phone} date={date} slot={slot} onChange={changeHandoverField} onBack={() => setStep(1)} onContinue={() => setStep(3)} />}
					{step === 3 && <ReviewStep labId={labId} stock={stock} process={servicePackage.process} format={servicePackage.format} rollCount={rollCount} service={servicePackage.name} method={method} address={address} district={district} province={province} date={date} slot={slot} payment={payment} baseTotal={baseTotal} deliveryFee={deliveryFee} onChangePayment={setPayment} onBack={() => setStep(2)} onConfirm={confirmOrder} />}
				</div>
				<aside className="service-estimate-card" aria-label="Chi phí dự kiến">
					<p className="eyebrow">CHI PHÍ DỰ KIẾN</p>
					<h2><Film aria-hidden="true" /> Tạm tính</h2>
					<dl>
						<div><dt>Film Lab</dt><dd>{lab.name}</dd></div>
						<div><dt>Dịch vụ</dt><dd>{servicePackage.name} · {servicePackage.format}</dd></div>
						<div><dt>Số cuộn</dt><dd>{rollCount}</dd></div>
						<div><dt>Bàn giao</dt><dd>{deliveryMethods.find((item) => item.id === method)?.label}</dd></div>
					</dl>
					<div className="service-estimate-total"><span>Tạm tính</span><strong>{total.toLocaleString("vi-VN")}đ</strong></div>
					<small>Giá cuối được chốt sau khi lab kiểm đếm phim thực tế.</small>
				</aside>
			</div>
		</section>
	);
}
