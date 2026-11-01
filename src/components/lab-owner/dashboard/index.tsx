"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LabOwnerOverview } from "./dashboard-page";
import { useLabOwnerWorkspace } from "../workspace";
import type { LabOwnerSection } from "../dashboard-data";

export function LabOwnerDashboardPage() {
	const router = useRouter();
	const { labName, address } = useLabOwnerWorkspace();
	const [query, setQuery] = useState("");
	return <LabOwnerOverview labName={labName} address={address} query={query} onQueryChange={setQuery} onNavigate={(section: LabOwnerSection) => router.push(section === "overview" ? "/lab-owner" : `/lab-owner/${section}`)} onProfile={() => router.push("/lab-owner/profile")} />;
}
