import "server-only"
import { NextRequest } from "next/server"
import { assignmentService } from "@/services/assignment.service"
import type { TugasLampiran } from "@/features/tugas/types/tugas"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { assignmentSchema } from "@/lib/validations/assignment.schemas"
import {
  allowedTeachingClassIdsFor,
  assertTeachingClassAccess,
  isAdmin,
  requireApiUser,
} from "@/auth/api-authorization"
import type { TugasFormData } from "@/features/tugas/types/tugas"

export async function GET() {
  try {
    const user = await requireApiUser()
    const assignments = await assignmentService.getAll()
const allowedIds = await allowedTeachingClassIdsFor(user)

const scoped = assignments
  .filter(
    (item) =>
      item.kelas_mengajar_id &&
      allowedIds.has(item.kelas_mengajar_id)
  )
  .filter(
    (item) =>
      user.role !== "siswa" || item.status === "Dipublikasikan"
  )
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
    
    // Validate storage paths
    if (body.lampiran && Array.isArray(body.lampiran)) {
       for (const lamp of (body.lampiran as unknown as TugasLampiran[])) {
          if (lamp.storage_path) {
             if (!lamp.storage_path.startsWith('assignments/temp-')) {
                return apiError(new Error(`Invalid storage path for ${lamp.nama}. Must use a temporary namespace for new assignments.`), 400)
             }
          }
       }
    }
    
    try {
      const assignment = await assignmentService.create(
        body as unknown as TugasFormData
      )
      return created(assignment, "Tugas berhasil ditambahkan")
    } catch (dbError) {
      // Orphan cleanup on DB failure
      if (body.lampiran && Array.isArray(body.lampiran)) {
         const { deleteAssignmentFileIfStorage } = await import("@/lib/storage/assignment-helper")
         for (const lamp of (body.lampiran as unknown as TugasLampiran[])) {
            if (lamp.storage_path) {
               await deleteAssignmentFileIfStorage(lamp.storage_path)
            }
         }
      }
      throw dbError
    }
  } catch (error) {
    return apiError(error, 422)
  }
}
