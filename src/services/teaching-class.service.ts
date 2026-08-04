import "server-only"
import { teachingClassRepository, teachingClassAssignmentRepository } from "@/repositories/teaching-class.repository"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"
import type { TeacherSubject, User, Subject, SchoolClass } from "@/types"

export interface TeacherSubjectCreateInput {
  teacher_id: number
  subject_id: number
  class_id: number
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
    nip: row.nip,
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
    const user = await teachingClassAssignmentRepository.getUserById(data.teacher_id)
    const teacher = user
      ? await teachingClassAssignmentRepository.getTeacherByUserId(user.id)
      : null
    const subject = await teachingClassAssignmentRepository.getSubjectById(data.subject_id)
    const classroom = await teachingClassAssignmentRepository.getClassroomById(data.class_id)
    const row = await teachingClassRepository.createWithRelations({
      teacher_id: teacher?.id ?? null,
      subject_id: data.subject_id,
      classroom_id: data.class_id,
      guru_nama: teacher?.nama_lengkap ?? user?.name ?? "",
      mata_pelajaran: subject?.name ?? "",
      kelas: classroom?.name ?? "",
      tahun_ajaran: "2026/2027",
      semester: "Ganjil",
      status: "Aktif",
    })
    return toTeacherSubject(row)
  },

  async create(
    data: Omit<KelasMengajar, "id" | "created_at" | "updated_at">
  ): Promise<KelasMengajar> {
    const row = await teachingClassRepository.create({
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
    const row = await teachingClassRepository.update(id, {
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
