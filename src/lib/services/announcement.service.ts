import { apiFetch } from '@/lib/client-api'
import type { Pengumuman } from '@/features/pengumuman/types/pengumuman'

export type AnnouncementFormData = Omit<
  Pengumuman,
  'id' | 'created_at' | 'updated_at'
>

export const announcementService = {
  getAll: async () => {
    return apiFetch<Pengumuman[]>('/api/announcements')
  },
  getById: async (id: number) => {
    return apiFetch<Pengumuman>(`/api/announcements/${id}`)
  },
  create: async (data: AnnouncementFormData) => {
    return apiFetch<Pengumuman>('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: number, data: AnnouncementFormData) => {
    return apiFetch<Pengumuman>(`/api/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  remove: async (id: number) => {
    return apiFetch<null>(`/api/announcements/${id}`, {
      method: 'DELETE',
    })
  },
}
