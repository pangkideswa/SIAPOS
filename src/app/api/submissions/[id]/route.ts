import "server-only"
import { NextRequest } from "next/server"
import { submissionService } from "@/services/submission.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { gradeSubmissionSchema } from "@/lib/validations/submission.schemas"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const submission = await submissionService.getById(Number(id))
    if (!submission) return notFound("Pengumpulan tidak ditemukan")
    return ok(submission)
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
    const body = parseWithSchema(gradeSubmissionSchema, await request.json())
    const submission = await submissionService.grade(
      Number(id),
      body.nilai ?? null,
      body.feedback
    )
    return ok(submission, "Penilaian berhasil disimpan")
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
    await submissionService.remove(Number(id))
    return ok(true, "Pengumpulan berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
