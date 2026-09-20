import { NextRequest, NextResponse } from "next/server"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireApiUser("super_admin", "admin", "guru")

    const examId = Number(id)
    
    // Get all participants for this exam
    const participants = await prisma.examParticipant.findMany({
      where: {
        exam_id: examId,
      },
      include: {
        student: {
          include: {
            user: true
          }
        },
        answers: true
      },
      orderBy: {
        nilai_akhir: "desc"
      }
    })

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        paket_soal: true
      }
    })

    if (!exam) return apiError(new Error("Exam tidak ditemukan"), 404)

    return ok({ participants, exam }, "Peserta ujian berhasil dimuat")
  } catch (error) {
    return apiError(error)
  }
}
