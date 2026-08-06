import "server-only"
import { NextRequest } from "next/server"
import { assignmentService } from "@/services/assignment.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { assignmentSchema } from "@/lib/validations/assignment.schemas"
import {
  allowedTeachingClassIdsFor,
  assertTeachingClassAccess,
  filterByTeachingClassAccess,
  isAdmin,
  requireApiUser,
} from "@/auth/api-authorization"
import type { TugasFormData } from "@/features/tugas/types/tugas"

export async function GET() {
  try {
    const user = await requireApiUser()
    const assignments = await assignmentService.getAll()
    const allowedIds = await allowedTeachingClassIdsFor(user)
    const scoped = filterByTeachingClassAccess(user, assignments, allowedIds)
      .filter((item) => user.role !== "siswa" || item.status === "Dipublikasikan")
    return ok(isAdmin(user) ? assignments : scoped)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const body = parseWithSchema(assignmentSchema, await request.json())
    await assertTeachingClassAccess(user, body.kelas_mengajar_id)
    const assignment = await assignmentService.create(
      body as unknown as TugasFormData
    )
    return created(assignment, "Tugas berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
