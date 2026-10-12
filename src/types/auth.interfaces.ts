import type { AccountType } from "./auth.types"

/**
 * Pure TypeScript interfaces for Login and Registration domain objects.
 */

export interface ILoginFormData {
  email: string
  password: string
  keepSignedIn: boolean
}

export interface IRegisterFormData {
  accountType: AccountType
  fullName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface IAuthFormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
  general?: string
}

export interface IAuthResponse {
  success: boolean
  message?: string
  token?: string
  user?: {
    id: string
    email: string
    name: string
    accountType: AccountType
  }
}
