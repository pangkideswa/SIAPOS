import "server-only"
import { NextRequest } from "next/server"
import { teacherService } from "@/services/teacher.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { teacherSchema } from "@/lib/validations/teacher.schemas"
import { getTeacherProfile, isAdmin, requireAdmin, requireApiUser } from "@/auth/api-authorization"
import type { GuruFormData } from "@/features/guru/types/guru"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser()
    const searchParams = request.nextUrl.searchParams
    const hasFilters = [
      "search",
      "status_kepegawaian",
      "jenis_kelamin",
      "page",
      "per_page",
    ].some((key) => searchParams.has(key))

    if (!hasFilters) {
      const teachers = await teacherService.getAll()
      if (isAdmin(user)) return ok(teachers)
      const teacher = await getTeacherProfile(user)
      return ok(teacher ? teachers.filter((item) => item.id === teacher.id) : [])
    }

    const teachers = await teacherService.getAllPaginated({
      search: searchParams.get("search") ?? undefined,
      status_kepegawaian:
        searchParams.get("status_kepegawaian") ?? undefined,
      jenis_kelamin: searchParams.get("jenis_kelamin") ?? undefined,
      page: searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined,
      per_page: searchParams.get("per_page")
        ? Number(searchParams.get("per_page"))
        : undefined,
    })
    if (!isAdmin(user)) {
      const teacher = await getTeacherProfile(user)
      return ok({ ...teachers, data: teacher ? teachers.data.filter((item) => item.id === teacher.id) : [] })
    }
    return ok(teachers)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = parseWithSchema(teacherSchema, await request.json()) as unknown as GuruFormData
    
    if (body.foto && !body.foto.startsWith('http')) {
      const { assertValidAvatarPath } = await import("@/lib/storage/path-validator")
      if (!assertValidAvatarPath(body.foto, 'teachers')) {
         return apiError(new Error("Invalid avatar storage path"), 400)
      }
    }

    try {
      const teacher = await teacherService.create(body)
      return created(teacher, "Guru berhasil ditambahkan")
    } catch (dbError) {
      if (body.foto && !body.foto.startsWith('http')) {
         const { deleteAvatarIfFromStorage } = await import("@/lib/storage/avatar-helper")
         const { BUCKETS } = await import("@/lib/storage/supabase-server")
         await deleteAvatarIfFromStorage(body.foto, BUCKETS.AVATARS)
      }
      throw dbError
    }
  } catch (error: unknown) {
    const msg = error instanceof Error && error.message.includes("exceeds") ? error.message : undefined
    return apiError(msg ? new Error(msg) : error, 422)
  }
}
