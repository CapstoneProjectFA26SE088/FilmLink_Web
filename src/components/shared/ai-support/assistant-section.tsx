import { Send, Sparkles } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AssistantSection({
	chat,
	prompt,
	onPrompt,
	onSubmit,
}: {
	chat: { id: string; from: "user" | "ai"; text: string }[];
	prompt: string;
	onPrompt: (value: string) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
	return (
		<section className="assistant-page">
			<div className="assistant-orb">
				<Sparkles aria-hidden="true" />
			</div>
			<p className="eyebrow">TRỢ LÝ PHIM ẢNH</p>
			<h1>
				Chuyện phim ảnh,
				<br />
				cứ hỏi FilmLink.
			</h1>
			<p className="assistant-intro">
				Từ chọn cuộn phim đầu tiên đến tìm nơi tráng phù hợp, mình ở đây để giúp
				bạn.
			</p>
			<div className="chat-thread" aria-live="polite">
				{chat.map((message) => (
					<div
						className={`chat-bubble chat-bubble--${message.from}`}
						key={message.id}
					>
						{message.from === "ai" && <Sparkles aria-hidden="true" />}
						{message.text}
					</div>
				))}
			</div>
			<form className="assistant-composer" onSubmit={onSubmit}>
				<Input
					value={prompt}
					onChange={(event) => onPrompt(event.target.value)}
					placeholder="Ví dụ: Máy ảnh của mình hợp với phim nào?"
					aria-label="Nhập câu hỏi cho FilmLink AI"
				/>
				<Button
					type="submit"
					size="icon"
					className="assistant-send px-0"
					aria-label="Gửi câu hỏi"
				>
					<Send />
				</Button>
			</form>
			<div className="assistant-suggestions">
				<span>Gợi ý câu hỏi</span>
				<button
					type="button"
					onClick={() => onPrompt("Người mới nên chọn phim màu nào?")}
				>
					Người mới nên chọn phim nào?
				</button>
				<button
					type="button"
					onClick={() => onPrompt("Tìm lab tráng phim gần mình")}
				>
					Tìm lab gần mình
				</button>
				<button
					type="button"
					onClick={() => onPrompt("Tráng phim C-41 là gì?")}
				>
					C-41 là gì?
				</button>
			</div>
			<p className="assistant-disclaimer">
				Trợ lý đang ở chế độ trải nghiệm, câu trả lời chỉ mang tính tham khảo.
			</p>
		</section>
	);
}
