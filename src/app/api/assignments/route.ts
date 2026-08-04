import "server-only"
import { NextRequest } from "next/server"
import { assignmentService } from "@/services/assignment.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { assignmentSchema } from "@/lib/validations/assignment.schemas"
import type { TugasFormData } from "@/features/tugas/types/tugas"

export async function GET() {
  try {
    const assignments = await assignmentService.getAll()
    return ok(assignments)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(assignmentSchema, await request.json())
    const assignment = await assignmentService.create(
      body as unknown as TugasFormData
    )
    return created(assignment, "Tugas berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
