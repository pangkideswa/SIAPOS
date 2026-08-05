import { apiFetch } from '@/lib/client-api'
import type { JadwalPelajaran } from '@/features/jadwal-pelajaran/types/jadwal-pelajaran'

export const scheduleService = {
  getAll: async () => {
    return apiFetch<JadwalPelajaran[]>('/api/schedules')
  },
  getById: async (id: number) => {
    return apiFetch<JadwalPelajaran>(`/api/schedules/${id}`)
  },
}
