import "server-only"
import { NextRequest } from "next/server"
import { bankSoalService } from "@/services/bank-soal.service"
import { ok, created, apiError } from "@/lib/api-utils"
import { isAdmin, requireApiUser } from "@/auth/api-authorization"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const scope = request.nextUrl.searchParams.get("scope")
    
    if (user.role === "guru" && scope !== "all") {
      const teacher = await import("@/lib/prisma").then(m => m.prisma.teacher.findUnique({
        where: { user_id: user.id },
        select: { id: true }
      }))
      if (!teacher) return ok([])
      const items = await bankSoalService.getAll(teacher.id)
      return ok(items)
    }

    const items = await bankSoalService.getAll()
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

    const createdItem = await bankSoalService.create({
      ...body,
      guru_id: guruId
    })
    return created(createdItem, "Soal berhasil ditambahkan")
  } catch (error) {
    return apiError(error)
  }
}
