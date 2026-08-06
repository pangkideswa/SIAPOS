import "server-only"
import { NextRequest } from "next/server"
import { announcementService } from "@/services/announcement.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { announcementSchema } from "@/lib/validations/announcement.schemas"
import {
  getStudentProfile,
  isAdmin,
  requireApiUser,
} from "@/auth/api-authorization"
import type { AnnouncementCreateInput } from "@/services/announcement.service"

export async function GET() {
  try {
    const user = await requireApiUser()
    const announcements = await announcementService.getAll()
    if (isAdmin(user)) return ok(announcements)
    if (user.role === "guru") {
      return ok(
        announcements.filter(
          (item) =>
            item.penulis === user.name ||
            (item.status === "Dipublikasikan" &&
              (item.target === "Semua Pengguna" || item.target === "Guru"))
        )
      )
    }
    const student = await getStudentProfile(user)
    return ok(
      announcements.filter(
        (item) =>
          item.status === "Dipublikasikan" &&
          (item.target === "Semua Pengguna" ||
            item.target === "Siswa" ||
            (item.target === "Kelas Tertentu" && item.kelas === student?.kelas))
      )
    )
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const body = parseWithSchema(announcementSchema, await request.json())
    const announcement = await announcementService.create(
      {
        ...(body as unknown as AnnouncementCreateInput),
        penulis: isAdmin(user) ? (body.penulis ?? user.name) : user.name,
      }
    )
    return created(announcement, "Pengumuman berhasil dibuat")
  } catch (error) {
    return apiError(error, 422)
  }
}
