import "server-only"
import { NextRequest } from "next/server"
import { notifikasiService } from "@/services/notifikasi.service"
import { userRepository } from "@/repositories/user.repository"
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
import type { NotifikasiCreateManyInput } from "@/services/notifikasi.service"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return unauthorized()
    const notifications = await notifikasiService.getAllByUserId(user.id)
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
    
    // Find all target user IDs based on the roles
    const userIds = await userRepository.findUserIdsByRoles(body.target_roles)
    
    const count = await notifikasiService.createForUsers({
      tipe: body.tipe as NotifikasiCreateManyInput["tipe"],
      judul: body.judul,
      pesan: body.pesan,
      href: body.href,
      user_ids: userIds,
    })
    
    // Since createForUsers returns a count rather than a single Notifikasi object,
    // we return a success response indicating how many were sent.
    // If the frontend expects a Notifikasi object back (pushNotifikasi), we can return a mock one for cache updating,
    // or the frontend can ignore the return value.
    const mockNotification = {
      id: Date.now(), // temporary id
      tipe: body.tipe,
      judul: body.judul,
      pesan: body.pesan,
      href: body.href,
      is_read: false,
      created_at: new Date().toISOString()
    }
    return created(mockNotification, `Notifikasi berhasil dikirim ke ${count} pengguna`)
  } catch (error) {
    return apiError(error, 422)
  }
}
