import type { Metadata } from "next"
import { LoginForm } from "./_components/login-form"

export const metadata: Metadata = {
  title: "Login | FilmLink",
  description: "Sign in to your FilmLink account.",
}

export default function LoginPage() {
  return <LoginForm />
}
