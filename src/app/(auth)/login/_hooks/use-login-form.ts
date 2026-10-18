"use client"

import { useState } from "react"
import type { IAuthFormErrors, ILoginFormData } from "@/types"

export interface UseLoginFormOptions {
  onSuccess?: (data: ILoginFormData) => void
}

export function useLoginForm(options: UseLoginFormOptions = {}) {
  const [formData, setFormData] = useState<ILoginFormData>({
    email: "photographer@leicaworks.com",
    password: "••••••••••••",
    keepSignedIn: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<IAuthFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof ILoginFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof IAuthFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: IAuthFormErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      // Simulated authentication request
      await new Promise((resolve) => setTimeout(resolve, 800))
      options.onSuccess?.(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    showPassword,
    errors,
    isSubmitting,
    setShowPassword,
    handleChange,
    handleSubmit,
  }
}
