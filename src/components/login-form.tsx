"use client"

import { isExpertRole, nonExpertHome } from "@/lib/expert-access"
import { useHydrated } from "@/hooks/use-hydrated"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type ApiError = { message?: string }
type AccountResponse = { role?: string }

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const hydrated = useHydrated()
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError("")

    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      })
      const result = (await response.json().catch(() => ({}))) as ApiError

      if (!response.ok) {
        setError(result.message || "Không thể đăng nhập. Vui lòng thử lại.")
        return
      }

      const accountResponse = await fetch("/api/auth/me", { cache: "no-store" })
      const account = accountResponse.ok
        ? ((await accountResponse.json()) as AccountResponse)
        : null

      if (!account?.role) {
        setError("Chưa tải được thông tin tài khoản. Vui lòng thử lại.")
        return
      }
      router.replace(isExpertRole(account.role) ? "/expert" : nonExpertHome(account.role))
      router.refresh()
    } catch {
      setError("Không kết nối được máy chủ. Vui lòng thử lại sau.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Đăng nhập FilmLink</CardTitle>
          <CardDescription>
            Sử dụng email đã đăng ký để tiếp tục.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form method="post" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
              {error ? (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              <Field>
                <Button type="submit" disabled={!hydrated || pending}>
                  {pending ? "Đang đăng nhập…" : "Đăng nhập"}
                </Button>
                <FieldDescription className="text-center">
                  Chưa có tài khoản?{" "}
                  <Link href="/register">Đăng ký</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
