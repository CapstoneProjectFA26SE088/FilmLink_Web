"use client";

import { createContext, useContext, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WorkspaceShell } from "@/components/shared/layout/workspace-shell";
import { photographerExpertNavigation, photographerNavigation, type Account, type Section, type ServiceOrder } from "@/components/shared/model";
import { getExpertAccessState, isExpertRole, nonExpertHome } from "@/lib/expert-access";

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
	archive: "/archive",
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
	archive: "archive",
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
	const [accountRequestError, setAccountRequestError] = useState<string | null>(null);
	const [accountRequestKey, setAccountRequestKey] = useState(0);
	const [orders, setOrders] = useState<ServiceOrder[]>([]);
	const [likedPosts, setLikedPosts] = useState<string[]>([]);
	const [prompt, setPrompt] = useState("");
	const [chat, setChat] = useState<{ id: string; from: "user" | "ai"; text: string }[]>([]);
	const [bookingLabId, setBookingLabId] = useState<string | null>(null);
	const [bookingPackageId, setBookingPackageId] = useState<string | null>(null);
	const active = sectionForRoute[pathname.split("/")[1] ?? ""] ?? "home";
	const expertAccount = isExpertRole(account?.role);
	const shellMode = mode === "expert" || expertAccount ? "expert" : "user";
	const expertAccessState = getExpertAccessState({
		account,
		loaded: accountLoaded,
		requestError: accountRequestError,
	});

	useEffect(() => {
		const controller = new AbortController();
		if (mode === "expert") {
			setAccountLoaded(false);
			setAccountRequestError(null);
		}
		fetch("/api/auth/me", { cache: "no-store", signal: controller.signal })
			.then(async (response) => {
				if (controller.signal.aborted) return null;
				if (response.status === 401) {
					setAccount(null);
					router.replace("/login");
					return null;
				}
				if (!response.ok) throw new Error("Không tải được thông tin tài khoản.");
				return (await response.json()) as Account;
			})
			.then((profile) => {
				if (!controller.signal.aborted) setAccount(profile);
			})
			.catch(() => {
				if (mode === "expert" && !controller.signal.aborted) {
					setAccountRequestError("Không thể xác minh tài khoản chuyên gia. Vui lòng thử lại.");
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setAccountLoaded(true);
			});
		return () => controller.abort();
	}, [accountRequestKey, mode, router]);

	useEffect(() => {
		if (!accountLoaded || !account) return;
		if (mode === "expert" && expertAccessState === "wrong-role") router.replace(nonExpertHome(account.role));
	}, [account, accountLoaded, expertAccessState, mode, router]);

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
	const expertGate = mode === "expert" && expertAccessState !== "verified" ? (
		<main className="flex min-h-screen items-center justify-center bg-background px-4">
			<section
				className="w-full max-w-md rounded-xl border bg-card p-6 text-center shadow-sm"
				aria-busy={expertAccessState === "loading"}
				aria-live="polite"
			>
				{expertAccessState === "loading" && (
					<>
						<h1 className="text-lg font-semibold">Đang xác minh tài khoản</h1>
						<p className="mt-2 text-sm text-muted-foreground" role="status">Vui lòng chờ trong giây lát…</p>
					</>
				)}
				{expertAccessState === "request-error" && (
					<>
						<h1 className="text-lg font-semibold">Chưa thể mở không gian chuyên gia</h1>
						<p className="mt-2 text-sm text-destructive" role="alert">{accountRequestError}</p>
						<Button className="mt-4" type="button" onClick={() => setAccountRequestKey((key) => key + 1)}>Thử lại</Button>
					</>
				)}
				{expertAccessState === "logged-out" && <p className="text-sm text-muted-foreground" role="status">Đang chuyển đến trang đăng nhập…</p>}
				{expertAccessState === "wrong-role" && <p className="text-sm text-muted-foreground" role="status">Đang chuyển về trang tài khoản của bạn…</p>}
			</section>
		</main>
	) : null;

	if (expertGate) return expertGate;

	return (
		<UserWorkspaceContext.Provider value={value}>
			<WorkspaceShell
				account={account}
				active={active}
				mode={shellMode}
				homeHref="/dashboard"
				navigationItems={shellMode === "expert" ? photographerExpertNavigation : photographerNavigation}
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
