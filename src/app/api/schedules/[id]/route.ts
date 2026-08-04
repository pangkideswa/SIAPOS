import "server-only"
import { NextRequest } from "next/server"
import { scheduleService } from "@/services/schedule.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { scheduleSchema } from "@/lib/validations/schedule.schemas"
import type { ScheduleCreateInput } from "@/services/schedule.service"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const schedule = await scheduleService.getById(Number(id))
    if (!schedule) return notFound("Jadwal tidak ditemukan")
    return ok(schedule)
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = parseWithSchema(scheduleSchema, await request.json())
    const schedule = await scheduleService.update(
      Number(id),
      body as unknown as ScheduleCreateInput
    )
    return ok(schedule, "Jadwal berhasil diperbarui")
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await scheduleService.remove(Number(id))
    return ok(true, "Jadwal berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
