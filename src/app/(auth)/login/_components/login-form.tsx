"use client"

import { ArrowRight, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { AuthCard } from "../../_components/auth-card"
import { AuthLogo } from "../../_components/auth-logo"
import { useLoginForm } from "../_hooks/use-login-form"

export function LoginForm() {
  const {
    formData,
    showPassword,
    errors,
    isSubmitting,
    setShowPassword,
    handleChange,
    handleSubmit,
  } = useLoginForm()

  return (
    <AuthCard>
      {/* Top Logo */}
      <div className="flex justify-center">
        <AuthLogo />
      </div>

      {/* Headline */}
      <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-zinc-900">Login</h1>

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="login-email"
            className="text-[11px] font-bold tracking-wider text-zinc-700 uppercase"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="photographer@leicaworks.com"
            required
            className="w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
          />
          {errors.email && (
            <span className="text-xs text-rose-500 font-medium">{errors.email}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-[11px] font-bold tracking-wider text-zinc-700 uppercase"
            >
              Password
            </label>
            <Link
              href="#forgot-password"
              className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-rose-500 font-medium">{errors.password}</span>
          )}
        </div>

        {/* Keep Me Signed In Checkbox */}
        <div className="flex items-center gap-2 pt-0.5">
          <input
            id="keep-signed-in"
            type="checkbox"
            checked={formData.keepSignedIn}
            onChange={(e) => handleChange("keepSignedIn", e.target.checked)}
            className="size-4 rounded border-zinc-300 text-[#D94848] accent-[#D94848] focus:ring-[#D94848]/20"
          />
          <label
            htmlFor="keep-signed-in"
            className="text-xs font-medium text-zinc-600 cursor-pointer select-none"
          >
            Keep me signed in
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D94848] py-3 text-sm font-semibold text-white shadow-md shadow-[#D94848]/25 transition-all duration-200 hover:bg-[#C83E3E] hover:shadow-lg hover:shadow-[#D94848]/30 active:translate-y-px disabled:opacity-70 cursor-pointer"
        >
          <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
          <ArrowRight className="size-4" />
        </button>
        {errors.general && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errors.general}
          </p>
        )}

        {/* Footer Link */}
        <p className="mt-4 text-center text-xs text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#D94848] hover:underline">
            Create Account
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
