"use client";

import { createContext, useContext, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { WorkspaceShell } from "@/components/shared/layout/workspace-shell";
import { expertNavigation, navigation, orders as initialOrders, type Account, type Section, type ServiceOrder } from "@/components/shared/model";

type UserWorkspaceValue = {
	account: Account | null;
	accountLoaded: boolean;
	orders: ServiceOrder[];
	addOrder: (order: ServiceOrder) => void;
	likedPosts: string[];
	toggleLike: (id: string) => void;
	prompt: string;
	setPrompt: (value: string) => void;
	chat: { id: string; from: "user" | "ai"; text: string }[];
	sendPrompt: (event: FormEvent<HTMLFormElement>) => void;
	bookingLabId: string | null;
	setBookingLabId: (id: string | null) => void;
	bookingPackageId: string | null;
	setBookingPackageId: (id: string | null) => void;
};

const UserWorkspaceContext = createContext<UserWorkspaceValue | null>(null);

export const userRouteBySection: Record<Section, string> = {
	expert: "/expert",
	home: "/dashboard",
	services: "/services",
	orders: "/orders",
	marketplace: "/marketplace",
	community: "/community",
	assistant: "/ai-support",
	account: "/profile",
};

const sectionForRoute: Record<string, Section> = {
	dashboard: "home",
	expert: "expert",
	"expert-application": "account",
	"expert-articles": "expert",
	"expert-events": "expert",
	services: "services",
	orders: "orders",
	marketplace: "marketplace",
	community: "community",
	"ai-support": "assistant",
	profile: "account",
};

export function UserWorkspace({ children, mode = "user" }: { children: ReactNode; mode?: "user" | "expert" }) {
	const pathname = usePathname();
	const router = useRouter();
	const [account, setAccount] = useState<Account | null>(null);
	const [accountLoaded, setAccountLoaded] = useState(false);
	const [orders, setOrders] = useState<ServiceOrder[]>(initialOrders);
	const [likedPosts, setLikedPosts] = useState<string[]>([]);
	const [prompt, setPrompt] = useState("");
	const [chat, setChat] = useState<{ id: string; from: "user" | "ai"; text: string }[]>([]);
	const [bookingLabId, setBookingLabId] = useState<string | null>(null);
	const [bookingPackageId, setBookingPackageId] = useState<string | null>(null);
	const active = sectionForRoute[pathname.split("/")[1] ?? ""] ?? "home";
	const expertAccount = account?.role === "PHOTOGRAPHY_EXPERT" || account?.role === "EXPERT";
	const shellMode = mode === "expert" || expertAccount ? "expert" : "user";

	useEffect(() => {
		const controller = new AbortController();
		fetch("/api/auth/me", { cache: "no-store", signal: controller.signal })
			.then(async (response) => {
				if (response.status === 401) {
					router.replace("/login");
					return null;
				}
				if (!response.ok) throw new Error("Không tải được thông tin tài khoản.");
				return (await response.json()) as Account;
			})
			.then((profile) => setAccount(profile))
			.catch(() => {})
			.finally(() => setAccountLoaded(true));
		return () => controller.abort();
	}, [router]);

	useEffect(() => {
		if (!accountLoaded || !account) return;
		const expert = account.role === "PHOTOGRAPHY_EXPERT" || account.role === "EXPERT";
		if (mode === "expert" && !expert) router.replace("/dashboard");
	}, [account, accountLoaded, mode, router]);

	function navigateTo(section: Section) {
		if (section !== "services") {
			setBookingLabId(null);
			setBookingPackageId(null);
		}
		router.push(section === "expert" ? "/expert" : userRouteBySection[section]);
	}

	function addOrder(order: ServiceOrder) {
		setOrders((current) => [order, ...current]);
		setBookingLabId(null);
		setBookingPackageId(null);
		router.push(userRouteBySection.orders);
	}

	function toggleLike(id: string) {
		setLikedPosts((current) => current.includes(id)
			? current.filter((item) => item !== id)
			: [...current, id]);
	}

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
				text: "Mình đang ở chế độ trải nghiệm. Với câu hỏi về cuộn phim này, bạn có thể bắt đầu bằng loại phim, máy ảnh và phong cách ảnh bạn muốn nhé.",
			},
		]);
		setPrompt("");
	}

	async function logout() {
		const response = await fetch("/api/auth/logout", {
			method: "POST",
			cache: "no-store",
		});
		if (!response.ok) throw new Error("Logout request failed.");
		router.replace("/login");
		router.refresh();
	}

	const value: UserWorkspaceValue = {
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
	};

	return (
		<UserWorkspaceContext.Provider value={value}>
			<WorkspaceShell
				account={account}
				active={active}
				mode={shellMode}
				homeHref="/dashboard"
				navigationItems={shellMode === "expert" ? expertNavigation : navigation}
				orderCount={orders.length}
				onLogout={logout}
				onNavigate={navigateTo}
			>
				{children}
			</WorkspaceShell>
		</UserWorkspaceContext.Provider>
	);
}

export function useUserWorkspace() {
	const context = useContext(UserWorkspaceContext);
	if (!context) throw new Error("useUserWorkspace must be used within UserWorkspace.");
	return context;
}
