import type { Metadata } from "next"
import { RegisterForm } from "./_components/register-form"

export const metadata: Metadata = {
  title: "Create Photographer Account | FilmLink",
  description: "Create a FilmLink Photographer account and verify your email address.",
}

export default function RegisterPage() {
  return <RegisterForm />
}
