import { apiFetch } from '@/lib/client-api'
import type {
  AbsensiSiswa,
  RekapAbsensi,
  SesiAbsensi,
  StatusKehadiran,
} from '@/features/absensi/types/absensi'

export interface AttendanceSessionFormData {
  tanggal: string
  jam_mulai?: string | null
  jam_selesai?: string | null
  mata_pelajaran?: string | null
  guru_nama?: string | null
  kelas?: string | null
  tahun_ajaran?: string | null
  semester?: string | null
  status?: 'Selesai' | 'Berlangsung' | 'Belum'
}

export interface SiswaAbsensiRow extends AbsensiSiswa {
  sesi: SesiAbsensi
}

export type AttendanceSessionDetail = SesiAbsensi & {
  records: AbsensiSiswa[]
}

export interface AttendanceFilters {
  guru?: string
  kelas?: string
  tanggal?: string
}

export interface SaveAttendanceRecord {
  student_id: number
  status: StatusKehadiran
  keterangan?: string | null
}

export const attendanceService = {
  getAll: async (filters: AttendanceFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value))
      }
    })
    const qs = params.toString()
    return apiFetch<SesiAbsensi[]>(`/api/attendance${qs ? `?${qs}` : ''}`)
  },
  getById: async (id: number) => {
    return apiFetch<AttendanceSessionDetail>(`/api/attendance/${id}`)
  },
  getSiswaAbsensi: async (studentId: number) => {
    return apiFetch<SiswaAbsensiRow[]>(
      `/api/attendance/siswa?student_id=${studentId}`
    )
  },
  getRekap: async (kelas?: string) => {
    const qs = kelas ? `?kelas=${encodeURIComponent(kelas)}` : ''
    return apiFetch<RekapAbsensi[]>(`/api/attendance/rekap${qs}`)
  },
  createSession: async (data: AttendanceSessionFormData) => {
    return apiFetch<SesiAbsensi>('/api/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  saveRecords: async (id: number, records: SaveAttendanceRecord[]) => {
    return apiFetch<AttendanceSessionDetail>(`/api/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ records }),
    })
  },
}
