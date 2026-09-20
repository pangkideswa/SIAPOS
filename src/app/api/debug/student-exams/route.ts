import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok } from "@/lib/api-utils"

export async function GET(req: NextRequest) {
  const students = await prisma.student.findMany({
    include: { user: true }
  })
  
  const exams = await prisma.exam.findMany()

  return ok({
    students: students.map(s => ({
      id: s.id,
      nama: s.nama_lengkap,
      kelas: s.kelas,
      user_id: s.user_id,
      user_role: s.user?.role
    })),
    exams: exams.map(e => ({
      id: e.id,
      judul: e.judul,
      tipe: e.tipe,
      status: e.status,
      kelas: e.kelas
    }))
  })
}
