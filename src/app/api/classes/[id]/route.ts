import "server-only"
import { NextRequest } from "next/server"
import { classService } from "@/services/class.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { classroomSchema } from "@/lib/validations/classroom.schemas"
import type { ClassroomCreateInput } from "@/services/class.service"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const classroom = await classService.getById(Number(id))
    if (!classroom) return notFound("Kelas tidak ditemukan")
    return ok(classroom)
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = parseWithSchema(classroomSchema, await request.json())
    const classroom = await classService.update(
      Number(id),
      body as unknown as ClassroomCreateInput
    )
    return ok(classroom, "Kelas berhasil diperbarui")
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await classService.remove(Number(id))
    return ok(true, "Kelas berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
