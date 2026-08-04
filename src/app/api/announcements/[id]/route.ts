import "server-only"
import { NextRequest } from "next/server"
import { announcementService } from "@/services/announcement.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { announcementSchema } from "@/lib/validations/announcement.schemas"
import type { AnnouncementCreateInput } from "@/services/announcement.service"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const announcement = await announcementService.getById(Number(id))
    if (!announcement) return notFound("Pengumuman tidak ditemukan")
    return ok(announcement)
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
    const body = parseWithSchema(announcementSchema, await request.json())
    const announcement = await announcementService.update(
      Number(id),
      body as unknown as AnnouncementCreateInput
    )
    return ok(announcement, "Pengumuman berhasil diperbarui")
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
    await announcementService.remove(Number(id))
    return ok(true, "Pengumuman berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
