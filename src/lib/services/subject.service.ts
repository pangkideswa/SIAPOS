import api from '@/lib/api/axios'
import type { Subject, ApiResponse, ApiListResponse } from '@/types'

interface SubjectFilters {
  search?: string
  is_active?: boolean
  page?: number
  per_page?: number
}

export const subjectService = {
  getAll: async (filters: SubjectFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value))
    })
    const response = await api.get<ApiListResponse<Subject>>(`/subjects?${params.toString()}`)
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Subject>>(`/subjects/${id}`)
    return response.data
  },
  create: async (data: { name: string; description?: string; is_active?: boolean }) => {
    const response = await api.post<ApiResponse<Subject>>('/subjects', data)
    return response.data
  },
  update: async (id: number, data: Record<string, unknown>) => {
    const response = await api.put<ApiResponse<Subject>>(`/subjects/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/subjects/${id}`)
    return response.data
  },
}
