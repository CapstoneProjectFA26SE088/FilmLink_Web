import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Section, services } from "@/components/shared/model";
import { ServiceCard } from "@/components/shared/services/service-card";

export function ServicesSection({
	search,
	onSearch,
	services: filteredServices,
	onBook,
	onSelect,
}: {
	search: string;
	onSearch: (value: string) => void;
	services: typeof services;
	onBook: (id: string) => void;
	onSelect: (section: Section) => void;
}) {
	return (
		<section className="subpage-section">
			<p className="eyebrow">DỊCH VỤ PHIM ẢNH</p>
			<div className="subpage-title-row">
				<div>
					<h1>Chọn dịch vụ hợp với cuộn phim</h1>
					<p>Tìm lab phù hợp và xem trước chi phí trước khi gửi phim.</p>
				</div>
				<span className="service-total">{filteredServices.length} dịch vụ</span>
			</div>
			<div className="service-search">
				<Search aria-hidden="true" />
				<Input
					value={search}
					onChange={(event) => onSearch(event.target.value)}
					placeholder="Tìm tráng phim, scan ảnh..."
					aria-label="Tìm dịch vụ"
				/>
			</div>
			{filteredServices.length ? (
				<div className="service-grid">
					{filteredServices.map((service) => (
						<ServiceCard key={service.id} service={service} onBook={onBook} />
					))}
				</div>
			) : (
				<div className="empty-state">
					<Search aria-hidden="true" />
					<strong>Chưa tìm thấy dịch vụ</strong>
					<span>Thử tìm bằng từ khóa khác nhé.</span>
				</div>
			)}
			<div className="service-tip">
				<Sparkles aria-hidden="true" />
				<p>
					<strong>Chưa biết chọn loại phim nào?</strong>
					<br />
					FilmLink AI có thể gợi ý theo máy ảnh và phong cách bạn thích.
				</p>
				<button type="button" onClick={() => onSelect("assistant")}>
					Hỏi trợ lý AI <ArrowRight aria-hidden="true" />
				</button>
			</div>
		</section>
	);
}
