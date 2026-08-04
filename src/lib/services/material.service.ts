import { apiFetch } from '@/lib/client-api'
import type { Materi } from '@/features/materi/types/materi'

export type MaterialFormData = Omit<
  Materi,
  'id' | 'created_at' | 'updated_at'
>

export const materialService = {
  getAll: async () => {
    return apiFetch<Materi[]>('/api/materials')
  },
  getById: async (id: number) => {
    return apiFetch<Materi>(`/api/materials/${id}`)
  },
  create: async (data: MaterialFormData) => {
    return apiFetch<Materi>('/api/materials', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: number, data: MaterialFormData) => {
    return apiFetch<Materi>(`/api/materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  remove: async (id: number) => {
    return apiFetch<null>(`/api/materials/${id}`, {
      method: 'DELETE',
    })
  },
}
