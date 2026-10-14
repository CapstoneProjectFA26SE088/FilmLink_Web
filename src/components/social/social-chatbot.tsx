import { Send } from "lucide-react"

export function SocialChatbot() {
  return (
    <div
      aria-label="Vị trí nút chatbot"
      className="fixed right-5 bottom-[84px] z-20 inline-flex h-12 items-center gap-3 rounded-full border border-border bg-background px-5 text-[15px] font-semibold leading-[21px] text-foreground shadow-sm lg:bottom-6"
      role="img"
    >
      <Send aria-hidden="true" />
      <span>Chatbot</span>
    </div>
  )
}
