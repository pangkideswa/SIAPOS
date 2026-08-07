import "server-only"
import { NextRequest } from "next/server"
import { nilaiService } from "@/services/nilai.service"
import { AppError, ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { nilaiCreateSchema } from "@/lib/validations/nilai.schemas"
import {
  allowedTeachingClassIdsFor,
  assertStudentAccess,
  assertTeachingClassAccess,
  getStudentId,
  isAdmin,
  requireApiUser,
} from "@/auth/api-authorization"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser()
    const studentId = request.nextUrl.searchParams.get("student_id")
    const teachingClassId = request.nextUrl.searchParams.get("teaching_class_id")
    if (studentId) await assertStudentAccess(user, Number(studentId), true)
    if (teachingClassId) {
      if (user.role === "siswa") {
        throw new AppError("Anda tidak memiliki akses ke data nilai ini", 403)
      }
      await assertTeachingClassAccess(user, Number(teachingClassId))
    }
    const items = studentId
      ? await nilaiService.getByStudent(Number(studentId))
      : teachingClassId
        ? await nilaiService.getByTeachingClass(Number(teachingClassId))
        : await nilaiService.getAll()
    if (isAdmin(user)) return ok(items)
    if (user.role === "siswa") {
      const ownStudentId = await getStudentId(user)
      return ok(items.filter((item) => item.siswa_id === ownStudentId))
    }
    const allowedIds = await allowedTeachingClassIdsFor(user)
    return ok(items.filter((item) => item.kelas_mengajar_id && allowedIds.has(item.kelas_mengajar_id)))
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const body = parseWithSchema(nilaiCreateSchema, await request.json())
    await assertStudentAccess(user, body.student_id, true)
    await assertTeachingClassAccess(user, body.teaching_class_id)
    const item = await nilaiService.create(body)
    return created(item, "Nilai berhasil dibuat")
  } catch (error) {
    return apiError(error, 422)
  }
}
