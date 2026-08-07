import "server-only"
import { type Student } from "@/generated/prisma/client"
import { studentRepository } from "@/repositories/student.repository"
import { classroomRepository } from "@/repositories/classroom.repository"
import { prisma } from "@/lib/prisma"
import { assertUniqueField } from "@/lib/duplicate-check"
import { AppError } from "@/lib/api-utils"
import type { Siswa, SiswaFormData } from "@/features/siswa/types/siswa"
import type { PaginatedResponse } from "@/types"

export interface StudentFilters {
  search?: string
  jurusan_id?: number
  kelas?: string
  status?: string
  page?: number
  per_page?: number
}

async function enrichJurusanNama(rows: Student[]): Promise<Siswa[]> {
  const jurusanIds = [
    ...new Set(
      rows.map((row) => row.jurusan_id).filter((id): id is number => id !== null)
    ),
  ]
  let jurusanMap = new Map<number, string>()
  if (jurusanIds.length > 0) {
    const jurusans = await prisma.jurusan.findMany({
      where: { id: { in: jurusanIds } },
      select: { id: true, name: true },
    })
    jurusanMap = new Map(jurusans.map((j) => [j.id, j.name]))
  }
  return rows.map((row) => {
    const sis = toSiswa(row)
    if (row.jurusan_id !== null) {
      sis.jurusan_nama = jurusanMap.get(row.jurusan_id) ?? undefined
    }
    return sis
  })
}

function toSiswa(row: Student): Siswa {
  return {
    id: row.id,
    user_id: row.user_id,
    foto: row.foto,
    nis: row.nis,
    nisn: row.nisn,
    nama_lengkap: row.nama_lengkap,
    jenis_kelamin: (row.jenis_kelamin as Siswa["jenis_kelamin"]) ?? "Laki-laki",
    tempat_lahir: row.tempat_lahir ?? "",
    tanggal_lahir: row.tanggal_lahir?.toISOString() ?? "",
    agama: row.agama ?? "Islam",
    alamat: row.alamat,
    jurusan_id: row.jurusan_id ?? 0,
    jurusan_nama: undefined,
    classroom_id: row.classroom_id,
    kelas: row.kelas ?? "",
    tahun_masuk: row.tahun_masuk ?? "",
    tahun_ajaran: row.tahun_ajaran ?? "",
    status: (row.status as Siswa["status"]) ?? "Aktif",
    nama_ayah: row.nama_ayah ?? "",
    nama_ibu: row.nama_ibu ?? "",
    no_hp_ortu: row.no_hp_ortu,
    alamat_ortu: row.alamat_ortu,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

function toSiswaCreate(data: SiswaFormData) {
  return {
    foto: data.foto ?? null,
    nis: data.nis,
    nisn: data.nisn,
    nama_lengkap: data.nama_lengkap,
    jenis_kelamin: data.jenis_kelamin,
    tempat_lahir: data.tempat_lahir ?? null,
    tanggal_lahir: data.tanggal_lahir ? new Date(data.tanggal_lahir) : null,
    agama: data.agama,
    alamat: data.alamat ?? null,
    jurusan_id: data.jurusan_id ?? null,
    kelas: data.kelas ?? null,
    tahun_masuk: data.tahun_masuk ?? null,
    tahun_ajaran: data.tahun_ajaran ?? null,
    status: data.status,
    nama_ayah: data.nama_ayah ?? null,
    nama_ibu: data.nama_ibu ?? null,
    no_hp_ortu: data.no_hp_ortu ?? null,
    alamat_ortu: data.alamat_ortu ?? null,
  }
}

async function resolveClassroom(
  data: SiswaFormData
): Promise<{ classroom_id: number | null; kelas: string | null }> {
  if (data.classroom_id != null) {
    const classroom = await classroomRepository.findById(data.classroom_id)
    if (!classroom) {
      throw new AppError("Kelas tidak valid", 422, {
        classroom_id: ["Kelas tidak ditemukan"],
      })
    }
    return { classroom_id: classroom.id, kelas: classroom.name }
  }
  if (data.kelas) {
    const classroom = await classroomRepository.findFirst({
      name: { equals: data.kelas, mode: "insensitive" },
    })
    return { classroom_id: classroom?.id ?? null, kelas: data.kelas }
  }
  return { classroom_id: null, kelas: null }
}

export const studentService = {
  async getAll(): Promise<Siswa[]> {
    const rows = await studentRepository.findAll()
    return enrichJurusanNama(rows)
  },

  async getAllPaginated(
    filters: StudentFilters = {},
    allowedClassNames?: Set<string>
  ): Promise<PaginatedResponse<Siswa>> {
    const per_page = filters.per_page ?? 10
    const page = filters.page ?? 1

    if (allowedClassNames && allowedClassNames.size === 0) {
      return {
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page,
          total: 0,
        },
      }
    }

    const kelasFilter = filters.kelas ?? undefined
    if (kelasFilter && allowedClassNames && !allowedClassNames.has(kelasFilter)) {
      return {
        data: [],
        meta: {
          current_page: page,
          last_page: 1,
          per_page,
          total: 0,
        },
      }
    }

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
              { nis: { contains: filters.search } },
              { nisn: { contains: filters.search } },
              { kelas: { contains: filters.search } },
            ],
          }
        : {}),
      ...(filters.jurusan_id !== undefined
        ? { jurusan_id: filters.jurusan_id }
        : {}),
      ...(kelasFilter ? { kelas: kelasFilter } : {}),
      ...(allowedClassNames && !kelasFilter
        ? { kelas: { in: [...allowedClassNames] } }
        : {}),
      ...(filters.status ? { status: filters.status } : {}),
    }

    const [rows, total] = await Promise.all([
      studentRepository.findMany({
        where,
        skip: (page - 1) * per_page,
        take: per_page,
      }),
      studentRepository.count(where),
    ])

    return {
      data: await enrichJurusanNama(rows),
      meta: {
        current_page: page,
        last_page: Math.max(1, Math.ceil(total / per_page)),
        per_page,
        total,
      },
    }
  },

  async getById(id: number): Promise<Siswa | null> {
    const row = await studentRepository.findById(id)
    if (!row) return null
    const [siswa] = await enrichJurusanNama([row])
    return siswa
  },

  async create(data: SiswaFormData): Promise<Siswa> {
    await assertUniqueField(
      (value) => studentRepository.findFirst({ nis: value }),
      data.nis,
      "NIS"
    )
    await assertUniqueField(
      (value) => studentRepository.findFirst({ nisn: value }),
      data.nisn,
      "NISN"
    )
    const { classroom_id, kelas } = await resolveClassroom(data)
    const row = await studentRepository.create({
      ...toSiswaCreate(data),
      classroom_id,
      kelas,
    })
    const [siswa] = await enrichJurusanNama([row])
    return siswa
  },

  async update(id: number, data: SiswaFormData): Promise<Siswa | null> {
    await assertUniqueField(
      (value) => studentRepository.findFirst({ nis: value }),
      data.nis,
      "NIS",
      id
    )
    await assertUniqueField(
      (value) => studentRepository.findFirst({ nisn: value }),
      data.nisn,
      "NISN",
      id
    )
    const { classroom_id, kelas } = await resolveClassroom(data)
    const row = await studentRepository.update(id, {
      ...toSiswaCreate(data),
      classroom_id,
      kelas,
    })
    if (!row) return null
    const [siswa] = await enrichJurusanNama([row])
    return siswa
  },

  async remove(id: number): Promise<boolean> {
    await studentRepository.delete(id)
    return true
  },
}
