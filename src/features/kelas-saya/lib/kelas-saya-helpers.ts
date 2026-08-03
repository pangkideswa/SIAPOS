import { DUMMY_KELAS_MENGAJAR } from "@/features/kelas-mengajar/dummy/kelas-mengajar.data"
import { DUMMY_SISWA } from "@/features/siswa/dummy/siswa.data"
import { DUMMY_MATERI } from "@/features/materi/dummy/materi.data"
import { DUMMY_TUGAS } from "@/features/tugas/dummy/tugas.data"
import { DUMMY_PENGUMPULAN } from "@/features/pengumpulan/dummy/pengumpulan.data"
import { DUMMY_PENGUMUMAN } from "@/features/pengumuman/dummy/pengumuman.data"
import { DUMMY_GURU_JADWAL } from "@/features/dashboard/dummy/dashboard.data"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"
import type { Materi } from "@/features/materi/types/materi"
import type { Tugas } from "@/features/tugas/types/tugas"
import type { PengumpulanTugas } from "@/features/pengumpulan/types/pengumpulan"
import type { Pengumuman } from "@/features/pengumuman/types/pengumuman"
import type { Siswa } from "@/features/siswa/types/siswa"

export function getKelasSayaByGuru(guruNama: string): KelasMengajar[] {
  return DUMMY_KELAS_MENGAJAR.filter(
    (km) => km.guru_nama === guruNama && km.status === "Aktif"
  )
}

export function getKelasMengajarById(id: number): KelasMengajar | undefined {
  return DUMMY_KELAS_MENGAJAR.find((km) => km.id === id)
}

export function getAktifKelasMengajar(): KelasMengajar[] {
  return DUMMY_KELAS_MENGAJAR.filter((km) => km.status === "Aktif")
}

export function getKelasMengajarAll(): KelasMengajar[] {
  return DUMMY_KELAS_MENGAJAR
}

export function getKelasByRombel(kelas: string): KelasMengajar[] {
  return DUMMY_KELAS_MENGAJAR.filter((km) => km.kelas === kelas)
}

export function getAnggotaKelas(kelas: string): Siswa[] {
  return DUMMY_SISWA.filter((s) => s.kelas === kelas && s.status === "Aktif")
}

export function getSiswaByNama(nama: string): Siswa | undefined {
  return DUMMY_SISWA.find(
    (s) =>
      s.nama_lengkap.toLowerCase() === nama.toLowerCase() &&
      s.status === "Aktif"
  )
}

export function getKelasMateri(kelasMengajarId: number): Materi[] {
  return DUMMY_MATERI.filter((m) => m.kelas_mengajar_id === kelasMengajarId)
}

export function getKelasTugas(kelasMengajarId: number): Tugas[] {
  return DUMMY_TUGAS.filter((t) => t.kelas_mengajar_id === kelasMengajarId)
}

export function getTugasPengumpulan(tugasId: number): PengumpulanTugas[] {
  return DUMMY_PENGUMPULAN.filter((p) => p.tugas_id === tugasId)
}

export function getKelasJadwal(kelas: string) {
  return DUMMY_GURU_JADWAL.filter((j) => j.kelas === kelas)
}

export function getKelasPengumuman(kelas: string): Pengumuman[] {
  return DUMMY_PENGUMUMAN.filter(
    (p) =>
      p.status === "Dipublikasikan" &&
      (p.target === "Semua Pengguna" ||
        p.target === "Siswa" ||
        (p.target === "Kelas Tertentu" && p.kelas === kelas))
  ).sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) ||
      b.tanggal_publish.localeCompare(a.tanggal_publish)
  )
}

export function getKelasPengumumanAll(kelas: string): Pengumuman[] {
  return DUMMY_PENGUMUMAN.filter(
    (p) =>
      p.target === "Semua Pengguna" ||
      p.target === "Siswa" ||
      (p.target === "Kelas Tertentu" && p.kelas === kelas)
  ).sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) ||
      b.tanggal_publish.localeCompare(a.tanggal_publish)
  )
}

export interface KelasAktivitas {
  id: string
  tipe: "materi" | "tugas" | "pengumpulan"
  pesan: string
  timestamp: string
}

export function getKelasAktivitas(kelasMengajarId: number): KelasAktivitas[] {
  const materi: KelasAktivitas[] = getKelasMateri(kelasMengajarId).map((m) => ({
    id: `m-${m.id}`,
    tipe: "materi",
    pesan:
      m.status === "Publish"
        ? `Mempublikasikan materi "${m.judul}"`
        : `Membuat draf materi "${m.judul}"`,
    timestamp: m.updated_at,
  }))
  const tugas: KelasAktivitas[] = getKelasTugas(kelasMengajarId).map((t) => ({
    id: `t-${t.id}`,
    tipe: "tugas",
    pesan: `Membuat tugas "${t.judul}"`,
    timestamp: t.updated_at,
  }))
  const tugasIds = getKelasTugas(kelasMengajarId).map((t) => t.id)
  const pengumpulan: KelasAktivitas[] = DUMMY_PENGUMPULAN.filter(
    (p) => tugasIds.includes(p.tugas_id) && p.waktu_pengumpulan !== null
  ).map((p) => ({
    id: `p-${p.id}`,
    tipe: "pengumpulan",
    pesan: `${p.siswa_nama} mengumpulkan tugas`,
    timestamp: p.waktu_pengumpulan as string,
  }))
  return [...materi, ...tugas, ...pengumpulan].sort((a, b) =>
    b.timestamp.localeCompare(a.timestamp)
  )
}

export function getInitials(nama: string): string {
  return nama
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function formatTanggal(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatTanggalPendek(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function formatWaktuPengumpulan(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
