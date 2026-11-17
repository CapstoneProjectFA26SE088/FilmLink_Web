import { AdminUsersPage } from "@/components/admin/admin-pages";
import { AdminCreateAccountForm } from "@/components/admin/admin-api-workflows";

export default function Page() {
	return <><AdminUsersPage /><div className="mx-auto max-w-7xl px-6 pb-8"><AdminCreateAccountForm /></div></>;
}

