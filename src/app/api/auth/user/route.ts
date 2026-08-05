import "server-only"
import { NextRequest } from "next/server"
import { authService } from "@/services/auth.service"
import { ok, apiError, unauthorized, getCurrentUserId } from "@/lib/api-utils"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request)

    if (userId) {
      const user = await authService.getUserById(userId)
      if (!user) return unauthorized()
      return ok(user)
    }

    const session = await auth()
    const sessionUserId = session?.user?.id
    if (sessionUserId) {
      const user = await authService.getUserById(Number(sessionUserId))
      if (user) return ok(user)
    }

    return unauthorized()
  } catch (error) {
    return apiError(error)
  }
}
