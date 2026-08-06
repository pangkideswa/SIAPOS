import "server-only"
import { type Teacher } from "@/generated/prisma/client"
import { teacherRepository } from "@/repositories/teacher.repository"
import { assertUniqueField } from "@/lib/duplicate-check"
import type { Guru, GuruFormData } from "@/features/guru/types/guru"
import type { PaginatedResponse } from "@/types"

export interface TeacherFilters {
  search?: string
  status_kepegawaian?: string
  jenis_kelamin?: string
  page?: number
  per_page?: number
}

function toGuru(row: Teacher): Guru {
  return {
    id: row.id,
    user_id: row.user_id,
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

  async getAllPaginated(
    filters: TeacherFilters = {}
  ): Promise<PaginatedResponse<Guru>> {
    const per_page = filters.per_page ?? 10
    const page = filters.page ?? 1

    const where = {
      ...(filters.search
        ? {
            OR: [
              {
                nama_lengkap: {
                  contains: filters.search,
                  mode: "insensitive" as const,
                },
              },
              { nip: { contains: filters.search } },
              { nuptk: { contains: filters.search } },
              { email: { contains: filters.search, mode: "insensitive" as const } },
              {
                mata_pelajaran: {
                  string_contains: filters.search,
                },
              },
            ],
          }
        : {}),
      ...(filters.status_kepegawaian
        ? { status_kepegawaian: filters.status_kepegawaian }
        : {}),
      ...(filters.jenis_kelamin ? { jenis_kelamin: filters.jenis_kelamin } : {}),
    }

    const [rows, total] = await Promise.all([
      teacherRepository.findMany({
        where,
        skip: (page - 1) * per_page,
        take: per_page,
      }),
      teacherRepository.count(where),
    ])

    return {
      data: rows.map(toGuru),
      meta: {
        current_page: page,
        last_page: Math.max(1, Math.ceil(total / per_page)),
        per_page,
        total,
      },
    }
  },

  async getById(id: number): Promise<Guru | null> {
    const row = await teacherRepository.findById(id)
    return row ? toGuru(row) : null
  },

  async create(data: GuruFormData): Promise<Guru> {
    await assertUniqueField(
      (value) => teacherRepository.findFirst({ nip: value }),
      data.nip,
      "NIP"
    )
    await assertUniqueField(
      (value) =>
        teacherRepository.findFirst({
          email: value.toLowerCase(),
        }),
      data.email,
      "Email"
    )
    const row = await teacherRepository.create(toGuruCreate(data))
    return toGuru(row)
  },

  async update(id: number, data: GuruFormData): Promise<Guru | null> {
    await assertUniqueField(
      (value) => teacherRepository.findFirst({ nip: value }),
      data.nip,
      "NIP",
      id
    )
    await assertUniqueField(
      (value) =>
        teacherRepository.findFirst({
          email: value.toLowerCase(),
        }),
      data.email,
      "Email",
      id
    )
    const row = await teacherRepository.update(id, toGuruCreate(data))
    return row ? toGuru(row) : null
  },

  async remove(id: number): Promise<boolean> {
    await teacherRepository.delete(id)
    return true
  },
}
