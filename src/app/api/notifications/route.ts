import "server-only"
import { NextRequest } from "next/server"
import { notifikasiService } from "@/services/notifikasi.service"
import {
  ok,
  created,
  apiError,
  parseWithSchema,
  unauthorized,
  forbidden,
} from "@/lib/api-utils"
import { notifikasiSchema } from "@/lib/validations/notifikasi.schemas"
import { getCurrentUser } from "@/auth/session"
import type { NotifikasiCreateInput } from "@/services/notifikasi.service"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return unauthorized()
    const notifications =
      user.role === "super_admin"
        ? await notifikasiService.getAllForSuperAdmin()
        : await notifikasiService.getAll([user.role])
    return ok(notifications)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return unauthorized()
    if (!["admin", "super_admin", "guru"].includes(user.role)) {
      return forbidden()
    }
    const body = parseWithSchema(notifikasiSchema, await request.json())
    const notification = await notifikasiService.create(
      body as unknown as NotifikasiCreateInput
    )
    return created(notification, "Notifikasi berhasil dikirim")
  } catch (error) {
    return apiError(error, 422)
  }
}
