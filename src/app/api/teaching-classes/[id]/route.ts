import "server-only"
import { NextRequest } from "next/server"
import { teachingClassService } from "@/services/teaching-class.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { teachingClassSchema } from "@/lib/validations/teaching-class.schemas"
import {
  assertTeachingClassAccess,
  requireAdmin,
  requireApiUser,
} from "@/auth/api-authorization"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser()
    const { id } = await context.params
    await assertTeachingClassAccess(user, Number(id))
    const teachingClass = await teachingClassService.getById(Number(id))
    if (!teachingClass) return notFound("Kelas mengajar tidak ditemukan")
    return ok(teachingClass)
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
    const body = parseWithSchema(teachingClassSchema, await request.json())
    const teachingClass = await teachingClassService.update(Number(id), body)
    return ok(teachingClass, "Kelas mengajar berhasil diperbarui")
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
    await teachingClassService.remove(Number(id))
    return ok(true, "Kelas mengajar berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
