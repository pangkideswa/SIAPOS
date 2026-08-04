import { apiFetch } from '@/lib/client-api'
import type { Guru } from '@/features/guru/types/guru'

export type TeacherFormData = Omit<Guru, 'id' | 'created_at' | 'updated_at'>

export const teacherService = {
  getAll: async () => {
    return apiFetch<Guru[]>('/api/teachers')
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
