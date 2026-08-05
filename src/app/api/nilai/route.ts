import "server-only"
import { NextRequest } from "next/server"
import { nilaiService } from "@/services/nilai.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { nilaiCreateSchema } from "@/lib/validations/nilai.schemas"

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get("student_id")
    const teachingClassId = request.nextUrl.searchParams.get("teaching_class_id")
    const items = studentId
      ? await nilaiService.getByStudent(Number(studentId))
      : teachingClassId
        ? await nilaiService.getByTeachingClass(Number(teachingClassId))
        : await nilaiService.getAll()
    return ok(items)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(nilaiCreateSchema, await request.json())
    const item = await nilaiService.create(body)
    return created(item, "Nilai berhasil dibuat")
  } catch (error) {
    return apiError(error, 422)
  }
}
