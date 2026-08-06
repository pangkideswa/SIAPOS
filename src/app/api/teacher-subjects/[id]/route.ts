import "server-only"
import { NextRequest } from "next/server"
import { teachingClassService } from "@/services/teaching-class.service"
import { ok, apiError } from "@/lib/api-utils"
import { requireAdmin } from "@/auth/api-authorization"

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await context.params
    await teachingClassService.remove(Number(id))
    return ok(true, "Penugasan guru berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
