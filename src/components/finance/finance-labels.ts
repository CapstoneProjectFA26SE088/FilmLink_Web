import {
	COMMISSION_STATUS_MAP,
	DEBT_STATUS_MAP,
	PAYOUT_STATUS_MAP,
	type EnumLabelMap,
} from "@/components/shared/status/labels";

/**
 * Debt and commission statuses are plain strings in the staging contract (not enums).
 * These maps extend the shared label maps with the values the finance screens already handled,
 * so no raw value is shown to the user.
 */
export const FINANCE_PAYOUT_STATUS_MAP: EnumLabelMap = PAYOUT_STATUS_MAP;

export const FINANCE_DEBT_STATUS_MAP: EnumLabelMap = {
	...DEBT_STATUS_MAP,
	UNPAID: { label: "Chưa thanh toán", tone: "warning" },
	PARTIALLY_PAID: { label: "Đã trả một phần", tone: "info" },
};

export const FINANCE_COMMISSION_STATUS_MAP: EnumLabelMap = {
	...COMMISSION_STATUS_MAP,
	OPEN: { label: "Đang mở", tone: "info" },
	DEFERRED: { label: "Tạm hoãn", tone: "warning" },
	BILLED: { label: "Đã lập công nợ", tone: "info" },
	SETTLED: { label: "Đã tất toán", tone: "success" },
};
