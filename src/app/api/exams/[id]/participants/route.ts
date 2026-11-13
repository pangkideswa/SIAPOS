import "server-only"
import { NextRequest } from "next/server"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"
import { examService } from "@/services/exam.service"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await requireApiUser("super_admin", "admin", "guru")

    const examId = Number(id)
    if (isNaN(examId)) return apiError(new Error("ID ujian tidak valid"), 400)

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        paket_soal: {
          include: {
            guru: { select: { nama_lengkap: true } },
            _count: { select: { items: true } }
          }
        },
        teaching_class: {
          include: {
            teacher: { select: { nama_lengkap: true } }
          }
        },
      },
    })

    if (!exam) return apiError(new Error("Exam tidak ditemukan"), 404)

    // 1. Get existing participants
    const existingParticipants = await prisma.examParticipant.findMany({
      where: { exam_id: examId },
      include: {
        student: {
          include: { user: true },
        },
        answers: true,
      },
      orderBy: { student: { nama_lengkap: "asc" } },
    })

    // 2. If exam has a class target, fetch all active students in that class
    let allClassStudents: any[] = []
    const targetClass = exam.kelas || exam.teaching_class?.kelas

    if (targetClass) {
      allClassStudents = await prisma.student.findMany({
        where: {
          kelas: targetClass,
          status: "Aktif",
        },
        include: { user: true },
        orderBy: { nama_lengkap: "asc" },
      })
    }

    // 3. Merge roster: ensure all students in class appear, even if BELUM_MULAI
    const participantMap = new Map<number, any>()
    existingParticipants.forEach((p) => {
      participantMap.set(p.student_id, p)
    })

    const mergedList: any[] = []

    // Add all students from class roster
    allClassStudents.forEach((st) => {
      const p = participantMap.get(st.id)
      if (p) {
        mergedList.push(p)
        participantMap.delete(st.id) // processed
      } else {
        // Virtual participant for student who has not started yet
        mergedList.push({
          id: null,
          exam_id: examId,
          student_id: st.id,
          student: st,
          status: "BELUM_MULAI",
          waktu_mulai: null,
          waktu_selesai: null,
          nilai_akhir: null,
          violation_count: 0,
          answers: [],
          created_at: null,
          updated_at: null,
        })
      }
    })

    // Any remaining participants (e.g. from different class or past enrollment)
    participantMap.forEach((p) => {
      mergedList.push(p)
    })

    return ok({
      exam,
      participants: mergedList,
      total_soal: exam.paket_soal?._count?.items || 0,
    }, "Data pengawasan ujian berhasil dimuat")
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await requireApiUser("super_admin", "admin", "guru")

    const examId = Number(id)
    if (isNaN(examId)) return apiError(new Error("ID ujian tidak valid"), 400)

    const body = await request.json()
    const { action, participant_id, type } = body

    // 1. Force Submit a specific student
    if (action === "force_submit") {
      if (!participant_id) {
        return apiError(new Error("ID peserta wajib disertakan"), 400)
      }
      const result = await examService.submitExam(participant_id)
      return ok(result, "Ujian siswa berhasil diselesaikan secara paksa")
    }

    // 2. Force Submit ALL students who are still MENGERJAKAN
    if (action === "force_submit_all") {
      const activeParticipants = await prisma.examParticipant.findMany({
        where: {
          exam_id: examId,
          status: "MENGERJAKAN",
        },
        select: { id: true },
      })

      for (const p of activeParticipants) {
        try {
          await examService.submitExam(p.id)
        } catch (e) {
          console.error(`Gagal force submit peserta ${p.id}:`, e)
        }
      }

      return ok(
        { count: activeParticipants.length },
        `${activeParticipants.length} siswa berhasil diselesaikan secara serentak`
      )
    }

    // 3. Reset Sesi Siswa (Unblock / Restart)
    if (action === "reset") {
      if (!participant_id) {
        return apiError(new Error("ID peserta wajib disertakan"), 400)
      }

      const existing = await prisma.examParticipant.findUnique({
        where: { id: participant_id },
      })
      if (!existing) return apiError(new Error("Peserta tidak ditemukan"), 404)

      if (type === "restart") {
        // Complete restart: remove answers and set to BELUM_MULAI
        await prisma.examAnswer.deleteMany({
          where: { participant_id },
        })

        const updated = await prisma.examParticipant.update({
          where: { id: participant_id },
          data: {
            status: "BELUM_MULAI",
            waktu_mulai: null,
            waktu_selesai: null,
            nilai_akhir: null,
            violation_count: 0,
            catatan_guru: "Ujian di-reset ulang total oleh guru/pengawas.",
          },
        })
        return ok(updated, "Sesi ujian siswa berhasil di-reset ulang dari awal")
      } else {
        // Unlock only: clear violations and allow student to continue
        const updated = await prisma.examParticipant.update({
          where: { id: participant_id },
          data: {
            status: "MENGERJAKAN",
            violation_count: 0,
            catatan_guru: "Kunci ujian dibuka kembali oleh pengawas.",
          },
        })
        return ok(updated, "Kunci ujian siswa berhasil dibuka. Siswa dapat melanjutkan.")
      }
    }

    return apiError(new Error("Aksi tidak dikenali"), 400)
  } catch (error) {
    return apiError(error)
  }
}
