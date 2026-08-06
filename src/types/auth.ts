import type { DefaultSession } from "next-auth"
export type UserRole = "super_admin" | "admin" | "guru" | "siswa" | "wali"
export type AccountStatus = "BELUM_AKTIF" | "AKTIF" | "DIBLOKIR"

declare module "next-auth" {
  interface User {
    role?: string
    id?: string
  }
  interface Session {
    user: {
      role?: string
      id?: string
    } & DefaultSession["user"]
  }
}

export interface User {
  id: number
  name: string
  email: string | null
  role: UserRole
  status: AccountStatus
  provider?: string
  providerId?: string | null
  image?: string | null
  emailVerified?: string | null
  username?: string
  nip?: string | null
  nisn?: string | null
  avatar?: string | null
  login_count: number
  last_login: string | null
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  identifier: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
  role: UserRole
  nip?: string | null
  nisn?: string | null
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}
