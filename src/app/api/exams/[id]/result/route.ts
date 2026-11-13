import "server-only"
import { NextRequest } from "next/server"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser, getStudentProfile } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await requireApiUser("siswa", "guru", "admin", "super_admin")

    const examId = Number(id)
    if (isNaN(examId)) {
      return apiError(new Error("ID ujian tidak valid"), 400)
    }

    let targetStudentId: number | undefined

    if (user.role === "siswa") {
      const student = await getStudentProfile(user)
      if (!student) {
        return apiError(new Error("Profil siswa tidak ditemukan"), 404)
      }
      targetStudentId = student.id
    } else {
      const studentIdParam = request.nextUrl.searchParams.get("student_id")
      if (studentIdParam) {
        targetStudentId = Number(studentIdParam)
      }
    }

    // Ambil data ujian
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        paket_soal: {
          include: {
            items: {
              include: {
                bank_soal: {
                  include: {
                    options: true,
                  },
                },
              },
              orderBy: { nomor_urut: "asc" },
            },
          },
        },
      },
    })

    if (!exam) {
      return apiError(new Error("Ujian CBT tidak ditemukan"), 404)
    }

    // Ambil participant
    const whereParticipant: any = { exam_id: examId }
    if (targetStudentId) {
      whereParticipant.student_id = targetStudentId
    }

    const participant = await prisma.examParticipant.findFirst({
      where: whereParticipant,
      include: {
        student: {
          include: { user: true },
        },
        answers: true,
      },
      orderBy: { created_at: "desc" },
    })

    if (!participant) {
      return apiError(new Error("Lembar hasil ujian belum tersedia untuk siswa ini"), 404)
    }

    // Cek apakah siswa berhak melihat rincian nilai & pembahasan
    const isTeacherOrAdmin = user.role !== "siswa"
    const canViewScore = isTeacherOrAdmin || !!exam.tampilkan_nilai

    // Susun response paket soal dan opsi
    const mappedItems = (exam.paket_soal?.items || []).map((item) => {
      const q = item.bank_soal
      const studentAnswer = participant.answers.find((a) => a.bank_soal_id === q.id)

      let safeOptions = q.options
      let safePembahasan = q.pembahasan

      // Jika siswa belum diizinkan melihat kunci/nilai, sembunyikan kunci & pembahasan
      if (!canViewScore) {
        safeOptions = q.options.map((opt) => ({
          ...opt,
          is_correct: false,
        }))
        safePembahasan = "Pembahasan dirahasiakan oleh pengawas ujian."
      }

      return {
        ...item,
        bank_soal: {
          ...q,
          pembahasan: safePembahasan,
          options: safeOptions,
        },
        student_answer: studentAnswer
          ? {
              id: studentAnswer.id,
              selected_option_id: studentAnswer.selected_option_id,
              jawaban_esai: studentAnswer.jawaban_esai,
              is_correct: canViewScore ? studentAnswer.is_correct : null,
              nilai: canViewScore ? studentAnswer.nilai : null,
            }
          : null,
      }
    })

    const sanitizedExam = {
      id: exam.id,
      judul: exam.judul,
      deskripsi: exam.deskripsi,
      kelas: exam.kelas,
      kkm: exam.kkm,
      durasi_menit: exam.durasi_menit,
      tampilkan_nilai: exam.tampilkan_nilai,
      can_view_score: canViewScore,
      waktu_mulai: exam.waktu_mulai,
      waktu_selesai: exam.waktu_selesai,
      status: exam.status,
      paket_soal: exam.paket_soal
        ? {
            id: exam.paket_soal.id,
            judul: exam.paket_soal.judul,
            mata_pelajaran: exam.paket_soal.mata_pelajaran,
            items: mappedItems,
          }
        : null,
    }

    const sanitizedParticipant = {
      id: participant.id,
      student_id: participant.student_id,
      status: participant.status,
      waktu_mulai: participant.waktu_mulai,
      waktu_selesai: participant.waktu_selesai,
      created_at: participant.created_at,
      updated_at: participant.updated_at,
      nilai_akhir: canViewScore ? participant.nilai_akhir : null,
      catatan_guru: canViewScore ? participant.catatan_guru : null,
      violation_count: participant.violation_count,
      student: {
        id: participant.student?.id,
        nama_lengkap: participant.student?.nama_lengkap || participant.student?.user?.name,
        nisn: participant.student?.nisn || participant.student?.nis,
        kelas: participant.student?.kelas,
      },
      answers: participant.answers.map((a) => ({
        id: a.id,
        bank_soal_id: a.bank_soal_id,
        selected_option_id: a.selected_option_id,
        jawaban_esai: a.jawaban_esai,
        is_correct: canViewScore ? a.is_correct : null,
        nilai: canViewScore ? a.nilai : null,
      })),
    }

    const essayItems = (exam.paket_soal?.items || []).filter(
      (it) => it.bank_soal.tipe_soal === "ESAI"
    )
    const totalEssay = essayItems.length
    let gradedEssayCount = 0
    let pendingEssayCount = 0

    essayItems.forEach((it) => {
      const studentAns = participant.answers.find((a) => a.bank_soal_id === it.bank_soal.id)
      if (studentAns && studentAns.nilai !== null && studentAns.nilai !== undefined) {
        gradedEssayCount++
      } else {
        pendingEssayCount++
      }
    })

    const hasPendingEssay = pendingEssayCount > 0

    return ok({
      exam: sanitizedExam,
      participant: sanitizedParticipant,
      has_pending_essay: hasPendingEssay,
      total_essay: totalEssay,
      graded_essay_count: gradedEssayCount,
      pending_essay_count: pendingEssayCount,
    }, "Hasil ujian berhasil dimuat")
  } catch (error) {
    return apiError(error)
  }
}
