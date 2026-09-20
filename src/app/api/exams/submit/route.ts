import "server-only"
import { NextRequest } from "next/server"
import { examService } from "@/services/exam.service"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"

export async function POST(request: NextRequest) {
  try {
    await requireApiUser("siswa")
    const body = await request.json()
    
    // action: 'save' or 'submit'
    const { participant_id, action, answers } = body

    if (answers && Array.isArray(answers)) {
      for (const ans of answers) {
        await examService.saveAnswer(
          participant_id, 
          ans.bank_soal_id, 
          ans.selected_option_id, 
          ans.jawaban_esai
        )
      }
    }

    if (action === "submit") {
      const result = await examService.submitExam(participant_id)
      return ok(result, "Ujian berhasil diselesaikan")
    }

    return ok(null, "Jawaban berhasil disimpan")
  } catch (error) {
    return apiError(error)
  }
}
