"use client"

import { ArrowRight, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react"
import Link from "next/link"
import { AuthCard } from "../../_components/auth-card"
import { AuthLogo } from "../../_components/auth-logo"
import { useRegisterForm } from "../_hooks/use-register-form"

export function RegisterForm() {
  const {
    formData,
    showPassword,
    showConfirmPassword,
    errors,
    isSubmitting,
    isVerifying,
    otp,
    setOtp,
    setIsVerifying,
    setShowPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit,
    handleVerify,
  } = useRegisterForm()

  return (
    <AuthCard>
      <div className="flex justify-center">
        <AuthLogo />
      </div>

      {isVerifying ? (
        <>
          <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-zinc-900">
            Verify your email
          </h1>
          <p className="mt-2 text-center text-sm leading-6 text-zinc-500">
            Enter the six-digit code sent to{" "}
            <span className="font-medium text-zinc-700">{formData.email}</span>.
          </p>
          <form onSubmit={handleVerify} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-otp"
                className="text-[11px] font-bold tracking-wider text-zinc-700 uppercase"
              >
                Verification code
              </label>
              <input
                id="register-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="000000"
                required
                className="w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 py-3 text-center text-lg tracking-[0.4em] text-zinc-900 placeholder:text-zinc-300 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
              />
              {errors.otp && (
                <span role="alert" className="text-xs font-medium text-rose-500">
                  {errors.otp}
                </span>
              )}
            </div>
            <p className="text-xs leading-5 text-zinc-500">
              In local development, if no email arrives, check the backend console for the logged
              OTP.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D94848] py-3 text-sm font-semibold text-white shadow-md shadow-[#D94848]/25 transition-all duration-200 hover:bg-[#C83E3E] disabled:opacity-70"
            >
              <span>{isSubmitting ? "Verifying..." : "Verify email"}</span>
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsVerifying(false)}
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Use a different email
            </button>
          </form>
        </>
      ) : (
        <>
          <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-zinc-900">
            Create Photographer Account
          </h1>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
                  onChange={(event) => handleChange("fullName", event.target.value)}
                  placeholder="Ansel Adams"
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                />
                <User className="pointer-events-none absolute right-3.5 size-4 text-zinc-400" />
              </div>
              {errors.fullName && (
                <span className="text-xs font-medium text-rose-500">{errors.fullName}</span>
              )}
            </div>

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
                  onChange={(event) => handleChange("email", event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                />
                <Mail className="pointer-events-none absolute right-3.5 size-4 text-zinc-400" />
              </div>
              {errors.email && (
                <span className="text-xs font-medium text-rose-500">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-phone"
                className="text-[11px] font-bold tracking-wider text-zinc-700 uppercase"
              >
                Phone Number{" "}
                <span className="font-medium normal-case text-zinc-400">(Optional)</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="register-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={formData.phoneNumber}
                  onChange={(event) => handleChange("phoneNumber", event.target.value)}
                  placeholder="+84901234567"
                  maxLength={15}
                  className="w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                />
                <Phone className="pointer-events-none absolute right-3.5 size-4 text-zinc-400" />
              </div>
              {errors.phoneNumber && (
                <span className="text-xs font-medium text-rose-500">{errors.phoneNumber}</span>
              )}
            </div>

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
                  onChange={(event) => handleChange("password", event.target.value)}
                  placeholder="Create password"
                  maxLength={72}
                  required
                  className="w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs font-medium text-rose-500">{errors.password}</span>
              )}
            </div>

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
                  onChange={(event) => handleChange("confirmPassword", event.target.value)}
                  placeholder="Re-enter password"
                  maxLength={72}
                  required
                  className="w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 text-zinc-400 hover:text-zinc-600"
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-xs font-medium text-rose-500">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Lock className="size-3.5 shrink-0 text-zinc-400" />
              <span>8–72 characters, with at least one letter and one number</span>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                id="agree-terms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(event) => handleChange("agreeToTerms", event.target.checked)}
                required
                className="mt-0.5 size-4 rounded border-zinc-300 accent-[#D94848] focus:ring-[#D94848]/20"
              />
              <label
                htmlFor="agree-terms"
                className="cursor-pointer select-none text-xs leading-snug text-zinc-600"
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
              <span className="text-xs font-medium text-rose-500">{errors.agreeToTerms}</span>
            )}
            {errors.general && (
              <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {errors.general}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D94848] py-3 text-sm font-semibold text-white shadow-md shadow-[#D94848]/25 transition-all duration-200 hover:bg-[#C83E3E] disabled:opacity-70"
            >
              <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
              <ArrowRight className="size-4" />
            </button>
            <p className="mt-2 text-center text-xs text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-zinc-900 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </>
      )}
    </AuthCard>
  )
}
