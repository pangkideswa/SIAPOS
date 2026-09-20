import "server-only"
import { NextRequest } from "next/server"
import { bankSoalService } from "@/services/bank-soal.service"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireApiUser("super_admin", "admin", "guru")
    const { id } = await params
    const item = await bankSoalService.getById(parseInt(id))
    
    if (!item) return apiError(new Error("Soal tidak ditemukan"), 404)
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
    await requireApiUser("super_admin", "admin", "guru")
    const { id } = await params
    const body = await request.json()
    
    const updatedItem = await bankSoalService.update(parseInt(id), body)
    return ok(updatedItem, "Soal berhasil diperbarui")
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireApiUser("super_admin", "admin", "guru")
    const { id } = await params
    
    await bankSoalService.delete(parseInt(id))
    return ok({ success: true }, "Soal berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
