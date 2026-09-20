import { NextRequest, NextResponse } from "next/server"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser, getStudentProfile } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireApiUser("siswa")
    const student = await getStudentProfile(user)
    if (!student) return apiError(new Error("Profil siswa tidak ditemukan"), 404)

    const examId = Number(id)
    
    // Get participant and its answers
    const participant = await prisma.examParticipant.findFirst({
      where: {
        exam_id: examId,
        student_id: student.id,
      },
      include: {
        answers: true
      }
    })

    if (!participant) {
      return apiError(new Error("Hasil ujian tidak ditemukan"), 404)
    }

    // Get Exam and Questions with correct answers (for Pembahasan)
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        paket_soal: {
          include: {
            items: {
              include: {
                bank_soal: {
                  include: {
                    options: true // Includes is_correct!
                  }
                }
              },
              orderBy: { id: "asc" }
            }
          }
        },
        teaching_class: true
      }
    })

    if (!exam) return apiError(new Error("Exam tidak ditemukan"), 404)

    return ok({ participant, exam }, "Hasil ujian berhasil dimuat")
  } catch (error) {
    return apiError(error)
  }
}
