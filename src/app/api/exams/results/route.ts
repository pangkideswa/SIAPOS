import "server-only"
import { NextRequest } from "next/server"
import { ok, apiError } from "@/lib/api-utils"
import { isAdmin, requireApiUser, getStudentProfile } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru", "siswa")
    
    let whereClause: any = {}

    if (user.role === "siswa") {
      const student = await getStudentProfile(user)
      if (!student) return apiError(new Error("Profil siswa tidak ditemukan"), 404)
      whereClause = { student_id: student.id, status: { not: "BELUM_MULAI" } } // Only show started exams
    } else if (user.role === "guru") {
      const teacher = await prisma.teacher.findUnique({
        where: { user_id: user.id }
      })
      if (teacher) {
        whereClause = {
          exam: {
            teaching_class: {
              teacher_id: teacher.id
            }
          }
        }
      }
    }

    const participants = await prisma.examParticipant.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            nama_lengkap: true,
            nis: true,
            kelas: true
          }
        },
        exam: {
          select: {
            id: true,
            judul: true,
            tipe: true,
            kkm: true,
            waktu_mulai: true,
            waktu_selesai: true,
            durasi_menit: true,
            paket_soal: {
              select: {
                mata_pelajaran: true
              }
            },
            teaching_class: {
              select: {
                guru_nama: true
              }
            }
          }
        },
        answers: {
          select: {
            is_correct: true,
            jawaban_esai: true,
            selected_option_id: true
          }
        }
      },
      orderBy: { created_at: "desc" }
    })

    // Map to HasilUjian format expected by frontend
    const mapped = participants.map((p) => {
      let statusHasil = "Menunggu Penilaian"
      let jumlah_benar = 0
      let jumlah_salah = 0
      let jumlah_kosong = 0
      const jumlah_soal = p.answers.length
      
      p.answers.forEach(a => {
        if (a.is_correct === true) jumlah_benar++
        else if (a.is_correct === false) jumlah_salah++
        else if (!a.selected_option_id && !a.jawaban_esai) jumlah_kosong++ // simplistic check
      })

      if (p.status === "SELESAI" && p.nilai_akhir !== null) {
        statusHasil = p.nilai_akhir >= p.exam.kkm ? "Lulus" : "Tidak Lulus"
      } else if (p.status === "MENGERJAKAN") {
        statusHasil = "Menunggu Penilaian" // Technically still working
      }

      return {
        id: p.id,
        siswa_id: p.student.id,
        siswa_nama: p.student.nama_lengkap,
        siswa_nis: p.student.nis,
        siswa_kelas: p.student.kelas || "-",
        mata_pelajaran: p.exam.paket_soal.mata_pelajaran,
        guru_nama: p.exam.teaching_class?.guru_nama || "Sistem",
        nama_ujian: p.exam.judul,
        jenis_ujian: p.exam.tipe,
        durasi: p.exam.durasi_menit || 0,
        waktu_mulai: p.waktu_mulai?.toISOString() || "",
        waktu_selesai: p.waktu_selesai?.toISOString() || "",
        tanggal: p.created_at.toISOString(),
        nilai: p.nilai_akhir,
        jumlah_soal,
        jumlah_benar,
        jumlah_salah,
        jumlah_kosong,
        status: statusHasil,
        catatan_evaluasi: (p as any).catatan_guru || "",
      }
    })

    return ok(mapped)
  } catch (error) {
    return apiError(error)
  }
}
