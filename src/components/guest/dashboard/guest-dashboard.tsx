"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import { AssistantSection } from "@/components/shared/ai-support/assistant-section";
import { CommunitySection } from "@/components/shared/community/community-section";
import { HomeSection } from "./home-section";
import { LoginRequiredSection } from "../auth/login-required-section";
import type { Section } from "@/components/shared/model";
import { services } from "@/components/shared/model";
import { ServicesSection } from "../services/services-section";
import { WorkspaceShell } from "@/components/shared/layout/workspace-shell";

export function GuestDashboard() {
	const router = useRouter();
	const [active, setActive] = useState<Section>("home");
	const [search, setSearch] = useState("");
	const [likedPosts, setLikedPosts] = useState<string[]>([]);
	const [prompt, setPrompt] = useState("");
	const [chat, setChat] = useState<
		{ id: string; from: "user" | "ai"; text: string }[]
	>([]);
	const visibleServices = useMemo(
		() =>
			services.filter((service) =>
				`${service.name} ${service.description} ${service.place}`
					.toLowerCase()
					.includes(search.toLowerCase()),
			),
		[search],
	);

	function sendPrompt(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const trimmed = prompt.trim();
		if (!trimmed) return;
		const messageId = Date.now().toString();
		setChat((current) => [
			...current,
			{ id: `${messageId}-user`, from: "user", text: trimmed },
			{
				id: `${messageId}-ai`,
				from: "ai",
				text: "Mình đang ở chế độ trải nghiệm. Hãy cho mình biết loại phim, máy ảnh và phong cách ảnh bạn muốn để bắt đầu nhé.",
			},
		]);
		setPrompt("");
	}

	return (
		<WorkspaceShell
			account={null}
			active={active}
			mode="guest"
			onNavigate={setActive}
		>
			{active === "home" && (
				<HomeSection
					account={null}
					guest
					onSelect={setActive}
					onBook={() => router.push("/login")}
				/>
			)}
			{active === "services" && (
				<ServicesSection
					search={search}
					onSearch={setSearch}
					services={visibleServices}
					onBook={() => router.push("/login")}
					onSelect={setActive}
				/>
			)}
			{active === "orders" && <LoginRequiredSection section="orders" />}
			{active === "community" && (
				<CommunitySection
					likedPosts={likedPosts}
					onExploreLabs={() => setActive("services")}
					onOpenAssistant={() => setActive("assistant")}
					onLike={(id) =>
						setLikedPosts((current) =>
							current.includes(id)
								? current.filter((item) => item !== id)
								: [...current, id],
						)
					}
				/>
			)}
			{active === "assistant" && (
				<AssistantSection
					chat={chat}
					prompt={prompt}
					onPrompt={setPrompt}
					onSubmit={sendPrompt}
				/>
			)}
			{active === "account" && <LoginRequiredSection section="account" />}
		</WorkspaceShell>
	);
}
