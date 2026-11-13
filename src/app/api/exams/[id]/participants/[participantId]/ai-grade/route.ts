import "server-only"
import { NextRequest } from "next/server"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"
import { GoogleGenAI, Type } from "@google/genai"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const { id, participantId } = await params
    await requireApiUser("super_admin", "admin", "guru")

    const examId = Number(id)
    const pId = Number(participantId)

    if (isNaN(examId) || isNaN(pId)) {
      return apiError(new Error("ID ujian atau peserta tidak valid"), 400)
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return apiError(new Error("GEMINI_API_KEY belum dikonfigurasi di environment server"), 500)
    }

    // Ambil data peserta beserta paket soal dan jawaban
    const participant = await prisma.examParticipant.findUnique({
      where: { id: pId },
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
                        options: true,
                      },
                    },
                  },
                  orderBy: { nomor_urut: "asc" },
                },
              },
            },
          },
        },
      },
    })

    if (!participant || participant.exam_id !== examId) {
      return apiError(new Error("Peserta ujian tidak ditemukan"), 404)
    }

    const answersMap = new Map(participant.answers.map((a) => [a.bank_soal_id, a]))

    // Saring hanya soal bertipe ESAI
    const items = participant.exam?.paket_soal?.items || []
    const essayQuestions = items
      .filter((item) => item.bank_soal.tipe_soal === "ESAI")
      .map((item) => {
        const studentAns = answersMap.get(item.bank_soal_id)
        const correctOpt = item.bank_soal.options?.find((o) => o.is_correct)
        return {
          answer_id: studentAns?.id,
          bank_soal_id: item.bank_soal_id,
          pertanyaan: item.bank_soal.pertanyaan,
          bobot: item.bobot,
          pembahasan: item.bank_soal.pembahasan || "",
          jawaban_benar_esai: correctOpt?.teks || item.bank_soal.pembahasan || "",
          jawaban_esai: studentAns?.jawaban_esai?.trim() || "",
        }
      })

    if (essayQuestions.length === 0) {
      return ok({
        results: [],
        message: "Tidak ada soal esai yang perlu dikoreksi untuk peserta ini",
      })
    }

    // Pisahkan soal yang kosong dan soal yang diisi oleh siswa
    const questionsToEvaluate: any[] = []
    const results: Array<{
      answer_id?: number
      bank_soal_id: number
      skor: number
      bobot: number
      alasan: string
    }> = []

    for (const eq of essayQuestions) {
      if (!eq.jawaban_esai) {
        results.push({
          answer_id: eq.answer_id,
          bank_soal_id: eq.bank_soal_id,
          skor: 0,
          bobot: eq.bobot,
          alasan: "Siswa tidak memberikan jawaban pada soal ini.",
        })
      } else {
        questionsToEvaluate.push(eq)
      }
    }

    if (questionsToEvaluate.length > 0) {
      const ai = new GoogleGenAI({ apiKey })

      const promptPayload = questionsToEvaluate.map((q, idx) => ({
        index: idx,
        pertanyaan: q.pertanyaan,
        bobot_maksimal: q.bobot,
        kunci_jawaban_atau_rubrik: q.jawaban_benar_esai || q.pembahasan || "Gunakan standar kebenaran materi terkait.",
        pembahasan_referensi: q.pembahasan || "",
        jawaban_siswa: q.jawaban_esai,
      }))

      const prompt = `Anda adalah seorang guru penguji yang objektif, teliti, dan adil.
Tugas Anda adalah menilai jawaban esai siswa berdasarkan pertanyaan, bobot maksimal, dan kunci jawaban/rubrik yang disediakan.

Berikut adalah daftar soal dan jawaban esai siswa yang perlu dinilai:
${JSON.stringify(promptPayload, null, 2)}

Pedoman Penilaian:
1. Berikan skor proporsional antara 0 sampai bobot maksimal sesuai kebenaran konsep, kelengkapan, dan kejelasan penalaran.
2. Jika jawaban benar sepenuhnya dan mencakup poin kunci, berikan skor penuh atau mendekati penuh.
3. Jika jawaban sebagian benar (sebagian konsep disebutkan tapi kurang lengkap), berikan skor parsial yang wajar.
4. Jika jawaban salah total atau tidak relevan, berikan skor 0.
5. Berikan feedback/alasan singkat, jelas, dan memotivasi dalam Bahasa Indonesia (maksimal 2 kalimat per soal).`

      const gradingSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            index: { type: Type.INTEGER },
            skor: { type: Type.NUMBER },
            alasan: { type: Type.STRING },
          },
        },
      }

      let response: any
      let retries = 3
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-flash-lite-latest",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: gradingSchema,
            },
          })
          break
        } catch (e: any) {
          retries--
          if (retries === 0) throw new Error("Layanan AI sedang sibuk. Silakan coba beberapa saat lagi.")
          await new Promise((res) => setTimeout(res, 2000))
        }
      }

      const evaluations = JSON.parse(response?.text || "[]")
      for (const ev of evaluations) {
        const item = questionsToEvaluate[ev.index]
        if (item) {
          // Batasi skor agar tidak melebihi bobot dan tidak negatif
          const safeScore = Math.min(Math.max(0, Number(ev.skor) || 0), item.bobot)
          results.push({
            answer_id: item.answer_id,
            bank_soal_id: item.bank_soal_id,
            skor: Math.round(safeScore * 10) / 10,
            bobot: item.bobot,
            alasan: ev.alasan || ev.feedback || ev.penjelasan || "Dievaluasi oleh AI",
          })
        }
      }
    }

    return ok({
      results,
      summary: `Berhasil menganalisis ${results.length} soal esai dengan AI.`,
    })
  } catch (error) {
    return apiError(error)
  }
}
