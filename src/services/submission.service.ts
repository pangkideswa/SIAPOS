import "server-only"
import { Prisma } from "@/generated/prisma/client"
import { submissionRepository, type SubmissionRow } from "@/repositories/submission.repository"
import { toSubmissionStatus } from "@/lib/db-mappers"
import type {
  PengumpulanTugas,
  PengumpulanTugasFormData,
} from "@/features/pengumpulan/types/pengumpulan"

function toPengumpulan(row: SubmissionRow): PengumpulanTugas {
  const file = row.file_jawaban as PengumpulanTugas["file_jawaban"] | null
  return {
    id: row.id,
    tugas_id: row.assignment_id ?? 0,
    siswa_id: row.student_id ?? 0,
    siswa_nama: row.student?.nama_lengkap ?? "",
    siswa_kelas: row.student?.kelas ?? "",
    file_jawaban: file,
    catatan: row.catatan ?? "",
    waktu_pengumpulan: row.waktu_pengumpulan?.toISOString() ?? null,
    status: toSubmissionStatus(row.status),
    nilai: row.nilai,
    feedback: row.feedback,
    riwayat_pengumpulan: [
      {
        id: row.id,
        file_jawaban: file,
        catatan: row.catatan ?? "",
        waktu_pengumpulan: row.waktu_pengumpulan?.toISOString() ?? null,
      },
    ],
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

function toPengumpulanCreate(
  data: PengumpulanTugasFormData,
  assignmentId: number,
  studentId: number
) {
  return {
    assignment_id: assignmentId,
    student_id: studentId,
    file_jawaban: data.file_jawaban as unknown as Prisma.InputJsonValue,
    catatan: data.catatan || null,
    waktu_pengumpulan: new Date(),
    status: "SUBMITTED" as const,
  }
}

export const submissionService = {
  async getAll(): Promise<PengumpulanTugas[]> {
    const rows = await submissionRepository.findAll()
    return rows.map(toPengumpulan)
  },

  async getByAssignment(assignmentId: number): Promise<PengumpulanTugas[]> {
    const rows = await submissionRepository.findByAssignmentId(assignmentId)
    return rows.map(toPengumpulan)
  },

  async getById(id: number): Promise<PengumpulanTugas | null> {
    const row = await submissionRepository.findById(id)
    return row ? toPengumpulan(row) : null
  },

  async create(
    data: PengumpulanTugasFormData,
    assignmentId: number,
    studentId: number
  ): Promise<PengumpulanTugas> {
    const row = await submissionRepository.create(
      toPengumpulanCreate(data, assignmentId, studentId)
    )
    return toPengumpulan(row)
  },

  async grade(
    id: number,
    nilai: number | null,
    feedback?: string | null
  ): Promise<PengumpulanTugas | null> {
    const row = await submissionRepository.update(id, {
      nilai,
      feedback: feedback ?? null,
    })
    return row ? toPengumpulan(row) : null
  },

  async remove(id: number): Promise<boolean> {
    await submissionRepository.delete(id)
    return true
  },
}
