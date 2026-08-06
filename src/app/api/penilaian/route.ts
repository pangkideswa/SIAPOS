import "server-only"
import { penilaianService } from "@/services/penilaian.service"
import { ok, apiError } from "@/lib/api-utils"
import {
  allowedAssignmentIdsFor,
  isAdmin,
  requireApiUser,
} from "@/auth/api-authorization"

export async function GET() {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const items = await penilaianService.getAll()
    if (isAdmin(user)) return ok(items)
    const allowedAssignmentIds = await allowedAssignmentIdsFor(user)
    return ok(items.filter((item) => allowedAssignmentIds.has(item.tugas_id)))
  } catch (error) {
    return apiError(error)
  }
}
