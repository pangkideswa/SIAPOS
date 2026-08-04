import "server-only"
import { NextRequest } from "next/server"
import { teachingClassService } from "@/services/teaching-class.service"
import { ok, apiError } from "@/lib/api-utils"

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await teachingClassService.remove(Number(id))
    return ok(true, "Penugasan guru berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
