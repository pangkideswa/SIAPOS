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
import type { PengumpulanTugasFormData, PengumpulanFile } from "@/features/pengumpulan/types/pengumpulan"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser()
    const assignmentId = request.nextUrl.searchParams.get("assignment_id")
    if (assignmentId) await assertAssignmentAccess(user, Number(assignmentId))
    const submissions = assignmentId
      ? await submissionService.getByAssignment(Number(assignmentId))
      : await submissionService.getAll()
    const studentId = await getStudentId(user)
    if (isAdmin(user)) return ok(submissions)
    if (assignmentId && user.role === "siswa") {
      return ok(submissions.filter((item) => item.siswa_id === studentId))
    }
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
    
    const sessionStudentId = await getStudentId(user)
    const effectiveStudentId = user.role === "siswa" ? sessionStudentId : body.student_id

    if (!effectiveStudentId) {
      return apiError(new Error("Student ID is required"), 400)
    }

    if (user.role === "siswa") {
      await assertStudentAccess(user, body.student_id)
    }
    await assertAssignmentAccess(user, body.assignment_id)

    // Verify storage_path ownership
    const fileJawaban = body.data?.file_jawaban as unknown as PengumpulanFile | undefined
    if (fileJawaban?.storage_path) {
      const expectedPrefix = `submissions/${effectiveStudentId}/${body.assignment_id}/`
      if (!fileJawaban.storage_path.startsWith(expectedPrefix)) {
        return apiError(new Error("Invalid storage path namespace. Possible IDOR attempt."), 400)
      }
    }

    const existingRows = await submissionService.getByAssignment(body.assignment_id)
    const existingSubmission = existingRows.find(r => r.siswa_id === effectiveStudentId)
    
    let submission
    let oldStoragePath = null

    try {
      if (existingSubmission) {
        oldStoragePath = (existingSubmission.file_jawaban as unknown as PengumpulanFile)?.storage_path
        submission = await submissionService.resubmit(
          existingSubmission.id,
          body.data! as unknown as PengumpulanTugasFormData
        )
      } else {
        submission = await submissionService.create(
          body.data! as unknown as PengumpulanTugasFormData,
          body.assignment_id,
          effectiveStudentId
        )
      }
    } catch (dbError) {
      if (fileJawaban?.storage_path && (!oldStoragePath || oldStoragePath !== fileJawaban.storage_path)) {
         try {
            const { deleteSubmissionFileIfStorage } = await import("@/lib/storage/submission-helper")
            await deleteSubmissionFileIfStorage(fileJawaban.storage_path)
         } catch (cleanupError) {
            console.error("Failed to cleanup orphaned new submission file after DB error:", cleanupError)
         }
      }
      throw dbError
    }

    // Cleanup old file safely after DB success
    if (oldStoragePath && oldStoragePath !== fileJawaban?.storage_path) {
       try {
          const { deleteSubmissionFileIfStorage } = await import("@/lib/storage/submission-helper")
          await deleteSubmissionFileIfStorage(oldStoragePath)
       } catch (e) {
          console.error("Failed to cleanup old submission file:", e)
       }
    }

    return created(submission, "Pengumpulan berhasil")
  } catch (error) {
    return apiError(error, 422)
  }
}
