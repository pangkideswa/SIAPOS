export type { User, UserRole, LoginRequest, RegisterRequest, AuthResponse, ApiResponse, ApiError } from './auth'
import type { User } from './auth'

export interface SchoolClass {
  id: number
  name: string
  major: string
  grade_level: string
  homeroom_teacher_id: number | null
  homeroom_teacher?: User
  created_at: string
  updated_at: string
}

export interface Subject {
  id: number
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TeacherSubject {
  id: number
  teacher_id: number
  subject_id: number
  class_id: number
  teacher?: User
  subject?: Subject
  class?: SchoolClass
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ApiListResponse<T> {
  data: T[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    path: string
    per_page: number
    to: number
    total: number
  }
}
