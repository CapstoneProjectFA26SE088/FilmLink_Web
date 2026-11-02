export type ExpertArticle = { id: string; title: string; category: string; content: string; status: "Công khai" | "Bản nháp"; kb: "Chưa đề xuất" | "Chờ Moderator duyệt" | "Đã duyệt" | "Từ chối"; kbRejectionReason?: string; author: string };
export type ExpertEvent = { id: string; title: string; date: string; location: string; description: string; capacity: number; registered: number; host: string };
export type ExpertApplicationDemo = { id: string; name: string; email: string; experience: string; portfolio: string; status: "Chờ duyệt" | "Đã xác minh" | "Từ chối"; rejectionReason?: string };

const articleKey = "filmlink-expert-articles-demo-v1";
const eventKey = "filmlink-expert-events-demo-v1";
const applicationKey = "filmlink-expert-application-demo-v1";

export const articleFixtures: ExpertArticle[] = [
	{ id: "art-01", title: "Đọc histogram của một bản scan phim", category: "TUTORIAL", content: "Histogram giúp quan sát vùng sáng, vùng tối và độ tương phản của bản scan. Hãy dùng nó cùng ảnh gốc và ý đồ màu, thay vì xem đây là công thức chỉnh ảnh duy nhất.", status: "Công khai", kb: "Chờ Moderator duyệt", author: "Nguyễn Hoàng Nam" },
	{ id: "art-02", title: "Kodak Gold 200 trong nắng chiều", category: "FILM_REVIEW", content: "Một số ghi chú thực hành về màu sắc và điều kiện phơi sáng khi chụp Kodak Gold 200.", status: "Công khai", kb: "Chưa đề xuất", author: "Nguyễn Hoàng Nam" },
];

export const eventFixtures: ExpertEvent[] = [
	{ id: "evt-01", title: "Photowalk Sài Gòn buổi sớm", date: "2026-11-15T06:30", location: "Bưu điện Thành phố, Quận 1", description: "Cùng đi bộ, chụp ảnh phim và trao đổi cách đo sáng trong ánh sáng sớm.", capacity: 16, registered: 11, host: "Nguyễn Hoàng Nam" },
	{ id: "evt-02", title: "Workshop nhập môn chụp film", date: "2026-11-21T14:00", location: "Mộc Lab, Quận 3", description: "Làm quen với cuộn phim, khẩu độ, tốc độ màn trập và cách gửi film đi tráng.", capacity: 12, registered: 8, host: "Mộc Lab Community" },
];

function readArray<T>(key: string, fallback: T[], valid: (value: unknown) => value is T): T[] {
	try {
		const value: unknown = JSON.parse(sessionStorage.getItem(key) ?? "null");
		return Array.isArray(value) && value.every(valid) ? value : fallback;
	} catch { return fallback; }
}

export const readDemoArticles = () => readArray(articleKey, articleFixtures, (item): item is ExpertArticle => !!item && typeof item === "object" && "title" in item && "status" in item && "kb" in item);
export const readDemoEvents = () => readArray(eventKey, eventFixtures, (item): item is ExpertEvent => !!item && typeof item === "object" && "title" in item && "date" in item && "capacity" in item);
export function saveDemoArticles(items: ExpertArticle[]) { try { sessionStorage.setItem(articleKey, JSON.stringify(items)); } catch { /* Session storage may be unavailable; page state still works. */ } }
export function saveDemoEvents(items: ExpertEvent[]) { try { sessionStorage.setItem(eventKey, JSON.stringify(items)); } catch { /* Session storage may be unavailable; page state still works. */ } }
export function readExpertApplication(): ExpertApplicationDemo | null {
	try {
		const value: unknown = JSON.parse(sessionStorage.getItem(applicationKey) ?? "null");
		if (value && typeof value === "object" && "id" in value && "name" in value && "email" in value && "experience" in value && "portfolio" in value && "status" in value) return value as ExpertApplicationDemo;
	} catch { /* Session storage may be unavailable; fixture remains available. */ }
	return null;
}
export function saveExpertApplication(value: ExpertApplicationDemo) { try { sessionStorage.setItem(applicationKey, JSON.stringify(value)); } catch { /* Session storage may be unavailable; page state still works. */ } }
