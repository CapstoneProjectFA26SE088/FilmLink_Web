import type { Metadata } from "next";
import Script from "next/script";
import "./fonts/geist.css";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "FilmLink",
  description: "Cộng đồng đặt và rửa phim với sự hỗ trợ của AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
