import { prisma } from "@/lib/prisma"
import type { ExamType, ExamStatus, ExamParticipantStatus } from "@/generated/prisma/enums"

export type ExamCreateInput = {
  judul: string
  tipe?: ExamType
  paket_soal_id: number
  teaching_class_id?: number
  kelas?: string
  deskripsi?: string
  waktu_mulai?: Date
  waktu_selesai?: Date
  durasi_menit?: number
  kkm?: number
  percobaan_maksimal?: number
  acak_urutan_soal?: boolean
  acak_urutan_jawaban?: boolean
  tampilkan_nilai?: boolean
  token?: string | null
  status?: ExamStatus
}

export type ExamUpdateInput = Partial<ExamCreateInput>

function generateExamToken(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let token = ""
  for (let i = 0; i < 6; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export const examService = {
  async getAll(teachingClassId?: number) {
    return await prisma.exam.findMany({
      where: teachingClassId ? { teaching_class_id: teachingClassId } : undefined,
      include: {
        paket_soal: {
          select: {
            judul: true,
            mata_pelajaran: true,
            guru: {
              select: { nama_lengkap: true }
            }
          }
        },
        teaching_class: {
          select: {
            kelas: true,
            mata_pelajaran: true,
            guru_nama: true,
            teacher: {
              select: { nama_lengkap: true }
            }
          }
        },
        _count: {
          select: { participants: true }
        }
      },
      orderBy: { created_at: "desc" },
    })
  },

  async getForStudent(kelas: string, tipe?: ExamType, studentId?: number) {
    const cleanKelas = (kelas || "").trim()
    return await prisma.exam.findMany({
      where: {
        status: "PUBLISH",
        ...(cleanKelas
          ? {
              OR: [
                { kelas: { equals: kelas, mode: "insensitive" } },
                { kelas: { equals: cleanKelas, mode: "insensitive" } },
                { kelas: { contains: cleanKelas, mode: "insensitive" } },
                { teaching_class: { kelas: { contains: cleanKelas, mode: "insensitive" } } },
                { kelas: null },
                { kelas: "" },
              ],
            }
          : {}),
        ...(tipe ? { tipe } : {}),
      },
      include: {
        paket_soal: {
          select: {
            judul: true,
            mata_pelajaran: true,
            guru: {
              select: { nama_lengkap: true }
            },
            _count: { select: { items: true } }
          }
        },
        teaching_class: {
          select: {
            guru_nama: true,
            mata_pelajaran: true,
            teacher: {
              select: { nama_lengkap: true }
            }
          }
        },
        ...(studentId ? {
          participants: {
            where: { student_id: studentId },
            select: {
              id: true,
              status: true,
              nilai_akhir: true,
              waktu_mulai: true,
              waktu_selesai: true,
              violation_count: true
            }
          }
        } : {})
      },
      orderBy: { created_at: "desc" },
    })
  },

  async getById(id: number) {
    return await prisma.exam.findUnique({
      where: { id },
      include: {
        paket_soal: {
          include: {
            guru: {
              select: { nama_lengkap: true }
            },
            items: {
              include: { bank_soal: { include: { options: true } } },
              orderBy: { nomor_urut: "asc" }
            }
          }
        },
        teaching_class: {
          select: {
            guru_nama: true,
            mata_pelajaran: true,
            teacher: {
              select: { nama_lengkap: true }
            }
          }
        }
      },
    })
  },

  async create(data: ExamCreateInput) {
    const isCbt = (data.tipe ?? "QUIZ") === "CBT"
    const token = data.token || (isCbt ? generateExamToken() : null)

    return await prisma.exam.create({
      data: {
        judul: data.judul,
        tipe: data.tipe ?? "QUIZ",
        paket_soal_id: data.paket_soal_id,
        teaching_class_id: data.teaching_class_id,
        kelas: data.kelas,
        deskripsi: data.deskripsi,
        waktu_mulai: data.waktu_mulai,
        waktu_selesai: data.waktu_selesai,
        durasi_menit: data.durasi_menit,
        kkm: data.kkm ?? 75,
        percobaan_maksimal: data.percobaan_maksimal ?? 1,
        acak_urutan_soal: data.acak_urutan_soal ?? false,
        acak_urutan_jawaban: data.acak_urutan_jawaban ?? false,
        tampilkan_nilai: data.tampilkan_nilai ?? false,
        token: token,
        status: data.status ?? "DRAFT",
      },
    })
  },

  async update(id: number, data: ExamUpdateInput) {
    return await prisma.exam.update({
      where: { id },
      data: {
        judul: data.judul,
        tipe: data.tipe,
        paket_soal_id: data.paket_soal_id,
        teaching_class_id: data.teaching_class_id,
        kelas: data.kelas,
        deskripsi: data.deskripsi,
        waktu_mulai: data.waktu_mulai,
        waktu_selesai: data.waktu_selesai,
        durasi_menit: data.durasi_menit,
        kkm: data.kkm,
        percobaan_maksimal: data.percobaan_maksimal,
        acak_urutan_soal: data.acak_urutan_soal,
        acak_urutan_jawaban: data.acak_urutan_jawaban,
        tampilkan_nilai: data.tampilkan_nilai,
        token: data.token,
        status: data.status,
      },
    })
  },

  async delete(id: number) {
    return await prisma.exam.delete({
      where: { id },
    })
  },

  // Participant endpoints
  async enrollStudent(examId: number, studentId: number) {
    return await prisma.examParticipant.create({
      data: {
        exam_id: examId,
        student_id: studentId,
        status: "BELUM_MULAI"
      }
    })
  },

  async getParticipant(examId: number, studentId: number) {
    return await prisma.examParticipant.findUnique({
      where: {
        exam_id_student_id: {
          exam_id: examId,
          student_id: studentId
        }
      },
      include: {
        answers: true
      }
    })
  },

  async startExam(participantId: number) {
    return await prisma.examParticipant.update({
      where: { id: participantId },
      data: {
        status: "MENGERJAKAN",
        waktu_mulai: new Date(),
      }
    })
  },

  async saveAnswer(participantId: number, bankSoalId: number, selectedOptionId?: number, jawabanEsai?: string) {
    return await prisma.examAnswer.upsert({
      where: {
        participant_id_bank_soal_id: {
          participant_id: participantId,
          bank_soal_id: bankSoalId
        }
      },
      update: {
        selected_option_id: selectedOptionId,
        jawaban_esai: jawabanEsai,
      },
      create: {
        participant_id: participantId,
        bank_soal_id: bankSoalId,
        selected_option_id: selectedOptionId,
        jawaban_esai: jawabanEsai,
      }
    })
  },

  async submitExam(participantId: number) {
    const participant = await prisma.examParticipant.findUnique({
      where: { id: participantId },
      include: {
        answers: true,
        exam: {
          include: {
            paket_soal: {
              include: {
                items: {
                  include: {
                    bank_soal: {
                      include: {
                        options: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!participant) throw new Error("Participant not found")

    let totalScore = 0
    let maxPossibleScore = 0

    const paketItems = participant.exam?.paket_soal?.items || []

    for (const item of paketItems) {
      maxPossibleScore += item.bobot
      
      const answer = participant.answers.find(a => a.bank_soal_id === item.bank_soal_id)
      if (answer) {
        let isCorrect: boolean | null = false
        let itemScore: number | null = 0

        if (item.bank_soal.tipe_soal === "PILIHAN_GANDA" && answer.selected_option_id) {
          const correctOption = item.bank_soal.options.find(o => o.is_correct)
          isCorrect = !!correctOption && correctOption.id === answer.selected_option_id
          itemScore = isCorrect ? item.bobot : 0
        } else if (item.bank_soal.tipe_soal === "ESAI" && answer.jawaban_esai) {
          const correctOption = item.bank_soal.options.find(o => o.is_correct)
          const studentAns = answer.jawaban_esai.toLowerCase().trim()
          
          if (correctOption && correctOption.teks) {
            const correctAns = correctOption.teks.toLowerCase().trim()
            // Check exact match or keyword inclusion
            if (studentAns === correctAns || (correctAns.length >= 3 && (studentAns.includes(correctAns) || correctAns.includes(studentAns)))) {
              isCorrect = true
              itemScore = item.bobot
            } else {
              // Not automatically matched: leave as pending teacher/AI review
              isCorrect = null
              itemScore = null
            }
          } else {
            // No rubric option present yet: leave as pending review
            isCorrect = null
            itemScore = null
          }
        }

        // Update answer in DB
        await prisma.examAnswer.update({
          where: { id: answer.id },
          data: { 
            is_correct: isCorrect,
            nilai: itemScore
          }
        });

        if (itemScore && itemScore > 0) {
          totalScore += itemScore;
        }
      }
    }

    const finalScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
    const roundedScore = Math.round(finalScore * 100) / 100;

    return await prisma.examParticipant.update({
      where: { id: participantId },
      data: {
        status: "SELESAI",
        waktu_selesai: new Date(),
        nilai_akhir: roundedScore
      }
    });
  }
}
