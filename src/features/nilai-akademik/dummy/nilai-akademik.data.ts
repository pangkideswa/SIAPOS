import type { NilaiAkademik } from "../types/nilai-akademik"

const SISWA = [
  "Ahmad Fauzi", "Budi Prasetyo", "Citra Dewi", "Dian Permata",
  "Eko Saputra", "Fitri Handayani", "Gilang Pratama", "Hesti Wulandari",
  "Irfan Maulana", "Juniarti Rahma", "Kurniawan Adi", "Lestari Sari",
  "Miftahul Jannah", "Novi Andriani", "Oktavianus Dwi", "Putri Ayu",
  "Qori Amalia", "Rizky Kurniawan", "Siti Nurhaliza", "Teguh Wicaksono",
  "Umi Kalsum", "Vina Oktaviani", "Wahyu Hidayat", "Xavier Nugraha",
  "Yuniarti Dewi", "Zainal Abidin", "Agus Salim", "Bunga Lestari",
  "Candra Wijaya", "Dewi Sartika", "Eka Pratiwi", "Fajar Nugroho",
  "Gita Puspita", "Hendra Gunawan", "Indah Permata", "Joko Susilo",
  "Karina Ayu", "Lukman Hakim", "Maya Sari", "Nanda Pratama",
]

const GURU_MAPEL: Record<string, string[]> = {
  "Asep Nugraha": ["Informatika", "Pemrograman Web"],
  "Rina Wulandari": ["Dasar Jaringan", "Administrasi Sistem Jaringan"],
  "Budi Santoso": ["Basis Data", "Sistem Operasi"],
  "Siti Rahayu": ["Matematika", "Pendidikan Agama"],
  "Andi Wijaya": ["Komputer dan Jaringan Dasar", "Bahasa Inggris"],
  "Dewi Sartika": ["Komputer dan Jaringan Dasar", "Administrasi Sistem Jaringan"],
}

const KELAS_LIST = [
  "X TKJ 1", "X TKJ 2", "X TBSM 1", "X TBSM 2",
  "XI TKJ 1", "XI TKJ 2", "XI TBSM 1", "XI TBSM 2",
  "XII TKJ 1", "XII TKJ 2",
]

const TAHUN_AJARAN_LIST = ["2025/2026", "2026/2027"]
const SEMESTER_LIST = ["Ganjil", "Genap"]

function randomNilai(): number | null {
  const r = Math.random()
  if (r < 0.15) return null
  return Math.floor(Math.random() * 51) + 50
}

function getStatus(tugas: number | null, praktik: number | null, uts: number | null, uas: number | null): "Lengkap" | "Belum Lengkap" {
  if (tugas !== null && praktik !== null && uts !== null && uas !== null) return "Lengkap"
  return "Belum Lengkap"
}

function generateNilai(): NilaiAkademik[] {
  const result: NilaiAkademik[] = []
  let id = 1

  for (const tahunAjaran of TAHUN_AJARAN_LIST) {
    for (const semester of SEMESTER_LIST) {
      for (const guru of Object.keys(GURU_MAPEL)) {
        const mapels = GURU_MAPEL[guru]
        for (const mapel of mapels) {
          const kelasCount = Math.floor(Math.random() * 3) + 1
          const shuffledKelas = [...KELAS_LIST].sort(() => Math.random() - 0.5).slice(0, kelasCount)

          for (const kelas of shuffledKelas) {
            const siswaCount = Math.floor(Math.random() * 6) + 3
            const shuffledSiswa = [...SISWA].sort(() => Math.random() - 0.5).slice(0, siswaCount)

            for (const siswa of shuffledSiswa) {
              const tugas = randomNilai()
              const praktik = randomNilai()
              const uts = randomNilai()
              const uas = randomNilai()

              result.push({
                id: id++,
                siswa_nama: siswa,
                siswa_kelas: kelas,
                mata_pelajaran: mapel,
                guru_nama: guru,
                tugas,
                praktik,
                uts,
                uas,
                status: getStatus(tugas, praktik, uts, uas),
                tahun_ajaran: tahunAjaran,
                semester,
                created_at: "2026-07-01T08:00:00Z",
                updated_at: "2026-07-01T08:00:00Z",
              })
            }
          }
        }
      }
    }
  }

  return result
}

export const DUMMY_NILAI_AKADEMIK: NilaiAkademik[] = generateNilai()
