import { prisma } from "@/lib/prisma"
import { ok } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    try {
      await requireApiUser("super_admin")
    } catch {
      return new Response("Not Found", { status: 404 })
    }
  }

  const students = await prisma.student.findMany({
    include: { user: true, classroom: true }
  })
  
  const exams = await prisma.exam.findMany({
    include: {
      paket_soal: {
        include: {
          items: {
            include: { bank_soal: true }
          }
        }
      },
      teaching_class: true
    }
  })

  const teachingClasses = await prisma.teachingClass.findMany()

  return ok({
    students: students.map(s => ({
      id: s.id,
      nama: s.nama_lengkap,
      kelas: s.kelas,
      classroom: s.classroom?.name,
      user_id: s.user_id,
      user_role: s.user?.role
    })),
    exams: exams.map(e => ({
      id: e.id,
      judul: e.judul,
      tipe: e.tipe,
      status: e.status,
      kelas: e.kelas,
      teaching_class_id: e.teaching_class_id,
      teaching_class_kelas: e.teaching_class?.kelas,
      paket_soal_id: e.paket_soal_id,
      paket_soal_judul: e.paket_soal?.judul,
      soal_count: e.paket_soal?.items?.length ?? 0
    })),
    teachingClasses: teachingClasses.map(t => ({
      id: t.id,
      kelas: t.kelas,
      mata_pelajaran: t.mata_pelajaran,
      guru_nama: t.guru_nama
    }))
  })
}
