import "server-only"
import { NextRequest } from "next/server"
import { submissionService } from "@/services/submission.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { submissionCreateSchema } from "@/lib/validations/submission.schemas"
import type { PengumpulanTugasFormData } from "@/features/pengumpulan/types/pengumpulan"

export async function GET(request: NextRequest) {
  try {
    const assignmentId = request.nextUrl.searchParams.get("assignment_id")
    const submissions = assignmentId
      ? await submissionService.getByAssignment(Number(assignmentId))
      : await submissionService.getAll()
    return ok(submissions)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(submissionCreateSchema, await request.json())
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
