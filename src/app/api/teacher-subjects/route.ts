import "server-only"
import { NextRequest } from "next/server"
import { teachingClassService } from "@/services/teaching-class.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { teacherSubjectAssignmentSchema } from "@/lib/validations/teaching-class.schemas"

export async function GET() {
  try {
    const assignments = await teachingClassService.getAssignments()
    return ok(assignments)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(
      teacherSubjectAssignmentSchema,
      await request.json()
    )
    const assignment = await teachingClassService.createAssignment(body)
    return created(assignment, "Penugasan guru berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
