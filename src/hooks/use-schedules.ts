'use client'

import { useQuery } from '@tanstack/react-query'
import {
  scheduleService,
  type ScheduleFilters,
} from '@/lib/services/schedule.service'
import type { JadwalPelajaran } from '@/features/jadwal-pelajaran/types/jadwal-pelajaran'
import { createCrudHooks } from './use-api-crud'

export const {
  useCreate: useCreateSchedule,
  useUpdate: useUpdateSchedule,
  useRemove: useRemoveSchedule,
} = createCrudHooks('schedules', scheduleService)

export function useSchedules(filters: ScheduleFilters = {}) {
  return useQuery<JadwalPelajaran[]>({
    queryKey: ['schedules', filters],
    queryFn: () => scheduleService.getAll(filters),
  })
}

export function useSchedule(id: number) {
  return useQuery<JadwalPelajaran>({
    queryKey: ['schedules', id],
    queryFn: () => scheduleService.getById(id),
    enabled: !!id,
  })
}
