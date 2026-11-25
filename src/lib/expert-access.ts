export type ExpertAccountAccess = {
	role?: string;
};

export type ExpertAccessState =
	| "loading"
	| "request-error"
	| "logged-out"
	| "wrong-role"
	| "verified";

export function isExpertRole(role?: string) {
	return role === "PHOTOGRAPHY_EXPERT" || role === "EXPERT";
}

export function nonExpertHome(role?: string) {
	switch (role) {
		case "ADMIN":
			return "/admin";
		case "MODERATOR":
			return "/moderation";
		case "FILM_LAB_OWNER":
			return "/lab-owner";
		default:
			return "/dashboard";
	}
}

export function getExpertAccessState({
	account,
	loaded,
	requestError,
}: {
	account: ExpertAccountAccess | null;
	loaded: boolean;
	requestError: string | null;
}): ExpertAccessState {
	if (!loaded) return "loading";
	if (requestError) return "request-error";
	if (!account) return "logged-out";
	if (!isExpertRole(account.role)) return "wrong-role";
	return "verified";
}
