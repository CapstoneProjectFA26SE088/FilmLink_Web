"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { postAuth } from "@/lib/auth/client"
import { type BackendRole, getRoleHome } from "@/lib/auth/roles"
import type { IAuthFormErrors, IRegisterFormData } from "@/types"

export function useRegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<IRegisterFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<IAuthFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [otp, setOtp] = useState("")

  const handleChange = (field: keyof IRegisterFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof IAuthFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }))
    }
  }

  const validate = () => {
    const nextErrors: IAuthFormErrors = {}
    if (formData.fullName.trim().length < 2 || formData.fullName.trim().length > 100) {
      nextErrors.fullName = "Enter a name between 2 and 100 characters"
    }
    if (!formData.email.trim()) nextErrors.email = "Email address is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address"
    }
    if (formData.phoneNumber.trim().length > 15) {
      nextErrors.phoneNumber = "Phone number must be 15 characters or fewer"
    }
    if (formData.password.length < 8 || formData.password.length > 72) {
      nextErrors.password = "Password must be between 8 and 72 characters"
    } else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      nextErrors.password = "Use at least one letter and one number"
    }
    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match"
    }
    if (!formData.agreeToTerms) nextErrors.agreeToTerms = "You must agree to the Terms of Service"
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setErrors({})
    const result = await postAuth("register", {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      ...(formData.phoneNumber.trim() ? { phoneNumber: formData.phoneNumber.trim() } : {}),
      password: formData.password,
      termsAccepted: true,
    })
    setIsSubmitting(false)

    if (!result.ok) {
      setErrors({ general: result.message })
      return
    }

    setIsVerifying(true)
  }

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!/^\d{6}$/.test(otp)) {
      setErrors({ otp: "Enter the six-digit verification code" })
      return
    }

    setIsSubmitting(true)
    setErrors({})
    const result = await postAuth<{ role: BackendRole }>("verify-email", {
      email: formData.email.trim(),
      otp,
    })
    setIsSubmitting(false)

    if (!result.ok) {
      setErrors({ otp: result.message })
      return
    }

    router.replace(getRoleHome(result.data.role))
    router.refresh()
  }

  return {
    formData,
    showPassword,
    showConfirmPassword,
    errors,
    isSubmitting,
    isVerifying,
    otp,
    setOtp: (value: string) => setOtp(value.replace(/\D/g, "").slice(0, 6)),
    setIsVerifying,
    setShowPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit,
    handleVerify,
  }
}
