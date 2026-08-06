import { apiFetch } from '@/lib/client-api'
import type { JadwalPelajaran } from '@/features/jadwal-pelajaran/types/jadwal-pelajaran'

export interface ScheduleFilters {
  guru_nama?: string
  kelas?: string
  hari?: string
}

export const scheduleService = {
  getAll: async (filters: ScheduleFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value))
      }
    })
    const qs = params.toString()
    return apiFetch<JadwalPelajaran[]>(
      `/api/schedules${qs ? `?${qs}` : ''}`
    )
  },
  getById: async (id: number) => {
    return apiFetch<JadwalPelajaran>(`/api/schedules/${id}`)
  },
}
