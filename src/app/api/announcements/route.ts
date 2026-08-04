import "server-only"
import { NextRequest } from "next/server"
import { announcementService } from "@/services/announcement.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { announcementSchema } from "@/lib/validations/announcement.schemas"
import type { AnnouncementCreateInput } from "@/services/announcement.service"

export async function GET() {
  try {
    const announcements = await announcementService.getAll()
    return ok(announcements)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(announcementSchema, await request.json())
    const announcement = await announcementService.create(
      body as unknown as AnnouncementCreateInput
    )
    return created(announcement, "Pengumuman berhasil dibuat")
  } catch (error) {
    return apiError(error, 422)
  }
}
