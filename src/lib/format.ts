const EMPTY_VALUE = "—";

const moneyFormatter = new Intl.NumberFormat("vi-VN");
const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
	dateStyle: "short",
	timeStyle: "short",
});
const dateOnlyFormatter = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" });

function toValidDate(value: string | number | Date | null | undefined) {
	if (value === null || value === undefined || value === "") return null;
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

/** Example: 80000 -> "80.000 ₫". Null, undefined or NaN -> "—". */
export function formatMoney(value: number | null | undefined) {
	if (value === null || value === undefined || Number.isNaN(value)) return EMPTY_VALUE;
	return `${moneyFormatter.format(value)} ₫`;
}

/** Date and time, vi-VN short style. Invalid or empty -> "—". */
export function formatDate(value: string | number | Date | null | undefined) {
	const date = toValidDate(value);
	return date ? dateTimeFormatter.format(date) : EMPTY_VALUE;
}

/** Date without time, vi-VN short style. Invalid or empty -> "—". */
export function formatDateOnly(value: string | number | Date | null | undefined) {
	const date = toValidDate(value);
	return date ? dateOnlyFormatter.format(date) : EMPTY_VALUE;
}
