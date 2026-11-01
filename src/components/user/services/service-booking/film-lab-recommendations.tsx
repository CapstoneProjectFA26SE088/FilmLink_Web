"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Clock3, MapPin, Search, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { filmLabs } from "./data";

export function FilmLabRecommendations({ onSelectLab }: { onSelectLab: (labId: string) => void }) {
	const [search, setSearch] = useState("");
	const [city, setCity] = useState("Tất cả");
	const [recommendedFirst, setRecommendedFirst] = useState(true);
	const [comparedLabs, setComparedLabs] = useState<string[]>([]);
	const [showComparison, setShowComparison] = useState(false);

	const visibleLabs = useMemo(() => {
		const term = search.trim().toLocaleLowerCase("vi-VN");
		const matches = filmLabs
			.filter((lab) => (city === "Tất cả" || lab.city === city))
			.filter((lab) => !term || `${lab.name} ${lab.district} ${lab.city}`.toLocaleLowerCase("vi-VN").includes(term));
		return matches.sort((left, right) => recommendedFirst
			? (right.rating * 10 - right.turnaroundDays) - (left.rating * 10 - left.turnaroundDays)
			: left.priceFrom - right.priceFrom);
	}, [city, recommendedFirst, search]);

	const compared = filmLabs.filter((lab) => comparedLabs.includes(lab.id));

	function toggleCompare(labId: string) {
		setComparedLabs((current) => current.includes(labId)
			? current.filter((id) => id !== labId)
			: current.length < 3 ? [...current, labId] : current);
	}

	return (
		<section className="subpage-section film-lab-discovery">
			<p className="eyebrow">ĐẶT DỊCH VỤ · KHÁM PHÁ FILM LAB</p>
			<div className="subpage-title-row">
				<div>
					<h1>Tìm Film Lab phù hợp</h1>
					<p>Xem dịch vụ, giá tham khảo và thời gian xử lý trước khi chọn nơi gửi phim.</p>
				</div>
				<span className="service-total">{visibleLabs.length} Film Lab</span>
			</div>

			<div className="lab-discovery-toolbar">
				<label className="service-search lab-search">
					<Search aria-hidden="true" />
					<Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên lab hoặc khu vực..." aria-label="Tìm Film Lab" />
				</label>
				<label className="lab-city-filter">
					<span className="sr-only">Lọc theo thành phố</span>
					<select value={city} onChange={(event) => setCity(event.target.value)}>
						<option>Tất cả</option><option>TP. Hồ Chí Minh</option><option>Hà Nội</option>
					</select>
				</label>
				<Button type="button" variant={recommendedFirst ? "default" : "outline"} onClick={() => setRecommendedFirst((value) => !value)}>
					<Sparkles data-icon="inline-start" /> {recommendedFirst ? "Gợi ý phù hợp" : "Xếp theo giá"}
				</Button>
				<Button type="button" variant="outline" disabled={comparedLabs.length < 2} onClick={() => setShowComparison((value) => !value)}>
					So sánh lab ({comparedLabs.length})
				</Button>
			</div>

			{showComparison && compared.length > 1 && (
				<div className="lab-compare-panel" aria-label="So sánh Film Lab">
					<div className="lab-compare-heading"><strong>So sánh Film Lab</strong><button type="button" onClick={() => setShowComparison(false)}>Đóng</button></div>
					<div className="lab-compare-grid">
						{compared.map((lab) => <div key={lab.id}><strong>{lab.name}</strong><span>★ {lab.rating} · {lab.reviewCount} đánh giá</span><span>{lab.turnaroundDays} ngày xử lý</span><span>Từ {lab.priceFrom.toLocaleString("vi-VN")}đ/cuộn</span></div>)}
					</div>
				</div>
			)}

			{visibleLabs.length ? (
				<div className="film-lab-grid">
					{visibleLabs.map((lab, index) => (
						<article className="film-lab-card" key={lab.id}>
							<div className={`film-lab-card__art film-lab-card__art--${lab.id}`}>
								<span className="film-lab-card__monogram">{lab.name.split(" ").map((word) => word[0]).join("")}</span>
								{recommendedFirst && index === 0 && <span className="film-lab-recommended"><Sparkles aria-hidden="true" /> Gợi ý cho bạn</span>}
							</div>
							<div className="film-lab-card__body">
								<div className="film-lab-card__title"><div><h2>{lab.name}</h2><span><MapPin aria-hidden="true" /> {lab.place}</span></div><span className="film-lab-rating"><Star aria-hidden="true" /> {lab.rating}</span></div>
								<div className="film-lab-facts"><span><Clock3 aria-hidden="true" /> {lab.turnaroundDays} ngày</span><span>{lab.equipment}</span></div>
								<div className="film-lab-card__footer"><strong>Từ {lab.priceFrom.toLocaleString("vi-VN")}đ <small>/ cuộn</small></strong><Button type="button" onClick={() => onSelectLab(lab.id)}>Xem lab <ArrowRight data-icon="inline-end" /></Button></div>
								<label className="film-lab-compare"><input type="checkbox" checked={comparedLabs.includes(lab.id)} onChange={() => toggleCompare(lab.id)} /><span><Check aria-hidden="true" /> So sánh lab</span></label>
							</div>
						</article>
					))}
				</div>
			) : (
				<div className="empty-state"><Search aria-hidden="true" /><strong>Chưa tìm thấy Film Lab</strong><span>Thử đổi khu vực hoặc từ khóa tìm kiếm.</span></div>
			)}
			<p className="marketplace-demo-note">Thông tin lab, khoảng cách, giá và thời gian đang dùng dữ liệu minh họa.</p>
		</section>
	);
}
