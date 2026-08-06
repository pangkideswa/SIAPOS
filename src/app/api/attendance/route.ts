import "server-only"
import { NextRequest } from "next/server"
import { attendanceService } from "@/services/attendance.service"
import { AppError, ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import {
  getTeacherProfile,
  isAdmin,
  requireApiUser,
} from "@/auth/api-authorization"
import { attendanceSessionCreateSchema } from "@/lib/validations/attendance.schemas"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const params = request.nextUrl.searchParams
    const sessions = await attendanceService.getAll({
      guru: params.get("guru") ?? undefined,
      kelas: params.get("kelas") ?? undefined,
      tanggal: params.get("tanggal") ?? undefined,
    })
    if (isAdmin(user)) return ok(sessions)
    const teacher = await getTeacherProfile(user)
    return ok(sessions.filter((item) => item.guru_nama === teacher?.nama_lengkap))
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const body = parseWithSchema(
      attendanceSessionCreateSchema,
      await request.json()
    )
    if (!isAdmin(user)) {
      const teacher = await getTeacherProfile(user)
      if (!teacher || body.guru_nama !== teacher.nama_lengkap) {
        throw new AppError("Guru hanya boleh membuat sesi absensi miliknya", 403)
      }
    }
    const session = await attendanceService.create(body)
    return created(session, "Sesi absensi berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
