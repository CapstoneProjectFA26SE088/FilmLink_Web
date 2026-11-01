"use client";

import { Bell } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type WorkspaceNotification = {
	id: string;
	title: string;
	description: string;
	time: string;
	read?: boolean;
};

export function WorkspaceNotifications({
	items = [],
	prototype = false,
}: {
	items?: readonly WorkspaceNotification[];
	prototype?: boolean;
}) {
	const unreadCount = items.filter((item) => !item.read).length;
	const countLabel = unreadCount > 99 ? "99+" : unreadCount;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className="workspace-notifications-trigger"
				aria-label={unreadCount ? `Thông báo, ${unreadCount} thông báo chưa đọc` : "Thông báo"}
			>
				<Bell aria-hidden="true" />
				{unreadCount > 0 && <span className="workspace-notifications-count">{countLabel}</span>}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" side="bottom" className="workspace-notifications-menu">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Thông báo</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				{items.length > 0 ? (
					<div className="workspace-notifications-list">
						{items.map((item) => (
							<article className="workspace-notification" key={item.id}>
								<span className={`workspace-notification__dot${item.read ? " is-read" : ""}`} aria-hidden="true" />
								<div>
									<strong>{item.title}</strong>
									<p>{item.description}</p>
									<small>{item.time}</small>
								</div>
							</article>
						))}
					</div>
				) : (
					<p className="workspace-notifications-empty">Bạn chưa có thông báo mới.</p>
				)}
				{prototype && <p className="workspace-notifications-note">Thông báo minh họa · chưa kết nối API</p>}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
