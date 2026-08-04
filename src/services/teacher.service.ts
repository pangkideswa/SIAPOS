import "server-only"
import { type Teacher } from "@/generated/prisma/client"
import { teacherRepository } from "@/repositories/teacher.repository"
import type { Guru, GuruFormData } from "@/features/guru/types/guru"

function toGuru(row: Teacher): Guru {
  return {
    id: row.id,
    foto: row.foto,
    nama_lengkap: row.nama_lengkap,
    nip: row.nip,
    nuptk: row.nuptk,
    jenis_kelamin: (row.jenis_kelamin as Guru["jenis_kelamin"]) ?? "Laki-laki",
    tempat_lahir: row.tempat_lahir ?? "",
    tanggal_lahir: row.tanggal_lahir?.toISOString() ?? "",
    no_hp: row.no_hp,
    email: row.email,
    alamat: row.alamat,
    pendidikan_terakhir: row.pendidikan_terakhir ?? "",
    status_kepegawaian: (row.status_kepegawaian as Guru["status_kepegawaian"]) ?? "Honorer",
    mata_pelajaran: Array.isArray(row.mata_pelajaran)
      ? (row.mata_pelajaran as string[])
      : [],
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

function toGuruCreate(data: GuruFormData) {
  return {
    foto: data.foto ?? null,
    nama_lengkap: data.nama_lengkap,
    nip: data.nip,
    nuptk: data.nuptk ?? null,
    jenis_kelamin: data.jenis_kelamin,
    tempat_lahir: data.tempat_lahir ?? null,
    tanggal_lahir: data.tanggal_lahir ? new Date(data.tanggal_lahir) : null,
    no_hp: data.no_hp ?? null,
    email: data.email,
    alamat: data.alamat ?? null,
    pendidikan_terakhir: data.pendidikan_terakhir ?? null,
    status_kepegawaian: data.status_kepegawaian,
    mata_pelajaran: data.mata_pelajaran,
  }
}

export const teacherService = {
  async getAll(): Promise<Guru[]> {
    const rows = await teacherRepository.findAll()
    return rows.map(toGuru)
  },

  async getById(id: number): Promise<Guru | null> {
    const row = await teacherRepository.findById(id)
    return row ? toGuru(row) : null
  },

  async create(data: GuruFormData): Promise<Guru> {
    const row = await teacherRepository.create(toGuruCreate(data))
    return toGuru(row)
  },

  async update(id: number, data: GuruFormData): Promise<Guru | null> {
    const row = await teacherRepository.update(id, toGuruCreate(data))
    return row ? toGuru(row) : null
  },

  async remove(id: number): Promise<boolean> {
    await teacherRepository.delete(id)
    return true
  },
}
