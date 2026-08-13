import "server-only"
import { NextRequest } from "next/server"
import { studentService } from "@/services/student.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { studentSchema } from "@/lib/validations/student.schemas"
import { assertStudentAccess, requireAdmin, requireApiUser } from "@/auth/api-authorization"
import type { SiswaFormData } from "@/features/siswa/types/siswa"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "siswa")
    const { id } = await context.params
    await assertStudentAccess(user, Number(id), true)
    const student = await studentService.getById(Number(id))
    if (!student) return notFound("Siswa tidak ditemukan")
    return ok(student)
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await context.params
    const body = parseWithSchema(studentSchema, await request.json()) as unknown as SiswaFormData
    
    const oldStudent = await studentService.getById(Number(id))
    
    if (body.foto && !body.foto.startsWith('http') && body.foto !== oldStudent?.foto) {
      const { assertValidAvatarPath } = await import("@/lib/storage/path-validator")
      if (!assertValidAvatarPath(body.foto, 'students', Number(id))) {
         return apiError(new Error("Invalid avatar storage path. Namespace mismatch."), 400)
      }
    }

    try {
      const student = await studentService.update(
        Number(id),
        body
      )
      
      if (body.foto !== oldStudent?.foto && oldStudent?.foto) {
        const { deleteAvatarIfFromStorage } = await import("@/lib/storage/avatar-helper")
        const { BUCKETS } = await import("@/lib/storage/supabase-server")
        await deleteAvatarIfFromStorage(oldStudent.foto, BUCKETS.AVATARS)
      }
      return ok(student, "Siswa berhasil diperbarui")
    } catch (dbError) {
      if (body.foto && !body.foto.startsWith('http') && body.foto !== oldStudent?.foto) {
        const { deleteAvatarIfFromStorage } = await import("@/lib/storage/avatar-helper")
        const { BUCKETS } = await import("@/lib/storage/supabase-server")
        await deleteAvatarIfFromStorage(body.foto, BUCKETS.AVATARS)
      }
      throw dbError
    }
  } catch (error: unknown) {
    const msg = error instanceof Error && error.message.includes("exceeds") ? error.message : undefined
    return apiError(msg ? new Error(msg) : error)
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await context.params
    
    // --- PHASE 3: CLEANUP AVATAR ---
    const oldStudent = await studentService.getById(Number(id))
    if (oldStudent?.foto) {
      const { deleteAvatarIfFromStorage } = await import("@/lib/storage/avatar-helper")
      const { BUCKETS } = await import("@/lib/storage/supabase-server")
      await deleteAvatarIfFromStorage(oldStudent.foto, BUCKETS.AVATARS)
    }
    // -------------------------------

    await studentService.remove(Number(id))
    return ok(true, "Siswa berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
