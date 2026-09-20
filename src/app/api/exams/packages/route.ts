import "server-only"
import { NextRequest } from "next/server"
import { paketSoalService } from "@/services/paket-soal.service"
import { ok, created, apiError } from "@/lib/api-utils"
import { isAdmin, requireApiUser } from "@/auth/api-authorization"

export async function GET() {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    let actualGuruId: number | undefined = undefined
    
    if (user.role === "guru") {
      const teacher = await import("@/lib/prisma").then(m => m.prisma.teacher.findUnique({
        where: { user_id: user.id }
      }))
      actualGuruId = teacher?.id
    }

    const items = await paketSoalService.getAll(isAdmin(user) ? undefined : actualGuruId)
    return ok(items)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const body = await request.json()
    
    let guruId = body.guru_id
    if (user.role === "guru" && !guruId) {
      const teacher = await import("@/lib/prisma").then(m => m.prisma.teacher.findUnique({
        where: { user_id: user.id }
      }))
      guruId = teacher?.id
    }

    const createdItem = await paketSoalService.create({
      ...body,
      guru_id: guruId
    })
    return created(createdItem, "Paket Soal berhasil ditambahkan")
  } catch (error) {
    return apiError(error)
  }
}
