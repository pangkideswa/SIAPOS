import "server-only"
import { NextRequest } from "next/server"
import { attendanceService } from "@/services/attendance.service"
import { ok, apiError } from "@/lib/api-utils"
import {
  allowedClassNamesFor,
  getTeacherProfile,
  isAdmin,
  requireApiUser,
} from "@/auth/api-authorization"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser()
    const kelas = request.nextUrl.searchParams.get("kelas") ?? undefined
    const mata_pelajaran = request.nextUrl.searchParams.get("mata_pelajaran") ?? undefined
    const tanggal_mulai = request.nextUrl.searchParams.get("tanggal_mulai") ?? undefined
    const tanggal_selesai = request.nextUrl.searchParams.get("tanggal_selesai") ?? undefined

    const filters = {
      kelas,
      mata_pelajaran,
      tanggal_mulai,
      tanggal_selesai,
    }

    let exportData = await attendanceService.getExportData(filters)

    // Security check
    if (!isAdmin(user)) {
      if (user.role === "guru") {
        const teacher = await getTeacherProfile(user)
        if (!teacher) return ok([])
        const allowedClasses = await allowedClassNamesFor(user)
        // filter data so teachers only export classes they teach
        exportData = exportData.filter((item) => allowedClasses.has(item.Kelas))
      } else {
        // Students shouldn't export this
        return ok([])
      }
    }

    return ok(exportData)
  } catch (error) {
    return apiError(error)
  }
}
