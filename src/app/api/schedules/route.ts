import "server-only"
import { NextRequest } from "next/server"
import { scheduleService } from "@/services/schedule.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { scheduleSchema } from "@/lib/validations/schedule.schemas"
import type { ScheduleCreateInput } from "@/services/schedule.service"

export async function GET() {
  try {
    const schedules = await scheduleService.getAll()
    return ok(schedules)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = parseWithSchema(scheduleSchema, await request.json())
    const schedule = await scheduleService.create(
      body as unknown as ScheduleCreateInput
    )
    return created(schedule, "Jadwal berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
