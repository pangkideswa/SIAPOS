import { apiFetch } from '@/lib/client-api'
import type { PaginatedResponse } from '@/types'

export interface TahunAkademik {
  id: number
  nama: string
  tanggal_mulai: string | null
  tanggal_selesai: string | null
  is_active: boolean
  keterangan: string | null
  created_at: string
  updated_at: string
}

export type TahunAkademikFormData = Omit<
  TahunAkademik,
  'id' | 'created_at' | 'updated_at'
>

export interface TahunAkademikFilters {
  search?: string
  is_active?: boolean
  page?: number
  per_page?: number
}

export const tahunAkademikService = {
  getAll: async () => {
    return apiFetch<TahunAkademik[]>('/api/tahun-akademik')
  },
  getAllPaginated: async (filters: TahunAkademikFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '')
        params.append(key, String(value))
    })
    return apiFetch<PaginatedResponse<TahunAkademik>>(
      `/api/tahun-akademik?${params.toString()}`
    )
  },
  getById: async (id: number) => {
    return apiFetch<TahunAkademik>(`/api/tahun-akademik/${id}`)
  },
  create: async (data: TahunAkademikFormData) => {
    return apiFetch<TahunAkademik>('/api/tahun-akademik', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: number, data: TahunAkademikFormData) => {
    return apiFetch<TahunAkademik>(`/api/tahun-akademik/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  remove: async (id: number) => {
    return apiFetch<null>(`/api/tahun-akademik/${id}`, {
      method: 'DELETE',
    })
  },
}
