import { apiFetch } from '@/lib/client-api'
import type { Siswa } from '@/features/siswa/types/siswa'

export type StudentFormData = Omit<
  Siswa,
  'id' | 'created_at' | 'updated_at' | 'jurusan_nama'
>

export const studentService = {
  getAll: async () => {
    return apiFetch<Siswa[]>('/api/students')
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
