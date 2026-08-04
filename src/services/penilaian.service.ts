import "server-only"
import { z } from "zod"
import { submissionRepository } from "@/repositories/submission.repository"
import { assignmentRepository } from "@/repositories/assignment.repository"
import type { Penilaian } from "@/features/penilaian/types/penilaian"
import { penilaianUpdateSchema } from "@/lib/validations/penilaian.schemas"

type PenilaianUpdateData = z.input<typeof penilaianUpdateSchema>

const DEFAULT_STATUS: Penilaian["status_penilaian"] = "Belum Dinilai"

function toStatusPenilaian(
  nilai: number | null,
  feedback: string | null
): Penilaian["status_penilaian"] {
  if (nilai !== null) return "Sudah Dinilai"
  if (feedback) return "Revisi"
  return "Belum Dinilai"
}

type SubmissionRow = NonNullable<
  Awaited<ReturnType<typeof submissionRepository.findById>>
>

async function toPenilaian(
  row: SubmissionRow
): Promise<Penilaian> {
  const assignment = row.assignment_id
    ? await assignmentRepository.findById(row.assignment_id)
    : null
  return {
    id: row.id,
    pengumpulan_id: row.id,
    tugas_id: row.assignment_id ?? 0,
    siswa_nama: row.student?.nama_lengkap ?? "",
    siswa_kelas: row.student?.kelas ?? "",
    mata_pelajaran: assignment?.mata_pelajaran ?? "",
    guru_nama: assignment?.guru_nama ?? "",
    tugas_judul: assignment?.judul ?? "",
    tenggat_waktu: assignment?.tenggat_waktu?.toISOString() ?? "",
    nilai: row.nilai,
    feedback_guru: row.feedback ?? "",
    status_penilaian: toStatusPenilaian(row.nilai, row.feedback),
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

export const penilaianService = {
  async getAll(): Promise<Penilaian[]> {
    const rows = await submissionRepository.findAll()
    const result: Penilaian[] = []
    for (const row of rows) {
      result.push(await toPenilaian(row))
    }
    return result
  },

  async getById(id: number): Promise<Penilaian | null> {
    const row = await submissionRepository.findById(id)
    return row ? toPenilaian(row) : null
  },

  async grade(id: number, data: PenilaianUpdateData): Promise<Penilaian | null> {
    const status = data.status_penilaian ?? DEFAULT_STATUS
    const nilai =
      status === "Sudah Dinilai" ? data.nilai ?? null : null
    const row = await submissionRepository.update(id, {
      nilai,
      feedback: data.feedback ?? null,
    })
    if (!row) return null

    const penilaian = await toPenilaian(row)
    return {
      ...penilaian,
      status_penilaian: status,
    }
  },
}
