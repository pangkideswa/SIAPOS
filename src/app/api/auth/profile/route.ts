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
