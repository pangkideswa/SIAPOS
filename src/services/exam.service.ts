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
  status?: ExamStatus
}

export type ExamUpdateInput = Partial<ExamCreateInput>

export const examService = {
  async getAll(teachingClassId?: number) {
    return await prisma.exam.findMany({
      where: teachingClassId ? { teaching_class_id: teachingClassId } : undefined,
      include: {
        paket_soal: {
          select: { judul: true, mata_pelajaran: true }
        },
        teaching_class: {
          select: { kelas: true, mata_pelajaran: true }
        },
        _count: {
          select: { participants: true }
        }
      },
      orderBy: { created_at: "desc" },
    })
  },

  async getForStudent(kelas: string, tipe?: ExamType) {
    return await prisma.exam.findMany({
      where: {
        status: "PUBLISH",
        kelas: kelas,
        ...(tipe ? { tipe } : {}),
      },
      include: {
        paket_soal: {
          select: { judul: true, mata_pelajaran: true }
        },
        teaching_class: {
          select: { guru_nama: true, mata_pelajaran: true }
        },
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
            items: {
              include: { bank_soal: { include: { options: true } } },
              orderBy: { nomor_urut: "asc" }
            }
          }
        },
      },
    })
  },

  async create(data: ExamCreateInput) {
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
        let isCorrect = false;

        if (item.bank_soal.tipe_soal === "PILIHAN_GANDA" && answer.selected_option_id) {
          const correctOption = item.bank_soal.options.find(o => o.is_correct)
          isCorrect = !!correctOption && correctOption.id === answer.selected_option_id
        } else if (item.bank_soal.tipe_soal === "ESAI" && answer.jawaban_esai) {
          const correctOption = item.bank_soal.options.find(o => o.is_correct)
          if (correctOption) {
            // Strict text match ignoring case and whitespace for "Isian Singkat"
            const studentAns = answer.jawaban_esai.toLowerCase().trim()
            const correctAns = correctOption.teks.toLowerCase().trim()
            isCorrect = studentAns === correctAns
          }
        }

        // Update correct status in answer
        await prisma.examAnswer.update({
          where: { id: answer.id },
          data: { 
            is_correct: isCorrect,
            nilai: isCorrect ? item.bobot : 0
          }
        });

        if (isCorrect) {
          totalScore += item.bobot;
        }
      }
    }

    const finalScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

    return await prisma.examParticipant.update({
      where: { id: participantId },
      data: {
        status: "SELESAI",
        waktu_selesai: new Date(),
        nilai_akhir: finalScore
      }
    });
  }
}
