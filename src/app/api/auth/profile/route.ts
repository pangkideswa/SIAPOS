import "server-only"
import { NextRequest } from "next/server"
import { authService } from "@/services/auth.service"
import {
  ok,
  apiError,
  unauthorized,
  parseWithSchema,
} from "@/lib/api-utils"
import { getCurrentUser } from "@/auth/session"
import { updateProfileSchema } from "@/lib/validations/auth.schemas"

export async function GET() {
  try {
    const current = await getCurrentUser()
    if (!current) return unauthorized()
    let teacherId: number | null = null
    if (current.role === "guru") {
      const teacher = await import("@/lib/prisma").then(m => m.prisma.teacher.findUnique({
        where: { user_id: current.id },
        select: { id: true, nama_lengkap: true }
      }))
      teacherId = teacher?.id ?? null
    }
    return ok({
      id: current.id,
      role: current.role,
      name: current.name,
      email: current.email,
      teacher_id: teacherId,
    })
  } catch (error) {
    return apiError(error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const current = await getCurrentUser()
    if (!current) return unauthorized()
    const body = parseWithSchema(updateProfileSchema, await request.json())
    const user = await authService.updateProfile(current.id, body)
    return ok(user, "Profil berhasil diperbarui")
  } catch (error) {
    return apiError(error, 422)
  }
}
