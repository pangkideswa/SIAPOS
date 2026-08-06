import "server-only"
import { NextRequest } from "next/server"
import { notifikasiService } from "@/services/notifikasi.service"
import {
  ok,
  apiError,
  unauthorized,
  parseWithSchema,
} from "@/lib/api-utils"
import { notifikasiReadAllSchema } from "@/lib/validations/notifikasi.schemas"
import { getCurrentUser } from "@/auth/session"
import type { UserRole } from "@/types/auth"

const ALL_ROLES: UserRole[] = ["super_admin", "admin", "guru", "siswa", "wali"]

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return unauthorized()
    const body = parseWithSchema(notifikasiReadAllSchema, await request.json())
    if (body.ids && body.ids.length > 0) {
      await notifikasiService.markListRead(body.ids)
    } else if (user.role === "super_admin") {
      await notifikasiService.markAllRead(ALL_ROLES)
    } else {
      await notifikasiService.markAllRead([user.role])
    }
    return ok(true, "Notifikasi ditandai sudah dibaca")
  } catch (error) {
    return apiError(error)
  }
}
