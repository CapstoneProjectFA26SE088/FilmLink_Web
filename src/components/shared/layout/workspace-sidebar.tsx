import {
	ArrowUpRight,
	ChevronRight,
	Film,
	LogOut,
	UserRound,
	UsersRound,
	X,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Account } from "../model";
import { navigation } from "../model";

export function WorkspaceSidebar({
	active,
	account,
	homeHref = "/",
	orderCount = 2,
	showOrderCount = true,
	marketplaceEnabled = false,
	navigationItems,
	accountRoleLabel,
	accountInitials = "FL",
	onNavigate,
	onClose,
	onDismissCommunityNote,
	communityNoteVisible = true,
	onLogout,
	logoutPending = false,
	logoutError,
}: {
	active: string;
	account: Account | null;
	homeHref?: string;
	orderCount?: number;
	showOrderCount?: boolean;
	marketplaceEnabled?: boolean;
	navigationItems?: readonly { id: string; label: string; icon: LucideIcon }[];
	accountRoleLabel?: string;
	accountInitials?: string;
	onNavigate: (section: string) => void;
	onClose?: () => void;
	onDismissCommunityNote?: () => void;
	communityNoteVisible?: boolean;
	onLogout?: () => void;
	logoutPending?: boolean;
	logoutError?: string | null;
}) {
	const items = navigationItems ?? navigation.filter(({ id }) => marketplaceEnabled || id !== "marketplace");
	return (
		<>
			<div className="sidebar-brand-row">
				<Link
					href={homeHref}
					className="brand-lockup"
					onClick={onClose}
					aria-label="FilmLink, về trang chủ"
				>
					<span className="brand-mark">
						<Film aria-hidden="true" />
					</span>
					<span className="brand-name">
						Film<span>Link</span>
					</span>
				</Link>
			</div>
			<nav className="sidebar-nav" aria-label="Điều hướng chính">
				{items.map(({ id, label, icon: Icon }) => (
					<button
						key={id}
						type="button"
						className={`nav-item${active === id ? " nav-item--active" : ""}`}
						aria-current={active === id ? "page" : undefined}
						onClick={() => {
							onNavigate(id);
							onClose?.();
						}}
					>
						<Icon aria-hidden="true" />
						<span className="nav-label">{label}</span>
						{id === "orders" && account && showOrderCount && <span className="nav-count">{orderCount}</span>}
					</button>
					))}
			</nav>

			<div className="sidebar-bottom">
				{communityNoteVisible && (
					<div className="community-note">
						<button
							type="button"
							className="community-note__dismiss"
							aria-label="Đóng thông báo cộng đồng"
							onClick={onDismissCommunityNote}
						>
							<X aria-hidden="true" />
						</button>
						<div className="community-note__icon">
							<UsersRound aria-hidden="true" />
						</div>
						<p>Góc nhỏ cho người mê phim</p>
						<span>Chia sẻ cuộn phim, gặp những tâm hồn đồng điệu.</span>
						<button
							type="button"
							className="community-note__link"
							onClick={() => {
								onNavigate("community");
								onClose?.();
							}}
						>
							Khám phá cộng đồng <ArrowUpRight aria-hidden="true" />
						</button>
					</div>
				)}
				{account && onLogout ? (
					<div className="sidebar-user">
						<span className="user-avatar">
							<span className="sidebar-avatar-initials">{accountInitials}</span>
							<UserRound aria-hidden="true" className="sidebar-avatar-icon" />
						</span>
						<span className="sidebar-user__copy">
							<strong>{account.fullName || account.email || "Tài khoản FilmLink"}</strong>
							<small>{accountRoleLabel || account.role || "Thành viên"}</small>
						</span>
						<DropdownMenu>
							<DropdownMenuTrigger className="sidebar-user__trigger" aria-label="Mở menu đăng xuất">
								<ChevronRight aria-hidden="true" className="sidebar-user__chevron" />
							</DropdownMenuTrigger>
							<DropdownMenuContent side="top" align="end" sideOffset={8} className="min-w-52">
								<DropdownMenuGroup>
									<DropdownMenuLabel>{account.fullName || account.email || "Tài khoản"}</DropdownMenuLabel>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem variant="destructive" disabled={logoutPending} onClick={onLogout}>
										<LogOut aria-hidden="true" />
										{logoutPending ? "Đang đăng xuất…" : "Đăng xuất"}
									</DropdownMenuItem>
								</DropdownMenuGroup>
								{logoutError && <p className="px-2 py-1 text-xs text-destructive" role="alert">{logoutError}</p>}
							</DropdownMenuContent>
						</DropdownMenu>
				</div>
				) : (
					<div className="sidebar-user">
						<span className="user-avatar">
										<span className="sidebar-avatar-initials">{accountInitials}</span>
							<UserRound aria-hidden="true" className="sidebar-avatar-icon" />
						</span>
						<span className="sidebar-user__copy">
							<strong>{account?.fullName || account?.email || "Khách FilmLink"}</strong>
							<small>{account ? accountRoleLabel || account.role || "Thành viên" : "Trải nghiệm ngay"}</small>
						</span>
						<ChevronRight aria-hidden="true" className="sidebar-user__chevron" />
					</div>
				)}
			</div>
		</>
	);
}
