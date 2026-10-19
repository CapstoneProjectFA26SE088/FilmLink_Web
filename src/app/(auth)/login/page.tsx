import type { Metadata } from "next"
import { LoginForm } from "./_components/login-form"

export const metadata: Metadata = {
  title: "Login | FilmFlow",
  description: "Sign in to your FilmFlow account to manage analog rolls, scans, and labs.",
}

export default function LoginPage() {
  return <LoginForm />
}
