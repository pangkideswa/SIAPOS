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
import { changePasswordSchema } from "@/lib/validations/auth.schemas"

export async function POST(request: NextRequest) {
  try {
    const current = await getCurrentUser()
    if (!current) return unauthorized()
    const body = parseWithSchema(changePasswordSchema, await request.json())
    await authService.changePassword(
      current.id,
      body.old_password,
      body.new_password
    )
    return ok(true, "Password berhasil diubah")
  } catch (error) {
    return apiError(error, 400)
  }
}
