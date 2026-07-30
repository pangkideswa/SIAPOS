export type UserRole = "super_admin" | "admin" | "guru" | "siswa" | "wali"

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
