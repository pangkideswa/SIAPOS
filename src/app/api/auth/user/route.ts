import "server-only"
import { authService } from "@/services/auth.service"
import { ok, apiError, unauthorized } from "@/lib/api-utils"
import { getCurrentUser } from "@/auth/session"

export async function GET() {
  try {
    const current = await getCurrentUser()
    if (!current) return unauthorized()
    const user = await authService.getUserById(current.id)
    if (!user) return unauthorized()
    return ok(user)
  } catch (error) {
    return apiError(error)
  }
}
