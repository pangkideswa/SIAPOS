import type { DefaultSession } from "next-auth"
export type UserRole = "super_admin" | "admin" | "guru" | "siswa" | "wali"

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

declare module "next-auth" {
  interface JWT {
    role?: string
    userId?: string
  }
}

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  username?: string
  nip?: string | null
  nisn?: string | null
  avatar?: string | null
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
