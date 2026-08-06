import "server-only"
import { NextRequest } from "next/server"
import { notifikasiService } from "@/services/notifikasi.service"
import { ok, apiError, unauthorized, notFound } from "@/lib/api-utils"
import { getCurrentUser } from "@/auth/session"

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return unauthorized()
    const { id } = await context.params
    const updated = await notifikasiService.markRead(Number(id))
    if (!updated) return notFound("Notifikasi tidak ditemukan")
    return ok(true, "Notifikasi ditandai sudah dibaca")
  } catch (error) {
    return apiError(error)
  }
}
