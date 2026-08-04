import { apiFetch } from '@/lib/client-api'
import type { User, PaginatedResponse } from '@/types'

interface UserFilters {
  role?: string
  search?: string
  page?: number
  per_page?: number
}

interface CreateUserData {
  name: string
  username?: string | null
  email: string
  password: string
  role: string
  nip?: string | null
  nisn?: string | null
}

export const userService = {
  getAll: async (filters: UserFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value))
    })
    return apiFetch<PaginatedResponse<User>>(`/api/users?${params.toString()}`)
  },
  getById: async (id: number) => {
    return apiFetch<User>(`/api/users/${id}`)
  },
  create: async (data: CreateUserData) => {
    return apiFetch<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: number, data: Record<string, unknown>) => {
    return apiFetch<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  delete: async (id: number) => {
    return apiFetch<null>(`/api/users/${id}`, {
      method: 'DELETE',
    })
  },
}
