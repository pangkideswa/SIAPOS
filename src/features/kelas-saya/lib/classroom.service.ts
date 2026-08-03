import {
  getKelasMengajarById,
  getAktifKelasMengajar,
  getKelasMengajarAll,
  getKelasMateri,
  getKelasTugas,
  getKelasPengumuman,
  getKelasPengumumanAll,
  getAnggotaKelas,
  getKelasJadwal,
  getKelasAktivitas,
  getKelasSayaByGuru,
  type KelasAktivitas,
} from "./kelas-saya-helpers"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"
import type { Materi } from "@/features/materi/types/materi"
import type { Tugas } from "@/features/tugas/types/tugas"
import type { Pengumuman } from "@/features/pengumuman/types/pengumuman"
import type { Siswa } from "@/features/siswa/types/siswa"

export const classroomService = {
  getKelasSayaByGuru(guruNama: string): KelasMengajar[] {
    return getKelasSayaByGuru(guruNama)
  },

  getById(id: number): KelasMengajar | undefined {
    return getKelasMengajarById(id)
  },

  getAktifKelasMengajar(): KelasMengajar[] {
    return getAktifKelasMengajar()
  },

  getAll(): KelasMengajar[] {
    return getKelasMengajarAll()
  },

  getMateri(kelasMengajarId: number): Materi[] {
    return getKelasMateri(kelasMengajarId)
  },

  getTugas(kelasMengajarId: number): Tugas[] {
    return getKelasTugas(kelasMengajarId)
  },

  getPengumuman(kelas: string): Pengumuman[] {
    return getKelasPengumuman(kelas)
  },

  getPengumumanAll(kelas: string): Pengumuman[] {
    return getKelasPengumumanAll(kelas)
  },

  getAnggota(kelas: string): Siswa[] {
    return getAnggotaKelas(kelas)
  },

  getJadwal(kelas: string) {
    return getKelasJadwal(kelas)
  },

  getAktivitas(kelasMengajarId: number): KelasAktivitas[] {
    return getKelasAktivitas(kelasMengajarId)
  },
}
