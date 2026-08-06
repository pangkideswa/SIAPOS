import "server-only"
import { NextRequest } from "next/server"
import { scheduleService } from "@/services/schedule.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { scheduleSchema } from "@/lib/validations/schedule.schemas"
import {
  getStudentProfile,
  getTeacherProfile,
  isAdmin,
  requireAdmin,
  requireApiUser,
} from "@/auth/api-authorization"
import type { ScheduleCreateInput } from "@/services/schedule.service"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser()
    const params = request.nextUrl.searchParams
    const schedules = await scheduleService.getAll({
      guru_nama: params.get("guru_nama") ?? undefined,
      kelas: params.get("kelas") ?? undefined,
      hari: params.get("hari") ?? undefined,
    })
    if (isAdmin(user)) return ok(schedules)
    if (user.role === "guru") {
      const teacher = await getTeacherProfile(user)
      return ok(schedules.filter((item) => item.guru_nama === teacher?.nama_lengkap))
    }
    const student = await getStudentProfile(user)
    return ok(schedules.filter((item) => item.kelas === student?.kelas))
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = parseWithSchema(scheduleSchema, await request.json())
    const schedule = await scheduleService.create(
      body as unknown as ScheduleCreateInput
    )
    return created(schedule, "Jadwal berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
