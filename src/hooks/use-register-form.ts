"use client"

import { useState } from "react"
import type { AccountType, IAuthFormErrors, IRegisterFormData } from "@/types"

export interface UseRegisterFormOptions {
  onSuccess?: (data: IRegisterFormData) => void
}

export function useRegisterForm(options: UseRegisterFormOptions = {}) {
  const [formData, setFormData] = useState<IRegisterFormData>({
    accountType: "photographer",
    fullName: "Ansel Adams",
    email: "photographer@leicaworks.com",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<IAuthFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    field: keyof IRegisterFormData,
    value: string | boolean | AccountType
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof IAuthFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: IAuthFormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms of Service"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      options.onSuccess?.(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    showPassword,
    showConfirmPassword,
    errors,
    isSubmitting,
    setShowPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit,
  }
}
