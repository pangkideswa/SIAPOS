import "server-only"
import { NextRequest } from "next/server"
import { materialService } from "@/services/material.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { materialSchema } from "@/lib/validations/material.schemas"
import {
  allowedTeachingClassIdsFor,
  assertTeachingClassAccess,
  filterByTeachingClassAccess,
  isAdmin,
  requireApiUser,
} from "@/auth/api-authorization"
import type { MateriFormData } from "@/features/materi/types/materi"

export async function GET() {
  try {
    const user = await requireApiUser()
    const materials = await materialService.getAll()
    const allowedIds = await allowedTeachingClassIdsFor(user)
    const scoped = filterByTeachingClassAccess(user, materials, allowedIds)
      .filter((item) => user.role !== "siswa" || item.status === "Publish")
    return ok(isAdmin(user) ? materials : scoped)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const body = parseWithSchema(materialSchema, await request.json())
    await assertTeachingClassAccess(user, body.kelas_mengajar_id)
    const material = await materialService.create(body as unknown as MateriFormData)
    return created(material, "Materi berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
