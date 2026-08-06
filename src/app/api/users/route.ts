import "server-only"
import { NextRequest } from "next/server"
import { userService } from "@/services/user.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { createUserSchema } from "@/lib/validations/user.schemas"
import { requireAdmin } from "@/auth/api-authorization"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    const searchParams = request.nextUrl.searchParams
    const result = await userService.getAll({
      role: searchParams.get("role") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      page: searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined,
      per_page: searchParams.get("per_page")
        ? Number(searchParams.get("per_page"))
        : undefined,
    })
    return ok(result)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = parseWithSchema(createUserSchema, await request.json())
    const user = await userService.create(body)
    return created(user, "Pengguna berhasil dibuat")
  } catch (error) {
    return apiError(error, 422)
  }
}
