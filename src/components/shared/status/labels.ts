export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

export type EnumLabel = { label: string; tone: StatusTone };
export type EnumLabelMap = Record<string, EnumLabel>;

export const UNKNOWN_LABEL = "Không xác định";
const UNKNOWN: EnumLabel = { label: UNKNOWN_LABEL, tone: "neutral" };

/** Looks up an enum value; never returns the raw enum for unknown values. */
export function enumEntry(map: EnumLabelMap, value: string | null | undefined): EnumLabel {
	if (!value) return UNKNOWN;
	return Object.prototype.hasOwnProperty.call(map, value) ? map[value] : UNKNOWN;
}

export function enumLabel(map: EnumLabelMap, value: string | null | undefined) {
	return enumEntry(map, value).label;
}

export function enumTone(map: EnumLabelMap, value: string | null | undefined) {
	return enumEntry(map, value).tone;
}

function l(label: string, tone: StatusTone = "neutral"): EnumLabel {
	return { label, tone };
}

export const ORDER_STATUS_MAP: EnumLabelMap = {
	AWAITING_PAYMENT: l("Chờ thanh toán", "warning"),
	AWAITING_LAB_CONFIRMATION: l("Chờ lab xác nhận", "warning"),
	AWAITING_FILM: l("Chờ nhận phim", "warning"),
	AWAITING_MACHINE_ASSIGNMENT: l("Chờ xếp máy", "warning"),
	IN_PROCESSING: l("Đang xử lý", "info"),
	AWAITING_TOP_UP: l("Chờ thanh toán bổ sung", "warning"),
	READY_FOR_HANDOVER: l("Chờ bàn giao", "info"),
	DELIVERED: l("Đã bàn giao", "success"),
	CLOSED: l("Đã đóng", "neutral"),
	CANCELLED: l("Đã hủy", "danger"),
	SUSPENDED: l("Tạm ngưng", "danger"),
};

export const PROCESSING_STAGE_MAP: EnumLabelMap = {
	RECEIVED: l("Đã nhận", "info"),
	DEVELOPING: l("Tráng phim", "info"),
	WASHING: l("Rửa phim", "info"),
	DRYING: l("Sấy khô", "info"),
	SCANNING: l("Scan", "info"),
	QC: l("Kiểm tra chất lượng", "info"),
};

export const ROLL_STATUS_MAP: EnumLabelMap = {
	PENDING: l("Chờ xử lý", "warning"),
	DECLARED: l("Đã khai báo", "neutral"),
	NOT_RECEIVED: l("Lab không nhận được", "danger"),
	RECEIVED: l("Đã nhận", "info"),
	RETURNED: l("Đã trả phim", "success"),
	IN_PROCESSING: l("Đang xử lý", "info"),
	DEVELOPING: l("Tráng phim", "info"),
	SCANNING: l("Scan", "info"),
	SCANNED: l("Đã scan", "info"),
	COMPLETED: l("Hoàn tất", "success"),
	DELIVERED: l("Đã bàn giao", "success"),
	DAMAGED: l("Hư hỏng", "danger"),
	CANCELLED: l("Đã hủy", "danger"),
};

export const SERVICE_TIER_MAP: EnumLabelMap = {
	STANDARD: l("Tiêu chuẩn"),
	EXPRESS: l("Nhanh", "info"),
};

export const HANDOVER_METHOD_MAP: EnumLabelMap = {
	SELF_DROP_OFF: l("Tự mang đến lab"),
	PICKUP: l("Lab đến lấy phim"),
	PARCEL_SHIPPING: l("Gửi phim qua bưu cục"),
};

export const HANDOVER_POINT_MAP: EnumLabelMap = {
	COLLECTED_FROM_PHOTOGRAPHER: l("Đã lấy phim từ khách"),
	HANDED_TO_PARTNER: l("Đã giao cho đơn vị vận chuyển"),
	RECEIVED_AT_LAB: l("Lab đã nhận phim", "info"),
	HANDED_BACK_TO_PARTNER: l("Đã giao lại cho đơn vị vận chuyển"),
	RETURNED_TO_PHOTOGRAPHER: l("Đã trả phim cho khách", "success"),
	COLLECTED_AT_LAB: l("Khách đã nhận tại lab", "success"),
};

export const PAYMENT_METHOD_MAP: EnumLabelMap = {
	ONLINE: l("Thanh toán trực tuyến"),
	VNPAY: l("VNPay"),
	PAY_AT_LAB: l("Thanh toán tại lab"),
	COD: l("Thanh toán khi nhận hàng"),
	BANK_TRANSFER: l("Chuyển khoản"),
};

export const PAYMENT_STATUS_MAP: EnumLabelMap = {
	PENDING: l("Đang chờ", "warning"),
	SUCCEEDED: l("Thành công", "success"),
	PAID: l("Đã thanh toán", "success"),
	FAILED: l("Thất bại", "danger"),
	EXPIRED: l("Hết hạn", "neutral"),
	CANCELLED: l("Đã hủy", "danger"),
	AWAITING_MANUAL: l("Chờ xử lý thủ công", "warning"),
};

export const PAYMENT_PURPOSE_MAP: EnumLabelMap = {
	ORDER_PAYMENT: l("Thanh toán đơn"),
	ORDER_TOP_UP: l("Thanh toán bổ sung"),
	ORDER_REFUND: l("Hoàn tiền đơn"),
	SALE_PAYMENT: l("Thanh toán mua bán"),
	SALE_REFUND: l("Hoàn tiền mua bán"),
	DEBT_PAYMENT: l("Thanh toán công nợ"),
};

export const MACHINE_TYPE_MAP: EnumLabelMap = {
	PROCESSOR: l("Máy tráng phim"),
	SCANNER: l("Máy scan"),
};

export const MACHINE_STATUS_MAP: EnumLabelMap = {
	ACTIVE: l("Hoạt động", "success"),
	MAINTENANCE: l("Bảo trì", "warning"),
	DOWN: l("Ngừng hoạt động", "danger"),
};

export const INCIDENT_CAUSE_MAP: EnumLabelMap = {
	MACHINE_FAILURE: l("Máy gặp sự cố", "danger"),
	CHEMICALS_RUN_OUT: l("Hết hóa chất", "warning"),
	CHEMICALS_EXPIRED: l("Hóa chất hết hạn", "warning"),
	POWER_OUTAGE: l("Mất điện", "danger"),
	OTHER: l("Nguyên nhân khác"),
};

export const LAB_APPLICATION_STATUS_MAP: EnumLabelMap = {
	PENDING_REVIEW: l("Chờ duyệt", "warning"),
	AWAITING_INFORMATION: l("Cần bổ sung thông tin", "warning"),
	APPROVED: l("Đã duyệt", "success"),
	REJECTED: l("Bị từ chối", "danger"),
};

export const PAYOUT_STATUS_MAP: EnumLabelMap = {
	PENDING: l("Chờ chi trả", "warning"),
	PROCESSING: l("Đang xử lý", "info"),
	PAID: l("Đã chi trả", "success"),
	FAILED: l("Thất bại", "danger"),
	CANCELLED: l("Đã hủy", "danger"),
};

export const DEBT_STATUS_MAP: EnumLabelMap = {
	OPEN: l("Chưa thanh toán", "warning"),
	OVERDUE: l("Quá hạn", "danger"),
	PAID: l("Đã thanh toán", "success"),
	WAIVED: l("Đã miễn", "neutral"),
	CANCELLED: l("Đã hủy", "danger"),
};

export const COMMISSION_STATUS_MAP: EnumLabelMap = {
	PENDING: l("Chờ đối soát", "warning"),
	SETTLED: l("Đã đối soát", "success"),
	PAID: l("Đã thanh toán", "success"),
	CANCELLED: l("Đã hủy", "danger"),
};

export const STEP_APPLIED_MAP: EnumLabelMap = {
	MOVED_MACHINE: l("Chuyển sang máy khác", "info"),
	RESCHEDULED: l("Dời lịch trả phim", "warning"),
};

export const CONFIRMATION_STATUS_MAP: EnumLabelMap = {
	NOT_REQUIRED: l("Không cần xác nhận"),
	AWAITING_CONFIRMATION: l("Chờ xác nhận", "warning"),
	CONFIRMED: l("Đã xác nhận", "success"),
	DISPUTED: l("Đang tranh chấp", "danger"),
};

export const PAYMENT_DIRECTION_MAP: EnumLabelMap = {
	IN: l("Tiền vào", "success"),
	OUT: l("Tiền ra", "info"),
};

export const RECIPIENT_TYPE_MAP: EnumLabelMap = {
	FILM_LAB: l("Film lab"),
	SELLER: l("Người bán"),
};

export const PAYOUT_ITEM_KIND_MAP: EnumLabelMap = {
	ORDER: l("Đơn dịch vụ"),
	SALE: l("Đơn mua bán"),
	ADJUSTMENT: l("Điều chỉnh"),
};

export const COLLECTION_MODE_MAP: EnumLabelMap = {
	DEDUCTED: l("Trừ trực tiếp vào đối soát"),
	DEBT: l("Ghi nhận công nợ", "warning"),
};

export const orderStatusLabel = (v: string | null | undefined) => enumLabel(ORDER_STATUS_MAP, v);
export const orderStatusTone = (v: string | null | undefined) => enumTone(ORDER_STATUS_MAP, v);
export const stageLabel = (v: string | null | undefined) => enumLabel(PROCESSING_STAGE_MAP, v);
export const rollStatusLabel = (v: string | null | undefined) => enumLabel(ROLL_STATUS_MAP, v);
export const serviceTierLabel = (v: string | null | undefined) => enumLabel(SERVICE_TIER_MAP, v);
export const handoverMethodLabel = (v: string | null | undefined) => enumLabel(HANDOVER_METHOD_MAP, v);
export const handoverPointLabel = (v: string | null | undefined) => enumLabel(HANDOVER_POINT_MAP, v);
export const paymentMethodLabel = (v: string | null | undefined) => enumLabel(PAYMENT_METHOD_MAP, v);
export const paymentStatusLabel = (v: string | null | undefined) => enumLabel(PAYMENT_STATUS_MAP, v);
export const paymentPurposeLabel = (v: string | null | undefined) => enumLabel(PAYMENT_PURPOSE_MAP, v);
export const machineTypeLabel = (v: string | null | undefined) => enumLabel(MACHINE_TYPE_MAP, v);
export const machineStatusLabel = (v: string | null | undefined) => enumLabel(MACHINE_STATUS_MAP, v);
export const incidentCauseLabel = (v: string | null | undefined) => enumLabel(INCIDENT_CAUSE_MAP, v);
export const labApplicationStatusLabel = (v: string | null | undefined) => enumLabel(LAB_APPLICATION_STATUS_MAP, v);
export const payoutStatusLabel = (v: string | null | undefined) => enumLabel(PAYOUT_STATUS_MAP, v);
export const debtStatusLabel = (v: string | null | undefined) => enumLabel(DEBT_STATUS_MAP, v);
export const commissionStatusLabel = (v: string | null | undefined) => enumLabel(COMMISSION_STATUS_MAP, v);
export const stepAppliedLabel = (v: string | null | undefined) => enumLabel(STEP_APPLIED_MAP, v);
export const confirmationStatusLabel = (v: string | null | undefined) => enumLabel(CONFIRMATION_STATUS_MAP, v);
export const paymentDirectionLabel = (v: string | null | undefined) => enumLabel(PAYMENT_DIRECTION_MAP, v);
export const recipientTypeLabel = (v: string | null | undefined) => enumLabel(RECIPIENT_TYPE_MAP, v);
export const payoutItemKindLabel = (v: string | null | undefined) => enumLabel(PAYOUT_ITEM_KIND_MAP, v);
export const collectionModeLabel = (v: string | null | undefined) => enumLabel(COLLECTION_MODE_MAP, v);

/** Plain label records for legacy consumers (value -> label). */
export function labelsOf(map: EnumLabelMap): Record<string, string> {
	return Object.fromEntries(Object.entries(map).map(([key, entry]) => [key, entry.label]));
}
