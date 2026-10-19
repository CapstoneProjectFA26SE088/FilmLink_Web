"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { postAuth } from "@/lib/auth/client"
import type { BackendRole } from "@/lib/auth/roles"
import { getRoleHome, isSafeReturnPath } from "@/lib/auth/roles"
import type { IAuthFormErrors, ILoginFormData } from "@/types"

export function useLoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<ILoginFormData>({
    email: "",
    password: "",
    keepSignedIn: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<IAuthFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof ILoginFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof IAuthFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }))
    }
  }

  const validate = () => {
    const nextErrors: IAuthFormErrors = {}
    if (!formData.email.trim()) nextErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address"
    }
    if (!formData.password) nextErrors.password = "Password is required"
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setErrors({})
    const result = await postAuth<{ role: BackendRole }>("login", {
      email: formData.email.trim(),
      password: formData.password,
      keepSignedIn: formData.keepSignedIn,
    })
    setIsSubmitting(false)

    if (!result.ok) {
      setErrors({ general: result.message })
      return
    }

    const from = new URLSearchParams(window.location.search).get("from")
    const destination = isSafeReturnPath(from, result.data.role)
      ? from
      : getRoleHome(result.data.role)
    router.replace(destination)
    router.refresh()
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
