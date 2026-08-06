import { apiFetch } from '@/lib/client-api'
import type { Siswa } from '@/features/siswa/types/siswa'
import type { PaginatedResponse } from '@/types'

export type StudentFormData = Omit<
  Siswa,
  'id' | 'created_at' | 'updated_at' | 'jurusan_nama'
>

interface StudentFilters {
  search?: string
  jurusan_id?: number
  kelas?: string
  status?: string
  page?: number
  per_page?: number
}

export const studentService = {
  getAll: async () => {
    return apiFetch<Siswa[]>('/api/students')
  },
  getAllPaginated: async (filters: StudentFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value))
    })
    return apiFetch<PaginatedResponse<Siswa>>(
      `/api/students?${params.toString()}`
    )
  },
  getById: async (id: number) => {
    return apiFetch<Siswa>(`/api/students/${id}`)
  },
  create: async (data: StudentFormData) => {
    return apiFetch<Siswa>('/api/students', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: number, data: StudentFormData) => {
    return apiFetch<Siswa>(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  remove: async (id: number) => {
    return apiFetch<null>(`/api/students/${id}`, {
      method: 'DELETE',
    })
  },
}
