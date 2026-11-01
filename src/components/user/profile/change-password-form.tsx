"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type PasswordFields = {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
};

const EMPTY_FIELDS: PasswordFields = {
	oldPassword: "",
	newPassword: "",
	confirmPassword: "",
};

export function ChangePasswordForm() {
	const router = useRouter();
	const [fields, setFields] = useState(EMPTY_FIELDS);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setSuccess(false);

		if (fields.newPassword !== fields.confirmPassword) {
			setError("Mật khẩu mới và phần xác nhận chưa khớp.");
			return;
		}
		if (fields.newPassword === fields.oldPassword) {
			setError("Mật khẩu mới cần khác mật khẩu hiện tại.");
			return;
		}
		if (!/\p{L}/u.test(fields.newPassword) || !/\d/.test(fields.newPassword)) {
			setError("Mật khẩu mới cần có ít nhất một chữ cái và một chữ số.");
			return;
		}

		setPending(true);
		try {
			const response = await fetch("/api/backend/accounts/me/password", {
				method: "PUT",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					oldPassword: fields.oldPassword,
					newPassword: fields.newPassword,
				}),
				cache: "no-store",
			});

			if (response.status === 401) {
				router.replace("/login");
				return;
			}

			if (!response.ok) {
				const result: unknown = await response.json().catch(() => null);
				const message = result && typeof result === "object" && "message" in result
					&& typeof result.message === "string"
					? result.message
					: "Không thể đổi mật khẩu. Vui lòng kiểm tra lại thông tin.";
				setError(message);
				return;
			}

			setFields(EMPTY_FIELDS);
			setSuccess(true);
			window.setTimeout(() => router.replace("/login"), 1400);
		} catch {
			setError("Không kết nối được máy chủ. Vui lòng thử lại.");
		} finally {
			setPending(false);
		}
	}

	return (
		<form className="account-password-form" onSubmit={handleSubmit}>
			<FieldSet>
				<FieldLegend>Đổi mật khẩu</FieldLegend>
				<p className="account-password-description">
					Mật khẩu mới từ 8–72 ký tự, có ít nhất một chữ cái và một chữ số.
				</p>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="old-password">Mật khẩu hiện tại</FieldLabel>
						<Input
							id="old-password"
							type="password"
							autoComplete="current-password"
							maxLength={72}
							required
							value={fields.oldPassword}
							onChange={(event) => setFields((current) => ({ ...current, oldPassword: event.target.value }))}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="new-password">Mật khẩu mới</FieldLabel>
						<Input
							id="new-password"
							type="password"
							autoComplete="new-password"
							minLength={8}
							maxLength={72}
							required
							value={fields.newPassword}
							onChange={(event) => setFields((current) => ({ ...current, newPassword: event.target.value }))}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="confirm-password">Xác nhận mật khẩu mới</FieldLabel>
						<Input
							id="confirm-password"
							type="password"
							autoComplete="new-password"
							minLength={8}
							maxLength={72}
							required
							value={fields.confirmPassword}
							onChange={(event) => setFields((current) => ({ ...current, confirmPassword: event.target.value }))}
						/>
					</Field>
				</FieldGroup>
			</FieldSet>
			{error && <p className="account-password-message account-password-message--error" role="alert">{error}</p>}
			{success && <p className="account-password-message account-password-message--success" role="status">Mật khẩu đã được đổi. Bạn sẽ được chuyển đến trang đăng nhập để đăng nhập lại.</p>}
			<Button type="submit" disabled={pending}>
				{pending ? "Đang cập nhật…" : "Cập nhật mật khẩu"}
			</Button>
		</form>
	);
}
