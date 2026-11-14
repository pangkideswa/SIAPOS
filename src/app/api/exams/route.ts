import "server-only"
import { NextRequest } from "next/server"
import { examService } from "@/services/exam.service"
import { ok, created, apiError } from "@/lib/api-utils"
import {
  isAdmin,
  requireApiUser,
  allowedTeachingClassIdsFor,
  getTeacherProfile,
} from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const tipe = request.nextUrl.searchParams.get("tipe")
    const items = await examService.getAll()

    let filteredItems = items
    if (!isAdmin(user) && user.role === "guru") {
      const allowedTeachingClassIds = await allowedTeachingClassIdsFor(user)
      const teacherProfile = await getTeacherProfile(user)
      const guruName = teacherProfile?.nama_lengkap?.trim().toLowerCase()

      filteredItems = items.filter((i) => {
        // 1. Linked to teaching class belonging to this teacher
        if (i.teaching_class_id && allowedTeachingClassIds.has(i.teaching_class_id)) {
          return true
        }
        // 2. Teaching class guru_nama matches teacher
        if (guruName && i.teaching_class?.guru_nama?.trim().toLowerCase() === guruName) {
          return true
        }
        if (guruName && i.teaching_class?.teacher?.nama_lengkap?.trim().toLowerCase() === guruName) {
          return true
        }
        // 3. Paket soal author matches teacher
        if (guruName && i.paket_soal?.guru?.nama_lengkap?.trim().toLowerCase() === guruName) {
          return true
        }
        return false
      })
    }

    if (tipe) {
      filteredItems = filteredItems.filter((i) => i.tipe === tipe)
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

    let teaching_class_id = body.teaching_class_id ? Number(body.teaching_class_id) : undefined
    let kelas = body.kelas

    if (!kelas && teaching_class_id) {
      const tc = await prisma.teachingClass.findUnique({
        where: { id: teaching_class_id },
        select: { kelas: true },
      })
      if (tc?.kelas) kelas = tc.kelas
    }

    if (!teaching_class_id && user.role === "guru") {
      const teacher = await getTeacherProfile(user)
      if (teacher) {
        const tc = await prisma.teachingClass.findFirst({
          where: {
            OR: [
              { teacher_id: teacher.id },
              ...(teacher.nama_lengkap ? [{ guru_nama: { equals: teacher.nama_lengkap, mode: "insensitive" as const } }] : []),
            ],
            ...(kelas ? { kelas: { equals: kelas, mode: "insensitive" as const } } : {}),
          },
        })
        if (tc) {
          teaching_class_id = tc.id
          if (!kelas) kelas = tc.kelas
        }
      }
    }

    const createdItem = await examService.create({
      judul: body.judul,
      tipe: body.tipe || "QUIZ",
      paket_soal_id: body.paket_soal_id,
      teaching_class_id: teaching_class_id,
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
      status: body.status,
    })

    return created(createdItem, "Exam berhasil dibuat")
  } catch (error) {
    return apiError(error)
  }
}
