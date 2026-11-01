"use client";

import { useRouter } from "next/navigation";
import type { Section } from "@/components/shared/model";
import { UserHomeSection } from "./user-home-section";
import { useUserWorkspace, userRouteBySection } from "../user-workspace";

export function UserDashboard() {
	const router = useRouter();
	const { account, orders, setBookingLabId, setBookingPackageId } = useUserWorkspace();

	function navigateTo(section: Section) {
		router.push(userRouteBySection[section]);
	}

	function requestBooking() {
		setBookingLabId(null);
		setBookingPackageId(null);
		router.push("/services");
	}

	return <UserHomeSection account={account} orders={orders} onSelect={navigateTo} onBook={requestBooking} />;
}
