import "server-only"
import { requireRole } from "@/auth/guards"
import { AppError, NotFoundError } from "@/lib/api-utils"
import { prisma } from "@/lib/prisma"
import type { SessionUser } from "@/auth/session"
import type { UserRole } from "@/types/auth"

export type ApiUser = SessionUser

const AUTHENTICATED_ROLES: UserRole[] = ["super_admin", "admin", "guru", "siswa"]
const ADMIN_ROLES: UserRole[] = ["super_admin", "admin"]

export async function requireApiUser(...roles: UserRole[]): Promise<ApiUser> {
  return requireRole(...(roles.length > 0 ? roles : AUTHENTICATED_ROLES))
}

export async function requireAdmin(): Promise<ApiUser> {
  return requireRole(...ADMIN_ROLES)
}

export function isAdmin(user: ApiUser): boolean {
  return ADMIN_ROLES.includes(user.role)
}

export async function getTeacherId(user: ApiUser): Promise<number | null> {
  if (isAdmin(user)) return null
  if (user.role !== "guru") return null
  const where = {
    OR: [
      { user_id: user.id },
      ...(user.email
        ? [{ email: { equals: user.email, mode: "insensitive" as const } }]
        : []),
      ...(user.name
        ? [{ nama_lengkap: { equals: user.name, mode: "insensitive" as const } }]
        : []),
    ],
  }
  const teacher = await prisma.teacher.findFirst({
    where,
    select: { id: true },
  })
  return teacher?.id ?? null
}

export async function getTeacherProfile(user: ApiUser) {
  if (user.role !== "guru") return null
  const where = {
    OR: [
      { user_id: user.id },
      ...(user.email
        ? [{ email: { equals: user.email, mode: "insensitive" as const } }]
        : []),
      ...(user.name
        ? [{ nama_lengkap: { equals: user.name, mode: "insensitive" as const } }]
        : []),
    ],
  }
  return prisma.teacher.findFirst({
    where,
    select: { id: true, nama_lengkap: true },
  })
}

export async function getStudentId(user: ApiUser): Promise<number | null> {
  if (isAdmin(user)) return null
  if (user.role !== "siswa") return null
  const student = await prisma.student.findFirst({
    where: { user_id: user.id },
    select: { id: true },
  })
  return student?.id ?? null
}

export async function getStudentProfile(user: ApiUser) {
  if (user.role !== "siswa") return null
  return prisma.student.findFirst({
    where: { user_id: user.id },
    select: { id: true, kelas: true, classroom_id: true },
  })
}

async function requireTeacherId(user: ApiUser): Promise<number> {
  const teacherId = await getTeacherId(user)
  if (!teacherId) throw new AppError("Data guru untuk akun ini tidak ditemukan", 403)
  return teacherId
}

async function requireStudentId(user: ApiUser): Promise<number> {
  const studentId = await getStudentId(user)
  if (!studentId) throw new AppError("Data siswa untuk akun ini tidak ditemukan", 403)
  return studentId
}

export async function teachingClassWhereFor(user: ApiUser) {
  if (isAdmin(user)) return {}
  if (user.role === "guru") {
    const teacherId = await requireTeacherId(user)
    const teacher = await getTeacherProfile(user)
    return teacher?.nama_lengkap
      ? {
          OR: [
            { teacher_id: teacherId },
            { teacher_id: null, guru_nama: teacher.nama_lengkap },
          ],
        }
      : { teacher_id: teacherId }
  }
  if (user.role === "siswa") {
    const studentId = await requireStudentId(user)
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { classroom_id: true, kelas: true },
    })
    if (!student) return { kelas: "__NO_CLASS__" }
    return student.classroom_id
      ? {
          OR: [
            { classroom_id: student.classroom_id },
            { kelas: student.kelas ?? "__NO_CLASS__" },
          ],
        }
      : { kelas: student.kelas ?? "__NO_CLASS__" }
  }
  throw new AppError("Anda tidak memiliki akses ke sumber daya ini", 403)
}

export async function assertTeachingClassAccess(
  user: ApiUser,
  teachingClassId: number | null | undefined
) {
  if (isAdmin(user)) return
  if (!teachingClassId) throw new AppError("Kelas mengajar tidak valid", 403)
  const row = await prisma.teachingClass.findUnique({
    where: { id: teachingClassId },
    select: { id: true, teacher_id: true, classroom_id: true, kelas: true, guru_nama: true },
  })
  if (!row) throw new NotFoundError("Kelas mengajar tidak ditemukan")
  if (user.role === "guru") {
    const teacher = await getTeacherProfile(user)
    if (row.teacher_id != null) {
      if (row.teacher_id === teacher?.id) {
        return
      }
    }
    const allowedIds = await allowedTeachingClassIdsFor(user)
    if (allowedIds.has(teachingClassId)) {
      return
    }
    if (
      teacher?.nama_lengkap &&
      row.guru_nama &&
      row.guru_nama.toLowerCase() === teacher.nama_lengkap.toLowerCase()
    ) {
      return
    }
    throw new AppError("Anda tidak memiliki akses ke kelas ini", 403)
  }
  if (user.role === "siswa") {
    const studentId = await requireStudentId(user)
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { classroom_id: true, kelas: true },
    })
    if (
      (row.classroom_id && row.classroom_id === student?.classroom_id) ||
      (!row.classroom_id && row.kelas && student?.kelas && row.kelas.toLowerCase() === student.kelas.toLowerCase())
    ) {
      return
    }
    const allowedIds = await allowedTeachingClassIdsFor(user)
    if (allowedIds.has(teachingClassId)) {
      return
    }
  }
  throw new AppError("Anda tidak memiliki akses ke kelas ini", 403)
}

export async function assertStudentAccess(
  user: ApiUser,
  studentId: number,
  allowTeacherClassAccess = false
) {
  if (isAdmin(user)) return
  if (allowTeacherClassAccess && user.role === "guru") {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { kelas: true },
    })
    const allowedClasses = await allowedClassNamesFor(user)
    if (student?.kelas && allowedClasses.has(student.kelas)) return
    throw new AppError("Anda tidak memiliki akses ke data siswa ini", 403)
  }
  if (user.role !== "siswa") throw new AppError("Anda tidak memiliki akses ke data siswa ini", 403)
  const ownStudentId = await requireStudentId(user)
  if (studentId !== ownStudentId) {
    throw new AppError("Anda tidak memiliki akses ke data siswa ini", 403)
  }
}

export async function assertTeacherAccess(user: ApiUser, teacherId: number) {
  if (isAdmin(user)) return
  if (user.role !== "guru") throw new AppError("Anda tidak memiliki akses ke data guru ini", 403)
  const ownTeacherId = await requireTeacherId(user)
  if (teacherId !== ownTeacherId) {
    throw new AppError("Anda tidak memiliki akses ke data guru ini", 403)
  }
}

export async function assertMaterialAccess(user: ApiUser, materialId: number) {
  if (isAdmin(user)) return
  const material = await prisma.material.findUnique({
    where: { id: materialId },
    select: { teaching_class_id: true, status: true },
  })
  if (!material) throw new NotFoundError("Materi tidak ditemukan")
  await assertTeachingClassAccess(user, material.teaching_class_id)
  if (user.role === "siswa" && material.status !== "PUBLISH") {
    throw new AppError("Anda tidak memiliki akses ke materi ini", 403)
  }
}

export async function assertAssignmentAccess(user: ApiUser, assignmentId: number) {
  if (isAdmin(user)) return
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { teaching_class_id: true, status: true },
  })
  if (!assignment) throw new NotFoundError("Tugas tidak ditemukan")
  await assertTeachingClassAccess(user, assignment.teaching_class_id)
  if (user.role === "siswa" && assignment.status !== "PUBLISHED") {
    throw new AppError("Anda tidak memiliki akses ke tugas ini", 403)
  }
}

export async function assertSubmissionAccess(user: ApiUser, submissionId: number) {
  if (isAdmin(user)) return
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: {
      student_id: true,
      assignment: { select: { teaching_class_id: true } },
    },
  })
  if (!submission) throw new NotFoundError("Pengumpulan tidak ditemukan")
  if (user.role === "siswa") {
    await assertStudentAccess(user, submission.student_id ?? 0)
    return
  }
  if (user.role === "guru") {
    await assertTeachingClassAccess(user, submission.assignment?.teaching_class_id)
    return
  }
  throw new AppError("Anda tidak memiliki akses ke pengumpulan ini", 403)
}

export async function assertNilaiAccess(user: ApiUser, nilaiId: number) {
  if (isAdmin(user)) return
  const nilai = await prisma.nilai.findUnique({
    where: { id: nilaiId },
    select: { student_id: true, teaching_class_id: true },
  })
  if (!nilai) throw new NotFoundError("Nilai tidak ditemukan")
  if (user.role === "siswa") return assertStudentAccess(user, nilai.student_id ?? 0)
  if (user.role === "guru") return assertTeachingClassAccess(user, nilai.teaching_class_id)
  throw new AppError("Anda tidak memiliki akses ke nilai ini", 403)
}

export async function assertScheduleAccess(user: ApiUser, scheduleId: number) {
  if (isAdmin(user)) return
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    select: { teaching_class_id: true, guru_nama: true, kelas: true },
  })
  if (!schedule) throw new NotFoundError("Jadwal tidak ditemukan")
  if (schedule.teaching_class_id) {
    await assertTeachingClassAccess(user, schedule.teaching_class_id)
    return
  }
  if (user.role === "guru") {
    const teacher = await getTeacherProfile(user)
    if (teacher?.nama_lengkap === schedule.guru_nama) return
  }
  if (user.role === "siswa") {
    const student = await getStudentProfile(user)
    if (student?.kelas === schedule.kelas) return
  }
  throw new AppError("Anda tidak memiliki akses ke jadwal ini", 403)
}

export async function assertAttendanceSessionAccess(user: ApiUser, sessionId: number) {
  if (isAdmin(user)) return
  const session = await prisma.attendanceSession.findUnique({
    where: { id: sessionId },
    select: { teaching_class_id: true, guru_nama: true, kelas: true },
  })
  if (!session) throw new NotFoundError("Sesi absensi tidak ditemukan")
  if (session.teaching_class_id) {
    await assertTeachingClassAccess(user, session.teaching_class_id)
    return
  }
  if (user.role === "guru") {
    const teacher = await getTeacherProfile(user)
    if (teacher?.nama_lengkap === session.guru_nama) return
  }
  if (user.role === "siswa") {
    const student = await getStudentProfile(user)
    if (student?.kelas === session.kelas) return
  }
  throw new AppError("Anda tidak memiliki akses ke sesi absensi ini", 403)
}

export function filterByTeachingClassAccess<T extends { teaching_class_id?: number | null }>(
  user: ApiUser,
  rows: T[],
  allowedTeachingClassIds: Set<number>
): T[] {
  if (isAdmin(user)) return rows
  return rows.filter((row) => row.teaching_class_id && allowedTeachingClassIds.has(row.teaching_class_id))
}

export async function allowedTeachingClassIdsFor(user: ApiUser): Promise<Set<number>> {
  const where = await teachingClassWhereFor(user)
  const rows = await prisma.teachingClass.findMany({ where, select: { id: true } })
  return new Set(rows.map((row) => row.id))
}

export async function allowedClassNamesFor(user: ApiUser): Promise<Set<string>> {
  if (isAdmin(user)) {
    const rows = await prisma.classroom.findMany({ select: { name: true } })
    return new Set(rows.map((row) => row.name))
  }
  if (user.role === "guru") {
    const teacherId = await requireTeacherId(user)
    const teacher = await getTeacherProfile(user)
    const where = teacher?.nama_lengkap
      ? {
          OR: [
            { teacher_id: teacherId },
            { teacher_id: null, guru_nama: teacher.nama_lengkap },
          ],
        }
      : { teacher_id: teacherId }
    const rows = await prisma.teachingClass.findMany({
      where,
      select: { kelas: true },
    })
    return new Set(rows.map((row) => row.kelas).filter((kelas): kelas is string => !!kelas))
  }
  if (user.role === "siswa") {
    const student = await getStudentProfile(user)
    return new Set(student?.kelas ? [student.kelas] : [])
  }
  return new Set()
}

export async function allowedAssignmentIdsFor(user: ApiUser): Promise<Set<number>> {
  if (isAdmin(user)) {
    const rows = await prisma.assignment.findMany({ select: { id: true } })
    return new Set(rows.map((row) => row.id))
  }
  const teachingClassIds = await allowedTeachingClassIdsFor(user)
  const rows = await prisma.assignment.findMany({
    where: { teaching_class_id: { in: [...teachingClassIds] } },
    select: { id: true },
  })
  return new Set(rows.map((row) => row.id))
}
