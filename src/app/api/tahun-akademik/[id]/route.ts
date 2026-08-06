import "server-only"
import { NextRequest } from "next/server"
import { tahunAkademikService } from "@/services/tahun-akademik.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { tahunAkademikSchema } from "@/lib/validations/tahun-akademik.schemas"
import { requireRole } from "@/auth/guards"
import type { TahunAkademikCreateInput } from "@/services/tahun-akademik.service"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("super_admin", "admin")
    const { id } = await context.params
    const tahunAkademik = await tahunAkademikService.getById(Number(id))
    if (!tahunAkademik) return notFound("Tahun akademik tidak ditemukan")
    return ok(tahunAkademik)
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
    const body = parseWithSchema(tahunAkademikSchema, await request.json())
    const tahunAkademik = await tahunAkademikService.update(
      Number(id),
      body as unknown as TahunAkademikCreateInput
    )
    if (!tahunAkademik) return notFound("Tahun akademik tidak ditemukan")
    return ok(tahunAkademik, "Tahun akademik berhasil diperbarui")
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
    await tahunAkademikService.remove(Number(id))
    return ok(true, "Tahun akademik berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
