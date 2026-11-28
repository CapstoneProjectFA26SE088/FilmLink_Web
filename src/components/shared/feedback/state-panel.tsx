import type { ReactNode } from "react";
import { AlertCircle, Inbox, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

type StatePanelBase = { className?: string };

export type StatePanelProps =
	| (StatePanelBase & { variant: "loading"; rows?: number; label?: string })
	| (StatePanelBase & {
			variant: "empty";
			title: string;
			description?: string;
			icon?: LucideIcon;
			action?: ReactNode;
	  })
	| (StatePanelBase & {
			variant: "error";
			title?: string;
			description?: string;
			onRetry?: () => void;
	  });

/** Loading skeleton, empty state, or error state with retry. */
export function StatePanel(props: StatePanelProps) {
	if (props.variant === "loading") {
		const { rows = 3, label = "Đang tải dữ liệu…", className } = props;
		return (
			<div
				role="status"
				aria-busy="true"
				data-slot="state-panel"
				className={cn("flex flex-col gap-3", className)}
			>
				<span className="sr-only">{label}</span>
				{Array.from({ length: rows }, (_, index) => (
					<Skeleton key={index} aria-hidden="true" className="h-14 w-full rounded-[10px]" />
				))}
			</div>
		);
	}

	if (props.variant === "empty") {
		const { title, description, icon: Icon = Inbox, action, className } = props;
		return (
			<Empty data-slot="state-panel" className={cn("border", className)}>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Icon aria-hidden="true" />
					</EmptyMedia>
					<EmptyTitle>{title}</EmptyTitle>
					{description ? <EmptyDescription>{description}</EmptyDescription> : null}
				</EmptyHeader>
				{action ? <EmptyContent>{action}</EmptyContent> : null}
			</Empty>
		);
	}

	const {
		title = "Không thể tải dữ liệu",
		description = "Đã có lỗi xảy ra. Vui lòng thử lại.",
		onRetry,
		className,
	} = props;
	return (
		<Empty role="alert" data-slot="state-panel" className={cn("border", className)}>
			<EmptyHeader>
				<EmptyMedia variant="icon" className="text-destructive">
					<AlertCircle aria-hidden="true" />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
			{onRetry ? (
				<EmptyContent>
					<Button type="button" variant="outline" onClick={onRetry}>
						Thử lại
					</Button>
				</EmptyContent>
			) : null}
		</Empty>
	);
}
