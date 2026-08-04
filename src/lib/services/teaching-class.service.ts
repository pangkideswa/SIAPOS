import { apiFetch } from '@/lib/client-api'
import type { KelasMengajar } from '@/features/kelas-mengajar/types/kelas-mengajar'

export type TeachingClassFormData = Omit<
  KelasMengajar,
  'id' | 'created_at' | 'updated_at'
>

export const teachingClassService = {
  getAll: async () => {
    return apiFetch<KelasMengajar[]>('/api/teaching-classes')
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
