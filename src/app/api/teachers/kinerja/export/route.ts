import "server-only"
import { NextRequest } from "next/server"
import { ok, apiError } from "@/lib/api-utils"
import { isAdmin, requireApiUser } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser()

    // Security check: Only Admin can access this
    if (!isAdmin(user)) {
      return apiError(new Error("Unauthorized"), 403)
    }

    const teachers = await prisma.teacher.findMany({
      include: {
        teaching_classes: {
          include: {
            _count: {
              select: {
                materials: true,
                assignments: true,
                attendance_sessions: true,
              },
            },
          },
        },
      },
      orderBy: {
        nama_lengkap: "asc",
      },
    })

    const results = teachers.map((t) => {
      let totalMateri = 0
      let totalTugas = 0
      let totalAbsensi = 0

      t.teaching_classes.forEach((tc) => {
        totalMateri += tc._count.materials
        totalTugas += tc._count.assignments
        totalAbsensi += tc._count.attendance_sessions
      })

      return {
        Nama: t.nama_lengkap,
        NIP: t.nip,
        Status_Kepegawaian: t.status_kepegawaian,
        Total_Materi: totalMateri,
        Total_Tugas: totalTugas,
        Sesi_Absensi: totalAbsensi,
      }
    })

    return ok(results)
  } catch (error) {
    return apiError(error)
  }
}
