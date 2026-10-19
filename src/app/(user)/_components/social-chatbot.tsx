"use client"

import { Bot, MessageSquare, Send, Sparkles, User, X } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MOCK_CHATBOT_PROMPTS,
  MOCK_INITIAL_CHAT_MESSAGES,
  type ChatMessage,
} from "../mock_data"

export function SocialChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_INITIAL_CHAT_MESSAGES)
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim()
    if (!text) return

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Vừa xong",
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInputValue("")

    // Generate mock AI assistant reply
    setTimeout(() => {
      let botReply = "Cảm ơn bạn đã đặt câu hỏi. Hệ thống FilmLink đang kết nối trực tiếp với dữ liệu các film lab để phản hồi chi tiết nhất cho bạn."
      if (text.toLowerCase().includes("ecn-2") || text.toLowerCase().includes("hà nội")) {
        botReply = "Tại Hà Nội, bạn có thể gửi tráng ECN-2 tại Croplab Hà Nội (thời gian 1-2 ngày, tẩy sạch than remjet bằng máy tự động). Tại TP.HCM, LLab có hỗ trợ tráng ECN-2 lấy nhanh trong 24h-48h."
      } else if (text.toLowerCase().includes("push") || text.toLowerCase().includes("pull")) {
        botReply = "Kỹ thuật Push film thường áp dụng khi chụp thiếu sáng hoặc muốn tăng độ tương phản hạt film. Ví dụ chụp cuộn ISO 400 ở ISO 800 (Push +1 stop). Lưu ý bạn cần ghi chú rõ 'Push +1' trên vỏ cuộn film để lab ngâm thuốc lâu hơn tương ứng nhé!"
      } else if (text.toLowerCase().includes("noritsu") || text.toLowerCase().includes("frontier")) {
        botReply = "Máy scan Noritsu HS-1800 cho độ nét hạt cực cao, dải dynamic range rộng và màu sắc trung thực chuẩn phong cảnh. Trong khi máy Fuji Frontier SP-3000 nổi tiếng với tone da ấm, ngả hồng pastel rất nịnh mắt khi chụp chân dung."
      } else if (text.toLowerCase().includes("gửi film") || text.toLowerCase().includes("bưu điện") || text.toLowerCase().includes("mail-in")) {
        botReply = "Để gửi film qua bưu điện an toàn: Bạn nên bọc cuộn film trong hộp nhựa bảo vệ hoặc quấn xốp bóng khí, ghi kèm Họ tên + Số điện thoại + Email và dán bên ngoài bưu kiện. Khi lab nhận được sẽ cập nhật trạng thái đơn ngay trên FilmLink."
      }

      const aiMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botReply,
        timestamp: "Vừa xong",
      }
      setMessages((prev) => [...prev, aiMsg])
    }, 600)
  }

  return (
    <>
      <button
        aria-label="Mở FilmLink AI Chatbot"
        className="fixed right-5 bottom-[84px] z-30 inline-flex h-12 items-center gap-2.5 rounded-full border border-border bg-background px-5 text-[15px] font-semibold text-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer lg:bottom-6 ring-1 ring-foreground/10 hover:ring-[rgb(74,93,249)]/50"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <Sparkles className="size-4 text-[rgb(74,93,249)]" />
        <span>FilmLink AI</span>
      </button>

      {isOpen && (
        <div className="fixed right-4 bottom-24 z-40 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex h-14 items-center justify-between border-b px-4 bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-[rgb(74,93,249)] text-white">
                <Bot className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground">FilmLink Assistant</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">● Trực tuyến</span>
              </div>
            </div>
            <Button
              aria-label="Đóng chat"
              className="size-8"
              onClick={() => setIsOpen(false)}
              size="icon"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div
                className={`flex gap-2 text-xs ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
                key={msg.id}
              >
                {msg.sender === "bot" && (
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[rgb(74,93,249)]/10 text-[rgb(74,93,249)] mt-0.5">
                    <Bot className="size-3" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[rgb(74,93,249)] text-white rounded-tr-sm"
                      : "bg-muted/60 text-foreground rounded-tl-sm border border-border/40"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[10px] block pt-1 ${msg.sender === "user" ? "text-white/70" : "text-muted-foreground"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Gợi ý câu hỏi phổ biến:
                </span>
                <div className="flex flex-col gap-1.5">
                  {MOCK_CHATBOT_PROMPTS.map((prompt) => (
                    <button
                      className="rounded-xl border border-border/70 bg-card p-2 text-left text-xs text-foreground transition-colors hover:bg-muted/50 cursor-pointer"
                      key={prompt.id}
                      onClick={() => handleSendMessage(prompt.prompt)}
                      type="button"
                    >
                      <span className="font-semibold block text-[rgb(74,93,249)]">{prompt.title}</span>
                      <span className="text-[11px] text-muted-foreground line-clamp-1">{prompt.prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t p-2.5 bg-muted/20"
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
          >
            <input
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi về lab, film, kỹ thuật tráng..."
              value={inputValue}
            />
            <Button
              className="size-8 rounded-xl bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)]/90"
              disabled={!inputValue.trim()}
              size="icon"
              type="submit"
            >
              <Send className="size-3.5" />
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
