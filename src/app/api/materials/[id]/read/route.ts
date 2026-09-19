import "server-only"
import { NextRequest } from "next/server"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await requireApiUser()
    const materialId = parseInt(id)

    if (isNaN(materialId)) {
      return apiError(new Error("ID materi tidak valid"), 400)
    }

    if (user.role !== "SISWA") {
      return ok({ success: true, message: "Ignored for non-students" })
    }

    // Find student ID
    const student = await prisma.student.findUnique({
      where: { user_id: user.id },
    })

    if (!student) {
      return apiError(new Error("Data siswa tidak ditemukan"), 404)
    }

    // Upsert read status
    await prisma.materialRead.upsert({
      where: {
        material_id_student_id: {
          material_id: materialId,
          student_id: student.id,
        },
      },
      create: {
        material_id: materialId,
        student_id: student.id,
      },
      update: {}, // do nothing if already exists
    })

    return ok({ success: true })
  } catch (error) {
    return apiError(error)
  }
}
