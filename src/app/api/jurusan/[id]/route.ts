import "server-only"
import { NextRequest } from "next/server"
import { jurusanService } from "@/services/jurusan.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { jurusanSchema } from "@/lib/validations/jurusan.schemas"
import { requireRole } from "@/auth/guards"
import type { JurusanCreateInput } from "@/services/jurusan.service"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("super_admin", "admin")
    const { id } = await context.params
    const jurusan = await jurusanService.getById(Number(id))
    if (!jurusan) return notFound("Jurusan tidak ditemukan")
    return ok(jurusan)
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("super_admin", "admin")
    const { id } = await context.params
    const body = parseWithSchema(jurusanSchema, await request.json())
    const jurusan = await jurusanService.update(
      Number(id),
      body as unknown as JurusanCreateInput
    )
    return ok(jurusan, "Jurusan berhasil diperbarui")
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("super_admin", "admin")
    const { id } = await context.params
    await jurusanService.remove(Number(id))
    return ok(true, "Jurusan berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
