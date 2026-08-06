"use client"

import { useMemo } from "react"
import { useTeachingClasses } from "@/hooks/use-teaching-classes"
import { useMaterials } from "@/hooks/use-materials"
import { useAssignments } from "@/hooks/use-assignments"
import { useSubmissions } from "@/hooks/use-submissions"
import { useAnnouncements } from "@/hooks/use-announcements"
import { useStudents } from "@/hooks/use-students"
import { useSchedules } from "@/hooks/use-schedules"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"
import type { Materi } from "@/features/materi/types/materi"
import type { Tugas } from "@/features/tugas/types/tugas"
import type { PengumpulanTugas } from "@/features/pengumpulan/types/pengumpulan"
import type { Pengumuman } from "@/features/pengumuman/types/pengumuman"
import type { Siswa } from "@/features/siswa/types/siswa"
import type { Guru } from "@/features/guru/types/guru"
import type { User } from "@/types/auth"
import type { KelasAktivitas } from "@/features/kelas-saya/lib/kelas-saya-helpers"
import { useTeachers } from "@/hooks/use-teachers"

export interface JadwalKelas {
  id: number
  hari: string
  waktu_mulai: string
  waktu_selesai: string
  mata_pelajaran: string
  guru_nama: string
  kelas: string
}

export function useClassroom() {
  const { data: teachingClasses = [] } = useTeachingClasses()
  const { data: materials = [] } = useMaterials()
  const { data: assignments = [] } = useAssignments()
  const { data: submissions = [] } = useSubmissions()
  const { data: announcements = [] } = useAnnouncements()
  const { data: students = [] } = useStudents()
  const { data: teachers = [] } = useTeachers()
  const { data: schedules = [] } = useSchedules()

  const jadwalList = useMemo<JadwalKelas[]>(
    () =>
      schedules.map((s) => ({
        id: s.id,
        hari: s.hari,
        waktu_mulai: s.jam_mulai,
        waktu_selesai: s.jam_selesai,
        mata_pelajaran: s.mata_pelajaran,
        guru_nama: s.guru_nama,
        kelas: s.kelas,
      })),
    [schedules]
  )

  return useMemo(
    () => {
      const getKelasMateri = (kelasMengajarId: number): Materi[] =>
        materials.filter((m) => m.kelas_mengajar_id === kelasMengajarId)

      const getKelasTugas = (kelasMengajarId: number): Tugas[] =>
        assignments.filter((t) => t.kelas_mengajar_id === kelasMengajarId)

      const getTugasPengumpulan = (tugasId: number): PengumpulanTugas[] =>
        submissions.filter((p) => p.tugas_id === tugasId)

      const getKelasJadwal = (kelas: string): JadwalKelas[] =>
        jadwalList.filter((j) => j.kelas === kelas)

      const getKelasPengumuman = (kelas: string): Pengumuman[] =>
        announcements
          .filter(
            (p) =>
              p.status === "Dipublikasikan" &&
              (p.target === "Semua Pengguna" ||
                p.target === "Siswa" ||
                (p.target === "Kelas Tertentu" && p.kelas === kelas))
          )
          .sort(
            (a, b) =>
              Number(b.pinned) - Number(a.pinned) ||
              b.tanggal_publish.localeCompare(a.tanggal_publish)
          )

      const getKelasPengumumanAll = (kelas: string): Pengumuman[] =>
        announcements
          .filter(
            (p) =>
              p.target === "Semua Pengguna" ||
              p.target === "Siswa" ||
              (p.target === "Kelas Tertentu" && p.kelas === kelas)
          )
          .sort(
            (a, b) =>
              Number(b.pinned) - Number(a.pinned) ||
              b.tanggal_publish.localeCompare(a.tanggal_publish)
          )

      const getAnggotaKelas = (kelas: string): Siswa[] =>
        students.filter((s) => s.kelas === kelas && s.status === "Aktif")

      const getSiswaByNama = (nama: string): Siswa | undefined =>
        students.find(
          (s) =>
            s.nama_lengkap.toLowerCase() === nama.toLowerCase() &&
            s.status === "Aktif"
        )

      const getSiswaByUser = (user?: User | null): Siswa | undefined => {
        if (!user) return undefined
        return students.find((s) => s.user_id === user.id && s.status === "Aktif")
          ?? students.find((s) => user.nisn && s.nisn === user.nisn && s.status === "Aktif")
          ?? getSiswaByNama(user.name)
      }

      const getGuruByUser = (user?: User | null): Guru | undefined => {
        if (!user) return undefined
        return teachers.find((g) => g.user_id === user.id)
          ?? teachers.find((g) => user.nip && g.nip === user.nip)
          ?? teachers.find(
            (g) => g.nama_lengkap.toLowerCase() === user.name.toLowerCase()
          )
      }

      const getKelasSayaByGuru = (guruNama: string): KelasMengajar[] =>
        teachingClasses.filter(
          (km) => km.guru_nama === guruNama && km.status === "Aktif"
        )

      const getKelasSayaByUser = (user?: User | null): KelasMengajar[] => {
        const guru = getGuruByUser(user)
        if (!guru) return []
        return teachingClasses.filter(
          (km) =>
            km.status === "Aktif" &&
            (km.teacher_id === guru.id || km.guru_nama === guru.nama_lengkap)
        )
      }

      const getKelasMengajarById = (id: number): KelasMengajar | undefined =>
        teachingClasses.find((km) => km.id === id)

      const getKelasByRombel = (kelas: string): KelasMengajar[] =>
        teachingClasses.filter((km) => km.kelas === kelas)

      const getKelasAktivitas = (kelasMengajarId: number): KelasAktivitas[] => {
        const materiAktivitas: KelasAktivitas[] = getKelasMateri(
          kelasMengajarId
        ).map((m) => ({
          id: `m-${m.id}`,
          tipe: "materi",
          pesan:
            m.status === "Publish"
              ? `Mempublikasikan materi "${m.judul}"`
              : `Membuat draf materi "${m.judul}"`,
          timestamp: m.updated_at,
        }))
        const tugasAktivitas: KelasAktivitas[] = getKelasTugas(
          kelasMengajarId
        ).map((t) => ({
          id: `t-${t.id}`,
          tipe: "tugas",
          pesan: `Membuat tugas "${t.judul}"`,
          timestamp: t.updated_at,
        }))
        const tugasIds = new Set(
          getKelasTugas(kelasMengajarId).map((t) => t.id)
        )
        const pengumpulanAktivitas: KelasAktivitas[] = submissions
          .filter(
            (p) => tugasIds.has(p.tugas_id) && p.waktu_pengumpulan !== null
          )
          .map((p) => ({
            id: `p-${p.id}`,
            tipe: "pengumpulan",
            pesan: `${p.siswa_nama} mengumpulkan tugas`,
            timestamp: p.waktu_pengumpulan as string,
          }))
        return [...materiAktivitas, ...tugasAktivitas, ...pengumpulanAktivitas]
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      }

      return {
        getKelasSayaByGuru,
        getKelasMengajarById,
        getAktifKelasMengajar: (): KelasMengajar[] =>
          teachingClasses.filter((km) => km.status === "Aktif"),
        getKelasMengajarAll: (): KelasMengajar[] => teachingClasses,
        getKelasByRombel,
        getAnggotaKelas,
        getSiswaByNama,
        getSiswaByUser,
        getGuruByUser,
        getKelasSayaByUser,
        getKelasMateri,
        getKelasTugas,
        getTugasPengumpulan,
        getKelasJadwal,
        getKelasPengumuman,
        getKelasPengumumanAll,
        getKelasAktivitas,
        getById: getKelasMengajarById,
        getMateri: getKelasMateri,
        getTugas: getKelasTugas,
        getPengumuman: getKelasPengumuman,
        getPengumumanAll: getKelasPengumumanAll,
        getAnggota: getAnggotaKelas,
        getJadwal: getKelasJadwal,
        getAktivitas: getKelasAktivitas,
        submissions,
        siswa: students,
        materi: materials,
        tugas: assignments,
      }
    },
    [
      teachingClasses,
      materials,
      assignments,
      submissions,
      announcements,
      students,
      teachers,
      jadwalList,
    ]
  )
}
