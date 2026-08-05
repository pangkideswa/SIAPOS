'use client'

import { useQuery } from '@tanstack/react-query'
import { scheduleService } from '@/lib/services/schedule.service'
import type { JadwalPelajaran } from '@/features/jadwal-pelajaran/types/jadwal-pelajaran'

export function useSchedules() {
  return useQuery<JadwalPelajaran[]>({
    queryKey: ['schedules'],
    queryFn: () => scheduleService.getAll(),
  })
}

export function useSchedule(id: number) {
  return useQuery<JadwalPelajaran>({
    queryKey: ['schedules', id],
    queryFn: () => scheduleService.getById(id),
    enabled: !!id,
  })
}
