import "server-only"
import { NextRequest } from "next/server"
import { teacherService } from "@/services/teacher.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { teacherSchema } from "@/lib/validations/teacher.schemas"
import type { GuruFormData } from "@/features/guru/types/guru"

export async function GET() {
  try {
    const teachers = await teacherService.getAll()
    return ok(teachers)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(teacherSchema, await request.json())
    const teacher = await teacherService.create(body as unknown as GuruFormData)
    return created(teacher, "Guru berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
