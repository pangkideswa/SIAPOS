import "server-only"
import { NextRequest } from "next/server"
import { assignmentService } from "@/services/assignment.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { assignmentSchema } from "@/lib/validations/assignment.schemas"
import {
  assertAssignmentAccess,
  assertTeachingClassAccess,
  requireApiUser,
} from "@/auth/api-authorization"
import type { TugasFormData } from "@/features/tugas/types/tugas"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser()
    const { id } = await context.params
    await assertAssignmentAccess(user, Number(id))
    const assignment = await assignmentService.getById(Number(id))
    if (!assignment) return notFound("Tugas tidak ditemukan")
    return ok(assignment)
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await context.params
    await assertAssignmentAccess(user, Number(id))
    const body = parseWithSchema(assignmentSchema, await request.json())
    await assertTeachingClassAccess(user, body.kelas_mengajar_id)
    const assignment = await assignmentService.update(
      Number(id),
      body as unknown as TugasFormData
    )
    return ok(assignment, "Tugas berhasil diperbarui")
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await context.params
    await assertAssignmentAccess(user, Number(id))
    await assignmentService.remove(Number(id))
    return ok(true, "Tugas berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
