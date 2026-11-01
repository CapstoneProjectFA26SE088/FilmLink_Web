"use client";

import { useMemo, useState } from "react";
import { ConsignmentBalance } from "./consignment-balance";
import { ConsignmentBookingForm } from "./consignment-booking-form";
import { ConsignmentRequests } from "./consignment-requests";
import {
	initialListedItems,
	initialRequests,
	marketplaceListings,
} from "./data";
import { MarketplaceCatalog } from "./marketplace-catalog";
import { MarketplaceProductDetail } from "./product-detail";
import { PriceNegotiation } from "./price-negotiation";
import type {
	AppointmentDraft,
	ConsignmentRequest,
	MarketplaceListing,
	PriceOffer,
} from "./types";

type MarketplaceScreen =
	| "catalog"
	| "booking"
	| "requests"
	| "balance"
	| "detail"
	| "negotiation";

export function MarketplaceSection() {
	const [screen, setScreen] = useState<MarketplaceScreen>("catalog");
	const [search, setSearch] = useState("");
	const [requestSearch, setRequestSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("Tất cả");
	const [requests, setRequests] = useState(initialRequests);
	const [listedItems] = useState(initialListedItems);
	const [selectedListing, setSelectedListing] =
		useState<MarketplaceListing | null>(null);
	const [selectedRequest, setSelectedRequest] =
		useState<ConsignmentRequest | null>(null);
	const [offersByRequest, setOffersByRequest] = useState<
		Record<string, PriceOffer[]>
	>({});
	const [notice, setNotice] = useState("");

	const visibleListings = useMemo(() => {
		const term = search.trim().toLocaleLowerCase("vi-VN");
		return marketplaceListings.filter((listing) => {
			const matchesTerm =
				!term ||
				`${listing.name} ${listing.type} ${listing.lab}`
					.toLocaleLowerCase("vi-VN")
					.includes(term);
			const matchesType = typeFilter === "Tất cả" || listing.type === typeFilter;
			return matchesTerm && matchesType;
		});
	}, [search, typeFilter]);

	function openRequests() {
		setNotice("");
		setScreen("requests");
	}

	function submitAppointment(draft: AppointmentDraft) {
		const newRequest: ConsignmentRequest = {
			id: `KG-REQ-${Date.now()}`,
			product: draft.product,
			type: draft.type,
			appointment: `${draft.date} · ${draft.time}`,
			lab: draft.lab,
			price: draft.price,
			status: "Chờ xác nhận lịch",
		};
		setRequests((current) => [newRequest, ...current]);
		setNotice(
			`Đã tạo yêu cầu trải nghiệm cho “${draft.product}”. Yêu cầu chỉ được lưu trong phiên này.`,
		);
		setScreen("requests");
	}

	function openNegotiation(request: ConsignmentRequest) {
		setSelectedRequest(request);
		setScreen("negotiation");
	}

	function sendOffer(offer: PriceOffer) {
		if (!selectedRequest) return;
		setOffersByRequest((current) => ({
			...current,
			[selectedRequest.id]: [...(current[selectedRequest.id] ?? []), offer],
		}));
		setNotice("Đề nghị giá đã được thêm vào mô phỏng của phiên này.");
	}

	function acceptCurrentPrice() {
		if (!selectedRequest) return;
		setRequests((current) =>
			current.map((request) =>
				request.id === selectedRequest.id
					? { ...request, status: "Đã đồng ý mức giá" }
					: request,
			),
		);
		setSelectedRequest({ ...selectedRequest, status: "Đã đồng ý mức giá" });
		setNotice("Trạng thái đồng ý đã được ghi trong phiên trải nghiệm này.");
	}

	return (
		<div className="marketplace-workspace">
			{notice && (
				<div className="marketplace-notice" role="status">
					<span>{notice}</span>
					<button type="button" onClick={() => setNotice("")} aria-label="Đóng thông báo">
						×
					</button>
				</div>
			)}

			{screen === "catalog" && (
				<MarketplaceCatalog
					listings={visibleListings}
					search={search}
					onSearch={setSearch}
					typeFilter={typeFilter}
					onTypeFilter={setTypeFilter}
					onSelectListing={(listing) => {
						setSelectedListing(listing);
						setScreen("detail");
					}}
					onBookConsignment={() => setScreen("booking")}
					onOpenRequests={openRequests}
					onOpenBalance={() => setScreen("balance")}
				/>
			)}
			{screen === "booking" && (
				<ConsignmentBookingForm
					onBack={() => setScreen("catalog")}
					onSubmit={submitAppointment}
				/>
			)}
			{screen === "requests" && (
				<ConsignmentRequests
					requests={requests}
					listedItems={listedItems}
					search={requestSearch}
					onSearch={setRequestSearch}
					onNewRequest={() => setScreen("booking")}
					onNegotiate={openNegotiation}
					onOpenListing={(id) => {
						const listing = marketplaceListings.find((item) => item.id === id);
						if (listing) {
							setSelectedListing(listing);
							setScreen("detail");
						}
					}}
				/>
			)}
			{screen === "balance" && (
				<ConsignmentBalance onBack={() => setScreen("catalog")} />
			)}
			{screen === "detail" && selectedListing && (
				<MarketplaceProductDetail
					listing={selectedListing}
					onBack={() => setScreen("catalog")}
				/>
			)}
			{screen === "negotiation" && selectedRequest && (
				<PriceNegotiation
					request={selectedRequest}
					offers={offersByRequest[selectedRequest.id] ?? []}
					onBack={openRequests}
					onSendOffer={sendOffer}
					onAccept={acceptCurrentPrice}
				/>
			)}
		</div>
	);
}
