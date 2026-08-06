import "server-only"
import { z } from "zod"
import { attendanceRepository } from "@/repositories/attendance.repository"
import type { AttendanceSessionRow } from "@/repositories/attendance.repository"
import type { Attendance, Prisma } from "@/generated/prisma/client"
import type {
  AbsensiSiswa,
  RekapAbsensi,
  SesiAbsensi,
  StatusKehadiran,
} from "@/features/absensi/types/absensi"
import {
  attendanceSessionCreateSchema,
  statusKehadiranSchema,
} from "@/lib/validations/attendance.schemas"

type AttendanceSessionCreateData = z.input<typeof attendanceSessionCreateSchema>

export interface AttendanceFilters {
  guru?: string
  kelas?: string
  tanggal?: string
}

export interface SiswaAbsensiRow extends AbsensiSiswa {
  sesi: SesiAbsensi
}

export type AttendanceSessionDetail = SesiAbsensi & {
  records: AbsensiSiswa[]
}

const STATUS_KEHADIRAN_DB: Record<Attendance["status"], StatusKehadiran> = {
  HADIR: "Hadir",
  IZIN: "Izin",
  SAKIT: "Sakit",
  ALPHA: "Alpha",
  TERLAMBAT: "Terlambat",
}

const STATUS_KEHADIRAN_TO_DB: Record<StatusKehadiran, Attendance["status"]> = {
  Hadir: "HADIR",
  Izin: "IZIN",
  Sakit: "SAKIT",
  Alpha: "ALPHA",
  Terlambat: "TERLAMBAT",
}

const SESSION_STATUS_DB: Record<
  AttendanceSessionRow["status"],
  SesiAbsensi["status"]
> = {
  SELESAI: "Selesai",
  BERLANGSUNG: "Berlangsung",
  BELUM: "Belum",
}

const SESSION_STATUS_TO_DB: Record<
  SesiAbsensi["status"],
  AttendanceSessionRow["status"]
> = {
  Selesai: "SELESAI",
  Berlangsung: "BERLANGSUNG",
  Belum: "BELUM",
}

function toDateOnly(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function toSesiAbsensi(row: AttendanceSessionRow): SesiAbsensi {
  const counts = { hadir: 0, izin: 0, sakit: 0, alpha: 0, terlambat: 0 }
  for (const record of row.records) {
    const status = STATUS_KEHADIRAN_DB[record.status]
    if (status === "Hadir") counts.hadir++
    else if (status === "Izin") counts.izin++
    else if (status === "Sakit") counts.sakit++
    else if (status === "Alpha") counts.alpha++
    else if (status === "Terlambat") counts.terlambat++
  }
  const total = row.records.length
  return {
    id: row.id,
    tanggal: toDateOnly(row.tanggal),
    jam_mulai: row.jam_mulai ?? "",
    jam_selesai: row.jam_selesai ?? "",
    mata_pelajaran: row.mata_pelajaran ?? "",
    guru_nama: row.guru_nama ?? "",
    kelas: row.kelas ?? "",
    tahun_ajaran: row.tahun_ajaran ?? "",
    semester: row.semester ?? "Ganjil",
    total_siswa: total,
    hadir: counts.hadir,
    izin: counts.izin,
    sakit: counts.sakit,
    alpha: counts.alpha,
    terlambat: counts.terlambat,
    status: SESSION_STATUS_DB[row.status],
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

function toAbsensiSiswa(
  record: AttendanceSessionRow["records"][number]
): AbsensiSiswa {
  return {
    id: record.id,
    sesi_id: record.session_id,
    siswa_id: record.student_id,
    siswa_nama: record.student?.nama_lengkap ?? "",
    siswa_kelas: record.student?.kelas ?? "",
    status: STATUS_KEHADIRAN_DB[record.status],
    keterangan: record.keterangan ?? "",
    created_at: record.created_at.toISOString(),
    updated_at: record.updated_at.toISOString(),
  }
}

function toSessionCreate(data: AttendanceSessionCreateData) {
  return {
    tanggal: new Date(data.tanggal + "T00:00:00"),
    jam_mulai: data.jam_mulai ?? null,
    jam_selesai: data.jam_selesai ?? null,
    mata_pelajaran: data.mata_pelajaran ?? null,
    guru_nama: data.guru_nama ?? null,
    kelas: data.kelas ?? null,
    tahun_ajaran: data.tahun_ajaran ?? null,
    semester: data.semester ?? null,
    status: SESSION_STATUS_TO_DB[data.status ?? "Belum"],
  }
}

export const attendanceService = {
  async getAll(filters: AttendanceFilters = {}): Promise<SesiAbsensi[]> {
    const where: Prisma.AttendanceSessionWhereInput = {
      ...(filters.guru ? { guru_nama: filters.guru } : {}),
      ...(filters.kelas ? { kelas: filters.kelas } : {}),
    }
    if (filters.tanggal) {
      const start = new Date(filters.tanggal + "T00:00:00")
      const end = new Date(start)
      end.setDate(start.getDate() + 1)
      where.tanggal = { gte: start, lt: end }
    }
    const rows = await attendanceRepository.findSessions(where)
    return rows.map(toSesiAbsensi)
  },

  async getById(id: number): Promise<AttendanceSessionDetail | null> {
    const row = await attendanceRepository.findSessionById(id)
    if (!row) return null
    return {
      ...toSesiAbsensi(row),
      records: row.records.map(toAbsensiSiswa),
    }
  },

  async getSiswaAbsensi(studentId: number): Promise<SiswaAbsensiRow[]> {
    const rows = await attendanceRepository.findSessionsByStudent(studentId)
    const result: SiswaAbsensiRow[] = []
    for (const row of rows) {
      const sesi = toSesiAbsensi(row)
      for (const record of row.records) {
        result.push({ ...toAbsensiSiswa(record), sesi })
      }
    }
    return result.sort((a, b) => b.sesi.tanggal.localeCompare(a.sesi.tanggal))
  },

  async getRekap(kelas?: string): Promise<RekapAbsensi[]> {
    const records = await attendanceRepository.findAllRecordsForRekap()
    const siswaMap = new Map<number, RekapAbsensi>()
    const kelasSesiCount = new Map<string, Set<number>>()

    for (const r of records) {
      if (kelas && r.student?.kelas !== kelas) continue
      let rec = siswaMap.get(r.student_id)
      if (!rec) {
        rec = {
          siswa_id: r.student_id,
          siswa_nama: r.student?.nama_lengkap ?? "",
          siswa_kelas: r.student?.kelas ?? "",
          hadir: 0,
          izin: 0,
          sakit: 0,
          alpha: 0,
          terlambat: 0,
          total_pertemuan: 0,
          persentase: 0,
        }
        siswaMap.set(r.student_id, rec)
      }
      const status = STATUS_KEHADIRAN_DB[r.status]
      if (status === "Hadir") rec.hadir++
      else if (status === "Izin") rec.izin++
      else if (status === "Sakit") rec.sakit++
      else if (status === "Alpha") rec.alpha++
      else if (status === "Terlambat") rec.terlambat++

      const key = rec.siswa_kelas
      if (!kelasSesiCount.has(key)) kelasSesiCount.set(key, new Set())
      kelasSesiCount.get(key)!.add(r.session.id)
    }

    for (const [kelasKey, sesiIds] of kelasSesiCount) {
      const total = sesiIds.size
      for (const rec of siswaMap.values()) {
        if (rec.siswa_kelas === kelasKey) {
          rec.total_pertemuan = total
          rec.persentase =
            total > 0
              ? Math.round(((rec.hadir + rec.terlambat) / total) * 100)
              : 0
        }
      }
    }

    return Array.from(siswaMap.values()).filter(
      (r) => r.total_pertemuan > 0
    )
  },

  async create(data: AttendanceSessionCreateData): Promise<SesiAbsensi> {
    const row = await attendanceRepository.createSession(toSessionCreate(data))
    return toSesiAbsensi(row)
  },

  async updateSessionStatus(
    id: number,
    status: SesiAbsensi["status"]
  ): Promise<AttendanceSessionDetail | null> {
    const row = await attendanceRepository.updateSession(id, {
      status: SESSION_STATUS_TO_DB[status],
    })
    if (!row) return null
    return {
      ...toSesiAbsensi(row),
      records: row.records.map(toAbsensiSiswa),
    }
  },

  async saveRecords(
    id: number,
    records: Array<{
      student_id: number
      status: StatusKehadiran
      keterangan: string | null
    }>
  ): Promise<AttendanceSessionDetail | null> {
    const row = await attendanceRepository.saveRecords(
      id,
      records.map((r) => ({
        student_id: r.student_id,
        status: STATUS_KEHADIRAN_TO_DB[r.status],
        keterangan: r.keterangan,
      }))
    )
    if (!row) return null
    return {
      ...toSesiAbsensi(row),
      records: row.records.map(toAbsensiSiswa),
    }
  },

  async remove(id: number): Promise<boolean> {
    await attendanceRepository.deleteSession(id)
    return true
  },

  validateStatus(value: string): value is StatusKehadiran {
    return statusKehadiranSchema.safeParse(value).success
  },
}
