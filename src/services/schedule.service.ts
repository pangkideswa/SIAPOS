import "server-only"
import { type Prisma, type Schedule } from "@/generated/prisma/client"
import { scheduleRepository } from "@/repositories/schedule.repository"
import { toScheduleDay } from "@/lib/db-mappers"
import type { JadwalPelajaran } from "@/features/jadwal-pelajaran/types/jadwal-pelajaran"

export type ScheduleCreateInput = Omit<
  JadwalPelajaran,
  "id" | "created_at" | "updated_at"
>

export interface ScheduleFilters {
  guru_nama?: string
  kelas?: string
  hari?: string
}

const DAY_DB: Record<string, string> = {
  Senin: "SENIN",
  Selasa: "SELASA",
  Rabu: "RABU",
  Kamis: "KAMIS",
  Jumat: "JUMAT",
  Sabtu: "SABTU",
  Minggu: "MINGGU",
}

function toJadwal(row: Schedule): JadwalPelajaran {
  return {
    id: row.id,
    hari: toScheduleDay(row.hari),
    jam_mulai: row.jam_mulai ?? "",
    jam_selesai: row.jam_selesai ?? "",
    mata_pelajaran: row.mata_pelajaran ?? "",
    guru_nama: row.guru_nama ?? "",
    kelas: row.kelas ?? "",
    tahun_ajaran: row.tahun_ajaran ?? "",
    semester: row.semester ?? "Ganjil",
    ruang: row.ruang ?? "",
    status: (row.status as JadwalPelajaran["status"]) ?? "Aktif",
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

function toJadwalCreate(data: ScheduleCreateInput) {
  return {
    teaching_class_id: null,
    hari: (DAY_DB[data.hari] ?? data.hari.toUpperCase()) as never,
    jam_mulai: data.jam_mulai || null,
    jam_selesai: data.jam_selesai || null,
    mata_pelajaran: data.mata_pelajaran || null,
    guru_nama: data.guru_nama || null,
    kelas: data.kelas || null,
    tahun_ajaran: data.tahun_ajaran || null,
    semester: data.semester || null,
    ruang: data.ruang || null,
    status: data.status,
  }
}

export const scheduleService = {
  async getAll(filters: ScheduleFilters = {}): Promise<JadwalPelajaran[]> {
    const where: Prisma.ScheduleWhereInput = {
      ...(filters.guru_nama ? { guru_nama: filters.guru_nama } : {}),
      ...(filters.kelas ? { kelas: filters.kelas } : {}),
      ...(filters.hari
        ? { hari: (DAY_DB[filters.hari] ?? filters.hari.toUpperCase()) as never }
        : {}),
    }
    const rows = await scheduleRepository.findMany(where)
    return rows.map(toJadwal)
  },

  async getById(id: number): Promise<JadwalPelajaran | null> {
    const row = await scheduleRepository.findById(id)
    return row ? toJadwal(row) : null
  },

  async getByKelas(kelas: string): Promise<JadwalPelajaran[]> {
    const rows = await scheduleRepository.findMany({ kelas })
    return rows.map(toJadwal)
  },

  async create(data: ScheduleCreateInput): Promise<JadwalPelajaran> {
    const row = await scheduleRepository.create(toJadwalCreate(data))
    return toJadwal(row)
  },

  async update(
    id: number,
    data: ScheduleCreateInput
  ): Promise<JadwalPelajaran | null> {
    const row = await scheduleRepository.update(id, toJadwalCreate(data))
    return row ? toJadwal(row) : null
  },

  async remove(id: number): Promise<boolean> {
    await scheduleRepository.delete(id)
    return true
  },
}
