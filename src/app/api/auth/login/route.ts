import "server-only"
import { NextRequest } from "next/server"
import { authService } from "@/services/auth.service"
import { ok, apiError, parseWithSchema } from "@/lib/api-utils"
import { loginSchema } from "@/lib/validations/auth.schemas"

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(loginSchema, await request.json())
    const result = await authService.login(body.identifier, body.password)
    const response = ok(result, "Login berhasil")
    response.cookies.set("token", result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  } catch (error) {
    return apiError(error, 401)
  }
}
