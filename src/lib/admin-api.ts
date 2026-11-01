export class AdminApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "AdminApiError";
		this.status = status;
	}
}

export async function adminApi<T>(path: string, init: RequestInit = {}): Promise<T> {
	const headers = new Headers(init.headers);
	headers.set("accept", "application/json");
	if (init.body !== undefined && !headers.has("content-type")) {
		headers.set("content-type", "application/json");
	}

	const response = await fetch(`/api/backend/${path.replace(/^\/+/, "")}`, {
		...init,
		headers,
		cache: "no-store",
	});
	if (!response.ok) {
		const body = await response.json().catch(() => ({})) as { message?: string; detail?: string };
		throw new AdminApiError(body.message || body.detail || "Yêu cầu chưa thể thực hiện.", response.status);
	}
	if (response.status === 204) return undefined as T;
	return await response.json() as T;
}
