import "server-only"
import { NextRequest } from "next/server"
import { examService } from "@/services/exam.service"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"
import type { ExamType } from "@/generated/prisma/enums"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser("siswa")
    const { searchParams } = new URL(request.url)
    const tipe = searchParams.get("tipe") as ExamType | null

    const student = await prisma.student.findUnique({
      where: { user_id: user.id }
    })

    if (!student || !student.kelas) {
      return ok([]) // Return empty if student has no class
    }

    const items = await examService.getForStudent(student.kelas, tipe ?? undefined)
    
    return ok(items)
  } catch (error) {
    return apiError(error)
  }
}
