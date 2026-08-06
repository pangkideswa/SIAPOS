'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  attendanceService,
  type AttendanceFilters,
  type AttendanceSessionDetail,
  type SaveAttendanceRecord,
  type SiswaAbsensiRow,
} from '@/lib/services/attendance.service'
import { getErrorMessage } from '@/hooks/use-api-crud'
import type { RekapAbsensi, SesiAbsensi } from '@/features/absensi/types/absensi'

export function useAttendanceList(filters: AttendanceFilters = {}) {
  return useQuery<SesiAbsensi[]>({
    queryKey: ['attendance-sessions', filters],
    queryFn: () => attendanceService.getAll(filters),
  })
}

export function useAttendanceDetail(id: number) {
  return useQuery<AttendanceSessionDetail>({
    queryKey: ['attendance-sessions', id],
    queryFn: () => attendanceService.getById(id),
    enabled: !!id,
  })
}

export function useSiswaAbsensi(studentId: number) {
  return useQuery<SiswaAbsensiRow[]>({
    queryKey: ['attendance-siswa', studentId],
    queryFn: () => attendanceService.getSiswaAbsensi(studentId),
    enabled: !!studentId,
  })
}

export function useAttendanceRekap(kelas?: string) {
  return useQuery<RekapAbsensi[]>({
    queryKey: ['attendance-rekap', kelas ?? 'all'],
    queryFn: () => attendanceService.getRekap(kelas),
  })
}

export function useSaveAttendanceRecords(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (records: SaveAttendanceRecord[]) =>
      attendanceService.saveRecords(id, records),
    onSuccess: () => {
      toast.success('Absensi berhasil disimpan!')
      queryClient.invalidateQueries({ queryKey: ['attendance-sessions'] })
      queryClient.invalidateQueries({ queryKey: ['attendance-siswa'] })
      queryClient.invalidateQueries({ queryKey: ['attendance-rekap'] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}
