import "server-only"
import { NextRequest } from "next/server"
import { teacherService } from "@/services/teacher.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { teacherSchema } from "@/lib/validations/teacher.schemas"
import { assertTeacherAccess, requireAdmin, requireApiUser } from "@/auth/api-authorization"
import type { GuruFormData } from "@/features/guru/types/guru"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await context.params
    await assertTeacherAccess(user, Number(id))
    const teacher = await teacherService.getById(Number(id))
    if (!teacher) return notFound("Guru tidak ditemukan")
    return ok(teacher)
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
    const body = parseWithSchema(teacherSchema, await request.json())
    const teacher = await teacherService.update(
      Number(id),
      body as unknown as GuruFormData
    )
    return ok(teacher, "Guru berhasil diperbarui")
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
    await teacherService.remove(Number(id))
    return ok(true, "Guru berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
