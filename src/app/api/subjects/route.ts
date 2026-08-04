import "server-only"
import { NextRequest } from "next/server"
import { subjectService } from "@/services/subject.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { subjectSchema } from "@/lib/validations/subject.schemas"
import type { SubjectCreateInput } from "@/services/subject.service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subjects = await subjectService.getAll({
      search: searchParams.get("search") ?? undefined,
      is_active: searchParams.get("is_active")
        ? searchParams.get("is_active") === "true"
        : undefined,
      page: searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined,
      per_page: searchParams.get("per_page")
        ? Number(searchParams.get("per_page"))
        : undefined,
    })
    return ok(subjects)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(subjectSchema, await request.json())
    const subject = await subjectService.create(
      body as unknown as SubjectCreateInput
    )
    return created(subject, "Mata pelajaran berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
