import "server-only"
import { teachingClassRepository, teachingClassAssignmentRepository } from "@/repositories/teaching-class.repository"
import { teacherRepository } from "@/repositories/teacher.repository"
import { tahunAkademikRepository } from "@/repositories/tahun-akademik.repository"
import { AppError } from "@/lib/api-utils"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"
import type { TeacherSubject, User, Subject, SchoolClass, PaginatedResponse } from "@/types"

async function getTeacherIdByName(teacherName: string): Promise<number | null> {
  if (!teacherName) return null
  const teacher = await teacherRepository.findFirst({
  nama_lengkap: teacherName,
})
  return teacher?.id ?? null
}

export interface TeacherSubjectCreateInput {
  teacher_id: number
  subject_id: number
  class_id: number
}

export interface KelasMengajarFilters {
  search?: string
  guru?: string
  kelas?: string
  tahun_ajaran?: string
  page?: number
  per_page?: number
}

function toUserReference(row: {
  id: number
  nama_lengkap: string
  email: string
  nip: string | null
}): User {
  return {
    id: row.id,
    name: row.nama_lengkap,
    email: row.email,
    role: "guru",
    status: "AKTIF",
    nip: row.nip,
    login_count: 0,
    last_login: null,
    created_at: "",
    updated_at: "",
  }
}

function toSubjectReference(row: {
  id: number
  name: string
  description: string | null
  is_active: boolean
}): Subject {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    is_active: row.is_active,
    created_at: "",
    updated_at: "",
  }
}

function toClassReference(row: {
  id: number
  name: string
  major: string | null
  grade_level: string | null
}): SchoolClass {
  return {
    id: row.id,
    name: row.name,
    major: row.major ?? "",
    grade_level: row.grade_level ?? "",
    homeroom_teacher_id: null,
    created_at: "",
    updated_at: "",
  }
}

function toTeacherSubject(row: {
  id: number
  teacher_id: number | null
  subject_id: number | null
  classroom_id: number | null
  created_at: Date
  updated_at: Date
  teacher?: {
    id: number
    nama_lengkap: string
    email: string
    nip: string | null
  } | null
  subject?: {
    id: number
    name: string
    description: string | null
    is_active: boolean
  } | null
  classroom?: {
    id: number
    name: string
    major: string | null
    grade_level: string | null
  } | null
}): TeacherSubject {
  return {
    id: row.id,
    teacher_id: row.teacher_id ?? 0,
    subject_id: row.subject_id ?? 0,
    class_id: row.classroom_id ?? 0,
    teacher: row.teacher ? toUserReference(row.teacher) : undefined,
    subject: row.subject ? toSubjectReference(row.subject) : undefined,
    class: row.classroom ? toClassReference(row.classroom) : undefined,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

function toKelasMengajar(row: {
  id: number
  classroom_id: number | null
  subject_id: number | null
  teacher_id: number | null
  guru_nama: string | null
  mata_pelajaran: string | null
  kelas: string | null
  tahun_ajaran: string | null
  semester: string | null
  status: string | null
  created_at: Date
  updated_at: Date
}): KelasMengajar {
  return {
    id: row.id,
    classroom_id: row.classroom_id,
    subject_id: row.subject_id,
    teacher_id: row.teacher_id,
    guru_nama: row.guru_nama ?? "",
    mata_pelajaran: row.mata_pelajaran ?? "",
    kelas: row.kelas ?? "",
    tahun_ajaran: row.tahun_ajaran ?? "",
    semester: (row.semester as KelasMengajar["semester"]) ?? "Ganjil",
    status: (row.status as KelasMengajar["status"]) ?? "Aktif",
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

export const teachingClassService = {
  async getAll(): Promise<KelasMengajar[]> {
    const rows = await teachingClassRepository.findAll()
    return rows.map(toKelasMengajar)
  },

  async getAllPaginated(
    filters: KelasMengajarFilters = {},
    allowedTeachingClassIds?: Set<number>
  ): Promise<PaginatedResponse<KelasMengajar>> {
    const { search, guru, kelas, tahun_ajaran } = filters
    const page = Math.max(1, filters.page ?? 1)
    const perPage = Math.min(100, Math.max(1, filters.per_page ?? 10))

    if (allowedTeachingClassIds && allowedTeachingClassIds.size === 0) {
      return {
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: perPage,
          total: 0,
        },
      }
    }

    const where = {
      ...(search
        ? {
            OR: [
              { guru_nama: { contains: search } },
              { mata_pelajaran: { contains: search } },
              { kelas: { contains: search } },
            ],
          }
        : {}),
      ...(guru && guru !== "all" ? { guru_nama: guru } : {}),
      ...(kelas && kelas !== "all" ? { kelas } : {}),
      ...(tahun_ajaran && tahun_ajaran !== "all" ? { tahun_ajaran } : {}),
      ...(allowedTeachingClassIds
        ? { id: { in: [...allowedTeachingClassIds] } }
        : {}),
    }

    const [total, rows] = await Promise.all([
      teachingClassRepository.count(where),
      teachingClassRepository.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ])

    return {
      data: rows.map(toKelasMengajar),
      meta: {
        current_page: page,
        last_page: Math.max(1, Math.ceil(total / perPage)),
        per_page: perPage,
        total,
      },
    }
  },

  async getById(id: number): Promise<KelasMengajar | null> {
    const row = await teachingClassRepository.findById(id)
    return row ? toKelasMengajar(row) : null
  },

  async getByTeacher(teacherId: number): Promise<KelasMengajar[]> {
    const rows = await teachingClassRepository.findMany({
      where: { teacher_id: teacherId },
    })
    return rows.map(toKelasMengajar)
  },

  async getAssignments(): Promise<TeacherSubject[]> {
    const rows = await teachingClassRepository.findWithRelations()
    return rows.map(toTeacherSubject)
  },

  async createAssignment(
    data: TeacherSubjectCreateInput
  ): Promise<TeacherSubject> {
    let teacher: { id: number; nama_lengkap: string } | null =
      await teachingClassAssignmentRepository.getTeacherById(data.teacher_id)
    if (!teacher) {
      const user = await teachingClassAssignmentRepository.getUserById(data.teacher_id)
      if (user) {
        teacher = await teachingClassAssignmentRepository.getTeacherByUserId(user.id)
      }
    }
    if (!teacher) {
      throw new AppError(
        "Guru tidak ditemukan. Pastikan guru sudah terdaftar pada Data Guru.",
        422
      )
    }
    const subject = await teachingClassAssignmentRepository.getSubjectById(data.subject_id)
    if (!subject) {
      throw new AppError("Mata pelajaran tidak ditemukan.", 422)
    }
    const classroom = await teachingClassAssignmentRepository.getClassroomById(data.class_id)
    if (!classroom) {
      throw new AppError("Kelas tidak ditemukan.", 422)
    }
    const activeTahunAkademik = await tahunAkademikRepository.findActive()
    const tahunAjaran = activeTahunAkademik ? activeTahunAkademik.nama : "2026/2027"

    const row = await teachingClassRepository.createWithRelations({
      teacher_id: teacher.id,
      subject_id: data.subject_id,
      classroom_id: data.class_id,
      guru_nama: teacher.nama_lengkap,
      mata_pelajaran: subject.name,
      kelas: classroom.name,
      tahun_ajaran: tahunAjaran,
      semester: "Ganjil",
      status: "Aktif",
    })
    return toTeacherSubject(row)
  },

  async create(
    data: Omit<KelasMengajar, "id" | "created_at" | "updated_at">
  ): Promise<KelasMengajar> {
    const teacherId =
      data.teacher_id ?? (await getTeacherIdByName(data.guru_nama))
    const row = await teachingClassRepository.create({
      teacher_id: teacherId,
      guru_nama: data.guru_nama,
      mata_pelajaran: data.mata_pelajaran,
      kelas: data.kelas,
      tahun_ajaran: data.tahun_ajaran,
      semester: data.semester,
      status: data.status,
    })
    return toKelasMengajar(row)
  },

  async update(
    id: number,
    data: Omit<KelasMengajar, "id" | "created_at" | "updated_at">
  ): Promise<KelasMengajar | null> {
    const teacherId =
      data.teacher_id ?? (await getTeacherIdByName(data.guru_nama))
    const row = await teachingClassRepository.update(id, {
      teacher_id: teacherId,
      guru_nama: data.guru_nama,
      mata_pelajaran: data.mata_pelajaran,
      kelas: data.kelas,
      tahun_ajaran: data.tahun_ajaran,
      semester: data.semester,
      status: data.status,
    })
    return row ? toKelasMengajar(row) : null
  },

  async remove(id: number): Promise<boolean> {
    await teachingClassRepository.delete(id)
    return true
  },
}
