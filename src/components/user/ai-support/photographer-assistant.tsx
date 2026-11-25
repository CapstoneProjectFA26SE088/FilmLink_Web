"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserWorkspace } from "../user-workspace";
import { errorMessage, isPhotographerRole, photographerApi, type ChatMessage, type Citation } from "@/lib/photographer-api";

type DisplayMessage = Omit<ChatMessage, "id"> & { id: number | string; fallback?: boolean };

export function PhotographerAssistant() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { account, accountLoaded } = useUserWorkspace();
	const rawSession = searchParams.get("session");
	const initialSession = rawSession && /^\d+$/.test(rawSession) && Number(rawSession) > 0 ? Number(rawSession) : null;
	const [sessionId, setSessionId] = useState<number | null>(initialSession);
	const [messages, setMessages] = useState<DisplayMessage[]>([]);
	const [prompt, setPrompt] = useState("");
	const [loading, setLoading] = useState(Boolean(initialSession));
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const historyVersion = useRef(0);
	const createdSession = useRef<number | null>(null);
	const sending = useRef(false);

	const loadHistory = useCallback(async (id: number) => {
		const version = ++historyVersion.current;
		setLoading(true);
		setError(null);
		try {
			const history: ChatMessage[] = [];
			for (let page = 0; ; page += 1) {
				const response = await photographerApi.messages(id, page);
				if (version !== historyVersion.current) return;
				history.push(...response.content);
				if (!response.hasNext) break;
			}
			setMessages(history);
			setSessionId(id);
		} catch (cause) {
			if (version === historyVersion.current) {
				setError(errorMessage(cause));
				setMessages([]);
			}
		} finally {
			if (version === historyVersion.current) setLoading(false);
		}
	}, []);
	useEffect(() => {
		if (!accountLoaded || !isPhotographerRole(account?.role)) return;
		if (initialSession && initialSession !== createdSession.current) void loadHistory(initialSession);
		createdSession.current = null;
		return () => { historyVersion.current += 1; };
	}, [account?.role, accountLoaded, initialSession, loadHistory]);

	async function submit(event: FormEvent) {
		event.preventDefault();
		const question = prompt.trim();
		if (question.length < 5 || question.length > 1000 || loading || sending.current) return;
		sending.current = true;
		setPending(true); setError(null); setPrompt("");
		const localId = `local-${Date.now()}`;
		setMessages((current) => [...current, { id: localId, sender: "USER", content: question, citations: [], createdAt: new Date().toISOString() }]);
		try {
			const answer = await photographerApi.ask(question, sessionId || undefined);
			setMessages((current) => [...current, { id: `${localId}-answer`, sender: "ASSISTANT", content: answer.answer, citations: answer.citations, fallback: answer.fallback, createdAt: new Date().toISOString() }]);
			if (answer.sessionId !== sessionId) {
				createdSession.current = answer.sessionId;
				setSessionId(answer.sessionId);
				router.replace(`/ai-support?session=${answer.sessionId}`, { scroll: false });
			}
		} catch (cause) {
			setMessages((current) => current.filter((message) => message.id !== localId));
			setPrompt((current) => current || question);
			setError(errorMessage(cause));
		} finally {
			sending.current = false;
			setPending(false);
		}
	}

	if (!accountLoaded) return <div className="photographer-loading"><LoaderCircle className="photographer-spin" /> Đang tải...</div>;
	if (!isPhotographerRole(account?.role)) return <div className="empty-state"><strong>Khu vực này chỉ dành cho tài khoản Photographer.</strong></div>;
	return <section className="assistant-page"><div className="assistant-orb"><Sparkles /></div><p className="eyebrow">TRỢ LÝ PHIM ẢNH</p><h1>Chuyện phim ảnh,<br />cứ hỏi FilmLink.</h1><p className="assistant-intro">Câu trả lời dựa trên kho kiến thức chuyên gia đã được duyệt.</p>
		<div className="chat-thread" aria-live="polite">{loading ? <div className="photographer-loading"><LoaderCircle className="photographer-spin" /> Đang tải cuộc trò chuyện...</div> : messages.map((message) => <div className={`chat-bubble chat-bubble--${message.sender === "ASSISTANT" ? "ai" : "user"}`} key={message.id}>{message.sender === "ASSISTANT" ? <Sparkles /> : null}<div>{message.content}{message.fallback ? <small className="assistant-fallback">Câu trả lời dự phòng do AI tạm thời không khả dụng.</small> : null}<Citations citations={message.citations} /></div></div>)}{messages.length === 0 && !loading ? <p className="marketplace-demo-note">Hãy bắt đầu một câu hỏi mới. Session sẽ được lưu vào đường dẫn để bạn có thể tải lại.</p> : null}</div>
		{error ? <div className="assistant-error" role="alert">{error}{sessionId ? <Button variant="outline" onClick={() => void loadHistory(sessionId)}>Tải lại</Button> : null}</div> : null}
		<form className="assistant-composer" onSubmit={submit}><Input minLength={5} maxLength={1000} value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ví dụ: Làm sao push Portra 400 một stop?" aria-label="Nhập câu hỏi cho FilmLink AI" /><Button type="submit" size="icon" className="assistant-send px-0" disabled={pending || prompt.trim().length < 5} aria-label="Gửi câu hỏi">{pending ? <LoaderCircle className="photographer-spin" /> : <Send />}</Button></form>
		<p className="assistant-disclaimer">Thông tin mang tính tham khảo; hãy kiểm tra hướng dẫn của nhà sản xuất trước khi xử lý phim.</p>
	</section>;
}

function Citations({ citations }: { citations: Citation[] }) {
	if (!citations.length) return null;
	return <ul className="assistant-citations">{citations.map((citation) => <li key={citation.articleId}>Nguồn: {citation.title}</li>)}</ul>;
}
