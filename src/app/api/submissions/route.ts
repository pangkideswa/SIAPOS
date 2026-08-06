import "server-only"
import { NextRequest } from "next/server"
import { submissionService } from "@/services/submission.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { submissionCreateSchema } from "@/lib/validations/submission.schemas"
import {
  allowedAssignmentIdsFor,
  assertAssignmentAccess,
  assertStudentAccess,
  getStudentId,
  isAdmin,
  requireApiUser,
} from "@/auth/api-authorization"
import type { PengumpulanTugasFormData } from "@/features/pengumpulan/types/pengumpulan"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser()
    const assignmentId = request.nextUrl.searchParams.get("assignment_id")
    if (assignmentId) await assertAssignmentAccess(user, Number(assignmentId))
    const submissions = assignmentId
      ? await submissionService.getByAssignment(Number(assignmentId))
      : await submissionService.getAll()
    if (isAdmin(user) || assignmentId) return ok(submissions)
    const studentId = await getStudentId(user)
    const allowedAssignmentIds = await allowedAssignmentIdsFor(user)
    const scoped = user.role === "siswa"
      ? submissions.filter((item) => item.siswa_id === studentId)
      : submissions.filter((item) => allowedAssignmentIds.has(item.tugas_id))
    return ok(scoped)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "siswa")
    const body = parseWithSchema(submissionCreateSchema, await request.json())
    if (user.role === "siswa") {
      await assertStudentAccess(user, body.student_id)
    }
    await assertAssignmentAccess(user, body.assignment_id)
    const submission = await submissionService.create(
      body.data as unknown as PengumpulanTugasFormData,
      body.assignment_id,
      body.student_id
    )
    return created(submission, "Pengumpulan berhasil")
  } catch (error) {
    return apiError(error, 422)
  }
}
