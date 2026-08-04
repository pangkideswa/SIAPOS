import "server-only"
import { NextRequest } from "next/server"
import { authService } from "@/services/auth.service"
import { ok, apiError, unauthorized, getCurrentUserId } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request)
    if (!userId) return unauthorized()
    const user = await authService.getUserById(userId)
    if (!user) return unauthorized()
    return ok(user)
  } catch (error) {
    return apiError(error)
  }
}
