import api from '@/lib/api/axios'
import type { User, ApiResponse, ApiListResponse } from '@/types'

interface UserFilters {
  role?: string
  search?: string
  page?: number
  per_page?: number
}

export const userService = {
  getAll: async (filters: UserFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value))
    })
    const response = await api.get<ApiListResponse<User>>(`/users?${params.toString()}`)
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`)
    return response.data
  },
  create: async (data: { name: string; username: string; email: string; password: string; password_confirmation: string; role: string }) => {
    const response = await api.post<ApiResponse<User>>('/users', data)
    return response.data
  },
  update: async (id: number, data: Record<string, unknown>) => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/users/${id}`)
    return response.data
  },
}
