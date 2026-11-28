"use client";

import { useEffect, useRef, useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import { Upload } from "lucide-react";

import { cn } from "@/lib/utils";

type FilePickerProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
	type?: "file";
	buttonLabel?: string;
	emptyLabel?: string;
};

/**
 * Native file input with Vietnamese button text and a list of selected files.
 * The real input stays in the DOM (transparent, on top), so FormData, `name`,
 * `required`, `onChange` and keyboard focus behave exactly like a plain input.
 */
export function FilePicker({
	className,
	buttonLabel = "Chọn tệp",
	emptyLabel = "Chưa chọn tệp nào",
	onChange,
	disabled,
	...inputProps
}: FilePickerProps) {
	const [names, setNames] = useState<string[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const form = inputRef.current?.form;
		if (!form) return;
		const clear = () => setNames([]);
		form.addEventListener("reset", clear);
		return () => form.removeEventListener("reset", clear);
	}, []);

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		setNames(Array.from(event.currentTarget.files ?? [], (file) => file.name));
		onChange?.(event);
	}

	return (
		<span
			className={cn(
				"relative flex min-h-11 w-full flex-wrap items-center gap-3 rounded-[var(--radius-control)] border border-dashed border-border bg-[var(--surface-muted)] px-3 py-2 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--brand)]",
				disabled && "opacity-60",
				className,
			)}
		>
			<span
				aria-hidden="true"
				className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-control)] bg-[var(--brand)] px-3 text-sm font-medium text-white"
			>
				<Upload className="size-4" />
				{buttonLabel}
			</span>
			<span className="min-w-0 flex-1 text-sm text-muted-foreground [overflow-wrap:anywhere]" aria-live="polite">
				{names.length ? `Đã chọn ${names.length} tệp: ${names.join(", ")}` : emptyLabel}
			</span>
			<input
				{...inputProps}
				ref={inputRef}
				type="file"
				disabled={disabled}
				onChange={handleChange}
				className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
			/>
		</span>
	);
}
