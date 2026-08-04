import "server-only"
import { NextRequest } from "next/server"
import { classService } from "@/services/class.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { classroomSchema } from "@/lib/validations/classroom.schemas"
import type { ClassroomCreateInput } from "@/services/class.service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const classes = await classService.getAll({
      search: searchParams.get("search") ?? undefined,
      grade_level: searchParams.get("grade_level") ?? undefined,
      page: searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined,
      per_page: searchParams.get("per_page")
        ? Number(searchParams.get("per_page"))
        : undefined,
    })
    return ok(classes)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(classroomSchema, await request.json())
    const classroom = await classService.create(
      body as unknown as ClassroomCreateInput
    )
    return created(classroom, "Kelas berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
