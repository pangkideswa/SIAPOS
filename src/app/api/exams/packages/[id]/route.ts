import "server-only"
import { NextRequest } from "next/server"
import { paketSoalService } from "@/services/paket-soal.service"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await params
    const item = await paketSoalService.getById(parseInt(id))
    
    if (!item) return apiError(new Error("Paket Soal tidak ditemukan"), 404)

    // Privacy check: only the creator guru and super_admin can view
    if (user.role === "guru") {
      const teacher = await prisma.teacher.findUnique({
        where: { user_id: user.id },
        select: { id: true }
      })
      if (!teacher || item.guru_id !== teacher.id) {
        return apiError(new Error("Anda tidak memiliki izin untuk melihat paket soal ini demi privasi"), 403)
      }
    }

    return ok(item)
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await params
    const item = await paketSoalService.getById(parseInt(id))
    if (!item) return apiError(new Error("Paket Soal tidak ditemukan"), 404)

    if (user.role === "guru") {
      const teacher = await prisma.teacher.findUnique({
        where: { user_id: user.id },
        select: { id: true }
      })
      if (!teacher || item.guru_id !== teacher.id) {
        return apiError(new Error("Anda tidak memiliki izin untuk mengubah paket soal ini"), 403)
      }
    }

    const body = await request.json()
    const updatedItem = await paketSoalService.update(parseInt(id), body)
    return ok(updatedItem, "Paket Soal berhasil diperbarui")
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await params
    const item = await paketSoalService.getById(parseInt(id))
    if (!item) return apiError(new Error("Paket Soal tidak ditemukan"), 404)

    if (user.role === "guru") {
      const teacher = await prisma.teacher.findUnique({
        where: { user_id: user.id },
        select: { id: true }
      })
      if (!teacher || item.guru_id !== teacher.id) {
        return apiError(new Error("Anda tidak memiliki izin untuk menghapus paket soal ini"), 403)
      }
    }
    
    await paketSoalService.delete(parseInt(id))
    return ok({ success: true }, "Paket Soal berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
