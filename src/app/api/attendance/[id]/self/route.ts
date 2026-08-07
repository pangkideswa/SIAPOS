import "server-only"
import { NextRequest } from "next/server"
import { attendanceService } from "@/services/attendance.service"
import { AppError, ok, apiError, notFound } from "@/lib/api-utils"
import {
  assertAttendanceSessionAccess,
  getStudentProfile,
  requireApiUser,
} from "@/auth/api-authorization"

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser()
    if (user.role !== "siswa") {
      throw new AppError(
        "Hanya siswa yang dapat melakukan absen mandiri",
        403
      )
    }
    const { id } = await context.params
    const sessionId = Number(id)
    await assertAttendanceSessionAccess(user, sessionId)
    const student = await getStudentProfile(user)
    if (!student) {
      throw new AppError("Data siswa untuk akun ini tidak ditemukan", 403)
    }
    const isMember = await attendanceService.assertStudentInSession(
      sessionId,
      student.id
    )
    if (!isMember) {
      throw new AppError("Anda tidak terdaftar pada sesi absensi ini", 403)
    }
    const detail = await attendanceService.markStudentPresent(
      sessionId,
      student.id
    )
    if (!detail) return notFound("Sesi absensi tidak ditemukan")
    return ok(detail, "Absensi berhasil dicatat")
  } catch (error) {
    return apiError(error)
  }
}
