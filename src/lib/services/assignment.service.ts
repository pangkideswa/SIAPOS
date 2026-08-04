import { apiFetch } from '@/lib/client-api'
import type { Tugas } from '@/features/tugas/types/tugas'

export type AssignmentFormData = Omit<
  Tugas,
  'id' | 'created_at' | 'updated_at'
>

export const assignmentService = {
  getAll: async () => {
    return apiFetch<Tugas[]>('/api/assignments')
  },
  getById: async (id: number) => {
    return apiFetch<Tugas>(`/api/assignments/${id}`)
  },
  create: async (data: AssignmentFormData) => {
    return apiFetch<Tugas>('/api/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: number, data: AssignmentFormData) => {
    return apiFetch<Tugas>(`/api/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  remove: async (id: number) => {
    return apiFetch<null>(`/api/assignments/${id}`, {
      method: 'DELETE',
    })
  },
}
