import { apiFetch } from '@/lib/client-api'
import type { Guru } from '@/features/guru/types/guru'
import type { PaginatedResponse } from '@/types'

export type TeacherFormData = Omit<Guru, 'id' | 'created_at' | 'updated_at'>

interface TeacherFilters {
  search?: string
  status_kepegawaian?: string
  jenis_kelamin?: string
  page?: number
  per_page?: number
}

export const teacherService = {
  getAll: async () => {
    return apiFetch<Guru[]>('/api/teachers')
  },
  getAllPaginated: async (filters: TeacherFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value))
    })
    return apiFetch<PaginatedResponse<Guru>>(
      `/api/teachers?${params.toString()}`
    )
  },
  getById: async (id: number) => {
    return apiFetch<Guru>(`/api/teachers/${id}`)
  },
  create: async (data: TeacherFormData) => {
    return apiFetch<Guru>('/api/teachers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: number, data: TeacherFormData) => {
    return apiFetch<Guru>(`/api/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  remove: async (id: number) => {
    return apiFetch<null>(`/api/teachers/${id}`, {
      method: 'DELETE',
    })
  },
}
