import "server-only"
import { NextRequest } from "next/server"
import { attendanceService } from "@/services/attendance.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import {
  assertAttendanceSessionAccess,
  requireAdmin,
  requireApiUser,
} from "@/auth/api-authorization"
import {
  attendanceBulkSaveSchema,
  statusSesiSchema,
} from "@/lib/validations/attendance.schemas"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await context.params
    await assertAttendanceSessionAccess(user, Number(id))
    const detail = await attendanceService.getById(Number(id))
    if (!detail) return notFound("Sesi absensi tidak ditemukan")
    return ok(detail)
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
    await assertAttendanceSessionAccess(user, Number(id))
    const body = parseWithSchema(attendanceBulkSaveSchema, await request.json())
    const detail = await attendanceService.saveRecords(
      Number(id),
      body.records.map((r) => ({
        student_id: r.student_id,
        status: r.status,
        keterangan: r.keterangan ?? null,
      }))
    )
    if (!detail) return notFound("Sesi absensi tidak ditemukan")
    return ok(detail, "Absensi berhasil disimpan")
  } catch (error) {
    return apiError(error, 422)
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await context.params
    await assertAttendanceSessionAccess(user, Number(id))
    const body = parseWithSchema(statusSesiSchema, await request.json())
    const detail = await attendanceService.updateSessionStatus(Number(id), body)
    if (!detail) return notFound("Sesi absensi tidak ditemukan")
    const message =
      body === "Selesai" ? "Absensi berhasil ditutup" : "Absensi berhasil dibuka"
    return ok(detail, message)
  } catch (error) {
    return apiError(error, 422)
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await context.params
    await attendanceService.remove(Number(id))
    return ok(null, "Sesi absensi berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
