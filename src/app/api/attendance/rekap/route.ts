import "server-only"
import { NextRequest } from "next/server"
import { attendanceService } from "@/services/attendance.service"
import { ok, apiError } from "@/lib/api-utils"
import {
  allowedClassNamesFor,
  getStudentProfile,
  getTeacherProfile,
  isAdmin,
  requireApiUser,
} from "@/auth/api-authorization"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser()
    const kelas = request.nextUrl.searchParams.get("kelas") ?? undefined
    const rekap = await attendanceService.getRekap(kelas)
    if (isAdmin(user)) return ok(rekap)
    if (user.role === "siswa") {
      const student = await getStudentProfile(user)
      return ok(rekap.filter((item) => item.siswa_id === student?.id))
    }
    const teacher = await getTeacherProfile(user)
    if (!teacher) return ok([])
    const allowedClasses = await allowedClassNamesFor(user)
    return ok(rekap.filter((item) => allowedClasses.has(item.siswa_kelas)))
  } catch (error) {
    return apiError(error)
  }
}
