import "server-only"
import { prisma } from "@/lib/prisma"
import type {
  Attendance,
  Prisma,
} from "@/generated/prisma/client"

export type AttendanceSessionCreateData =
  Prisma.AttendanceSessionUncheckedCreateInput
export type AttendanceSessionUpdateData =
  Prisma.AttendanceSessionUncheckedUpdateInput
export type AttendanceSessionWhere = Prisma.AttendanceSessionWhereInput

const SESSION_INCLUDE = {
  records: {
    include: {
      student: { select: { nama_lengkap: true, kelas: true } },
    },
  },
} as const

export type AttendanceSessionRow = Prisma.AttendanceSessionGetPayload<{
  include: typeof SESSION_INCLUDE
}>

export interface AttendanceRecordInput {
  student_id: number
  status: Attendance["status"]
  keterangan: string | null
}

export const attendanceRepository = {
  async findSessions(
    where: AttendanceSessionWhere = {}
  ): Promise<AttendanceSessionRow[]> {
    return prisma.attendanceSession.findMany({
      where,
      include: SESSION_INCLUDE,
      orderBy: [{ tanggal: "desc" }, { jam_mulai: "asc" }],
    })
  },

  async findSessionById(id: number): Promise<AttendanceSessionRow | null> {
    return prisma.attendanceSession.findUnique({
      where: { id },
      include: SESSION_INCLUDE,
    })
  },

  async findSessionsByStudent(
    studentId: number
  ): Promise<AttendanceSessionRow[]> {
    return prisma.attendanceSession.findMany({
      where: { records: { some: { student_id: studentId } } },
      include: {
        records: {
          where: { student_id: studentId },
          include: {
            student: { select: { nama_lengkap: true, kelas: true } },
          },
        },
      },
      orderBy: { tanggal: "desc" },
    })
  },

  async createSession(
    data: AttendanceSessionCreateData
  ): Promise<AttendanceSessionRow> {
    return prisma.attendanceSession.create({
      data,
      include: SESSION_INCLUDE,
    })
  },

  async updateSession(
    id: number,
    data: AttendanceSessionUpdateData
  ): Promise<AttendanceSessionRow | null> {
    return prisma.attendanceSession.update({
      where: { id },
      data,
      include: SESSION_INCLUDE,
    })
  },

  async deleteSession(id: number): Promise<void> {
    await prisma.attendanceSession.delete({ where: { id } })
  },

  async saveRecords(
    sessionId: number,
    records: AttendanceRecordInput[],
    markDone = true
  ): Promise<AttendanceSessionRow | null> {
    return prisma.$transaction(async (tx) => {
      await tx.attendance.deleteMany({ where: { session_id: sessionId } })
      if (records.length > 0) {
        await tx.attendance.createMany({
          data: records.map((r) => ({
            session_id: sessionId,
            student_id: r.student_id,
            status: r.status,
            keterangan: r.keterangan,
          })),
        })
      }
      if (markDone) {
        return tx.attendanceSession.update({
          where: { id: sessionId },
          data: { status: "SELESAI" },
          include: SESSION_INCLUDE,
        })
      }
      return tx.attendanceSession.findUnique({
        where: { id: sessionId },
        include: SESSION_INCLUDE,
      })
    })
  },

  async findAllRecordsForRekap() {
    return prisma.attendance.findMany({
      select: {
        id: true,
        student_id: true,
        status: true,
        session: { select: { id: true } },
        student: { select: { id: true, nama_lengkap: true, kelas: true } },
      },
    })
  },
}
