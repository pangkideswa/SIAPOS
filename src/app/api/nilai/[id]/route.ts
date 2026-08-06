import "server-only"
import { NextRequest } from "next/server"
import { nilaiService } from "@/services/nilai.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { nilaiUpdateSchema } from "@/lib/validations/nilai.schemas"
import { assertNilaiAccess, requireApiUser } from "@/auth/api-authorization"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser()
    const { id } = await context.params
    await assertNilaiAccess(user, Number(id))
    const item = await nilaiService.getById(Number(id))
    if (!item) return notFound("Nilai tidak ditemukan")
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
    await assertNilaiAccess(user, Number(id))
    const body = parseWithSchema(nilaiUpdateSchema, await request.json())
    const item = await nilaiService.update(Number(id), body)
    return ok(item, "Nilai berhasil disimpan")
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin")
    const { id } = await context.params
    await assertNilaiAccess(user, Number(id))
    await nilaiService.remove(Number(id))
    return ok(true, "Nilai berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
