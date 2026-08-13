import "server-only"
import { NextRequest } from "next/server"
import { assignmentService } from "@/services/assignment.service"
import type { TugasLampiran } from "@/features/tugas/types/tugas"
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
    
    // --- PHASE 5: CLEANUP PROCESS ---
    const { deleteAssignmentFileIfStorage } = await import("@/lib/storage/assignment-helper")
    const oldAssignment = await assignmentService.getById(Number(id))
    
    if (body.lampiran && Array.isArray(body.lampiran)) {
       // Validate new paths
       for (const lamp of (body.lampiran as unknown as TugasLampiran[])) {
          if (lamp.storage_path) {
             const validPrefix = `assignments/${id}/`
             const validTempPrefix = `assignments/temp-`
             if (!lamp.storage_path.startsWith(validPrefix) && !lamp.storage_path.startsWith(validTempPrefix)) {
                return apiError(new Error(`Invalid storage path for ${lamp.nama}. Namespace mismatch.`), 400)
             }
          }
       }
       
       // Check for deleted lampiran
       if (oldAssignment?.lampiran && Array.isArray(oldAssignment.lampiran)) {
          const newIds = (body.lampiran as unknown as TugasLampiran[]).map((l) => l.id)
          for (const oldLamp of (oldAssignment.lampiran as unknown as TugasLampiran[])) {
             if (!newIds.includes(oldLamp.id)) {
                // Was deleted, so delete from storage
                const toDelete = oldLamp.storage_path || oldLamp.url
                if (toDelete) {
                   await deleteAssignmentFileIfStorage(toDelete).catch(e => {
                      console.error(`Failed to delete old attachment: ${toDelete}`, e)
                   })
                }
             }
          }
       }
    }
    // -----------------------------------------

    try {
      const assignment = await assignmentService.update(
        Number(id),
        body as unknown as TugasFormData
      )
      return ok(assignment, "Tugas berhasil diperbarui")
    } catch (dbError) {
      // Orphan cleanup on DB failure
      if (body.lampiran && Array.isArray(body.lampiran)) {
         const oldPaths = (oldAssignment?.lampiran as unknown as TugasLampiran[])?.map(l => l.storage_path || l.url) || []
         for (const lamp of (body.lampiran as unknown as TugasLampiran[])) {
            if (lamp.storage_path && !oldPaths.includes(lamp.storage_path)) {
               await deleteAssignmentFileIfStorage(lamp.storage_path).catch(e => {
                  console.error(`Failed to delete new attachment on DB failure: ${lamp.storage_path}`, e)
               })
            }
         }
      }
      throw dbError
    }
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
    const assignment = await assignmentService.getById(Number(id))
    
    await assignmentService.remove(Number(id))
    
    // Cleanup storage files
    if (assignment?.lampiran && Array.isArray(assignment.lampiran)) {
       const { deleteAssignmentFileIfStorage } = await import("@/lib/storage/assignment-helper")
       for (const lamp of (assignment.lampiran as unknown as TugasLampiran[])) {
          const toDelete = lamp.storage_path || lamp.url
          if (toDelete) {
             await deleteAssignmentFileIfStorage(toDelete).catch(e => {
                console.error(`Failed to delete attachment on delete assignment: ${toDelete}`, e)
             })
          }
       }
    }
    
    return ok(true, "Tugas berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
