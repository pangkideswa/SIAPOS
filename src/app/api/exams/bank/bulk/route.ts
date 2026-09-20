import "server-only"
import { NextRequest } from "next/server"
import { bankSoalService } from "@/services/bank-soal.service"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"

export async function POST(request: NextRequest) {
  try {
    await requireApiUser("super_admin", "admin", "guru")
    const body = await request.json()
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return apiError(new Error("ID soal tidak valid atau kosong"), 400)
    }

    const result = await bankSoalService.bulkDelete(ids)
    return ok({ count: result.count }, `${result.count} soal berhasil dihapus`)
  } catch (error) {
    return apiError(error)
  }
}
