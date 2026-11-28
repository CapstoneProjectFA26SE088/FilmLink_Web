export function scheduleConfirmationBody(proposed: string | null, override: string): { promisedReturnAt?: string } | null {
	if (!override) return {};
	const earliest = Date.parse(proposed ?? "");
	const selected = Date.parse(override);
	if (!Number.isFinite(earliest) || !Number.isFinite(selected) || selected < earliest) return null;
	return { promisedReturnAt: new Date(selected).toISOString() };
}
