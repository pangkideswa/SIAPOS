import "server-only"
import { NextRequest } from "next/server"
import { tahunAkademikService } from "@/services/tahun-akademik.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { tahunAkademikSchema } from "@/lib/validations/tahun-akademik.schemas"
import { requireRole } from "@/auth/guards"
import type { TahunAkademikCreateInput } from "@/services/tahun-akademik.service"

export async function GET(request: NextRequest) {
  try {
    await requireRole("super_admin", "admin")
    const searchParams = request.nextUrl.searchParams
    const hasFilters = ["search", "is_active", "page", "per_page"].some((key) =>
      searchParams.has(key)
    )

    if (!hasFilters) {
      const tahunAkademik = await tahunAkademikService.getAll()
      return ok(tahunAkademik)
    }

    const isActive = searchParams.get("is_active")
    const result = await tahunAkademikService.getAllPaginated({
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
    return ok(result)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole("super_admin", "admin")
    const body = parseWithSchema(tahunAkademikSchema, await request.json())
    const tahunAkademik = await tahunAkademikService.create(
      body as unknown as TahunAkademikCreateInput
    )
    return created(tahunAkademik, "Tahun akademik berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
