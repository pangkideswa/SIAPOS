import { apiFetch } from '@/lib/client-api'
import type { KelasMengajar } from '@/features/kelas-mengajar/types/kelas-mengajar'
import type { PaginatedResponse } from '@/types'

export type TeachingClassFormData = Omit<
  KelasMengajar,
  'id' | 'created_at' | 'updated_at'
>

export interface TeachingClassFilters {
  search?: string
  guru?: string
  kelas?: string
  tahun_ajaran?: string
  page?: number
  per_page?: number
}

export const teachingClassService = {
  getAll: async () => {
    return apiFetch<KelasMengajar[]>('/api/teaching-classes')
  },
  getAllPaginated: async (filters: TeachingClassFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value))
    })
    return apiFetch<PaginatedResponse<KelasMengajar>>(
      `/api/teaching-classes?${params.toString()}`
    )
  },
  getById: async (id: number) => {
    return apiFetch<KelasMengajar>(`/api/teaching-classes/${id}`)
  },
  create: async (data: TeachingClassFormData) => {
    return apiFetch<KelasMengajar>('/api/teaching-classes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: number, data: TeachingClassFormData) => {
    return apiFetch<KelasMengajar>(`/api/teaching-classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  remove: async (id: number) => {
    return apiFetch<null>(`/api/teaching-classes/${id}`, {
      method: 'DELETE',
    })
  },
}
