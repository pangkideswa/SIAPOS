import { apiFetch } from '@/lib/client-api'
import type { Penilaian } from '@/features/penilaian/types/penilaian'

export interface PenilaianUpdateData {
  nilai: number | null
  feedback?: string | null
  status_penilaian: Penilaian['status_penilaian']
}

export const penilaianService = {
  getAll: async () => {
    return apiFetch<Penilaian[]>('/api/penilaian')
  },
  getById: async (id: number) => {
    return apiFetch<Penilaian>(`/api/penilaian/${id}`)
  },
  update: async (id: number, data: PenilaianUpdateData) => {
    return apiFetch<Penilaian>(`/api/penilaian/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}
