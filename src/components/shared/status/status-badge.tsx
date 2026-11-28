import {
	AlertTriangle,
	CheckCircle2,
	CircleDot,
	Info,
	XCircle,
	type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import {
	enumEntry,
	PAYMENT_STATUS_MAP,
	ORDER_STATUS_MAP,
	MACHINE_STATUS_MAP,
	PROCESSING_STAGE_MAP,
	ROLL_STATUS_MAP,
	LAB_APPLICATION_STATUS_MAP,
	type EnumLabelMap,
	type StatusTone,
} from "./labels";

const TONE_ICON: Record<StatusTone, LucideIcon> = {
	success: CheckCircle2,
	warning: AlertTriangle,
	danger: XCircle,
	info: Info,
	neutral: CircleDot,
};

const TONE_CLASS: Record<StatusTone, string> = {
	success: "bg-success-soft text-success",
	warning: "bg-warning-soft text-warning",
	info: "bg-info-soft text-info",
	danger: "bg-[color-mix(in_srgb,var(--destructive)_10%,var(--surface))] text-destructive",
	neutral: "bg-surface-muted text-text-secondary",
};

export type StatusBadgeProps = {
	label: string;
	tone?: StatusTone;
	icon?: LucideIcon;
	className?: string;
};

/** Icon + text badge. Never relies on color alone. */
export function StatusBadge({ label, tone = "neutral", icon, className }: StatusBadgeProps) {
	const Icon = icon ?? TONE_ICON[tone];
	return (
		<span
			data-slot="status-badge"
			data-tone={tone}
			className={cn(
				"inline-flex max-w-full items-center gap-1 rounded-[6px] border border-current/20 px-2 py-0.5 text-xs font-medium leading-[18px] whitespace-nowrap",
				TONE_CLASS[tone],
				className,
			)}
		>
			<Icon aria-hidden="true" className="size-3.5 shrink-0" />
			<span className="truncate">{label}</span>
		</span>
	);
}

type MappedBadgeProps = { value: string | null | undefined; className?: string; icon?: LucideIcon };

/** Badge for any enum map from labels.ts. */
export function EnumStatusBadge({ map, value, ...rest }: MappedBadgeProps & { map: EnumLabelMap }) {
	const { label, tone } = enumEntry(map, value);
	return <StatusBadge label={label} tone={tone} {...rest} />;
}

export function OrderStatusBadge(props: MappedBadgeProps) {
	return <EnumStatusBadge map={ORDER_STATUS_MAP} {...props} />;
}

export function StageBadge(props: MappedBadgeProps) {
	return <EnumStatusBadge map={PROCESSING_STAGE_MAP} {...props} />;
}

export function RollStatusBadge(props: MappedBadgeProps) {
	return <EnumStatusBadge map={ROLL_STATUS_MAP} {...props} />;
}

export function PaymentStatusBadge(props: MappedBadgeProps) {
	return <EnumStatusBadge map={PAYMENT_STATUS_MAP} {...props} />;
}

export function MachineStatusBadge(props: MappedBadgeProps) {
	return <EnumStatusBadge map={MACHINE_STATUS_MAP} {...props} />;
}

export function LabApplicationStatusBadge(props: MappedBadgeProps) {
	return <EnumStatusBadge map={LAB_APPLICATION_STATUS_MAP} {...props} />;
}
