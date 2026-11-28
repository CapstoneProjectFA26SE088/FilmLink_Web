"use client";

import { useCallback, useEffect, useState } from "react";
import { labOwnerApi, type CatalogOption } from "@/lib/lab-owner-api";

/**
 * Loads the public film process/format catalogs once so screens can show names
 * instead of numeric ids. Failures are silent: callers fall back to "Mã #id".
 */
export function useCatalogNames() {
	const [processes, setProcesses] = useState<CatalogOption[]>([]);
	const [formats, setFormats] = useState<CatalogOption[]>([]);

	useEffect(() => {
		let active = true;
		void Promise.all([
			labOwnerApi<CatalogOption[]>("film-processes").catch(() => [] as CatalogOption[]),
			labOwnerApi<CatalogOption[]>("film-formats").catch(() => [] as CatalogOption[]),
		]).then(([processRows, formatRows]) => {
			if (!active) return;
			setProcesses(processRows);
			setFormats(formatRows);
		});
		return () => { active = false; };
	}, []);

	const processName = useCallback((id: number | null | undefined) => processes.find((item) => item.id === id)?.displayName ?? `Mã #${id ?? "—"}`, [processes]);
	const formatName = useCallback((id: number | null | undefined) => formats.find((item) => item.id === id)?.displayName ?? `Mã #${id ?? "—"}`, [formats]);
	return { processName, formatName };
}
