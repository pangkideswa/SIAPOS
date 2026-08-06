import "server-only"
import { NextRequest } from "next/server"
import { penilaianService } from "@/services/penilaian.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { penilaianUpdateSchema } from "@/lib/validations/penilaian.schemas"
import { assertSubmissionAccess, requireApiUser } from "@/auth/api-authorization"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await context.params
    await assertSubmissionAccess(user, Number(id))
    const item = await penilaianService.getById(Number(id))
    if (!item) return notFound("Data penilaian tidak ditemukan")
    return ok(item)
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await context.params
    await assertSubmissionAccess(user, Number(id))
    const body = parseWithSchema(penilaianUpdateSchema, await request.json())
    const item = await penilaianService.grade(Number(id), body)
    if (!item) return notFound("Data penilaian tidak ditemukan")
    return ok(item, "Penilaian berhasil disimpan")
  } catch (error) {
    return apiError(error)
  }
}
