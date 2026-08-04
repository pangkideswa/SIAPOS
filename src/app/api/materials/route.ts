import "server-only"
import { NextRequest } from "next/server"
import { materialService } from "@/services/material.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { materialSchema } from "@/lib/validations/material.schemas"
import type { MateriFormData } from "@/features/materi/types/materi"

export async function GET() {
  try {
    const materials = await materialService.getAll()
    return ok(materials)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(materialSchema, await request.json())
    const material = await materialService.create(body as unknown as MateriFormData)
    return created(material, "Materi berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
