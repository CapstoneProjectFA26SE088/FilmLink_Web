import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ToastProvider } from "@/components/providers/toast-provider"
import "./globals.css"
import Header from "@/components/Header"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "FilmLink | From Film Roll to Digital Memory",
  description:
    "The all-in-one platform connecting film photographers, labs, and enthusiasts worldwide. Powered by AI.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 antialiased selection:bg-rose-100 selection:text-rose-900">
        <Header />
        <main className="flex-1">{children}</main>
        <ToastProvider />
      </body>
    </html>
  )
}
