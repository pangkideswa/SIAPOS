import "server-only"
import { NextRequest } from "next/server"
import { userService } from "@/services/user.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { updateUserSchema } from "@/lib/validations/user.schemas"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const user = await userService.getById(Number(id))
    if (!user) return notFound("Pengguna tidak ditemukan")
    return ok(user)
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = parseWithSchema(updateUserSchema, await request.json())
    const user = await userService.update(Number(id), body)
    return ok(user, "Pengguna berhasil diperbarui")
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await userService.remove(Number(id))
    return ok(true, "Pengguna berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
