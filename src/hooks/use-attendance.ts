'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  attendanceService,
  type AttendanceFilters,
  type AttendanceSessionDetail,
  type AttendanceSessionFormData,
  type SaveAttendanceRecord,
  type SiswaAbsensiRow,
} from '@/lib/services/attendance.service'
import { getErrorMessage } from '@/hooks/use-api-crud'
import type {
  MetodeAbsensi,
  RekapAbsensi,
  SesiAbsensi,
} from '@/features/absensi/types/absensi'

export function useAttendanceList(filters: AttendanceFilters = {}) {
  return useQuery<SesiAbsensi[]>({
    queryKey: ['attendance-sessions', filters],
    queryFn: () => attendanceService.getAll(filters),
  })
}

export function useAttendanceByClass(teachingClassId: number) {
  return useQuery<SesiAbsensi[]>({
    queryKey: ['attendance-sessions', { teaching_class_id: teachingClassId }],
    queryFn: () =>
      attendanceService.getAll({ teaching_class_id: teachingClassId }),
    enabled: !!teachingClassId,
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

export function useCreateAttendanceSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AttendanceSessionFormData) =>
      attendanceService.createSession(data),
    onSuccess: () => {
      toast.success('Pertemuan berhasil dimulai!')
      queryClient.invalidateQueries({ queryKey: ['attendance-sessions'] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

export function useCreateAttendanceForClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      teaching_class_id: number
      metode: MetodeAbsensi
      tanggal: string
      jam_mulai?: string | null
      jam_selesai?: string | null
    }) => attendanceService.createSessionForClass(data),
    onSuccess: () => {
      toast.success('Pertemuan berhasil dimulai!')
      queryClient.invalidateQueries({ queryKey: ['attendance-sessions'] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

export function useUpdateAttendanceSessionStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number
      status: 'Selesai' | 'Berlangsung' | 'Belum'
    }) => attendanceService.updateSessionStatus(id, status),
    onSuccess: (_data, { status }) => {
      toast.success(
        status === 'Selesai' ? 'Absensi berhasil ditutup' : 'Absensi berhasil dibuka'
      )
      queryClient.invalidateQueries({ queryKey: ['attendance-sessions'] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

export function useMarkPresent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => attendanceService.markPresent(id),
    onSuccess: () => {
      toast.success('Absensi berhasil dicatat!')
      queryClient.invalidateQueries({ queryKey: ['attendance-sessions'] })
      queryClient.invalidateQueries({ queryKey: ['attendance-siswa'] })
      queryClient.invalidateQueries({ queryKey: ['attendance-rekap'] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
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
