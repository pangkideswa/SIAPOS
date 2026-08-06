import "server-only"
import { NextRequest } from "next/server"
import { materialService } from "@/services/material.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { materialSchema } from "@/lib/validations/material.schemas"
import {
  assertMaterialAccess,
  assertTeachingClassAccess,
  requireApiUser,
} from "@/auth/api-authorization"
import type { MateriFormData } from "@/features/materi/types/materi"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser()
    const { id } = await context.params
    await assertMaterialAccess(user, Number(id))
    const material = await materialService.getById(Number(id))
    if (!material) return notFound("Materi tidak ditemukan")
    return ok(material)
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
    await assertMaterialAccess(user, Number(id))
    const body = parseWithSchema(materialSchema, await request.json())
    await assertTeachingClassAccess(user, body.kelas_mengajar_id)
    const material = await materialService.update(
      Number(id),
      body as unknown as MateriFormData
    )
    return ok(material, "Materi berhasil diperbarui")
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await context.params
    await assertMaterialAccess(user, Number(id))
    await materialService.remove(Number(id))
    return ok(true, "Materi berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
