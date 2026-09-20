import "server-only"
import { NextRequest } from "next/server"
import { examService } from "@/services/exam.service"
import { ok, created, apiError } from "@/lib/api-utils"
import { isAdmin, requireApiUser } from "@/auth/api-authorization"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    
    let actualGuruId: number | undefined = undefined
    if (user.role === "guru") {
      const teacher = await import("@/lib/prisma").then(m => m.prisma.teacher.findUnique({
        where: { user_id: user.id }
      }))
      actualGuruId = teacher?.id
    }

    // Usually we filter exams by teaching_class. If guru, we find all their classes first.
    // For simplicity, we just fetch all if admin, or filter later.
    let teachingClassIds: number[] = []
    if (actualGuruId && !isAdmin(user)) {
      const classes = await import("@/lib/prisma").then(m => m.prisma.teachingClass.findMany({
        where: { teacher_id: actualGuruId },
        select: { id: true }
      }))
      teachingClassIds = classes.map(c => c.id)
    }

    const tipe = request.nextUrl.searchParams.get("tipe")
    const items = await examService.getAll()
    let filteredItems = isAdmin(user) ? items : items.filter(i => !i.teaching_class_id || teachingClassIds.includes(i.teaching_class_id))
    
    if (tipe) {
      filteredItems = filteredItems.filter(i => i.tipe === tipe)
    }
    
    return ok(filteredItems)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const body = await request.json()
    
    let kelas = body.kelas
    if (!kelas && body.teaching_class_id) {
      const tc = await import("@/lib/prisma").then(m => m.prisma.teachingClass.findUnique({
        where: { id: body.teaching_class_id },
        select: { kelas: true }
      }))
      if (tc?.kelas) kelas = tc.kelas
    }
    
    const createdItem = await examService.create({
      judul: body.judul,
      tipe: body.tipe,
      paket_soal_id: body.paket_soal_id,
      teaching_class_id: body.teaching_class_id,
      kelas: kelas,
      deskripsi: body.deskripsi,
      waktu_mulai: body.waktu_mulai ? new Date(body.waktu_mulai) : undefined,
      waktu_selesai: body.waktu_selesai ? new Date(body.waktu_selesai) : undefined,
      durasi_menit: body.durasi_menit,
      kkm: body.kkm,
      percobaan_maksimal: body.percobaan_maksimal,
      acak_urutan_soal: body.acak_urutan_soal,
      acak_urutan_jawaban: body.acak_urutan_jawaban,
      tampilkan_nilai: body.tampilkan_nilai,
      status: body.status
    })
    
    return created(createdItem, "Exam berhasil dibuat")
  } catch (error) {
    return apiError(error)
  }
}
