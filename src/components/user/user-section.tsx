"use client";

import { useRouter } from "next/navigation";
import { AccountSection } from "./profile/account-section";
import { AssistantSection } from "@/components/shared/ai-support/assistant-section";
import { CommunitySection } from "@/components/shared/community/community-section";
import { MarketplaceSection } from "./marketplace/marketplace-section";
import { FilmLabDetail } from "./services/service-booking/film-lab-detail";
import { FilmLabRecommendations } from "./services/service-booking/film-lab-recommendations";
import { ServiceBookingFlow } from "./services/service-booking/service-booking-flow";
import type { Section } from "@/components/shared/model";
import { OrdersSection } from "./orders/orders-section";
import { UserHomeSection } from "./dashboard/user-home-section";
import { useUserWorkspace, userRouteBySection } from "./user-workspace";

export function UserSection({ section }: { section: Section }) {
	const router = useRouter();
	const {
		account,
		accountLoaded,
		orders,
		addOrder,
		likedPosts,
		toggleLike,
		prompt,
		setPrompt,
		chat,
		sendPrompt,
		bookingLabId,
		setBookingLabId,
		bookingPackageId,
		setBookingPackageId,
	} = useUserWorkspace();

	function navigateTo(nextSection: Section) {
		router.push(userRouteBySection[nextSection]);
	}

	function requestBooking() {
		setBookingLabId(null);
		setBookingPackageId(null);
		router.push("/services");
	}

	return (
		<>
			{section === "home" && <UserHomeSection account={account} orders={orders} onSelect={navigateTo} onBook={requestBooking} />}
			{section === "services" && bookingLabId && bookingPackageId && (
				<ServiceBookingFlow
					labId={bookingLabId}
					packageId={bookingPackageId}
					phoneNumber={account?.phoneNumber}
					onBack={() => setBookingPackageId(null)}
					onComplete={addOrder}
				/>
			)}
			{section === "services" && bookingLabId && !bookingPackageId && (
				<FilmLabDetail
					labId={bookingLabId}
					onBack={() => setBookingLabId(null)}
					onSelectPackage={(servicePackage) => setBookingPackageId(servicePackage.id)}
				/>
			)}
			{section === "services" && !bookingLabId && <FilmLabRecommendations onSelectLab={setBookingLabId} />}
			{section === "orders" && <OrdersSection orders={orders} />}
			{section === "marketplace" && <MarketplaceSection />}
			{section === "community" && (
				<CommunitySection
					likedPosts={likedPosts}
					accountName={account?.fullName || account?.email}
					onExploreLabs={() => navigateTo("services")}
					onOpenAssistant={() => navigateTo("assistant")}
					onLike={toggleLike}
				/>
			)}
			{section === "assistant" && <AssistantSection chat={chat} prompt={prompt} onPrompt={setPrompt} onSubmit={sendPrompt} />}
			{section === "account" && <AccountSection account={account} loaded={accountLoaded} />}
		</>
	);
}
