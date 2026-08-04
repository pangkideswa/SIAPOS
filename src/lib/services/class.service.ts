import { apiFetch } from '@/lib/client-api'
import type { SchoolClass, PaginatedResponse } from '@/types'

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
    return apiFetch<PaginatedResponse<SchoolClass>>(
      `/api/classes?${params.toString()}`
    )
  },
  getById: async (id: number) => {
    return apiFetch<SchoolClass>(`/api/classes/${id}`)
  },
  create: async (data: {
    name: string
    major: string
    grade_level: string
    homeroom_teacher_id?: number | null
  }) => {
    return apiFetch<SchoolClass>('/api/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: number, data: Record<string, unknown>) => {
    return apiFetch<SchoolClass>(`/api/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  delete: async (id: number) => {
    return apiFetch<null>(`/api/classes/${id}`, {
      method: 'DELETE',
    })
  },
}
