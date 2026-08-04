import "server-only"
import { type Student } from "@/generated/prisma/client"
import { studentRepository } from "@/repositories/student.repository"
import type { Siswa, SiswaFormData } from "@/features/siswa/types/siswa"

function toSiswa(row: Student): Siswa {
  return {
    id: row.id,
    foto: row.foto,
    nis: row.nis,
    nisn: row.nisn,
    nama_lengkap: row.nama_lengkap,
    jenis_kelamin: (row.jenis_kelamin as Siswa["jenis_kelamin"]) ?? "Laki-laki",
    tempat_lahir: row.tempat_lahir ?? "",
    tanggal_lahir: row.tanggal_lahir?.toISOString() ?? "",
    agama: row.agama ?? "Islam",
    alamat: row.alamat,
    jurusan_id: row.jurusan_id ?? 0,
    jurusan_nama: undefined,
    kelas: row.kelas ?? "",
    tahun_masuk: row.tahun_masuk ?? "",
    tahun_ajaran: row.tahun_ajaran ?? "",
    status: (row.status as Siswa["status"]) ?? "Aktif",
    nama_ayah: row.nama_ayah ?? "",
    nama_ibu: row.nama_ibu ?? "",
    no_hp_ortu: row.no_hp_ortu,
    alamat_ortu: row.alamat_ortu,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

function toSiswaCreate(data: SiswaFormData) {
  return {
    foto: data.foto ?? null,
    nis: data.nis,
    nisn: data.nisn,
    nama_lengkap: data.nama_lengkap,
    jenis_kelamin: data.jenis_kelamin,
    tempat_lahir: data.tempat_lahir ?? null,
    tanggal_lahir: data.tanggal_lahir ? new Date(data.tanggal_lahir) : null,
    agama: data.agama,
    alamat: data.alamat ?? null,
    jurusan_id: data.jurusan_id ?? null,
    kelas: data.kelas ?? null,
    tahun_masuk: data.tahun_masuk ?? null,
    tahun_ajaran: data.tahun_ajaran ?? null,
    status: data.status,
    nama_ayah: data.nama_ayah ?? null,
    nama_ibu: data.nama_ibu ?? null,
    no_hp_ortu: data.no_hp_ortu ?? null,
    alamat_ortu: data.alamat_ortu ?? null,
  }
}

export const studentService = {
  async getAll(): Promise<Siswa[]> {
    const rows = await studentRepository.findAll()
    return rows.map(toSiswa)
  },

  async getById(id: number): Promise<Siswa | null> {
    const row = await studentRepository.findById(id)
    return row ? toSiswa(row) : null
  },

  async create(data: SiswaFormData): Promise<Siswa> {
    const row = await studentRepository.create(toSiswaCreate(data))
    return toSiswa(row)
  },

  async update(id: number, data: SiswaFormData): Promise<Siswa | null> {
    const row = await studentRepository.update(id, toSiswaCreate(data))
    return row ? toSiswa(row) : null
  },

  async remove(id: number): Promise<boolean> {
    await studentRepository.delete(id)
    return true
  },
}
