import "server-only"
import { NextRequest } from "next/server"
import { studentService } from "@/services/student.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { studentSchema } from "@/lib/validations/student.schemas"
import type { SiswaFormData } from "@/features/siswa/types/siswa"

export async function GET() {
  try {
    const students = await studentService.getAll()
    return ok(students)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(studentSchema, await request.json())
    const student = await studentService.create(body as unknown as SiswaFormData)
    return created(student, "Siswa berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
