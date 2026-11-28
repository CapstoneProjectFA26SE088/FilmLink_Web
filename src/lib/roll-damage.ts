export function validDamageNote(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0 && value.length <= 500;
}

export function buildRollDamageBody(note: string, photos: FormDataEntryValue[]): FormData {
	const damageNote = note.trim();
	if (!validDamageNote(damageNote)) {
		throw new Error("Mô tả tình trạng hỏng trong 1 đến 500 ký tự.");
	}
	if (!photos.length || photos.length > 10 || photos.some((file) =>
		!(file instanceof File) || !["image/jpeg", "image/png"].includes(file.type) ||
		file.size === 0 || file.size > 10 * 1024 * 1024
	)) {
		throw new Error("Chọn từ 1 đến 10 ảnh JPG hoặc PNG. Mỗi ảnh tối đa 10 MB.");
	}
	const body = new FormData();
	body.append("data", new Blob([JSON.stringify({ damageNote })], { type: "application/json" }), "data.json");
	for (const photo of photos) body.append("photos", photo);
	return body;
}
