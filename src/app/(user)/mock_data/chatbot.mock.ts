export interface ChatbotPrompt {
  id: string
  title: string
  prompt: string
  category: "lab" | "film" | "technique" | "order"
}

export interface ChatMessage {
  id: string
  sender: "user" | "bot"
  text: string
  timestamp: string
  suggestedActions?: string[]
}

export const MOCK_CHATBOT_PROMPTS: ChatbotPrompt[] = [
  {
    id: "p-1",
    title: "Lab tráng ECN-2 lấy liền?",
    prompt: "Lab nào tại Hà Nội hoặc Sài Gòn có dịch vụ tráng ECN-2 điện ảnh uy tín nhất?",
    category: "lab",
  },
  {
    id: "p-2",
    title: "Khi nào cần Push/Pull film?",
    prompt: "Kỹ thuật push film là gì và khi nào nên push +1 hay +2 stop?",
    category: "technique",
  },
  {
    id: "p-3",
    title: "Khác biệt Noritsu và Frontier?",
    prompt: "Nên chọn scan máy Noritsu HS-1800 hay Fuji Frontier SP-3000 cho ảnh chân dung?",
    category: "film",
  },
  {
    id: "p-4",
    title: "Quy trình gửi film qua bưu điện?",
    prompt: "Làm thế nào để gửi film an toàn (mail-in) cho lab mà không bị lộ sáng hay va đập?",
    category: "order",
  },
]

export const MOCK_INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-welcome",
    sender: "bot",
    text: "Xin chào! Mình là FilmLink AI Assistant 🎞️. Mình có thể giúp bạn tìm film lab phù hợp, giải đáp thắc mắc về các quy trình tráng (C-41, B&W, ECN-2, E-6) hoặc hướng dẫn gửi đơn.",
    timestamp: "Just now",
    suggestedActions: [
      "Tìm Lab gần tôi",
      "Bảng giá tráng film",
      "Kỹ thuật push film",
    ],
  },
]
