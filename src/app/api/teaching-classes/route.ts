import "server-only"
import { NextRequest } from "next/server"
import { teachingClassService } from "@/services/teaching-class.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { teachingClassSchema } from "@/lib/validations/teaching-class.schemas"
import {
  allowedTeachingClassIdsFor,
  isAdmin,
  requireAdmin,
  requireApiUser,
} from "@/auth/api-authorization"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser()
    const searchParams = request.nextUrl.searchParams
    const hasFilters = [
      "search",
      "guru",
      "kelas",
      "tahun_ajaran",
      "page",
      "per_page",
    ].some((key) => searchParams.has(key))

    if (!hasFilters) {
      const teachingClasses = await teachingClassService.getAll()
      if (isAdmin(user)) return ok(teachingClasses)
      const allowedIds = await allowedTeachingClassIdsFor(user)
      return ok(teachingClasses.filter((item) => allowedIds.has(item.id)))
    }

    const filters = {
      search: searchParams.get("search") || undefined,
      guru: searchParams.get("guru") || undefined,
      kelas: searchParams.get("kelas") || undefined,
      tahun_ajaran: searchParams.get("tahun_ajaran") || undefined,
      page: searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined,
      per_page: searchParams.get("per_page")
        ? Number(searchParams.get("per_page"))
        : undefined,
    }
    const allowedIds = isAdmin(user)
      ? undefined
      : await allowedTeachingClassIdsFor(user)
    const result = await teachingClassService.getAllPaginated(filters, allowedIds)
    return ok(result)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = parseWithSchema(teachingClassSchema, await request.json())
    const teachingClass = await teachingClassService.create(body)
    return created(teachingClass, "Kelas mengajar berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
