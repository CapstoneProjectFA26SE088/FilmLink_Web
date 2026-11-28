export type PageResponse<T> = {
	content: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	hasNext: boolean;
};

export type CatalogItem = { id: number; code: string; displayName: string; description?: string | null; status: string };
export type FilmStock = { id: number; stockName: string; manufacturer: string; iso: number | null; defaultFilmProcessId: number | null; defaultFilmProcessName: string | null; status: string };
export type CatalogRef = Pick<CatalogItem, "id" | "code" | "displayName">;
export type ScanOption = { id: number; resolutionLabel: string; priceVnd: number };
export type ServicePackage = {
	id: number; packageName: string; serviceType: CatalogRef; filmProcess: CatalogRef; filmFormat: CatalogRef;
	priceVnd: number; turnaroundDays: number; pushPullAvailable: boolean;
	pushPullSurchargePerStopVnd: number; scanOptions: ScanOption[];
};
export type FilmLabSummary = { id: number; labName: string; addressLine: string; district: string; province: string; coverImageUrl: string | null; minPriceVnd: number; distanceKm: number | null };
export type FilmLab = { id: number; labName: string; description: string | null; addressLine: string; district: string; province: string; latitude: number | null; longitude: number | null; openingHours: { dayOfWeek: number; closed: boolean; opensAt: string | null; closesAt: string | null }[]; images: { id: number; displayOrder: number; url: string }[]; packages: ServicePackage[] };

export type OrderPayment = {
	id: number;
	transactionCode: string;
	serviceOrderId: number;
	amountVnd: number;
	purpose: string;
	method: string;
	status: string;
	createdAt: string;
};

export type OrderStatus = "AWAITING_PAYMENT" | "AWAITING_LAB_CONFIRMATION" | "AWAITING_FILM" | "AWAITING_MACHINE_ASSIGNMENT" | "IN_PROCESSING" | "AWAITING_TOP_UP" | "READY_FOR_HANDOVER" | "DELIVERED" | "CLOSED" | "CANCELLED" | "SUSPENDED";
export type OrderSummary = { id: number; orderCode: string; status: OrderStatus; filmLabId: number; labName: string; rollCount: number; estimatedTotalVnd: number | null; finalTotalVnd: number | null; expectedReturnAt: string | null; promisedReturnAt: string | null; createdAt: string };
export type FilmRoll = { id: number; rollSequence: number; filmStockId: number | null; filmStockNameText: string | null; filmFormatId: number; filmProcessId: number; servicePackageId: number; servicePackageScanOptionId: number | null; exposureCount: number; shootingIso: number | null; pushPullStops: number; unitPriceVnd: number; scanOptionPriceVnd: number; pushPullSurchargeVnd: number; expressSurchargeVnd: number; status: string; archiveRollId: number | null };
export type OrderDetail = { id: number; orderCode: string; status: OrderStatus; lab: { id: number; labName: string; addressLine: string; district: string; province: string } | null; serviceTier: string; filmHandoverMethod: string; paymentMethod: string; specialRequest: string | null; customerAddressLine: string | null; customerDistrict: string | null; customerProvince: string | null; customerPhone: string | null; pickupWindowStartAt: string | null; pickupWindowEndAt: string | null; estimatedTotalVnd: number | null; finalTotalVnd: number | null; priceLockedAt: string | null; expectedReturnAt: string | null; promisedReturnAt: string | null; acceptedAt: string | null; deliveredAt: string | null; closedAt: string | null; cancelledAt: string | null; cancellationReason: string | null; cancellationFeeVnd: number | null; keepNegativesAtLab: boolean; rolls: FilmRoll[]; stages: { stage: string; recordedAt: string; note: string | null }[]; handovers: { id: number; handoverPoint: string; rollCount: number; note: string | null; occurredAt: string; photos: { id: number; url: string }[] }[]; payment: unknown | null; createdAt: string };

export type RollDraft = { filmStockId: number | null; filmStockNameText: string | null; filmFormatId: number; exposureCount: number; shootingIso: number | null; servicePackageId: number; servicePackageScanOptionId: number | null; pushPullStops: number };
export type OrderPayload = { idempotencyKey: string | null; filmLabId: number; serviceTier: "STANDARD"; filmHandoverMethod: "SELF_DROP_OFF" | "PICKUP"; paymentMethod: "PAY_AT_LAB"; specialRequest: string | null; customerAddressLine: string | null; customerDistrict: string | null; customerProvince: string | null; customerPhone: string | null; pickupWindowStartAt: string | null; pickupWindowEndAt: string | null; rolls: RollDraft[] };
export type OrderQuote = { rolls: { rollSequence: number; servicePackageId: number; packageName: string; servicePackageScanOptionId: number | null; scanResolutionLabel: string | null; pushPullStops: number; unitPriceVnd: number; scanOptionPriceVnd: number; pushPullSurchargeVnd: number; rollPriceVnd: number }[]; subtotalVnd: number; expressSurchargeVnd: number; deliveryFeeVnd: number; estimatedTotalVnd: number; expectedReturnAt: string };

export type ArchiveSummary = { archiveRollId: number; filmRollId: number; rollSequence: number; serviceOrderId: number; orderCode: string; filmLabId: number; labName: string; filmStockId: number | null; filmStockName: string | null; filmFormatId: number; filmFormatName: string | null; deliveredAt: string; previewCount: number; coverPreviewUrl: string | null };
export type ArchiveRoll = ArchiveSummary & { exposureCount: number; fullResolutionLink: string | null; linkVerifiedAt: string | null; camera: string | null; lens: string | null; shotOn: string | null; location: string | null; note: string | null; frameCountDiscrepancyNote: string | null; previews: { id: number; frameNumber: number; widthPx: number; heightPx: number; sizeBytes: number; checksumSha256: string; url: string; createdAt: string }[] };
export type Citation = { articleId: number; title: string };
export type ChatMessage = { id: number; sender: "USER" | "ASSISTANT"; content: string; citations: Citation[]; createdAt: string };
export type ChatAnswer = { sessionId: number; answer: string; citations: Citation[]; fallback: boolean };

export class PhotographerApiError extends Error {
	constructor(public status: number, message: string, public code?: string) { super(message); }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`/api/backend/${path}`, { cache: "no-store", ...init });
	if (!response.ok) {
		const body = await response.json().catch(() => ({})) as { message?: string; errorCode?: string };
		throw new PhotographerApiError(response.status, body.message || "Không thể xử lý yêu cầu.", body.errorCode);
	}
	if (response.status === 204) return undefined as T;
	return response.json() as Promise<T>;
}

const json = (body: unknown): RequestInit => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
const query = (params: Record<string, string | number | null | undefined>) => {
	const search = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => { if (value !== null && value !== undefined && value !== "") search.set(key, String(value)); });
	return search.size ? `?${search}` : "";
};

export const photographerApi = {
	catalogs: () => Promise.all([
		request<CatalogItem[]>("film-formats"), request<CatalogItem[]>("film-processes"), request<CatalogItem[]>("service-types"),
	]).then(([formats, processes, serviceTypes]) => ({ formats, processes, serviceTypes })),
	labs: (params: Record<string, string | number | null | undefined>) => request<PageResponse<FilmLabSummary>>(`public/film-labs${query(params)}`),
	lab: (id: number) => request<FilmLab>(`public/film-labs/${id}`),
	filmStocks: (q: string) => request<FilmStock[]>(`film-stocks${query({ q })}`),
	quote: (payload: OrderPayload) => request<OrderQuote>("orders/quote", json(payload)),
	createOrder: (payload: OrderPayload) => request<{ id: number; orderCode: string }>("orders", json(payload)),
	orders: (params: Record<string, string | number | null | undefined>) => request<PageResponse<OrderSummary>>(`orders${query(params)}`),
	orderPayments: (id: number, signal?: AbortSignal) => request<OrderPayment[]>(`payments/by-order/${id}`, { signal }),
	order: (id: number) => request<OrderDetail>(`orders/${id}`),
	cancelOrder: (id: number, reason: string) => request<OrderDetail>(`orders/${id}/cancel`, json({ reason })),
	confirmReceipt: (id: number) => request<OrderDetail>(`orders/${id}/confirm-receipt`, json({})),
	archive: (page = 0) => request<PageResponse<ArchiveSummary>>(`me/archive${query({ page, size: 20 })}`),
	archiveRoll: (id: number) => request<ArchiveRoll>(`me/archive/rolls/${id}`),
	ask: (question: string, sessionId?: number) => request<ChatAnswer>("chatbot/questions", json({ question, sessionId })),
	messages: (sessionId: number, page = 0) => request<PageResponse<ChatMessage>>(`chatbot/sessions/${sessionId}/messages${query({ page, size: 100 })}`),
};

export function isPhotographerRole(role?: string) {
	return role === "PHOTOGRAPHER" || role === "PHOTOGRAPHY_EXPERT" || role === "EXPERT";
}

export function errorMessage(error: unknown) {
	if (error instanceof PhotographerApiError) {
		if (error.status === 401) return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
		if (error.status === 403) return "Tài khoản không có quyền thực hiện thao tác này.";
		if (error.status === 404) return "Không tìm thấy dữ liệu hoặc dữ liệu không thuộc tài khoản của bạn.";
		if (error.status === 409) return "Dữ liệu vừa thay đổi. Vui lòng tải lại rồi thử lại.";
		return error.message;
	}
	return "Không thể kết nối FilmLink. Vui lòng thử lại.";
}

export function isSafeHttpUrl(value: string | null): value is string {
	if (!value) return false;
	try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:"; } catch { return false; }
}

export { formatDate, formatDateOnly, formatMoney } from "@/lib/format";
export { orderStatusLabel, orderStatusTone } from "@/components/shared/status/labels";
