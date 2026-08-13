import "server-only"
import { NextRequest } from "next/server"
import { teacherService } from "@/services/teacher.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { teacherSchema } from "@/lib/validations/teacher.schemas"
import { assertTeacherAccess, requireAdmin, requireApiUser } from "@/auth/api-authorization"
import type { GuruFormData } from "@/features/guru/types/guru"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await context.params
    await assertTeacherAccess(user, Number(id))
    const teacher = await teacherService.getById(Number(id))
    if (!teacher) return notFound("Guru tidak ditemukan")
    return ok(teacher)
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
    const body = parseWithSchema(teacherSchema, await request.json()) as unknown as GuruFormData
    
    const oldTeacher = await teacherService.getById(Number(id))
    
    if (body.foto && !body.foto.startsWith('http') && body.foto !== oldTeacher?.foto) {
      const { assertValidAvatarPath } = await import("@/lib/storage/path-validator")
      if (!assertValidAvatarPath(body.foto, 'teachers', Number(id))) {
         return apiError(new Error("Invalid avatar storage path. Namespace mismatch."), 400)
      }
    }

    try {
      const teacher = await teacherService.update(
        Number(id),
        body
      )
      
      if (body.foto !== oldTeacher?.foto && oldTeacher?.foto) {
        const { deleteAvatarIfFromStorage } = await import("@/lib/storage/avatar-helper")
        const { BUCKETS } = await import("@/lib/storage/supabase-server")
        await deleteAvatarIfFromStorage(oldTeacher.foto, BUCKETS.AVATARS)
      }
      return ok(teacher, "Guru berhasil diperbarui")
    } catch (dbError) {
      if (body.foto && !body.foto.startsWith('http') && body.foto !== oldTeacher?.foto) {
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
    const oldTeacher = await teacherService.getById(Number(id))
    if (oldTeacher?.foto) {
      const { deleteAvatarIfFromStorage } = await import("@/lib/storage/avatar-helper")
      const { BUCKETS } = await import("@/lib/storage/supabase-server")
      await deleteAvatarIfFromStorage(oldTeacher.foto, BUCKETS.AVATARS)
    }
    // -------------------------------

    await teacherService.remove(Number(id))
    return ok(true, "Guru berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
