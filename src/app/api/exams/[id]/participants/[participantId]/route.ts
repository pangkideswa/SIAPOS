import "server-only"
import { NextRequest } from "next/server"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const { id, participantId } = await params
    await requireApiUser("super_admin", "admin", "guru")

    const examId = Number(id)
    const pId = Number(participantId)

    if (isNaN(examId) || isNaN(pId)) {
      return apiError(new Error("ID tidak valid"), 400)
    }

    const participant = await prisma.examParticipant.findUnique({
      where: { id: pId },
      include: {
        student: {
          include: { user: true },
        },
        answers: {
          include: {
            bank_soal: {
              include: { options: true },
            },
          },
        },
        exam: {
          include: {
            paket_soal: {
              include: {
                items: {
                  include: {
                    bank_soal: {
                      include: { options: true },
                    },
                  },
                  orderBy: { nomor_urut: "asc" },
                },
              },
            },
          },
        },
      },
    })

    if (!participant || participant.exam_id !== examId) {
      return apiError(new Error("Lembar ujian peserta tidak ditemukan"), 404)
    }

    // Map each item in the exam's paket_soal with the student's answer
    const items = participant.exam?.paket_soal?.items || []
    const mappedQuestions = items.map((item, idx) => {
      const studentAns = participant.answers.find((a) => a.bank_soal_id === item.bank_soal_id)
      const selectedOpt = item.bank_soal.options.find((o) => o.id === studentAns?.selected_option_id)
      const correctOpt = item.bank_soal.options.find((o) => o.is_correct)

      return {
        number: idx + 1,
        bank_soal_id: item.bank_soal.id,
        pertanyaan: item.bank_soal.pertanyaan,
        tipe_soal: item.bank_soal.tipe_soal,
        bobot: item.bobot,
        pembahasan: item.bank_soal.pembahasan,
        options: item.bank_soal.options,
        correct_option: correctOpt,
        answer: studentAns
          ? {
              id: studentAns.id,
              selected_option_id: studentAns.selected_option_id,
              selected_option_teks: selectedOpt?.teks || null,
              jawaban_esai: studentAns.jawaban_esai,
              is_correct: studentAns.is_correct,
              nilai: studentAns.nilai,
            }
          : null,
      }
    })

    return ok({
      participant: {
        id: participant.id,
        student_id: participant.student_id,
        nama_lengkap: participant.student?.nama_lengkap || participant.student?.user?.name,
        nisn: participant.student?.nisn || participant.student?.nis,
        kelas: participant.student?.kelas,
        status: participant.status,
        waktu_mulai: participant.waktu_mulai,
        waktu_selesai: participant.waktu_selesai,
        nilai_akhir: participant.nilai_akhir,
        violation_count: participant.violation_count,
        catatan_guru: participant.catatan_guru,
      },
      exam: {
        id: participant.exam.id,
        judul: participant.exam.judul,
        kkm: participant.exam.kkm,
        durasi_menit: participant.exam.durasi_menit,
      },
      questions: mappedQuestions,
    }, "Lembar jawaban peserta berhasil dimuat")
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const { id, participantId } = await params
    await requireApiUser("super_admin", "admin", "guru")

    const examId = Number(id)
    const pId = Number(participantId)

    if (isNaN(examId) || isNaN(pId)) {
      return apiError(new Error("ID tidak valid"), 400)
    }

    const body = await request.json()
    const { grades, catatan_guru } = body

    if (!grades || !Array.isArray(grades)) {
      return apiError(new Error("Format penilaian tidak valid"), 400)
    }

    const participant = await prisma.examParticipant.findUnique({
      where: { id: pId },
      include: {
        exam: {
          include: {
            paket_soal: {
              include: { items: true },
            },
          },
        },
        answers: true,
      },
    })

    if (!participant || participant.exam_id !== examId) {
      return apiError(new Error("Peserta tidak ditemukan"), 404)
    }

    // 1. Update individual answer grades
    for (const g of grades) {
      if (g.answer_id) {
        await prisma.examAnswer.update({
          where: { id: Number(g.answer_id) },
          data: {
            nilai: Number(g.nilai) || 0,
            is_correct: g.is_correct !== undefined ? Boolean(g.is_correct) : Number(g.nilai) > 0,
          },
        })
      }
    }

    // 2. Fetch fresh answers and recalculate total score
    const freshAnswers = await prisma.examAnswer.findMany({
      where: { participant_id: pId },
    })

    const paketItems = participant.exam?.paket_soal?.items || []
    let totalScore = 0
    let maxPossible = 0

    for (const item of paketItems) {
      maxPossible += item.bobot
      const ans = freshAnswers.find((a) => a.bank_soal_id === item.bank_soal_id)
      if (ans && ans.nilai !== null) {
        totalScore += ans.nilai
      }
    }

    const finalScore = maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0
    const roundedScore = Math.round(finalScore * 100) / 100

    const updatedParticipant = await prisma.examParticipant.update({
      where: { id: pId },
      data: {
        nilai_akhir: roundedScore,
        catatan_guru: catatan_guru !== undefined ? catatan_guru : participant.catatan_guru,
      },
    })

    return ok({
      participant: updatedParticipant,
      nilai_akhir: roundedScore,
    }, "Penilaian berhasil disimpan dan nilai akhir berhasil diperbarui")
  } catch (error) {
    return apiError(error)
  }
}

