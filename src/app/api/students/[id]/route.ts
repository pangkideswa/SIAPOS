import "server-only"
import { NextRequest } from "next/server"
import { studentService } from "@/services/student.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { studentSchema } from "@/lib/validations/student.schemas"
import { assertStudentAccess, requireAdmin, requireApiUser } from "@/auth/api-authorization"
import type { SiswaFormData } from "@/features/siswa/types/siswa"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "siswa")
    const { id } = await context.params
    await assertStudentAccess(user, Number(id), true)
    const student = await studentService.getById(Number(id))
    if (!student) return notFound("Siswa tidak ditemukan")
    return ok(student)
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await context.params
    const body = parseWithSchema(studentSchema, await request.json())
    const student = await studentService.update(
      Number(id),
      body as unknown as SiswaFormData
    )
    return ok(student, "Siswa berhasil diperbarui")
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await context.params
    await studentService.remove(Number(id))
    return ok(true, "Siswa berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
