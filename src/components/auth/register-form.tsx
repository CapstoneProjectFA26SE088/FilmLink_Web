"use client"

import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import Link from "next/link"
import { useRegisterForm } from "@/hooks/use-register-form"
import { cn } from "@/lib/utils"
import { AuthCard } from "./auth-card"
import { AuthLogo } from "./auth-logo"
import { GoogleButton } from "./google-button"

export function RegisterForm() {
  const {
    formData,
    showPassword,
    showConfirmPassword,
    errors,
    isSubmitting,
    setShowPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit,
  } = useRegisterForm()

  return (
    <AuthCard>
      {/* Top Logo */}
      <div className="flex justify-center">
        <AuthLogo />
      </div>

      {/* Headline */}
      <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-zinc-900">
        Create Account
      </h1>

      {/* Main Register Form */}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {/* Account Type Segmented Switch */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold tracking-wider text-zinc-700 uppercase">
            Account Type
          </label>
          <div className="grid grid-cols-2 rounded-xl bg-zinc-100 p-1">
            <button
              type="button"
              onClick={() => handleChange("accountType", "photographer")}
              className={cn(
                "rounded-lg py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer",
                formData.accountType === "photographer"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800"
              )}
            >
              Photographer
            </button>
            <button
              type="button"
              onClick={() => handleChange("accountType", "lab_owner")}
              className={cn(
                "rounded-lg py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer",
                formData.accountType === "lab_owner"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800"
              )}
            >
              Film Lab Owner
            </button>
          </div>
        </div>

        {/* Full Name Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="register-fullname"
            className="text-[11px] font-bold tracking-wider text-zinc-700 uppercase"
          >
            Full Name
          </label>
          <div className="relative flex items-center">
            <input
              id="register-fullname"
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Ansel Adams"
              required
              className="w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            />
            <User className="absolute right-3.5 size-4 text-zinc-400 pointer-events-none" />
          </div>
          {errors.fullName && (
            <span className="text-xs text-rose-500 font-medium">{errors.fullName}</span>
          )}
        </div>

        {/* Email Address Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="register-email"
            className="text-[11px] font-bold tracking-wider text-zinc-700 uppercase"
          >
            Email Address
          </label>
          <div className="relative flex items-center">
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="photographer@leicaworks.com"
              required
              className="w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            />
            <Mail className="absolute right-3.5 size-4 text-zinc-400 pointer-events-none" />
          </div>
          {errors.email && (
            <span className="text-xs text-rose-500 font-medium">{errors.email}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="register-password"
            className="text-[11px] font-bold tracking-wider text-zinc-700 uppercase"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Create password"
              required
              className="w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-rose-500 font-medium">{errors.password}</span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="register-confirm-password"
            className="text-[11px] font-bold tracking-wider text-zinc-700 uppercase"
          >
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="Re-enter password"
              required
              className="w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute right-3 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-xs text-rose-500 font-medium">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        {/* Password Hint */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Lock className="size-3.5 text-zinc-400 shrink-0" />
          <span>At least 8 characters with numbers and symbols</span>
        </div>

        {/* Agree to Terms Checkbox */}
        <div className="flex items-start gap-2 pt-1">
          <input
            id="agree-terms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleChange("agreeToTerms", e.target.checked)}
            required
            className="mt-0.5 size-4 rounded border-zinc-300 text-[#D94848] accent-[#D94848] focus:ring-[#D94848]/20"
          />
          <label
            htmlFor="agree-terms"
            className="text-xs text-zinc-600 leading-snug cursor-pointer select-none"
          >
            I agree to the{" "}
            <Link href="#terms" className="font-semibold text-zinc-800 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#privacy" className="font-semibold text-zinc-800 hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.agreeToTerms && (
          <span className="text-xs text-rose-500 font-medium">
            {errors.agreeToTerms}
          </span>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D94848] py-3 text-sm font-semibold text-white shadow-md shadow-[#D94848]/25 transition-all duration-200 hover:bg-[#C83E3E] hover:shadow-lg hover:shadow-[#D94848]/30 active:translate-y-px disabled:opacity-70 cursor-pointer"
        >
          <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
          <ArrowRight className="size-4" />
        </button>

        {/* Divider */}
        <div className="relative my-2 flex items-center justify-center">
          <div className="w-full border-t border-zinc-200/80" />
          <span className="absolute bg-white px-3 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
            Or continue with
          </span>
        </div>

        {/* Google Social Button */}
        <GoogleButton />

        {/* Footer Link */}
        <p className="mt-4 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-zinc-900 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
