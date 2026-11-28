import type { ReactNode } from "react";
import { EnumStatusBadge } from "@/components/shared/status/status-badge";
import { payoutItemKindLabel, recipientTypeLabel } from "@/components/shared/status/labels";
import { formatDate, formatMoney } from "@/lib/format";
import { labOwnerApi } from "@/lib/lab-owner-api";
import {
	FINANCE_COMMISSION_STATUS_MAP,
	FINANCE_DEBT_STATUS_MAP,
	FINANCE_PAYOUT_STATUS_MAP,
} from "./finance-labels";

export type FinanceView = "lab-income" | "lab-debt" | "lab-commissions" | "admin-payouts" | "admin-debts";

export type FinanceColumn = { header: string; align?: "end" };
export type FinanceRow = { id: number; cells: ReactNode[] };
export type FinanceKpi = { label: string; value: string };
export type FinancePage = { rows: FinanceRow[]; kpis: FinanceKpi[]; totalPages: number; totalElements: number | null };

export type FinanceScreen = {
	title: string;
	description: string;
	columns: FinanceColumn[];
	emptyTitle: string;
	emptyHint: string;
};

type ApiPage<T> = { content: T[]; totalPages: number; totalElements?: number };
type Payout = { id: number; payoutCode: string; recipientType: string; amountVnd: number; status: string; createdAt: string; paidAt: string | null };
type Commission = { id: number; kind: string; baseAmountVnd: number; ratePercent: number; amountVnd: number; status: string; createdAt: string };
type Debt = { id: number; billingPeriod: string; dueDate: string; totalAmountVnd: number; paidAmountVnd: number; status: string };

const LAB_DEBT_SCREEN: FinanceScreen = {
	title: "Công nợ",
	description: "Đối chiếu hoa hồng phải thanh toán và số tiền đã trả theo kỳ.",
	columns: [
		{ header: "Kỳ đối soát" }, { header: "Hạn thanh toán" }, { header: "Tổng công nợ", align: "end" },
		{ header: "Đã thanh toán", align: "end" }, { header: "Trạng thái" },
	],
	emptyTitle: "Lab chưa có kỳ công nợ",
	emptyHint: "Kỳ công nợ chỉ xuất hiện khi lab có hoa hồng cần thanh toán theo kỳ đối soát. Lab chưa phát sinh công nợ nào.",
};

export const FINANCE_SCREENS: Record<FinanceView, FinanceScreen> = {
	"admin-debts": {
		...LAB_DEBT_SCREEN,
		title: "Công nợ Film Lab",
		description: "Xem kỳ công nợ của một Film Lab và xác nhận khi đã nhận đủ tiền.",
		emptyTitle: "Lab này chưa có kỳ công nợ",
		emptyHint: "Kỳ công nợ chỉ xuất hiện khi lab có hoa hồng cần thanh toán theo kỳ đối soát. Hãy kiểm tra lại mã lab.",
	},
	"lab-income": {
		title: "Doanh thu",
		description: "Theo dõi các khoản nền tảng chuyển cho lab và ngày thực nhận.",
		columns: [
			{ header: "Mã chi trả" }, { header: "Số tiền", align: "end" }, { header: "Ngày tạo" },
			{ header: "Ngày chi trả" }, { header: "Trạng thái" },
		],
		emptyTitle: "Lab chưa có khoản chi trả",
		emptyHint: "Khi nền tảng chuyển tiền cho lab, từng khoản chi trả sẽ hiện ở đây cùng ngày thực nhận. Danh sách trống nghĩa là chưa có khoản nào được tạo.",
	},
	"lab-debt": LAB_DEBT_SCREEN,
	"lab-commissions": {
		title: "Hoa hồng",
		description: "Theo dõi tỷ lệ và số tiền hoa hồng ghi nhận từ từng giao dịch.",
		columns: [
			{ header: "Ngày ghi nhận" }, { header: "Nguồn" }, { header: "Giá trị tính phí", align: "end" },
			{ header: "Tỷ lệ", align: "end" }, { header: "Hoa hồng", align: "end" }, { header: "Trạng thái" },
		],
		emptyTitle: "Lab chưa phát sinh hoa hồng",
		emptyHint: "Mỗi giao dịch tính hoa hồng sẽ tạo một dòng ở đây với tỷ lệ và số tiền tương ứng. Hiện chưa có giao dịch nào.",
	},
	"admin-payouts": {
		title: "Thanh toán & chi trả",
		description: "Theo dõi các khoản chi cho Film Lab và người bán.",
		columns: [
			{ header: "Mã chi trả" }, { header: "Bên nhận" }, { header: "Số tiền", align: "end" },
			{ header: "Ngày tạo" }, { header: "Ngày chi trả" }, { header: "Trạng thái" },
		],
		emptyTitle: "Chưa có khoản chi trả nào",
		emptyHint: "Các khoản chi cho Film Lab và người bán sẽ hiện ở đây sau khi được tạo. Danh sách đang trống vì chưa có khoản nào phát sinh.",
	},
};

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
const isoDay = (value: string) => value.split("-").reverse().join("/");

function payoutPage(view: FinanceView, result: ApiPage<Payout>): FinancePage {
	const items = result.content;
	const paid = sum(items.filter((item) => item.status === "PAID").map((item) => item.amountVnd));
	const pending = sum(items.filter((item) => item.status === "PENDING").map((item) => item.amountVnd));
	return {
		totalPages: result.totalPages,
		totalElements: result.totalElements ?? null,
		kpis: [
			{ label: "Số khoản", value: String(items.length) },
			{ label: "Tổng số tiền", value: formatMoney(sum(items.map((item) => item.amountVnd))) },
			{ label: "Đã chi trả", value: formatMoney(paid) },
			{ label: "Chờ chi trả", value: formatMoney(pending) },
		],
		rows: items.map((payout) => ({
			id: payout.id,
			cells: [
				payout.payoutCode,
				...(view === "admin-payouts" ? [recipientTypeLabel(payout.recipientType)] : []),
				formatMoney(payout.amountVnd),
				formatDate(payout.createdAt),
				formatDate(payout.paidAt),
				<EnumStatusBadge key="status" map={FINANCE_PAYOUT_STATUS_MAP} value={payout.status} />,
			],
		})),
	};
}

function commissionPage(result: ApiPage<Commission>): FinancePage {
	const items = result.content;
	return {
		totalPages: result.totalPages,
		totalElements: result.totalElements ?? null,
		kpis: [
			{ label: "Số khoản", value: String(items.length) },
			{ label: "Giá trị tính phí", value: formatMoney(sum(items.map((item) => item.baseAmountVnd))) },
			{ label: "Tổng hoa hồng", value: formatMoney(sum(items.map((item) => item.amountVnd))) },
		],
		rows: items.map((item) => ({
			id: item.id,
			cells: [
				formatDate(item.createdAt),
				payoutItemKindLabel(item.kind),
				formatMoney(item.baseAmountVnd),
				`${item.ratePercent}%`,
				formatMoney(item.amountVnd),
				<EnumStatusBadge key="status" map={FINANCE_COMMISSION_STATUS_MAP} value={item.status} />,
			],
		})),
	};
}

function debtPage(result: ApiPage<Debt>): FinancePage {
	const items = result.content;
	const total = sum(items.map((item) => item.totalAmountVnd));
	const paid = sum(items.map((item) => item.paidAmountVnd));
	return {
		totalPages: result.totalPages,
		totalElements: result.totalElements ?? null,
		kpis: [
			{ label: "Số kỳ", value: String(items.length) },
			{ label: "Tổng công nợ", value: formatMoney(total) },
			{ label: "Đã thanh toán", value: formatMoney(paid) },
			{ label: "Còn phải trả", value: formatMoney(total - paid) },
		],
		rows: items.map((debt) => ({
			id: debt.id,
			cells: [
				isoDay(debt.billingPeriod),
				isoDay(debt.dueDate),
				formatMoney(debt.totalAmountVnd),
				formatMoney(debt.paidAmountVnd),
				<EnumStatusBadge key="status" map={FINANCE_DEBT_STATUS_MAP} value={debt.status} />,
			],
		})),
	};
}

/** Loads one page of a finance list. Request paths and query are unchanged from the original report. */
export async function loadFinancePage(view: FinanceView, page: number, signal: AbortSignal, labId?: number): Promise<FinancePage> {
	const query = new URLSearchParams({ page: String(page), size: "20" });
	if (view === "admin-debts") {
		if (!labId) throw new Error("Hãy nhập mã Film Lab để xem công nợ.");
		return debtPage(await labOwnerApi<ApiPage<Debt>>(`commission-debts/lab/${labId}?${query}`, { signal }));
	}
	if (view === "lab-debt" || view === "lab-commissions") {
		const lab = await labOwnerApi<{ id: number }>("film-labs/me", { signal });
		if (view === "lab-commissions") {
			return commissionPage(await labOwnerApi<ApiPage<Commission>>(`commissions/lab/${lab.id}?${query}`, { signal }));
		}
		return debtPage(await labOwnerApi<ApiPage<Debt>>(`commission-debts/lab/${lab.id}?${query}`, { signal }));
	}
	const path = view === "lab-income" ? "film-labs/me/payouts" : "admin/payouts";
	return payoutPage(view, await labOwnerApi<ApiPage<Payout>>(`${path}?${query}`, { signal }));
}
