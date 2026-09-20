import "server-only"
import { NextRequest } from "next/server"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser, getStudentProfile, isAdmin } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireApiUser("super_admin", "admin", "guru", "siswa")
    const participantId = Number(id)
    
    // Authorization check
    let whereClause: any = { id: participantId }
    if (user.role === "siswa") {
      const student = await getStudentProfile(user)
      if (!student) return apiError(new Error("Profil siswa tidak ditemukan"), 404)
      whereClause.student_id = student.id
    } else if (user.role === "guru") {
      const teacher = await prisma.teacher.findUnique({ where: { user_id: user.id } })
      if (teacher) {
        whereClause.exam = { teaching_class: { teacher_id: teacher.id } }
      }
    }

    const participant = await prisma.examParticipant.findFirst({
      where: whereClause,
      include: {
        student: { select: { id: true, nama_lengkap: true, nis: true, kelas: true } },
        answers: {
          include: {
            bank_soal: {
              select: {
                pertanyaan: true,
                options: true
              }
            }
          },
          orderBy: { id: "asc" } // Keep them somewhat ordered
        }
      }
    })

    if (!participant) {
      return apiError(new Error("Hasil ujian tidak ditemukan atau Anda tidak memiliki akses"), 404)
    }

    const exam = await prisma.exam.findUnique({
      where: { id: participant.exam_id },
      include: {
        paket_soal: { select: { mata_pelajaran: true } },
        teaching_class: { select: { guru_nama: true } }
      }
    })

    if (!exam) return apiError(new Error("Ujian tidak ditemukan"), 404)

    // Map to detail format
    let statusHasil = "Menunggu Penilaian"
    let jumlah_benar = 0
    let jumlah_salah = 0
    let jumlah_kosong = 0
    const jumlah_soal = participant.answers.length

    const soal_review = participant.answers.map((a, i) => {
      let jawabanPesertaTeks = null
      let jawabanBenarTeks = "-"
      
      if (a.jawaban_esai) {
        jawabanPesertaTeks = a.jawaban_esai
        jawabanBenarTeks = "Lihat Pembahasan" // or from bank_soal.pembahasan if existed
      } else if (a.selected_option_id) {
        const selectedOpt = a.bank_soal.options.find(o => o.id === a.selected_option_id)
        if (selectedOpt) jawabanPesertaTeks = selectedOpt.teks
      }

      const correctOpt = a.bank_soal.options.find(o => o.is_correct)
      if (correctOpt) jawabanBenarTeks = correctOpt.teks

      let status = "Tidak Dijawab"
      if (a.is_correct === true) {
        status = "Benar"
        jumlah_benar++
      } else if (a.is_correct === false) {
        status = "Salah"
        jumlah_salah++
      } else if (!a.selected_option_id && !a.jawaban_esai) {
        status = "Tidak Dijawab"
        jumlah_kosong++
      }

      return {
        nomor: i + 1,
        pertanyaan: a.bank_soal.pertanyaan,
        jawaban_peserta: jawabanPesertaTeks,
        jawaban_benar: jawabanBenarTeks,
        status
      }
    })

    if (participant.status === "SELESAI" && participant.nilai_akhir !== null) {
      statusHasil = participant.nilai_akhir >= exam.kkm ? "Lulus" : "Tidak Lulus"
    } else if (participant.status === "MENGERJAKAN") {
      statusHasil = "Menunggu Penilaian"
    }

    const detailData = {
      id: participant.id,
      siswa_id: participant.student.id,
      siswa_nama: participant.student.nama_lengkap,
      siswa_nis: participant.student.nis,
      siswa_kelas: participant.student.kelas || "-",
      mata_pelajaran: exam.paket_soal.mata_pelajaran,
      guru_nama: exam.teaching_class?.guru_nama || "Sistem",
      nama_ujian: exam.judul,
      jenis_ujian: exam.tipe,
      durasi: exam.durasi_menit || 0,
      waktu_mulai: participant.waktu_mulai?.toISOString() || "",
      waktu_selesai: participant.waktu_selesai?.toISOString() || "",
      tanggal: participant.created_at.toISOString(),
      nilai: participant.nilai_akhir,
      jumlah_soal,
      jumlah_benar,
      jumlah_salah,
      jumlah_kosong,
      status: statusHasil,
      catatan_evaluasi: (participant as any).catatan_guru || "",
      feedback_guru: (participant as any).catatan_guru || "", // Duplicate for frontend compatibility
      soal_review
    }

    return ok(detailData)
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
    const user = await requireApiUser("super_admin", "admin", "guru")
    const participantId = Number(id)
    const body = await request.json()
    
    // Authorization check
    let whereClause: any = { id: participantId }
    if (user.role === "guru") {
      const teacher = await prisma.teacher.findUnique({ where: { user_id: user.id } })
      if (teacher) {
        whereClause.exam = { teaching_class: { teacher_id: teacher.id } }
      }
    }

    const participant = await prisma.examParticipant.findFirst({
      where: whereClause
    })

    if (!participant) {
      return apiError(new Error("Hasil ujian tidak ditemukan atau Anda tidak memiliki akses"), 404)
    }

    const updated = await prisma.examParticipant.update({
      where: { id: participant.id },
      data: {
        catatan_guru: body.catatan_evaluasi,
        // Usually status (Lulus/Tidak Lulus) is dynamic based on KKM. 
        // We won't let them override `status` manually if it's derived.
      }
    })

    return ok(updated, "Hasil ujian berhasil diperbarui")
  } catch (error) {
    return apiError(error)
  }
}
