import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle, type LucideIcon } from "lucide-react";
import { cn } from "cn";

export type InlineMessageTone = "success" | "error" | "info" | "warning";

const TONE_ICON: Record<InlineMessageTone, LucideIcon> = {
	success: CheckCircle2,
	error: XCircle,
	info: Info,
	warning: AlertTriangle,
};

const TONE_CLASS: Record<InlineMessageTone, string> = {
	success: "bg-success-soft text-success",
	error: "bg-[color-mix(in_srgb,var(--destructive)_10%,var(--surface))] text-destructive",
	info: "bg-info-soft text-info",
	warning: "bg-warning-soft text-warning",
};

export type InlineMessageProps = {
	tone: InlineMessageTone;
	children: ReactNode;
	title?: string;
	className?: string;
};

/** Short feedback line. error/warning use role=alert, success/info use role=status. */
export function InlineMessage({ tone, title, children, className }: InlineMessageProps) {
	const Icon = TONE_ICON[tone];
	const urgent = tone === "error" || tone === "warning";
	return (
		<div
			role={urgent ? "alert" : "status"}
			data-slot="inline-message"
			data-tone={tone}
			className={cn(
				"flex items-start gap-2 rounded-lg border border-current/20 px-3 py-2 text-sm",
				TONE_CLASS[tone],
				className,
			)}
		>
			<Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
			<div className="min-w-0 flex-1">
				{title ? <p className="font-medium">{title}</p> : null}
				<div className={title ? "text-sm" : undefined}>{children}</div>
			</div>
		</div>
	);
}
