import "server-only"
import { NextRequest } from "next/server"
import { teachingClassService } from "@/services/teaching-class.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { teachingClassSchema } from "@/lib/validations/teaching-class.schemas"

export async function GET() {
  try {
    const teachingClasses = await teachingClassService.getAll()
    return ok(teachingClasses)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(teachingClassSchema, await request.json())
    const teachingClass = await teachingClassService.create(body)
    return created(teachingClass, "Kelas mengajar berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
