import { apiFetch } from '@/lib/client-api'
import type { Jurusan } from '@/features/jurusan/types/jurusan'
import type { PaginatedResponse } from '@/types'

export type JurusanFormData = Omit<
  Jurusan,
  'id' | 'created_at' | 'updated_at'
>

interface JurusanFilters {
  search?: string
  is_active?: boolean
  page?: number
  per_page?: number
}

export const jurusanService = {
  getAll: async (filters: JurusanFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value))
    })
    return apiFetch<PaginatedResponse<Jurusan>>(
      `/api/jurusan?${params.toString()}`
    )
  },
  getById: async (id: number) => {
    return apiFetch<Jurusan>(`/api/jurusan/${id}`)
  },
  create: async (data: JurusanFormData) => {
    return apiFetch<Jurusan>('/api/jurusan', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: number, data: JurusanFormData) => {
    return apiFetch<Jurusan>(`/api/jurusan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  remove: async (id: number) => {
    return apiFetch<null>(`/api/jurusan/${id}`, {
      method: 'DELETE',
    })
  },
}
