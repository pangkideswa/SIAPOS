import { apiFetch } from '@/lib/client-api'
import type { NilaiAkademik } from '@/features/nilai-akademik/types/nilai-akademik'

export interface NilaiUpdateData {
  tugas: number | null
  praktik: number | null
  uts: number | null
  uas: number | null
  semester: string
  tahun_ajaran?: string | null
  keterangan?: string | null
}

export interface NilaiCreateData extends NilaiUpdateData {
  student_id: number
  teaching_class_id: number
}

export const nilaiService = {
  getAll: async () => {
    return apiFetch<NilaiAkademik[]>('/api/nilai')
  },
  getById: async (id: number) => {
    return apiFetch<NilaiAkademik>(`/api/nilai/${id}`)
  },
  create: async (data: NilaiCreateData) => {
    return apiFetch<NilaiAkademik>('/api/nilai', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: number, data: NilaiUpdateData) => {
    return apiFetch<NilaiAkademik>(`/api/nilai/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  remove: async (id: number) => {
    return apiFetch<null>(`/api/nilai/${id}`, {
      method: 'DELETE',
    })
  },
}
