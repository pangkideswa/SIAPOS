import "server-only"
import { NextRequest } from "next/server"
import { examService } from "@/services/exam.service"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser, getStudentProfile } from "@/auth/api-authorization"

// Deterministic Pseudo-Random Number Generator (LCG)
function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const rng = seededRandom(seed)
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await requireApiUser("siswa")
    const student = await getStudentProfile(user)
    if (!student) return apiError(new Error("Profil siswa tidak ditemukan"), 404)

    const examId = Number(id)
    if (isNaN(examId)) return apiError(new Error("ID ujian tidak valid"), 400)

    // 1. Fetch Exam
    const exam = await examService.getById(examId)
    if (!exam) return apiError(new Error("Ujian tidak ditemukan"), 404)

    // 2. Validate Exam Status
    if (exam.status !== "PUBLISH") {
      return apiError(new Error("Ujian ini belum dipublikasikan oleh Guru"), 403)
    }

    // 3. Check or Enroll Participant
    let participant = (await examService.getParticipant(examId, student.id)) as any
    if (!participant) {
      participant = (await examService.enrollStudent(examId, student.id)) as any
    }

    const now = new Date()
    // If student hasn't started yet, enforce start and end schedule window
    if (participant.status === "BELUM_MULAI") {
      if (exam.waktu_mulai && now < new Date(exam.waktu_mulai)) {
        return apiError(new Error("Waktu pelaksanaan ujian belum dimulai"), 403)
      }
      if (exam.waktu_selesai && now > new Date(exam.waktu_selesai)) {
        return apiError(new Error("Waktu pelaksanaan ujian telah berakhir"), 403)
      }
    }

    // Parse request body for token or start signal if present
    const body = await request.json().catch(() => ({}))
    const providedToken = body?.token ? String(body.token).trim().toUpperCase() : null
    const isExplicitStart = !!body?.start

    // Token Validation: required if exam has token, participant is BELUM_MULAI, and student clicked start
    if (exam.token && exam.token.trim() !== "") {
      if (participant.status === "BELUM_MULAI" && isExplicitStart) {
        if (!providedToken) {
          return apiError(new Error("Token Ujian wajib diisi."), 400)
        }
        if (providedToken !== exam.token.trim().toUpperCase()) {
          return apiError(new Error("Token Ujian salah. Pastikan huruf dan angka sudah sesuai dengan pengawas."), 400)
        }
      }
    }

    // Start exam timestamp when student explicitly starts
    if (participant.status === "BELUM_MULAI" && isExplicitStart) {
      participant = (await examService.startExam(participant.id)) as any
    }

    // Refresh participant with answers
    participant = (await examService.getParticipant(examId, student.id)) as any

    // 4. Calculate accurate remaining time (Server-side truth)
    const durationMinutes = exam.durasi_menit || 60
    const durationSeconds = durationMinutes * 60
    let remainingSeconds = durationSeconds

    if (participant.status === "MENGERJAKAN" && participant.waktu_mulai) {
      const startTime = new Date(participant.waktu_mulai).getTime()
      const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000))
      remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds)

      if (exam.waktu_selesai) {
        const scheduleRemaining = Math.max(0, Math.floor((new Date(exam.waktu_selesai).getTime() - Date.now()) / 1000))
        remainingSeconds = Math.min(remainingSeconds, scheduleRemaining)
      }

      // If time has completely expired and participant has not submitted yet, auto-submit
      if (remainingSeconds <= 0) {
        participant = await examService.submitExam(participant.id)
      }
    }

    // 5. Sanitize questions & options (NEVER leak is_correct or pembahasan)
    let rawItems =
      exam.paket_soal?.items?.map((item: any) => ({
        id: item.bank_soal.id,
        nomor_urut: item.nomor_urut,
        bobot: item.bobot,
        pertanyaan: item.bank_soal.pertanyaan,
        tipe_soal: item.bank_soal.tipe_soal,
        lampiran: item.bank_soal.lampiran,
        options: (item.bank_soal.options || []).map((opt: any) => ({
          id: opt.id,
          teks: opt.teks,
          // CRITICAL: is_correct is strictly omitted!
        })),
      })) || []

    // 6. Deterministic Shuffle per participant
    if (exam.acak_urutan_soal) {
      rawItems = shuffleWithSeed(rawItems, participant.id * 10007 + exam.id)
    }

    if (exam.acak_urutan_jawaban) {
      rawItems = rawItems.map((q: any) => ({
        ...q,
        options: q.options ? shuffleWithSeed(q.options, participant.id * 997 + q.id) : [],
      }))
    }

    const sanitizedExam = {
      id: exam.id,
      judul: exam.judul,
      tipe: exam.tipe,
      deskripsi: exam.deskripsi,
      durasi_menit: exam.durasi_menit,
      kkm: exam.kkm,
      tampilkan_nilai: exam.tampilkan_nilai,
      acak_urutan_soal: exam.acak_urutan_soal,
      acak_urutan_jawaban: exam.acak_urutan_jawaban,
      waktu_mulai: exam.waktu_mulai,
      waktu_selesai: exam.waktu_selesai,
      has_token: !!(exam.token && exam.token.trim() !== ""),
      soal_items: rawItems,
    }

    return ok({
      participant,
      exam: sanitizedExam,
      remaining_seconds: remainingSeconds,
      total_soal: rawItems.length,
    }, "Ujian berhasil dimuat")
  } catch (error) {
    return apiError(error)
  }
}
