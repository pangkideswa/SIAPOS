import "server-only"
import { NextRequest } from "next/server"
import type { Prisma, Schedule } from "@/generated/prisma/client"
import { scheduleRepository } from "@/repositories/schedule.repository"
import { scheduleService } from "@/services/schedule.service"
import { ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import { scheduleSchema } from "@/lib/validations/schedule.schemas"
import {
  getStudentProfile,
  getTeacherProfile,
  isAdmin,
  requireSuperAdmin,
  requireApiUser,
  allowedTeachingClassIdsFor,
} from "@/auth/api-authorization"
import type { ScheduleCreateInput } from "@/services/schedule.service"

const DAY_DB: Record<string, string> = {
  Senin: "SENIN",
  Selasa: "SELASA",
  Rabu: "RABU",
  Kamis: "KAMIS",
  Jumat: "JUMAT",
  Sabtu: "SABTU",
  Minggu: "MINGGU",
}

function toJadwal(row: Schedule) {
  return {
    id: row.id,
    hari: row.hari,
    jam_mulai: row.jam_mulai ?? "",
    jam_selesai: row.jam_selesai ?? "",
    mata_pelajaran: row.mata_pelajaran ?? "",
    guru_nama: row.guru_nama ?? "",
    kelas: row.kelas ?? "",
    tahun_ajaran: row.tahun_ajaran ?? "",
    semester: row.semester ?? "Ganjil",
    ruang: row.ruang ?? "",
    status: row.status ?? "Aktif",
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser()
    const params = request.nextUrl.searchParams
    const guru_nama = params.get("guru_nama") ?? undefined
    const kelas = params.get("kelas") ?? undefined
    const hari = params.get("hari") ?? undefined
    const where: Prisma.ScheduleWhereInput = {
      ...(kelas ? { kelas } : {}),
      ...(hari ? { hari: (DAY_DB[hari] ?? hari.toUpperCase()) as never } : {}),
      ...(guru_nama ? { guru_nama } : {}),
    }

    if (isAdmin(user)) {
      const schedules = await scheduleRepository.findMany(where)
      return ok(schedules.map(toJadwal))
    }

    if (user.role === "guru") {
      const teacher = await getTeacherProfile(user)
      const allowedIds = await allowedTeachingClassIdsFor(user)
      const teacherWhere: Prisma.ScheduleWhereInput = {
        ...where,
        OR: [
          { teaching_class_id: { in: [...allowedIds] } },
          { teaching_class_id: null, guru_nama: teacher?.nama_lengkap ?? undefined },
        ],
      }
      const schedules = await scheduleRepository.findMany(teacherWhere)
      return ok(schedules.map(toJadwal))
    }

    const student = await getStudentProfile(user)
    if (!student?.kelas) return ok([])
    const allowedIds = await allowedTeachingClassIdsFor(user)
    const studentWhere: Prisma.ScheduleWhereInput = {
      ...where,
      OR: [
        { teaching_class_id: { in: [...allowedIds] } },
        { teaching_class_id: null, kelas: student.kelas },
      ],
    }
    const schedules = await scheduleRepository.findMany(studentWhere)
    return ok(schedules.map(toJadwal))
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSuperAdmin()
    const body = parseWithSchema(scheduleSchema, await request.json())
    const schedule = await scheduleService.create(
      body as unknown as ScheduleCreateInput
    )
    return created(schedule, "Jadwal berhasil ditambahkan")
  } catch (error) {
    return apiError(error, 422)
  }
}
