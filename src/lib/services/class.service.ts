import api from '@/lib/api/axios'
import type { SchoolClass, ApiResponse, ApiListResponse } from '@/types'

interface ClassFilters {
  search?: string
  grade_level?: string
  page?: number
  per_page?: number
}

export const classService = {
  getAll: async (filters: ClassFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value))
    })
    const response = await api.get<ApiListResponse<SchoolClass>>(`/classes?${params.toString()}`)
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get<ApiResponse<SchoolClass>>(`/classes/${id}`)
    return response.data
  },
  create: async (data: { name: string; major: string; grade_level: string; homeroom_teacher_id?: number | null }) => {
    const response = await api.post<ApiResponse<SchoolClass>>('/classes', data)
    return response.data
  },
  update: async (id: number, data: Record<string, unknown>) => {
    const response = await api.put<ApiResponse<SchoolClass>>(`/classes/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/classes/${id}`)
    return response.data
  },
}
