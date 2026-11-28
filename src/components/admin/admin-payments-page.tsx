"use client";

import { useEffect, useState, type FormEvent } from "react";
import { FinanceReport } from "@/components/finance-report";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import { adminApi } from "@/lib/admin-api";
import styles from "@/components/finance/finance.module.css";

type LabOption = { id: number; labName: string };

function AdminLabDebts() {
	const [labs, setLabs] = useState<LabOption[]>([]);
	const [labsError, setLabsError] = useState("");
	const [input, setInput] = useState("");
	const [labId, setLabId] = useState<number | null>(null);
	const [inputError, setInputError] = useState("");

	useEffect(() => {
		const request = new AbortController();
		adminApi<{ content: LabOption[] }>("public/film-labs?size=50", { signal: request.signal })
			.then((page) => {
				if (!request.signal.aborted) setLabs(page.content);
			})
			.catch((cause: unknown) => {
				if (!request.signal.aborted) setLabsError(cause instanceof Error ? cause.message : "Không tải được danh sách lab.");
			});
		return () => request.abort();
	}, []);

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		// Accept either a plain id or a datalist entry such as "12 – Tên lab".
		const id = Number.parseInt(input.trim(), 10);
		if (!Number.isInteger(id) || id <= 0) {
			setInputError("Nhập mã Film Lab hợp lệ (số nguyên dương).");
			return;
		}
		setInputError("");
		setLabId(id);
	}

	return (
		<div className="grid gap-4 pt-4">
			<form className="flex flex-wrap items-end gap-2" onSubmit={submit}>
				<label className="grid gap-1 text-sm">
					Mã Film Lab
					<Input
						list="admin-debt-labs"
						inputMode="numeric"
						className="w-64"
						placeholder="Nhập ID hoặc chọn lab"
						value={input}
						onChange={(event) => setInput(event.target.value)}
					/>
					<datalist id="admin-debt-labs">
						{labs.map((lab) => <option key={lab.id} value={String(lab.id)}>{lab.labName}</option>)}
					</datalist>
				</label>
				<Button type="submit" variant="outline">Xem công nợ</Button>
				<p className="m-0 basis-full text-xs text-muted-foreground">
					Danh sách gợi ý lấy từ các lab công khai (tối đa 50). Bạn vẫn có thể nhập ID bất kỳ.
				</p>
			</form>
			{inputError ? <InlineMessage tone="error">{inputError}</InlineMessage> : null}
			{labsError ? <InlineMessage tone="warning">Không tải được gợi ý lab: {labsError}. Hãy nhập ID thủ công.</InlineMessage> : null}
			{labId !== null
				? <FinanceReport key={labId} view="admin-debts" labId={labId} embedded />
				: <InlineMessage tone="info">Chọn hoặc nhập mã Film Lab để xem các kỳ công nợ và xác nhận thanh toán.</InlineMessage>}
		</div>
	);
}

export function AdminPaymentsPage() {
	return (
		<div className={styles.page}>
			<header className={styles.heading}>
				<div>
					<h1>Thanh toán & công nợ</h1>
					<p>Chi trả cho Film Lab, người bán và công nợ hoa hồng của từng lab.</p>
				</div>
			</header>
			<Tabs defaultValue="payouts">
				<TabsList aria-label="Thanh toán và công nợ">
					<TabsTrigger value="payouts">Chi trả</TabsTrigger>
					<TabsTrigger value="debts">Công nợ Film Lab</TabsTrigger>
				</TabsList>
				<TabsContent value="payouts"><FinanceReport view="admin-payouts" embedded /></TabsContent>
				<TabsContent value="debts"><AdminLabDebts /></TabsContent>
			</Tabs>
		</div>
	);
}
