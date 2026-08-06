import "server-only"
import { NextRequest } from "next/server"
import { announcementService } from "@/services/announcement.service"
import { AppError, ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { announcementSchema } from "@/lib/validations/announcement.schemas"
import {
  getStudentProfile,
  isAdmin,
  requireApiUser,
} from "@/auth/api-authorization"
import type { AnnouncementCreateInput } from "@/services/announcement.service"

async function assertAnnouncementAccess(
  user: Awaited<ReturnType<typeof requireApiUser>>,
  announcement: Awaited<ReturnType<typeof announcementService.getById>>,
  write = false
) {
  if (!announcement) throw new AppError("Pengumuman tidak ditemukan", 404)
  if (isAdmin(user)) return
  if (write) {
    if (user.role === "guru" && announcement.penulis === user.name) return
    throw new AppError("Anda tidak memiliki akses ke pengumuman ini", 403)
  }
  if (user.role === "guru") {
    if (
      announcement.penulis === user.name ||
      (announcement.status === "Dipublikasikan" &&
        (announcement.target === "Semua Pengguna" || announcement.target === "Guru"))
    ) return
  }
  if (user.role === "siswa") {
    const student = await getStudentProfile(user)
    if (
      announcement.status === "Dipublikasikan" &&
      (announcement.target === "Semua Pengguna" ||
        announcement.target === "Siswa" ||
        (announcement.target === "Kelas Tertentu" && announcement.kelas === student?.kelas))
    ) return
  }
  throw new AppError("Anda tidak memiliki akses ke pengumuman ini", 403)
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser()
    const { id } = await context.params
    const announcement = await announcementService.getById(Number(id))
    await assertAnnouncementAccess(user, announcement)
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
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await context.params
    const current = await announcementService.getById(Number(id))
    await assertAnnouncementAccess(user, current, true)
    const body = parseWithSchema(announcementSchema, await request.json())
    const announcement = await announcementService.update(
      Number(id),
      {
        ...(body as unknown as AnnouncementCreateInput),
        penulis: isAdmin(user) ? body.penulis : user.name,
      }
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
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await context.params
    const current = await announcementService.getById(Number(id))
    await assertAnnouncementAccess(user, current, true)
    await announcementService.remove(Number(id))
    return ok(true, "Pengumuman berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
