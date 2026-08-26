import "server-only"
import { NextRequest } from "next/server"
import { submissionService } from "@/services/submission.service"
import { prisma } from "@/lib/prisma"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { gradeSubmissionSchema } from "@/lib/validations/submission.schemas"
import {
  assertSubmissionAccess,
  requireApiUser,
} from "@/auth/api-authorization"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser()
    const { id } = await context.params
    await assertSubmissionAccess(user, Number(id))
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
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await context.params
    await assertSubmissionAccess(user, Number(id))
    const body = parseWithSchema(gradeSubmissionSchema, await request.json())
    
    // Validasi nilai_maksimal
    const existing = await submissionService.getById(Number(id))
    if (!existing) return notFound("Pengumpulan tidak ditemukan")
    
    const assignment = await prisma.assignment.findUnique({
      where: { id: existing.tugas_id },
      select: { nilai_maksimal: true }
    })
    
    if (assignment && body.nilai != null && body.nilai > assignment.nilai_maksimal) {
      return apiError(new Error(`Nilai tidak boleh melebihi nilai maksimal (${assignment.nilai_maksimal})`), 400)
    }

    const submission = await submissionService.grade(
      Number(id),
      body.nilai ?? null,
      body.feedback,
      body.allow_resubmit ?? false
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
    const user = await requireApiUser("super_admin", "admin", "siswa")
    const { id } = await context.params
    await assertSubmissionAccess(user, Number(id))
    const submission = await submissionService.getById(Number(id))
    if (!submission) return notFound("Pengumpulan tidak ditemukan")
    
    if (submission.nilai !== null) {
      return apiError(new Error("Tugas yang sudah dinilai tidak dapat dihapus"), 400)
    }
    
    const storagePath = submission.file_jawaban?.storage_path

    await submissionService.remove(Number(id))
    
    // Cleanup file from storage
    if (storagePath) {
       try {
          const { deleteSubmissionFileIfStorage } = await import("@/lib/storage/submission-helper")
          await deleteSubmissionFileIfStorage(storagePath)
       } catch (e) {
          console.error("Failed to delete submission file from storage:", e)
       }
    }

    return ok(true, "Pengumpulan berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
