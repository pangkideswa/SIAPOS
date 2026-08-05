import "server-only"
import { Prisma } from "@/generated/prisma/client"
import { nilaiRepository } from "@/repositories/nilai.repository"
import type {
  NilaiAkademik,
  StatusNilai,
} from "@/features/nilai-akademik/types/nilai-akademik"
export interface NilaiCreateInput {
  student_id: number
  teaching_class_id: number
  tahun_akademik_id?: number | null
  tugas?: number | null
  praktik?: number | null
  uts?: number | null
  uas?: number | null
  semester: string
  tahun_ajaran?: string | null
  keterangan?: string | null
}

function toStatusNilai(status: string): StatusNilai {
  return status === "LENGKAP" ? "Lengkap" : "Belum Lengkap"
}

function computeNilaiAkhir(data: {
  tugas?: number | null
  praktik?: number | null
  uts?: number | null
  uas?: number | null
}): number | null {
  const values: number[] = [
    data.tugas ?? 0,
    data.praktik ?? 0,
    data.uts ?? 0,
    data.uas ?? 0,
  ]
  if (
    data.tugas == null ||
    data.praktik == null ||
    data.uts == null ||
    data.uas == null
  )
    return null
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
}

function toNilaiAkademik(row: NonNullable<Awaited<ReturnType<typeof nilaiRepository.findById>>>): NilaiAkademik {
  const tc = row.teaching_class as
    | {
        guru_nama: string | null
        mata_pelajaran: string | null
      }
    | null
    | undefined
  const student = row.student as
    | { nama_lengkap: string; kelas: string | null }
    | null
    | undefined
  return {
    id: row.id,
    siswa_nama: student?.nama_lengkap ?? "",
    siswa_kelas: student?.kelas ?? "",
    mata_pelajaran: tc?.mata_pelajaran ?? "",
    guru_nama: tc?.guru_nama ?? "",
    tugas: row.tugas,
    praktik: row.praktik,
    uts: row.uts,
    uas: row.uas,
    status: toStatusNilai(row.status),
    tahun_ajaran: row.tahun_ajaran ?? "",
    semester: row.semester ?? "",
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

function toNilaiCreate(data: NilaiCreateInput): Prisma.NilaiUncheckedCreateInput {
  const nilaiAkhir = computeNilaiAkhir(data)
  return {
    student_id: data.student_id,
    teaching_class_id: data.teaching_class_id,
    tahun_akademik_id: data.tahun_akademik_id ?? null,
    tugas: data.tugas ?? null,
    praktik: data.praktik ?? null,
    uts: data.uts ?? null,
    uas: data.uas ?? null,
    nilai_akhir: nilaiAkhir,
    status: nilaiAkhir != null ? "LENGKAP" : "BELUM_LENGKAP",
    semester: data.semester,
    tahun_ajaran: data.tahun_ajaran ?? null,
    keterangan: data.keterangan ?? null,
  }
}

export const nilaiService = {
  async getAll(): Promise<NilaiAkademik[]> {
    const rows = await nilaiRepository.findAll()
    return rows.map(toNilaiAkademik)
  },

  async getById(id: number): Promise<NilaiAkademik | null> {
    const row = await nilaiRepository.findById(id)
    return row ? toNilaiAkademik(row) : null
  },

  async getByStudent(studentId: number): Promise<NilaiAkademik[]> {
    const rows = await nilaiRepository.findByStudent(studentId)
    return rows.map(toNilaiAkademik)
  },

  async getByTeachingClass(teachingClassId: number): Promise<NilaiAkademik[]> {
    const rows = await nilaiRepository.findByTeachingClass(teachingClassId)
    return rows.map(toNilaiAkademik)
  },

  async create(data: NilaiCreateInput): Promise<NilaiAkademik> {
    const row = await nilaiRepository.create(toNilaiCreate(data))
    return toNilaiAkademik(row)
  },

  async update(
    id: number,
    data: Omit<NilaiCreateInput, "student_id" | "teaching_class_id">
  ): Promise<NilaiAkademik | null> {
    const current = await nilaiRepository.findById(id)
    if (!current) return null
    const nilaiAkhir = computeNilaiAkhir({
      tugas: data.tugas,
      praktik: data.praktik,
      uts: data.uts,
      uas: data.uas,
    })
    const row = await nilaiRepository.update(id, {
      tugas: data.tugas ?? null,
      praktik: data.praktik ?? null,
      uts: data.uts ?? null,
      uas: data.uas ?? null,
      nilai_akhir: nilaiAkhir,
      status: nilaiAkhir != null ? "LENGKAP" : "BELUM_LENGKAP",
      semester: data.semester,
      tahun_ajaran: data.tahun_ajaran ?? null,
      keterangan: data.keterangan ?? null,
    })
    return row ? toNilaiAkademik(row) : null
  },

  async remove(id: number): Promise<boolean> {
    await nilaiRepository.delete(id)
    return true
  },
}
