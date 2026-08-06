import "server-only"
import { NextRequest } from "next/server"
import { jurusanService } from "@/services/jurusan.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { jurusanSchema } from "@/lib/validations/jurusan.schemas"
import { requireRole } from "@/auth/guards"
import type { JurusanCreateInput } from "@/services/jurusan.service"

export async function GET(request: NextRequest) {
  try {
    await requireRole("super_admin", "admin")
    const searchParams = request.nextUrl.searchParams
    const isActive = searchParams.get("is_active")
    const jurusans = await jurusanService.getAll({
      search: searchParams.get("search") ?? undefined,
      is_active:
        isActive === "true" || isActive === "false"
          ? isActive === "true"
          : undefined,
      page: searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined,
      per_page: searchParams.get("per_page")
        ? Number(searchParams.get("per_page"))
        : undefined,
    })
    return ok(jurusans)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole("super_admin", "admin")
    const body = parseWithSchema(jurusanSchema, await request.json())
    const jurusan = await jurusanService.create(
      body as unknown as JurusanCreateInput
    )
    return created(jurusan, "Jurusan berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
