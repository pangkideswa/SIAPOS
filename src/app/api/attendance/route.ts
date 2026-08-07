import "server-only"
import { NextRequest } from "next/server"
import type { Prisma } from "@/generated/prisma/client"
import { attendanceRepository } from "@/repositories/attendance.repository"
import { attendanceService } from "@/services/attendance.service"
import { AppError, ok, created, apiError, parseWithSchema } from "@/lib/api-utils"
import {
  allowedTeachingClassIdsFor,
  assertTeachingClassAccess,
  getStudentProfile,
  getTeacherProfile,
  isAdmin,
  requireApiUser,
} from "@/auth/api-authorization"
import { attendanceSessionCreateSchema } from "@/lib/validations/attendance.schemas"

type AttendanceSessionRow = Awaited<
  ReturnType<typeof attendanceRepository.findSessions>
>[number]

function toSesiAbsensi(row: AttendanceSessionRow) {
  const counts = { hadir: 0, izin: 0, sakit: 0, alpha: 0, terlambat: 0 }
  for (const record of row.records) {
    const status =
      record.status === "HADIR"
        ? "Hadir"
        : record.status === "IZIN"
        ? "Izin"
        : record.status === "SAKIT"
        ? "Sakit"
        : record.status === "ALPHA"
        ? "Alpha"
        : "Terlambat"
    if (status === "Hadir") counts.hadir++
    else if (status === "Izin") counts.izin++
    else if (status === "Sakit") counts.sakit++
    else if (status === "Alpha") counts.alpha++
    else if (status === "Terlambat") counts.terlambat++
  }
  return {
    id: row.id,
    teaching_class_id: row.teaching_class_id ?? null,
    tanggal: row.tanggal.toISOString().slice(0, 10),
    jam_mulai: row.jam_mulai ?? "",
    jam_selesai: row.jam_selesai ?? "",
    mata_pelajaran: row.mata_pelajaran ?? "",
    guru_nama: row.guru_nama ?? "",
    kelas: row.kelas ?? "",
    tahun_ajaran: row.tahun_ajaran ?? "",
    semester: row.semester ?? "Ganjil",
    total_siswa: row.records.length,
    hadir: counts.hadir,
    izin: counts.izin,
    sakit: counts.sakit,
    alpha: counts.alpha,
    terlambat: counts.terlambat,
    status:
      row.status === "SELESAI"
        ? "Selesai"
        : row.status === "BERLANGSUNG"
        ? "Berlangsung"
        : "Belum",
    metode:
      row.status === "BERLANGSUNG" || row.records.length === 0
        ? "Siswa"
        : "Guru",
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

function toStatusKehadiran(
  status: AttendanceSessionRow["records"][number]["status"]
): "Hadir" | "Izin" | "Sakit" | "Alpha" | "Terlambat" {
  return status === "HADIR"
    ? "Hadir"
    : status === "IZIN"
    ? "Izin"
    : status === "SAKIT"
    ? "Sakit"
    : status === "ALPHA"
    ? "Alpha"
    : "Terlambat"
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru", "siswa")
    const params = request.nextUrl.searchParams
    const guru = params.get("guru") ?? undefined
    const kelas = params.get("kelas") ?? undefined
    const tanggal = params.get("tanggal") ?? undefined
    const teachingClassIdParam = params.get("teaching_class_id")
    const teaching_class_id =
      teachingClassIdParam && !Number.isNaN(Number(teachingClassIdParam))
        ? Number(teachingClassIdParam)
        : undefined
    if (isAdmin(user)) {
      const sessions = await attendanceService.getAll({
        guru,
        kelas,
        tanggal,
        teaching_class_id,
      })
      return ok(sessions)
    }

    const dateWhere: Prisma.AttendanceSessionWhereInput = {}
    if (tanggal) {
      const start = new Date(tanggal + "T00:00:00")
      const end = new Date(start)
      end.setDate(start.getDate() + 1)
      dateWhere.tanggal = { gte: start, lt: end }
    }
    const classWhere: Prisma.AttendanceSessionWhereInput = teaching_class_id
      ? { teaching_class_id }
      : {}

    if (user.role === "guru") {
      const teacher = await getTeacherProfile(user)
      const allowedIds = await allowedTeachingClassIdsFor(user)
      const where: Prisma.AttendanceSessionWhereInput = {
        ...classWhere,
        ...(kelas ? { kelas } : {}),
        ...(guru ? { guru_nama: guru } : {}),
        ...dateWhere,
        OR: [
          { teaching_class_id: { in: [...allowedIds] } },
          { teaching_class_id: null, guru_nama: teacher?.nama_lengkap ?? undefined },
        ],
      }
      const rows = await attendanceRepository.findSessions(where)
      return ok(rows.map(toSesiAbsensi))
    }

    const student = await getStudentProfile(user)
    if (!student?.kelas) return ok([])
    const allowedIds = await allowedTeachingClassIdsFor(user)
    const where: Prisma.AttendanceSessionWhereInput = {
      ...classWhere,
      ...(guru ? { guru_nama: guru } : {}),
      ...dateWhere,
      OR: [
        { teaching_class_id: { in: [...allowedIds] } },
        { teaching_class_id: null, kelas: student.kelas },
      ],
    }
    const rows = await attendanceRepository.findSessions(where)
    const sessions = rows.map((row) => {
      const base = toSesiAbsensi(row)
      const mine = row.records.find((r) => r.student_id === student.id)
      return {
        ...base,
        saya_absen: mine?.status === "HADIR",
        status_saya: mine ? toStatusKehadiran(mine.status) : null,
      }
    })
    return ok(sessions)
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
    if (body.teaching_class_id != null) {
      await assertTeachingClassAccess(user, body.teaching_class_id)
      const session = await attendanceService.createForClass({
        teaching_class_id: body.teaching_class_id,
        metode: body.metode ?? "Guru",
        tanggal: body.tanggal,
        jam_mulai: body.jam_mulai ?? null,
        jam_selesai: body.jam_selesai ?? null,
      })
      return created(session, "Pertemuan berhasil dimulai")
    }
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
