import type { Metadata } from "next"
import { LoginForm } from "@/components/auth"

export const metadata: Metadata = {
  title: "Login | FilmFlow",
  description: "Sign in to your FilmFlow account to manage analog rolls, scans, and labs.",
}

export default function LoginPage() {
  return <LoginForm />
}
