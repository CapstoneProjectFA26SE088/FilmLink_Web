"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

type ApiError = { message?: string }

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [awaitingOtp, setAwaitingOtp] = useState(false)
  const [email, setEmail] = useState("")
  const [pending, setPending] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setNotice("")

    const form = new FormData(event.currentTarget)
    const nextEmail = String(form.get("email") || "").trim()
    const password = String(form.get("password") || "")
    const confirmPassword = String(form.get("confirmPassword") || "")
    const fullName = String(form.get("fullName") || "").trim()

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.")
      return
    }
    if (password.length < 8 || password.length > 72 || !/\p{L}/u.test(password) || !/\d/.test(password)) {
      setError("Mật khẩu cần từ 8 đến 72 ký tự, có ít nhất một chữ cái và một chữ số.")
      return
    }
    if (!termsAccepted) {
      setError("Bạn cần đồng ý với điều khoản sử dụng để đăng ký.")
      return
    }

    setPending(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: nextEmail, password, fullName, termsAccepted: true }),
      })
      const result = (await response.json().catch(() => ({}))) as ApiError

      if (!response.ok) {
        setError(result.message || "Không thể tạo tài khoản. Vui lòng thử lại.")
        return
      }

      setEmail(nextEmail)
      setAwaitingOtp(true)
      setNotice("Tài khoản đã được tạo. Hãy nhập mã 6 chữ số gửi đến email của bạn.")
    } catch {
      setError("Không kết nối được máy chủ. Vui lòng thử lại sau.")
    } finally {
      setPending(false)
    }
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError("")
    setNotice("")

    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, otp: form.get("otp") }),
      })
      const result = (await response.json().catch(() => ({}))) as ApiError

      if (!response.ok) {
        setError(result.message || "Mã xác thực không hợp lệ. Vui lòng thử lại.")
        return
      }

      router.replace("/dashboard")
      router.refresh()
    } catch {
      setError("Không kết nối được máy chủ. Vui lòng thử lại sau.")
    } finally {
      setPending(false)
    }
  }

  async function handleResend() {
    setResending(true)
    setError("")
    setNotice("")
    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, purpose: "EMAIL_VERIFICATION" }),
      })
      const result = (await response.json().catch(() => ({}))) as ApiError
      if (!response.ok) {
        setError(result.message || "Chưa thể gửi lại mã. Vui lòng thử sau.")
        return
      }
      setNotice("Đã yêu cầu gửi lại mã xác thực. Hãy kiểm tra email của bạn.")
    } catch {
      setError("Không kết nối được máy chủ. Vui lòng thử lại sau.")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{awaitingOtp ? "Verify your email" : "Create an account"}</CardTitle>
          <CardDescription>
            {awaitingOtp
              ? `Enter the verification code sent to ${email}`
              : "Enter your information below to create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {awaitingOtp ? (
            <form onSubmit={handleVerify}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="otp">Email verification code</FieldLabel>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    placeholder="123456"
                    required
                  />
                  <FieldDescription>The code contains 6 digits.</FieldDescription>
                </Field>
                {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
                {notice ? <p role="status" className="text-sm text-muted-foreground">{notice}</p> : null}
                <Field>
                  <Button type="submit" disabled={pending}>
                    {pending ? "Verifying…" : "Verify email"}
                  </Button>
                  <Button type="button" variant="outline" disabled={resending} onClick={handleResend}>
                    {resending ? "Sending…" : "Resend code"}
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account? <Link href="/login">Sign in</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
                  <Input
                    id="full-name"
                    name="fullName"
                    type="text"
                    placeholder="Nguyễn Văn An"
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    autoComplete="email"
                    maxLength={255}
                    required
                  />
                  <FieldDescription>
                    We&apos;ll use this address to verify your account.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    required
                  />
                  <FieldDescription>
                    Use 8–72 characters with at least one letter and one number.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    required
                  />
                </Field>
                <Field orientation="horizontal">
                  <Checkbox
                    id="terms-accepted"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="terms-accepted">
                      I agree to the terms of service.
                    </FieldLabel>
                  </FieldContent>
                </Field>
                {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
                {notice ? <p role="status" className="text-sm text-muted-foreground">{notice}</p> : null}
                <Field>
                  <Button type="submit" disabled={pending}>
                    {pending ? "Creating account…" : "Create Account"}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    disabled
                    aria-label="Google sign-up is not available yet"
                  >
                    Sign up with Google
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account? <Link href="/login">Sign in</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
