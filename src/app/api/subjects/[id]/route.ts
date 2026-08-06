import "server-only"
import { NextRequest } from "next/server"
import { subjectService } from "@/services/subject.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { subjectSchema } from "@/lib/validations/subject.schemas"
import { requireAdmin, requireApiUser } from "@/auth/api-authorization"
import type { SubjectCreateInput } from "@/services/subject.service"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireApiUser()
    const { id } = await context.params
    const subject = await subjectService.getById(Number(id))
    if (!subject) return notFound("Mata pelajaran tidak ditemukan")
    return ok(subject)
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await context.params
    const body = parseWithSchema(subjectSchema, await request.json())
    const subject = await subjectService.update(
      Number(id),
      body as unknown as SubjectCreateInput
    )
    return ok(subject, "Mata pelajaran berhasil diperbarui")
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await context.params
    await subjectService.remove(Number(id))
    return ok(true, "Mata pelajaran berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
