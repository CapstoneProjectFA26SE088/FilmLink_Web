import type { BackendRole } from "@/lib/auth/roles"

export interface ILoginFormData {
  email: string
  password: string
  keepSignedIn: boolean
}

export interface IRegisterFormData {
  fullName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface IAuthFormErrors {
  fullName?: string
  email?: string
  phoneNumber?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
  otp?: string
  general?: string
}

export interface IAuthSessionResponse {
  success: true
  role: BackendRole
}
