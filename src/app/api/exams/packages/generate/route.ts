import "server-only"
import { NextRequest } from "next/server"
import { bankSoalService } from "@/services/bank-soal.service"
import { paketSoalService } from "@/services/paket-soal.service"
import { ok, created, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"
import { GoogleGenAI, Type } from "@google/genai"
import { distributeProportionalWeights } from "@/lib/cbt-scoring"

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const body = await request.json()
    
    const { 
      nama_paket, mata_pelajaran, tingkat, kurikulum, topik, jumlah_soal, tipe_soal 
    } = body
    
    if (!nama_paket || !mata_pelajaran || !jumlah_soal) {
      return apiError(new Error("Nama paket, mata pelajaran, dan jumlah soal diperlukan"), 400)
    }

    let guruId: number | undefined = undefined
    if (user.role === "guru") {
      const teacher = await prisma.teacher.findUnique({
        where: { user_id: user.id }
      })
      guruId = teacher?.id
    }

    const typeMapping: Record<string, "PILIHAN_GANDA" | "ESAI"> = {
      "Pilihan Ganda": "PILIHAN_GANDA",
      "Essay": "ESAI",
      "Benar / Salah": "PILIHAN_GANDA",
      "Isian Singkat": "ESAI"
    }

    const qType = typeMapping[tipe_soal] || "PILIHAN_GANDA"
    const isPilihanGanda = qType === "PILIHAN_GANDA"
    
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return apiError(new Error("GEMINI_API_KEY belum dikonfigurasi di server"), 500)
    }
    const ai = new GoogleGenAI({ apiKey })
    
    const prompt = `Anda adalah seorang ahli pembuat soal ujian untuk siswa sekolah tingkat ${tingkat}. 
Mata Pelajaran: ${mata_pelajaran}
Topik/Materi: ${topik}
Kurikulum: ${kurikulum}
Tipe Soal: ${tipe_soal}
Jumlah Soal: ${jumlah_soal}

Buatkan paket soal ujian berkualitas tinggi dan mendidik sesuai topik. Hindari pertanyaan yang terlalu umum.
${tipe_soal === "Benar / Salah" ? `Setiap soal WAJIB memiliki tepat 2 opsi pilihan yaitu "Benar" dan "Salah", dan pastikan hanya satu opsi yang memiliki 'is_correct' bernilai true.` : tipe_soal === "Pilihan Ganda" ? `Setiap soal WAJIB memiliki tepat 4 opsi pilihan (A, B, C, D), dan pastikan hanya satu opsi yang memiliki 'is_correct' bernilai true.` : `Setiap soal WAJIB menyertakan 'jawaban_benar_esai' berupa kata kunci utama atau rubrik singkat jawaban yang benar.`}
Tingkat kesulitan (kesulitan) dapat bervariasi antara: MUDAH, SEDANG, atau SULIT.`

    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                pertanyaan: { type: Type.STRING },
                kesulitan: { type: Type.STRING },
                pembahasan: { type: Type.STRING },
                ...(isPilihanGanda ? {
                    pilihan_ganda: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                teks: { type: Type.STRING },
                                is_correct: { type: Type.BOOLEAN }
                            },
                        }
                    }
                } : {
                    jawaban_benar_esai: { type: Type.STRING }
                })
            }
        }
    }

    let response;
    let retries = 3;
    while (retries > 0) {
        try {
            response = await ai.models.generateContent({
                model: 'gemini-flash-lite-latest',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema
                }
            });
            break;
        } catch (e: any) {
            retries--;
            if (retries === 0) throw new Error("Layanan AI sedang sibuk. Silakan coba beberapa saat lagi.");
            await new Promise(res => setTimeout(res, 2000));
        }
    }

    const resultText = response?.text || "[]"
    let generatedQuestions: any[] = []
    
    try {
        generatedQuestions = JSON.parse(resultText)
    } catch (e) {
        return apiError(new Error("Gagal mem-parsing hasil AI"), 500)
    }

    if (!Array.isArray(generatedQuestions)) {
        return apiError(new Error("Format hasil AI tidak sesuai yang diharapkan"), 500)
    }

    const generatedIds = []
    
    for (let i = 0; i < Math.min(generatedQuestions.length, jumlah_soal); i++) {
      const q = generatedQuestions[i]
      const kode = `AI-${mata_pelajaran.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-4)}-${i+1}`
      
      let options = undefined
      if (isPilihanGanda && Array.isArray(q.pilihan_ganda)) {
        let hasCorrect = false
        options = q.pilihan_ganda.map((opt: any) => {
          const isCorrect = opt.is_correct === true || opt.is_correct === "true" || opt.is_correct === 1
          if (isCorrect) hasCorrect = true
          return {
            teks: opt.teks || "Opsi kosong",
            is_correct: isCorrect,
          }
        })
        if (!hasCorrect && options.length > 0) {
          options[0].is_correct = true
        }
      } else if (!isPilihanGanda) {
        const correctText = q.jawaban_benar_esai || q.kunci_jawaban || q.pembahasan || "Kunci Jawaban"
        options = [{
          teks: correctText,
          is_correct: true,
        }]
      }
      
      const createdItem = await bankSoalService.create({
        kode_soal: kode,
        mata_pelajaran,
        pertanyaan: q.pertanyaan || "Pertanyaan kosong",
        tipe_soal: qType,
        kesulitan: ["MUDAH", "SEDANG", "SULIT"].includes(q.kesulitan) ? q.kesulitan : "SEDANG",
        status: "PUBLISH",
        pembahasan: q.pembahasan || `Pembahasan dari AI.`,
        guru_id: guruId,
        options
      })
      generatedIds.push(createdItem.id)
    }

    const kodePaket = `PKT-AI-${Date.now().toString().slice(-6)}`
    const rawItems = generatedIds.map((id, index) => ({
      bank_soal_id: id,
      tipe_soal: qType,
      nomor_urut: index + 1
    }))
    const paketItems = distributeProportionalWeights(rawItems, 100)

    const createdPackage = await paketSoalService.create({
      kode_paket: kodePaket,
      judul: nama_paket,
      deskripsi: `Paket soal otomatis ter-generate dari topik ${topik}`,
      mata_pelajaran,
      durasi_menit: 60,
      status: "PUBLISH",
      guru_id: guruId,
      items: paketItems
    })

    return created({ packageId: createdPackage.id }, `Paket soal ${nama_paket} berhasil di-generate`)
  } catch (error) {
    return apiError(error)
  }
}
