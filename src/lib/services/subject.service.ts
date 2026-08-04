import { apiFetch } from '@/lib/client-api'
import type { Subject, PaginatedResponse } from '@/types'

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
    return apiFetch<PaginatedResponse<Subject>>(
      `/api/subjects?${params.toString()}`
    )
  },
  getById: async (id: number) => {
    return apiFetch<Subject>(`/api/subjects/${id}`)
  },
  create: async (data: {
    name: string
    description?: string
    is_active?: boolean
  }) => {
    return apiFetch<Subject>('/api/subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: number, data: Record<string, unknown>) => {
    return apiFetch<Subject>(`/api/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  delete: async (id: number) => {
    return apiFetch<null>(`/api/subjects/${id}`, {
      method: 'DELETE',
    })
  },
}
