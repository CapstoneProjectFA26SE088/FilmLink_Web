import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth"

export const metadata: Metadata = {
  title: "Create Account | FilmFlow",
  description: "Create your FilmFlow account as a photographer or film lab owner.",
}

export default function RegisterPage() {
  return <RegisterForm />
}
