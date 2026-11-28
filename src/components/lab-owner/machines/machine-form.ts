import type { Machine, MachineHour } from "@/lib/lab-owner-api";

export const weekdays = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ nhật"];
export const incidentCauses = ["MACHINE_FAILURE", "CHEMICALS_RUN_OUT", "CHEMICALS_EXPIRED", "POWER_OUTAGE", "OTHER"];

export type MachineForm = {
	id?: number;
	machineCode: string;
	modelName: string;
	machineType: "PROCESSOR" | "SCANNER";
	capacityPerHour: string;
	filmProcessIds: number[];
	filmFormatIds: number[];
	workingHours: MachineHour[];
};

export const defaultHours = (): MachineHour[] => weekdays.map((_, index) => ({ dayOfWeek: index + 1, closed: index > 4, opensAt: index > 4 ? null : "09:00", closesAt: index > 4 ? null : "18:00" }));
export const blankForm = (): MachineForm => ({ machineCode: "", modelName: "", machineType: "PROCESSOR", capacityPerHour: "1", filmProcessIds: [], filmFormatIds: [], workingHours: defaultHours() });

export function completeHours(rows: MachineHour[]) {
	const byDay = new Map(rows.map((row) => [row.dayOfWeek, row]));
	return defaultHours().map((fallback) => ({ ...fallback, ...(byDay.get(fallback.dayOfWeek) ?? { closed: true, opensAt: null, closesAt: null }) }));
}

export function formFromMachine(machine: Machine): MachineForm {
	return { id: machine.id, machineCode: machine.machineCode, modelName: machine.modelName ?? "", machineType: machine.machineType, capacityPerHour: String(machine.capacityPerHour), filmProcessIds: [...machine.filmProcessIds], filmFormatIds: [...machine.filmFormatIds], workingHours: completeHours(machine.workingHours) };
}

export function validateHours(hours: MachineHour[]) {
	if (hours.length !== 7 || new Set(hours.map((row) => row.dayOfWeek)).size !== 7) throw new Error("Cần cấu hình đủ 7 ngày trong tuần.");
	hours.forEach((row) => {
		if (!row.closed && (!row.opensAt || !row.closesAt || row.opensAt >= row.closesAt)) throw new Error(`${weekdays[row.dayOfWeek - 1]} cần giờ mở trước giờ đóng.`);
	});
}
