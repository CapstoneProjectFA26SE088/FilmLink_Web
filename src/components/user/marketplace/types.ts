export type ListingType = "Máy ảnh" | "Ống kính" | "Film stock";

export type MarketplaceListing = {
	id: string;
	name: string;
	type: ListingType;
	grade: "A" | "B" | "C";
	lab: string;
	price: number;
	status: string;
	storage: string;
	condition: string;
	returnPolicy: string;
	labInfo: string;
};

export type ConsignmentRequest = {
	id: string;
	product: string;
	type: ListingType;
	appointment: string;
	lab: string;
	price: number;
	status: string;
	grade?: string;
	storage?: string;
};

export type PriceOffer = {
	price: number;
	reason: string;
	by: string;
};

export type AppointmentDraft = {
	product: string;
	type: ListingType;
	lab: string;
	date: string;
	time: string;
	price: number;
	description: string;
};
