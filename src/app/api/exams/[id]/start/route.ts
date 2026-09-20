import "server-only"
import { NextRequest } from "next/server"
import { examService } from "@/services/exam.service"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"
import { getStudentProfile } from "@/auth/api-authorization"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireApiUser("siswa")
    const student = await getStudentProfile(user)
    if (!student) return apiError(new Error("Profil siswa tidak ditemukan"), 404)

    const examId = Number(id)
    
    // Check if participant already exists
    let participant = await examService.getParticipant(examId, student.id) as any
    
    if (!participant) {
      participant = await examService.enrollStudent(examId, student.id) as any
    }

    if (participant && participant.status === "BELUM_MULAI") {
      participant = await examService.startExam(participant.id) as any
    }

    // Get Exam and Questions
    const exam = await examService.getById(examId)
    if (!exam) return apiError(new Error("Ujian tidak ditemukan"), 404)

    return ok({ participant, exam }, "Ujian dimulai")
  } catch (error) {
    return apiError(error)
  }
}
