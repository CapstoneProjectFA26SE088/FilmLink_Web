"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { InlineMessage, type InlineMessageTone } from "@/components/shared/feedback/inline-message";
import { StatePanel } from "@/components/shared/feedback/state-panel";
import { labOwnerApi, LabOwnerApiError, type CatalogOption, type Machine, type MachineIncident } from "@/lib/lab-owner-api";
import { useLabOwnerWorkspace } from "../workspace";
import { IncidentDialog, type IncidentDraft } from "./incident-dialog";
import { IncidentResultsPanel } from "./incident-results-panel";
import { blankForm, formFromMachine, validateHours, type MachineForm } from "./machine-form";
import { MachineFormDialog } from "./machine-form-dialog";
import { MachinesTable } from "./machines-table";
import { SchedulingSettingsPanel, type SchedulingSettings } from "./scheduling-settings-panel";
import styles from "../lab-owner-pages.module.css";

type Message = { tone: InlineMessageTone; text: string };
const blankIncident = (): IncidentDraft => ({ cause: "MACHINE_FAILURE", description: "", unavailableFrom: "", expectedAt: "" });

export function MachinesPage() {
	const { lab } = useLabOwnerWorkspace();
	const lock = useRef(false);
	const hasLoaded = useRef(false);
	const [machines, setMachines] = useState<Machine[]>([]);
	const [processes, setProcesses] = useState<CatalogOption[]>([]);
	const [formats, setFormats] = useState<CatalogOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");
	const [form, setForm] = useState<MachineForm>(blankForm);
	const [showForm, setShowForm] = useState(false);
	const [busy, setBusy] = useState(false);
	const [message, setMessage] = useState<Message | null>(null);
	const [settings, setSettings] = useState<SchedulingSettings>({ qc: "2", cap: "", commitment: "unselected" });
	const [incidentMachine, setIncidentMachine] = useState<number | null>(null);
	const [draft, setDraft] = useState<IncidentDraft>(blankIncident);
	const [incidents, setIncidents] = useState<Record<number, MachineIncident>>({});

	const fail = (text: string) => setMessage({ tone: "error", text });
	const succeed = (text: string) => setMessage({ tone: "success", text });

	const load = useCallback(async () => {
		try {
			const [machineRows, processRows, formatRows] = await Promise.all([labOwnerApi<Machine[]>("film-labs/me/machines"), labOwnerApi<CatalogOption[]>("film-processes"), labOwnerApi<CatalogOption[]>("film-formats")]);
			setMachines(machineRows);
			setProcesses(processRows);
			setFormats(formatRows);
			setLoadError("");
			hasLoaded.current = true;
		} catch (error) {
			const text = error instanceof Error ? error.message : "Không tải được thiết bị.";
			if (hasLoaded.current) fail(text);
			else setLoadError(text);
		} finally {
			setLoading(false);
		}
	}, []);
	useEffect(() => { void load(); }, [load]);
	useEffect(() => { setSettings((current) => ({ ...current, qc: String(lab?.qcBufferHours ?? 2), cap: lab?.expressDailyCapPercent == null ? "" : String(lab.expressDailyCapPercent) })); }, [lab]);

	function retryLoad() {
		setLoading(true);
		setLoadError("");
		void load();
	}

	async function run(action: () => Promise<void>) {
		if (lock.current) return;
		lock.current = true; setBusy(true);
		try { await action(); } finally { lock.current = false; setBusy(false); }
	}

	async function saveMachine(event: FormEvent) {
		event.preventDefault();
		await run(async () => {
			setMessage(null);
			try {
				validateHours(form.workingHours);
				const capacity = Number(form.capacityPerHour);
				if (!Number.isInteger(capacity) || capacity < 1) throw new Error("Công suất mỗi giờ phải là số nguyên dương.");
				if (form.machineType === "PROCESSOR" && !form.filmProcessIds.length) throw new Error("Máy tráng cần ít nhất một quy trình.");
				if (!form.filmFormatIds.length) throw new Error("Chọn ít nhất một khổ phim.");
				const body = {
					...(form.id ? {} : { machineCode: form.machineCode, machineType: form.machineType }),
					modelName: form.modelName || null,
					capacityPerHour: capacity,
					filmProcessIds: form.machineType === "SCANNER" ? [] : form.filmProcessIds,
					filmFormatIds: form.filmFormatIds,
					workingHours: form.workingHours.map((row) => ({ dayOfWeek: row.dayOfWeek, closed: row.closed, opensAt: row.closed ? null : row.opensAt, closesAt: row.closed ? null : row.closesAt })),
				};
				await labOwnerApi(`film-labs/me/machines${form.id ? `/${form.id}` : ""}`, { method: form.id ? "PUT" : "POST", body: JSON.stringify(body) });
				setShowForm(false);
				setForm(blankForm());
				succeed(form.id ? "Đã cập nhật máy." : "Đã thêm máy.");
				await load();
			} catch (error) {
				fail(error instanceof Error ? error.message : "Không lưu được máy.");
				if (error instanceof LabOwnerApiError && error.status === 409) await load();
			}
		});
	}

	async function saveSettings() {
		const qc = Number(settings.qc);
		const cap = settings.cap === "" ? null : Number(settings.cap);
		if (settings.qc.trim() === "" || !Number.isInteger(qc) || qc < 0 || qc > 48) { fail("Giờ đệm kiểm tra chất lượng phải là số nguyên từ 0 đến 48."); return; }
		if (cap !== null && (!Number.isInteger(cap) || cap < 1 || cap > 100)) { fail("Giới hạn Express phải từ 1 đến 100%, hoặc để trống."); return; }
		if (!["1", "2", "none"].includes(settings.commitment)) { fail("Hãy chọn cam kết thời gian Express (1 ngày, 2 ngày hoặc không cấu hình)."); return; }
		await run(async () => {
			try {
				await labOwnerApi("film-labs/me/scheduling-settings", { method: "PUT", body: JSON.stringify({ qcBufferHours: qc, expressDailyCapPercent: cap, expressCommitmentWorkingDays: settings.commitment === "none" ? null : Number(settings.commitment) }) });
				succeed("Đã lưu tham số lập lịch.");
			} catch (error) { fail(error instanceof Error ? error.message : "Không lưu được tham số."); }
		});
	}

	async function report(event: FormEvent) {
		event.preventDefault();
		if (!incidentMachine) return;
		if (draft.cause === "OTHER" && !draft.description.trim()) { fail("Nguyên nhân khác cần có mô tả."); return; }
		const from = new Date(draft.unavailableFrom);
		const expected = draft.expectedAt ? new Date(draft.expectedAt) : null;
		if (!draft.unavailableFrom || Number.isNaN(from.valueOf()) || (expected && (Number.isNaN(expected.valueOf()) || expected <= from))) { fail("Thời điểm dự kiến hoạt động lại phải sau thời điểm bắt đầu."); return; }
		await run(async () => {
			try {
				const result = await labOwnerApi<MachineIncident>(`film-labs/me/machines/${incidentMachine}/incidents`, { method: "POST", body: JSON.stringify({ cause: draft.cause, description: draft.description || null, unavailableFrom: from.toISOString(), expectedAvailableAt: expected?.toISOString() ?? null }) });
				setIncidents((current) => ({ ...current, [incidentMachine]: result }));
				setIncidentMachine(null);
				setDraft(blankIncident());
				succeed(`Đã ghi nhận sự cố máy ${result.machineCode}; ảnh hưởng ${result.affectedOrderCount} đơn.`);
				await load();
			} catch (error) {
				fail(error instanceof Error ? error.message : "Không báo được sự cố.");
				if (error instanceof LabOwnerApiError && error.status === 409) await load();
			}
		});
	}

	async function resolve(machineId: number) {
		const incident = incidents[machineId];
		if (!incident) return;
		await run(async () => {
			try {
				const result = await labOwnerApi<MachineIncident>(`film-labs/me/machines/${machineId}/incidents/${incident.id}/resolve`, { method: "POST", body: "{}" });
				setIncidents((current) => ({ ...current, [machineId]: result }));
				succeed(`Đã giải quyết sự cố máy ${incident.machineCode}.`);
				await load();
			} catch (error) {
				fail(error instanceof Error ? error.message : "Không giải quyết được sự cố.");
				if (error instanceof LabOwnerApiError && error.status === 409) await load();
			}
		});
	}

	const activeProcesses = processes.filter((item) => item.status === "ACTIVE");
	const activeFormats = formats.filter((item) => item.status === "ACTIVE");
	const incidentList = Object.values(incidents);
	const reportingMachine = machines.find((machine) => machine.id === incidentMachine);
	const dialogError = message?.tone === "error" && (showForm || incidentMachine !== null) ? message.text : undefined;
	const ready = !loading && !loadError;
	const stat = (value: number) => (ready ? value : "—");

	return <div className={styles.page}>
		<header className={styles.heading}>
			<div><p className={styles.eyebrow}>Công suất phòng lab</p><h1>Máy và lập lịch</h1><p>Công suất mỗi ngày được tính từ giờ vận hành của từng máy.</p></div>
			<Button onClick={() => { setForm(blankForm()); setMessage(null); setShowForm(true); }}>Thêm máy</Button>
		</header>
		{message && !dialogError && <InlineMessage tone={message.tone}>{message.text}</InlineMessage>}
		<section className={styles.stats} aria-label="Tóm tắt công suất">
			<div className={styles.stat}><span>Tổng số máy</span><strong>{stat(machines.length)}</strong></div>
			<div className={styles.stat}><span>Đang hoạt động</span><strong>{stat(machines.filter((item) => item.status === "ACTIVE").length)}</strong></div>
			<div className={styles.stat}><span>Dừng hoặc bảo trì</span><strong>{stat(machines.filter((item) => item.status !== "ACTIVE").length)}</strong></div>
			<div className={styles.stat}><span>Công suất mỗi ngày (cuộn)</span><strong>{stat(machines.reduce((sum, item) => sum + item.dailyCapacityRolls, 0))}</strong></div>
		</section>
		<SchedulingSettingsPanel settings={settings} onChange={setSettings} busy={busy} onSave={() => void saveSettings()} />
		<section className={styles.panel} aria-labelledby="machines-title" aria-busy={loading}>
			<div className={styles.panelHeader}><div><h2 id="machines-title">Thiết bị</h2><p>Máy tráng và máy scan đang khai báo cho lab.</p></div></div>
			{loading && <div className={styles.detailBody}><StatePanel variant="loading" rows={4} label="Đang tải danh sách máy…" /></div>}
			{!loading && loadError && <div className={styles.detailBody}><StatePanel variant="error" title="Không tải được danh sách máy" description={loadError} onRetry={retryLoad} /></div>}
			{ready && machines.length === 0 && <div className={styles.detailBody}><StatePanel variant="empty" title="Chưa có máy nào" description="Thêm máy tráng và máy scan để hệ thống xếp lịch cho đơn." action={<Button onClick={() => { setForm(blankForm()); setMessage(null); setShowForm(true); }}>Thêm máy</Button>} /></div>}
			{ready && machines.length > 0 && <>
				<MachinesTable machines={machines} processes={processes} formats={formats} incidents={incidents} busy={busy} onEdit={(machine) => { setForm(formFromMachine(machine)); setMessage(null); setShowForm(true); }} onReport={(machineId) => { setMessage(null); setIncidentMachine(machineId); }} onResolve={(machineId) => void resolve(machineId)} />
				<div className={styles.detailBody}><InlineMessage tone="info">Nút giải quyết chỉ xuất hiện với sự cố bạn vừa báo trong phiên làm việc này.</InlineMessage></div>
			</>}
		</section>
		{incidentList.length > 0 && <IncidentResultsPanel incidents={incidentList} />}
		<MachineFormDialog open={showForm} onOpenChange={setShowForm} form={form} onChange={setForm} processes={activeProcesses} formats={activeFormats} busy={busy} error={showForm ? dialogError : undefined} onSubmit={(event) => void saveMachine(event)} />
		<IncidentDialog open={incidentMachine !== null} onOpenChange={(open) => { if (!open) setIncidentMachine(null); }} machineCode={reportingMachine?.machineCode ?? ""} draft={draft} onChange={setDraft} busy={busy} error={incidentMachine !== null ? dialogError : undefined} onSubmit={(event) => void report(event)} />
	</div>;
}
