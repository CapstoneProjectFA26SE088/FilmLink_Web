"use client"

import { useHydrated } from "@/hooks/use-hydrated"
import Link from "next/link"
import { useState, type FormEvent } from "react"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type Step = "email" | "otp" | "password" | "done"
type ApiError = { message?: string; resetToken?: string }

async function postJson(path: string, body: object) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = (await response.json().catch(() => ({}))) as ApiError
  if (!response.ok) throw new Error(data.message || "Yêu cầu không thành công. Vui lòng thử lại.")
  return data
}

export function ForgotPasswordForm() {
  const hydrated = useHydrated()
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  async function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("")
    try {
      await postJson("/api/auth/forgot-password", { email })
      setStep("otp")
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Có lỗi xảy ra.") }
    finally { setPending(false) }
  }

  async function submitOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("")
    const otp = String(new FormData(event.currentTarget).get("otp") || "")
    try {
      const data = await postJson("/api/auth/verify-password-reset-otp", { email, otp })
      if (!data.resetToken) throw new Error("Không nhận được mã đặt lại mật khẩu.")
      setResetToken(data.resetToken); setStep("password")
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Có lỗi xảy ra.") }
    finally { setPending(false) }
  }

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("")
    const form = new FormData(event.currentTarget)
    const password = String(form.get("password") || "")
    const confirmation = String(form.get("confirmation") || "")
    if (password !== confirmation) { setError("Mật khẩu xác nhận chưa khớp."); setPending(false); return }
    if (!/(?=.*[A-Za-z])(?=.*\d).{8,72}/.test(password)) { setError("Mật khẩu cần 8–72 ký tự, gồm chữ và số."); setPending(false); return }
    try {
      await postJson("/api/auth/reset-password", { resetToken, newPassword: password })
      setResetToken(""); setStep("done")
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Có lỗi xảy ra.") }
    finally { setPending(false) }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{step === "done" ? "Đã đổi mật khẩu" : "Khôi phục mật khẩu"}</CardTitle>
        <CardDescription>
          {step === "email" && "Nhập email tài khoản FilmLink của bạn."}
          {step === "otp" && `Nhập mã OTP 6 số đã gửi tới ${email}.`}
          {step === "password" && "Tạo mật khẩu mới để hoàn tất."}
          {step === "done" && "Bạn có thể đăng nhập bằng mật khẩu mới."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" && <form method="post" onSubmit={submitEmail}><FieldGroup><Field><FieldLabel htmlFor="email">Email</FieldLabel><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></Field>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={!hydrated || pending}>{pending ? "Đang gửi..." : "Gửi mã OTP"}</Button><FieldDescription>Vì lý do bảo mật, hệ thống luôn hiển thị cùng một kết quả dù email có tồn tại hay không.</FieldDescription></FieldGroup></form>}
        {step === "otp" && <form method="post" onSubmit={submitOtp}><FieldGroup><Field><FieldLabel htmlFor="otp">Mã OTP</FieldLabel><Input id="otp" name="otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="000000" required /></Field>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={!hydrated || pending}>{pending ? "Đang xác minh..." : "Xác minh OTP"}</Button><Button type="button" variant="outline" onClick={() => { setStep("email"); setError("") }}>Đổi email</Button></FieldGroup></form>}
        {step === "password" && <form method="post" onSubmit={submitPassword}><FieldGroup><Field><FieldLabel htmlFor="password">Mật khẩu mới</FieldLabel><Input id="password" name="password" type="password" minLength={8} maxLength={72} autoComplete="new-password" required /></Field><Field><FieldLabel htmlFor="confirmation">Xác nhận mật khẩu</FieldLabel><Input id="confirmation" name="confirmation" type="password" minLength={8} maxLength={72} autoComplete="new-password" required /></Field>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={!hydrated || pending}>{pending ? "Đang cập nhật..." : "Đặt lại mật khẩu"}</Button></FieldGroup></form>}
        {step === "done" && <div className="flex flex-col gap-4"><CheckCircle2 className="text-success" aria-hidden="true" /><Button render={<Link href="/login" />}>Đăng nhập ngay</Button></div>}
        {step !== "done" && <Link href="/login" className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Quay lại đăng nhập</Link>}
      </CardContent>
    </Card>
  )
}
