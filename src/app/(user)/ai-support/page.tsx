import { Suspense } from "react";
import { PhotographerAssistant } from "@/components/user/ai-support/photographer-assistant";

export default function AiSupportPage() {
	return <Suspense fallback={<p>Đang tải trợ lý...</p>}><PhotographerAssistant /></Suspense>;
}
