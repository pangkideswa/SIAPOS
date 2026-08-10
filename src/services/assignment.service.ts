import "server-only"
import { Prisma, type Assignment } from "@/generated/prisma/client"
import { assignmentRepository } from "@/repositories/assignment.repository"
import { teachingClassRepository } from "@/repositories/teaching-class.repository"
import { studentRepository } from "@/repositories/student.repository"
import { notifikasiService } from "@/services/notifikasi.service"
import {
  toAssignmentStatus,
  toAssignmentStatusDb,
} from "@/lib/db-mappers"
import type { Tugas, TugasFormData } from "@/features/tugas/types/tugas"

function toTugas(row: Assignment): Tugas {
  return {
    id: row.id,
    judul: row.judul,
    deskripsi: row.deskripsi ?? "",
    kelas_mengajar_id: row.teaching_class_id ?? 0,
    guru_nama: row.guru_nama ?? "",
    mata_pelajaran: row.mata_pelajaran ?? "",
    kelas: row.kelas ?? "",
    lampiran: Array.isArray(row.lampiran)
      ? (row.lampiran as unknown as Tugas["lampiran"])
      : [],
    tanggal_dibuka: row.tanggal_dibuka?.toISOString() ?? "",
    tenggat_waktu: row.tenggat_waktu?.toISOString() ?? "",
    tenggat_jam: row.tenggat_jam,
    nilai_maksimal: row.nilai_maksimal,
    status: toAssignmentStatus(row.status),
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

function toTugasCreate(data: TugasFormData): Prisma.AssignmentUncheckedCreateInput {
  return {
    teaching_class_id: data.kelas_mengajar_id || null,
    judul: data.judul,
    deskripsi: data.deskripsi || null,
    guru_nama: data.guru_nama || null,
    mata_pelajaran: data.mata_pelajaran || null,
    kelas: data.kelas || null,
    lampiran:
      data.lampiran.length > 0
        ? (data.lampiran as unknown as Prisma.InputJsonValue)
        : undefined,
    tanggal_dibuka: data.tanggal_dibuka ? new Date(data.tanggal_dibuka) : null,
    tenggat_waktu: data.tenggat_waktu ? new Date(data.tenggat_waktu) : null,
    tenggat_jam: data.tenggat_jam,
    nilai_maksimal: data.nilai_maksimal,
    status: toAssignmentStatusDb(data.status),
  }
}

export const assignmentService = {
  async getAll(): Promise<Tugas[]> {
    const rows = await assignmentRepository.findAll()
    return rows.map(toTugas)
  },

  async getById(id: number): Promise<Tugas | null> {
    const row = await assignmentRepository.findById(id)
    return row ? toTugas(row) : null
  },

  async getByKelasMengajar(kelasMengajarId: number): Promise<Tugas[]> {
    const rows = await assignmentRepository.findByTeachingClassId(kelasMengajarId)
    return rows.map(toTugas)
  },

  async create(data: TugasFormData): Promise<Tugas> {
    const row = await assignmentRepository.create(toTugasCreate(data))
    
    try {
      if (row.teaching_class_id) {
        const tc = await teachingClassRepository.findById(row.teaching_class_id)
        if (tc?.classroom_id) {
          const students = await studentRepository.findByClassroomId(tc.classroom_id)
          const userIds = students.map((s) => s.user_id).filter(Boolean) as number[]
          if (userIds.length > 0) {
            await notifikasiService.createForUsers({
              user_ids: userIds,
              tipe: "tugas",
              judul: "Tugas Baru",
              pesan: `Tugas baru "${row.judul}" ditambahkan pada mata pelajaran ${row.mata_pelajaran || tc.mata_pelajaran}.`,
              href: `/siswa/tugas/${row.id}`
            })
          }
        }
      }
    } catch (e) {
      console.error("Failed to send assignment notification:", e)
    }

    return toTugas(row)
  },

  async update(id: number, data: TugasFormData): Promise<Tugas | null> {
    const row = await assignmentRepository.update(id, toTugasCreate(data))
    return row ? toTugas(row) : null
  },

  async setStatus(
    id: number,
    status: Tugas["status"]
  ): Promise<Tugas | null> {
    const row = await assignmentRepository.update(id, {
      status: toAssignmentStatusDb(status),
    })
    return row ? toTugas(row) : null
  },

  async remove(id: number): Promise<boolean> {
    await assignmentRepository.delete(id)
    return true
  },
}
