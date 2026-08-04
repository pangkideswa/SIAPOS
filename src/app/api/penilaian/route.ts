import "server-only"
import { penilaianService } from "@/services/penilaian.service"
import { ok, apiError } from "@/lib/api-utils"

export async function GET() {
  try {
    const items = await penilaianService.getAll()
    return ok(items)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST() {
  return apiError(
    { message: "Method not allowed" } as unknown as Error,
    405
  )
}
