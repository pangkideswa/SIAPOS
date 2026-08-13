import "server-only"
import { NextRequest } from "next/server"
import { studentService } from "@/services/student.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { studentSchema } from "@/lib/validations/student.schemas"
import { allowedClassNamesFor, getStudentProfile, isAdmin, requireAdmin, requireApiUser } from "@/auth/api-authorization"
import type { SiswaFormData } from "@/features/siswa/types/siswa"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser()
    const searchParams = request.nextUrl.searchParams
    const hasFilters = [
      "search",
      "jurusan_id",
      "kelas",
      "status",
      "page",
      "per_page",
    ].some((key) => searchParams.has(key))

    if (!hasFilters) {
      const students = await studentService.getAll()
      if (isAdmin(user)) return ok(students)
      const student = await getStudentProfile(user)
      if (user.role === "siswa") {
        return ok(student ? students.filter((item) => item.id === student.id) : [])
      }
      const allowedClasses = await allowedClassNamesFor(user)
      return ok(students.filter((item) => allowedClasses.has(item.kelas)))
    }

    const jurusanId = searchParams.get("jurusan_id")
    const allowedClasses = isAdmin(user) ? undefined : await allowedClassNamesFor(user)
    const students = await studentService.getAllPaginated(
      {
        search: searchParams.get("search") ?? undefined,
        jurusan_id:
          jurusanId !== null && jurusanId !== "" && !Number.isNaN(Number(jurusanId))
            ? Number(jurusanId)
            : undefined,
        kelas: searchParams.get("kelas") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        page: searchParams.get("page")
          ? Number(searchParams.get("page"))
          : undefined,
        per_page: searchParams.get("per_page")
          ? Number(searchParams.get("per_page"))
          : undefined,
      },
      allowedClasses
    )
    if (!isAdmin(user)) {
      const student = await getStudentProfile(user)
      if (user.role === "siswa") {
        return ok({
          ...students,
          data: student ? students.data.filter((item) => item.id === student.id) : [],
        })
      }
      return ok(students)
    }
    return ok(students)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = parseWithSchema(studentSchema, await request.json()) as unknown as SiswaFormData
    
    if (body.foto && !body.foto.startsWith('http')) {
      const { assertValidAvatarPath } = await import("@/lib/storage/path-validator")
      if (!assertValidAvatarPath(body.foto, 'students')) {
         return apiError(new Error("Invalid avatar storage path"), 400)
      }
    }

    try {
      const student = await studentService.create(body)
      return created(student, "Siswa berhasil ditambahkan")
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
