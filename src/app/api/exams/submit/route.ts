import "server-only"
import { NextRequest } from "next/server"
import { examService } from "@/services/exam.service"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser, getStudentProfile } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("siswa")
    const student = await getStudentProfile(user)
    if (!student) return apiError(new Error("Profil siswa tidak ditemukan"), 404)

    const body = await request.json()
    const { participant_id, action, answers } = body

    if (!participant_id) {
      return apiError(new Error("Parameter participant_id wajib diisi"), 400)
    }

    // Verify participant exists and belongs to this student
    const participant = await prisma.examParticipant.findUnique({
      where: { id: participant_id },
      include: {
        exam: {
          select: { id: true, status: true, waktu_selesai: true, durasi_menit: true }
        }
      }
    })

    if (!participant) {
      return apiError(new Error("Data peserta ujian tidak ditemukan"), 404)
    }

    if (participant.student_id !== student.id) {
      return apiError(new Error("Akses tidak sah untuk peserta ini"), 403)
    }

    // If already finalized, do not accept modifications
    if (participant.status === "SELESAI") {
      return apiError(new Error("Ujian telah selesai dikerjakan"), 400)
    }

    if (participant.status === "CURANG") {
      return apiError(new Error("Ujian Anda telah dihentikan karena terdeteksi pelanggaran"), 403)
    }

    // Handle Violation action
    if (action === "violation") {
      const updated = await prisma.examParticipant.update({
        where: { id: participant_id },
        data: {
          violation_count: { increment: 1 }
        }
      })

      // Maximum 3 violations tolerance for anti-cheat
      const MAX_VIOLATIONS = 3
      if (updated.violation_count >= MAX_VIOLATIONS) {
        // Submit exam answers first to evaluate whatever was answered
        await examService.submitExam(participant_id)
        const locked = await prisma.examParticipant.update({
          where: { id: participant_id },
          data: {
            status: "CURANG",
            catatan_guru: `Dihentikan otomatis oleh sistem CBT karena melanggar aturan anti-curang sebanyak ${updated.violation_count} kali.`
          }
        })
        return ok(locked, "Ujian dihentikan karena telah melampaui batas toleransi pelanggaran anti-curang.")
      }

      return ok(updated, `Pelanggaran anti-curang dicatat (${updated.violation_count}/${MAX_VIOLATIONS})`)
    }

    // Handle Save Answers action
    if (answers && Array.isArray(answers)) {
      for (const ans of answers) {
        if (ans.bank_soal_id) {
          await examService.saveAnswer(
            participant_id,
            ans.bank_soal_id,
            ans.selected_option_id ? Number(ans.selected_option_id) : undefined,
            ans.jawaban_esai ?? undefined
          )
        }
      }
    }

    // Handle Submit Exam action
    if (action === "submit") {
      const result = await examService.submitExam(participant_id)
      return ok(result, "Ujian berhasil diselesaikan")
    }

    return ok(null, "Jawaban berhasil disimpan")
  } catch (error) {
    return apiError(error)
  }
}
