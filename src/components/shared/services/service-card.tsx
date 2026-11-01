import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { services } from "@/components/shared/model";

export function ServiceCard({
	service,
	onBook,
}: {
	service: (typeof services)[number];
	onBook: (id: string) => void;
}) {
	const Icon = service.icon;

	return (
		<article className="service-card">
			<div className={`service-artwork service-artwork--${service.tone}`}>
				<span className="service-artwork__stamp"><Icon aria-hidden="true" /></span>
				<span className="service-artwork__word">ANALOG<br />MEMORIES</span>
				<span className="service-artwork__grain" />
			</div>
			<div className="service-card__content">
				<div className="service-card__title"><h3>{service.name}</h3><span className="service-price">{service.price}</span></div>
				<p>{service.description}</p>
				<div className="service-location"><MapPin aria-hidden="true" />{service.place}</div>
				<Button type="button" variant="outline" className="service-choose" onClick={() => onBook(service.id)}>
					Chọn dịch vụ <ArrowRight data-icon="inline-end" />
				</Button>
			</div>
		</article>
	);
}
