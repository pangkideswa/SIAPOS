import "server-only"
import { NextRequest } from "next/server"
import { authService } from "@/services/auth.service"
import { ok, apiError, parseWithSchema } from "@/lib/api-utils"
import { registerSchema } from "@/lib/validations/auth.schemas"

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(registerSchema, await request.json())
    const user = await authService.register({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
      nip: body.nip,
      nisn: body.nisn,
    })
    return ok(user, "Registrasi berhasil")
  } catch (error) {
    return apiError(error, 422)
  }
}
