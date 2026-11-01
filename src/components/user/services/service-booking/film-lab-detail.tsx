"use client";

import { useState } from "react";
import { ArrowLeft, Clock3, MapPin, ShieldCheck, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { filmLabs, type LabServicePackage } from "./data";

type LabTab = "services" | "intro" | "reviews" | "policies";

const tabLabels: { id: LabTab; label: string }[] = [
	{ id: "services", label: "Dịch vụ" },
	{ id: "intro", label: "Giới thiệu" },
	{ id: "reviews", label: "Đánh giá" },
	{ id: "policies", label: "Chính sách" },
];

export function FilmLabDetail({
	labId,
	onBack,
	onSelectPackage,
}: {
	labId: string;
	onBack: () => void;
	onSelectPackage: (pkg: LabServicePackage) => void;
}) {
	const lab = filmLabs.find((item) => item.id === labId) ?? filmLabs[0];
	const [tab, setTab] = useState<LabTab>("services");
	const tabPanelId = `film-lab-panel-${tab}`;

	return (
		<section className="subpage-section film-lab-detail">
			<div className="film-lab-detail__back-row">
				<Button type="button" variant="ghost" onClick={onBack}><ArrowLeft data-icon="inline-start" /> Danh sách Film Lab</Button>
			</div>
			<div className={`film-lab-profile film-lab-profile--${lab.id}`}>
				<div className="film-lab-profile__monogram">{lab.name.split(" ").map((word) => word[0]).join("")}</div>
				<div className="film-lab-profile__copy">
					<p className="eyebrow">HỒ SƠ FILM LAB</p>
					<h1>{lab.name}</h1>
					<div className="film-lab-profile__facts"><span><MapPin aria-hidden="true" /> {lab.place}</span><span className="film-lab-rating"><Star aria-hidden="true" /> {lab.rating} · {lab.reviewCount} đánh giá</span><span><Clock3 aria-hidden="true" /> {lab.openHours}</span></div>
				</div>
				<Button type="button" onClick={() => document.getElementById("film-lab-packages")?.scrollIntoView({ behavior: "smooth", block: "center" })}><Tag data-icon="inline-start" /> Xem các gói</Button>
			</div>

			<div className="film-lab-tabs" role="tablist" aria-label={`Thông tin ${lab.name}`}>
				{tabLabels.map((item) => (
					<button key={item.id} type="button" role="tab" id={`film-lab-tab-${item.id}`} aria-controls={`film-lab-panel-${item.id}`} aria-selected={tab === item.id} onClick={() => setTab(item.id)}>{item.label}</button>
				))}
			</div>

			<div className="film-lab-tab-panel" id={tabPanelId} role="tabpanel" aria-labelledby={`film-lab-tab-${tab}`} tabIndex={0}>
				{tab === "services" && (
					<>
						<div id="film-lab-packages" className="film-lab-package-heading"><div><p className="eyebrow">GÓI ĐANG CUNG CẤP</p><h2>Dịch vụ của {lab.name}</h2></div><span>{lab.packages.length} gói dịch vụ</span></div>
						<div className="film-lab-package-list">
							{lab.packages.map((pkg) => (
								<article className="film-lab-package" key={pkg.id}>
									<div className="film-lab-package__icon"><span>{pkg.format}</span></div>
									<div className="film-lab-package__main"><h3>{pkg.name}</h3><p>{pkg.process} · {pkg.format} · khoảng {pkg.turnaroundDays} ngày</p></div>
									<div className="film-lab-package__price"><strong>{pkg.unitPrice.toLocaleString("vi-VN")}đ</strong><small>/ cuộn</small></div>
									<Button type="button" onClick={() => onSelectPackage(pkg)}>Chọn gói</Button>
								</article>
							))}
						</div>
					</>
				)}
				{tab === "intro" && <div className="film-lab-text-panel"><h2>Về {lab.name}</h2><p>{lab.description}</p><p><strong>Thiết bị:</strong> {lab.equipment}</p><p><strong>Giờ mở cửa:</strong> {lab.openHours}</p></div>}
				{tab === "reviews" && <div className="film-lab-text-panel"><h2>Đánh giá từ cộng đồng</h2><p className="film-lab-review-score"><Star aria-hidden="true" /> {lab.rating} / 5 <span>· {lab.reviewCount} lượt đánh giá</span></p><p>Dữ liệu nhận xét chi tiết sẽ hiển thị khi FilmLink kết nối nguồn đánh giá.</p></div>}
				{tab === "policies" && <div className="film-lab-text-panel"><h2>Chính sách nhận phim</h2><p><ShieldCheck aria-hidden="true" /> Giá trên mỗi gói là giá tham khảo. Lab kiểm đếm cuộn phim thực tế và xác nhận chi phí cuối trước khi xử lý.</p><p>Thời gian xử lý được tính từ lúc lab tiếp nhận phim và có thể thay đổi theo lịch máy.</p></div>}
			</div>
			<p className="marketplace-demo-note">Hồ sơ và gói dịch vụ đang dùng dữ liệu minh họa để trình bày nghiệp vụ.</p>
		</section>
	);
}
