import "server-only"
import { NextRequest } from "next/server"
import { examService } from "@/services/exam.service"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireApiUser()
    const item = await examService.getById(Number(id))
    if (!item) return apiError(new Error("Exam tidak ditemukan"), 404)

    // Security: Do NOT leak correct answers to students during the exam!
    if (user.role === "siswa" && item.paket_soal?.items) {
      item.paket_soal.items.forEach((paketItem: any) => {
        if (paketItem.bank_soal?.options) {
          paketItem.bank_soal.options.forEach((opt: any) => {
            delete opt.is_correct;
          })
        }
      })
    }

    return ok(item)
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireApiUser("super_admin", "admin", "guru")
    const body = await request.json()
    
    let kelas = body.kelas
    if (!kelas && body.teaching_class_id) {
      const tc = await import("@/lib/prisma").then(m => m.prisma.teachingClass.findUnique({
        where: { id: body.teaching_class_id },
        select: { kelas: true }
      }))
      if (tc?.kelas) kelas = tc.kelas
    }
    
    const item = await examService.update(Number(id), {
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
    return ok(item, "Exam berhasil diperbarui")
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireApiUser("super_admin", "admin", "guru")
    await examService.delete(Number(id))
    return ok(null, "Exam berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
