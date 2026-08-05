import "server-only"
import { NextRequest } from "next/server"
import { authService } from "@/services/auth.service"
import { ok, apiError, parseWithSchema } from "@/lib/api-utils"
import { z } from "zod"

const googleSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi" })
    .email("Format email tidak valid"),
  name: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  providerId: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(googleSchema, await request.json())
    const user = await authService.googleLogin({
      email: body.email,
      name: body.name,
      image: body.image,
      providerId: body.providerId,
    })
    return ok({
      user_id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    })
  } catch (error) {
    return apiError(error)
  }
}
