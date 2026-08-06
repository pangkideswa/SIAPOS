import "server-only"
import { NextRequest } from "next/server"
import { attendanceService } from "@/services/attendance.service"
import { ok, apiError, AppError } from "@/lib/api-utils"
import { assertStudentAccess, requireApiUser } from "@/auth/api-authorization"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser()
    const studentId = Number(
      request.nextUrl.searchParams.get("student_id")
    )
    if (!studentId) {
      throw new AppError("Parameter student_id wajib diisi", 400)
    }
    await assertStudentAccess(user, studentId)
    const rows = await attendanceService.getSiswaAbsensi(studentId)
    return ok(rows)
  } catch (error) {
    return apiError(error)
  }
}
