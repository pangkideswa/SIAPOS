import "server-only"
import { NextRequest } from "next/server"
import { authService } from "@/services/auth.service"
import { ok, apiError, parseWithSchema } from "@/lib/api-utils"
import { registerSchema } from "@/lib/validations/auth.schemas"

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(registerSchema, await request.json())
    const result = await authService.register({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
      nip: body.nip,
      nisn: body.nisn,
    })
    const response = ok(result, "Registrasi berhasil")
    response.cookies.set("token", result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  } catch (error) {
    return apiError(error, 422)
  }
}
