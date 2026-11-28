import { labelsOf, ORDER_STATUS_MAP, PROCESSING_STAGE_MAP } from "@/components/shared/status/labels";
export class LabOwnerApiError extends Error {
	constructor(message: string, public status: number, public details?: Record<string, unknown>) {
		super(message);
		this.name = "LabOwnerApiError";
	}
}

export async function labOwnerApi<T>(path: string, init: RequestInit = {}): Promise<T> {
	const headers = new Headers(init.headers);
	headers.set("accept", "application/json");
	if (init.body !== undefined && !(init.body instanceof FormData) && !headers.has("content-type")) headers.set("content-type", "application/json");
	const response = await fetch(`/api/backend/${path.replace(/^\/+/, "")}`, { ...init, headers, cache: "no-store" });
	if (!response.ok) {
		const details = await response.json().catch(() => ({})) as Record<string, unknown>;
		throw new LabOwnerApiError(typeof details.message === "string" ? details.message : "Yêu cầu chưa thể thực hiện.", response.status, details);
	}
	if (response.status === 204) return undefined as T;
	return await response.json() as T;
}

export type OrderStatus = "AWAITING_PAYMENT" | "AWAITING_LAB_CONFIRMATION" | "AWAITING_FILM" | "AWAITING_MACHINE_ASSIGNMENT" | "IN_PROCESSING" | "AWAITING_TOP_UP" | "READY_FOR_HANDOVER" | "DELIVERED" | "CLOSED" | "CANCELLED" | "SUSPENDED";
export type ProcessingStage = "RECEIVED" | "DEVELOPING" | "WASHING" | "DRYING" | "SCANNING" | "QC";
export type PageResponse<T> = { content: T[]; page: number; size: number; totalElements: number; totalPages: number; hasNext: boolean };
export type OrderSummary = { id: number; orderCode: string; status: OrderStatus; serviceTier: string; filmHandoverMethod: string; paymentMethod: string; rollCount: number; estimatedTotalVnd: number | null; labResponseDueAt: string | null; expectedReturnAt: string | null; createdAt: string };
export type FilmRoll = { id: number; rollSequence: number; filmStockId: number | null; filmStockNameText: string | null; filmFormatId: number; filmProcessId: number; servicePackageId: number; servicePackageScanOptionId: number | null; exposureCount: number | null; shootingIso: number | null; pushPullStops: number | null; unitPriceVnd: number; scanOptionPriceVnd: number | null; pushPullSurchargeVnd: number | null; expressSurchargeVnd: number | null; status: string; previewScanCount: number | null; fullResolutionLink: string | null };
export type StageRecord = { id?: number; stage: ProcessingStage; note?: string | null; recordedAt?: string; createdAt?: string };
export type FilmHandover = { id: number; handoverPoint: string; rollCount: number; note: string | null; performedByAccountId: number; performedByName: string; occurredAt: string; photos: { id: number; displayOrder: number; url: string }[] };
export type OrderDetail = OrderSummary & { specialRequest: string | null; customerAddressLine: string | null; customerDistrict: string | null; customerProvince: string | null; customerPhone: string | null; pickupWindowStartAt: string | null; pickupWindowEndAt: string | null; finalTotalVnd: number | null; priceLockedAt: string | null; promisedReturnAt: string | null; acceptedAt: string | null; deliveredAt: string | null; photographer: { id?: number; accountId?: number; fullName?: string; phoneNumber?: string } | null; rolls: FilmRoll[]; handovers: FilmHandover[]; stages: StageRecord[]; keepNegativesAtLab: boolean };
export type ScheduleProposal = { feasible: boolean; infeasibleReason: string | null; promisedReturnAt: string | null; tierCommitmentAt: string | null; allocations: { workDate: string; filmProcessId: number; filmFormatId: number; rollCount: number }[] };
export type ScanFile = { id: number; frameNumber: number; widthPx: number; heightPx: number; sizeBytes: number; url: string; createdAt: string };

export type MachineHour = { dayOfWeek: number; closed: boolean; opensAt: string | null; closesAt: string | null; dailyCapacityRolls?: number };
export type Machine = { id: number; filmLabId: number; machineCode: string; modelName: string | null; machineType: "PROCESSOR" | "SCANNER"; capacityPerHour: number; status: "ACTIVE" | "MAINTENANCE" | "DOWN"; dailyCapacityRolls: number; filmProcessIds: number[]; filmFormatIds: number[]; workingHours: MachineHour[]; createdAt: string; updatedAt: string };
export type CatalogOption = { id: number; code: string; displayName: string; status: string };
export type ScheduleChange = { id: number; serviceOrderId: number; stepApplied: string; oldPromisedAt: string | null; newPromisedAt: string | null; requiresResponse: boolean; responseDueAt: string | null };
export type MachineIncident = { id: number; machineId: number; machineCode: string; cause: string; description: string | null; unavailableFrom: string; expectedAvailableAt: string | null; machineStatusAfter: string; resolvedAt: string | null; affectedOrderCount: number; scheduleChanges: ScheduleChange[]; createdAt: string };

export const STATUS_LABELS: Record<string, string> = labelsOf(ORDER_STATUS_MAP);
export const STAGE_LABELS: Record<ProcessingStage, string> = labelsOf(PROCESSING_STAGE_MAP) as Record<ProcessingStage, string>;
export { formatDate, formatMoney } from "@/lib/format";
export function safeHttpUrl(value: string | null | undefined) { try { const url = new URL(value ?? ""); return ["http:", "https:"].includes(url.protocol) ? url.href : null; } catch { return null; } }
