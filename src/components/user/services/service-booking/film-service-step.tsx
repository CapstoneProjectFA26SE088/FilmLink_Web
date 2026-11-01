import { Camera, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FilmLab, LabServicePackage } from "./data";
import { filmStocks } from "./data";

export function FilmServiceStep({
	lab,
	servicePackage,
	stock,
	rollCount,
	onChange,
	onContinue,
}: {
	lab: FilmLab;
	servicePackage: LabServicePackage;
	stock: string;
	rollCount: number;
	onChange: (field: string, value: string | number) => void;
	onContinue: () => void;
}) {
	const processStocks = filmStocks.filter((item) => item.process === servicePackage.process);

	return (
		<section className="service-step-panel" aria-labelledby="service-step-title">
			<div className="service-step-intro">
				<span><Camera aria-hidden="true" /></span>
				<div>
					<p className="eyebrow">BƯỚC 1 · CUỘN PHIM</p>
					<h2 id="service-step-title">Khai báo cuộn phim</h2>
					<p>Film Lab và gói dịch vụ đã chọn được giữ trong đơn của bạn.</p>
				</div>
			</div>

			<div className="selected-lab-package">
				<span className="selected-lab-package__icon"><MapPin aria-hidden="true" /></span>
				<div><strong>{lab.name}</strong><small>{lab.place} · {servicePackage.name}</small></div>
				<strong className="selected-lab-package__price">{servicePackage.unitPrice.toLocaleString("vi-VN")}đ/cuộn</strong>
			</div>

			<div className="service-order-form-grid">
				<div className="service-order-readonly">
					<span>Quy trình và khổ phim</span>
					<strong>{servicePackage.process} · {servicePackage.format}</strong>
					<small>{servicePackage.turnaroundDays} ngày xử lý dự kiến</small>
				</div>
				<label className="service-order-field">
					Film stock
					<select value={stock} onChange={(event) => onChange("stock", event.target.value)}>
						{processStocks.map((option) => (
							<option key={option.name} value={option.name}>{option.name}</option>
						))}
					</select>
				</label>
				<label className="service-order-field service-order-field--wide">
					Số cuộn
					<Input type="number" min={1} max={20} value={rollCount} onChange={(event) => onChange("rollCount", Number(event.target.value))} />
					<small>Tối đa 20 cuộn trong một đơn đặt dịch vụ.</small>
				</label>
			</div>
			<div className="service-step-footer">
				<p>Tạm tính được tính theo gói và số cuộn đã khai báo.</p>
				<Button type="button" onClick={onContinue}>Tiếp tục</Button>
			</div>
		</section>
	);
}
