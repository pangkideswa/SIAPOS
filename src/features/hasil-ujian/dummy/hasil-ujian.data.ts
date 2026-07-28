import type { HasilUjian } from "../types/hasil-ujian"

function makeSoalReview(
  count: number,
  correctAnswers: string[],
  participantAnswers: (string | null)[]
) {
  const questions = [
    "Apa fungsi utama dari protocol TCP?",
    "Perangkat mana yang beroperasi pada layer Network (Lapisan 3)?",
    "Apa kepanjangan dari DHCP?",
    "Manakah yang merupakan alamat IP private?",
    "Apa jenis kabel UTP yang digunakan untuk jaringan gigabit?",
    "Perintah Linux untuk melihat isi direktori adalah?",
    "Apa fungsi dari command 'ping'?",
    "Manakah yang bukan merupakan topologi jaringan?",
    "Apa kepanjangan dari DNS?",
    "Port default untuk service HTTP adalah?",
    "Apa itu subnet mask?",
    "Fungsi dari firewall adalah?",
    "Apa beda switch dan hub?",
    "Apa itu MAC address?",
    "Perintah 'traceroute' berfungsi untuk?",
  ]

  return Array.from({ length: count }, (_, i) => {
    const pAnswer = participantAnswers[i] ?? null
    const cAnswer = correctAnswers[i] ?? "A"
    let status: "Benar" | "Salah" | "Tidak Dijawab"
    if (pAnswer === null) {
      status = "Tidak Dijawab"
    } else if (pAnswer === cAnswer) {
      status = "Benar"
    } else {
      status = "Salah"
    }
    return {
      nomor: i + 1,
      pertanyaan: questions[i % questions.length],
      jawaban_peserta: pAnswer,
      jawaban_benar: cAnswer,
      status,
    }
  })
}

function randomAnswers(count: number, correctCount: number): {
  correct: string[]
  participant: (string | null)[]
} {
  const pool = ["A", "B", "C", "D", "E"]
  const correct = Array.from({ length: count }, (_, i) => pool[i % 4])
  const participant: (string | null)[] = correct.map((c, i) => {
    if (i < correctCount) return c
    if (i >= count - 2) return null
    const wrongPool = pool.filter((a) => a !== c)
    return wrongPool[Math.floor(Math.random() * wrongPool.length)]
  })
  return { correct, participant }
}

export const DUMMY_HASIL_UJIAN: HasilUjian[] = [
  // 1. Rizki Pratama - Quiz Dasar Jaringan
  (() => {
    const { correct, participant } = randomAnswers(10, 8)
    return {
      id: 1,
      siswa_id: 1,
      siswa_nama: "Rizki Pratama",
      siswa_nis: "2024001",
      siswa_kelas: "XI TKJ 1",
      mata_pelajaran: "Dasar Jaringan",
      guru_nama: "Asep Nugraha",
      nama_ujian: "Quiz Jaringan Dasar: Pengenalan OSI Model",
      jenis_ujian: "Quiz" as const,
      durasi: 30,
      waktu_mulai: "2026-07-20T08:00:00Z",
      waktu_selesai: "2026-07-20T08:30:00Z",
      tanggal: "2026-07-20",
      nilai: 80,
      jumlah_soal: 10,
      jumlah_benar: 8,
      jumlah_salah: 2,
      jumlah_kosong: 0,
      status: "Lulus" as const,
      catatan_evaluasi: "",
      feedback_guru:
        "Pemahaman konsep OSI Model sudah sangat baik. Perlu dipertahankan.",
      soal_review: makeSoalReview(10, correct, participant),
      created_at: "2026-07-20T08:30:00Z",
      updated_at: "2026-07-20T09:00:00Z",
    }
  })(),

  // 2. Rizki Pratama - CBT Administrasi Jaringan
  (() => {
    const { correct, participant } = randomAnswers(15, 13)
    return {
      id: 2,
      siswa_id: 1,
      siswa_nama: "Rizki Pratama",
      siswa_nis: "2024001",
      siswa_kelas: "XI TKJ 1",
      mata_pelajaran: "Administrasi Sistem Jaringan",
      guru_nama: "Rina Wulandari",
      nama_ujian: "CBT Administrasi Server: Konfigurasi MikroTik",
      jenis_ujian: "CBT" as const,
      durasi: 60,
      waktu_mulai: "2026-07-22T09:00:00Z",
      waktu_selesai: "2026-07-22T10:00:00Z",
      tanggal: "2026-07-22",
      nilai: 87,
      jumlah_soal: 15,
      jumlah_benar: 13,
      jumlah_salah: 2,
      jumlah_kosong: 0,
      status: "Lulus" as const,
      catatan_evaluasi: "",
      feedback_guru: "Performa ujian CBT sangat baik. Penguasaan materi konfigurasi MikroTik unggul.",
      soal_review: makeSoalReview(15, correct, participant),
      created_at: "2026-07-22T10:00:00Z",
      updated_at: "2026-07-22T10:30:00Z",
    }
  })(),

  // 3. Rizki Pratama - PTS Pemrograman Web
  (() => {
    const { correct, participant } = randomAnswers(10, 6)
    return {
      id: 3,
      siswa_id: 1,
      siswa_nama: "Rizki Pratama",
      siswa_nis: "2024001",
      siswa_kelas: "XI TKJ 1",
      mata_pelajaran: "Pemrograman Web",
      guru_nama: "Rina Wulandari",
      nama_ujian: "PTS Pemrograman Web: HTML & CSS",
      jenis_ujian: "PTS" as const,
      durasi: 45,
      waktu_mulai: "2026-07-24T13:00:00Z",
      waktu_selesai: "2026-07-24T13:45:00Z",
      tanggal: "2026-07-24",
      nilai: 60,
      jumlah_soal: 10,
      jumlah_benar: 6,
      jumlah_salah: 3,
      jumlah_kosong: 1,
      status: "Tidak Lulus" as const,
      catatan_evaluasi: "Perlu belajar lebih giat untuk materi CSS positioning dan flexbox.",
      feedback_guru: "Nilai masih di bawah KKM. Silakan mengulang materi CSS dan mengikuti remedial.",
      soal_review: makeSoalReview(10, correct, participant),
      created_at: "2026-07-24T13:45:00Z",
      updated_at: "2026-07-24T14:30:00Z",
    }
  })(),

  // 4. Dewi Lestari - Quiz Dasar Jaringan
  (() => {
    const { correct, participant } = randomAnswers(10, 7)
    return {
      id: 4,
      siswa_id: 2,
      siswa_nama: "Dewi Lestari",
      siswa_nis: "2024002",
      siswa_kelas: "XI TBSM 1",
      mata_pelajaran: "Dasar Jaringan",
      guru_nama: "Asep Nugraha",
      nama_ujian: "Quiz Jaringan Dasar: Pengenalan OSI Model",
      jenis_ujian: "Quiz" as const,
      durasi: 30,
      waktu_mulai: "2026-07-20T08:00:00Z",
      waktu_selesai: "2026-07-20T08:30:00Z",
      tanggal: "2026-07-20",
      nilai: 70,
      jumlah_soal: 10,
      jumlah_benar: 7,
      jumlah_salah: 3,
      jumlah_kosong: 0,
      status: "Lulus" as const,
      catatan_evaluasi: "",
      feedback_guru: "Nilai tepat di batas KKM. Perlu diperkuat pemahaman tentang layer application.",
      soal_review: makeSoalReview(10, correct, participant),
      created_at: "2026-07-20T08:30:00Z",
      updated_at: "2026-07-20T09:00:00Z",
    }
  })(),

  // 5. Dewi Lestari - Ulangan Harian Basis Data
  (() => {
    const { correct, participant } = randomAnswers(10, 9)
    return {
      id: 5,
      siswa_id: 2,
      siswa_nama: "Dewi Lestari",
      siswa_nis: "2024002",
      siswa_kelas: "XI TBSM 1",
      mata_pelajaran: "Basis Data",
      guru_nama: "Budi Santoso",
      nama_ujian: "Ulangan Harian Basis Data: ERD & Normalisasi",
      jenis_ujian: "Ulangan Harian" as const,
      durasi: 40,
      waktu_mulai: "2026-07-21T10:00:00Z",
      waktu_selesai: "2026-07-21T10:40:00Z",
      tanggal: "2026-07-21",
      nilai: 90,
      jumlah_soal: 10,
      jumlah_benar: 9,
      jumlah_salah: 1,
      jumlah_kosong: 0,
      status: "Lulus" as const,
      catatan_evaluasi: "",
      feedback_guru: "Penguasaan ERD sangat baik. Hanya perlu review normalisasi 3NF.",
      soal_review: makeSoalReview(10, correct, participant),
      created_at: "2026-07-21T10:40:00Z",
      updated_at: "2026-07-21T11:00:00Z",
    }
  })(),

  // 6. Fajar Nugroho - PAS Dasar Jaringan
  (() => {
    const { correct, participant } = randomAnswers(15, 10)
    return {
      id: 6,
      siswa_id: 3,
      siswa_nama: "Fajar Nugroho",
      siswa_nis: "2022003",
      siswa_kelas: "XII TKJ 1",
      mata_pelajaran: "Dasar Jaringan",
      guru_nama: "Asep Nugraha",
      nama_ujian: "PAS Semester Genap: Dasar Jaringan Komputer",
      jenis_ujian: "PAS" as const,
      durasi: 90,
      waktu_mulai: "2026-07-23T08:00:00Z",
      waktu_selesai: "2026-07-23T09:30:00Z",
      tanggal: "2026-07-23",
      nilai: 67,
      jumlah_soal: 15,
      jumlah_benar: 10,
      jumlah_salah: 4,
      jumlah_kosong: 1,
      status: "Tidak Lulus" as const,
      catatan_evaluasi: "Materi subnetting dan routing masih perlu diperkuat.",
      feedback_guru: "Perlu remedial untuk materi subnetting. Silakan daftar remedial ke guru mapel.",
      soal_review: makeSoalReview(15, correct, participant),
      created_at: "2026-07-23T09:30:00Z",
      updated_at: "2026-07-23T10:00:00Z",
    }
  })(),

  // 7. Ahmad Rizky - Quiz Sistem Operasi
  (() => {
    const { correct, participant } = randomAnswers(10, 5)
    return {
      id: 7,
      siswa_id: 4,
      siswa_nama: "Ahmad Rizky",
      siswa_nis: "2023004",
      siswa_kelas: "XI TKJ 1",
      mata_pelajaran: "Sistem Operasi",
      guru_nama: "Siti Rahayu",
      nama_ujian: "Quiz Linux: Perintah Dasar Terminal",
      jenis_ujian: "Quiz" as const,
      durasi: 20,
      waktu_mulai: "2026-07-20T11:00:00Z",
      waktu_selesai: "2026-07-20T11:20:00Z",
      tanggal: "2026-07-20",
      nilai: 50,
      jumlah_soal: 10,
      jumlah_benar: 5,
      jumlah_salah: 4,
      jumlah_kosong: 1,
      status: "Tidak Lulus" as const,
      catatan_evaluasi: "Perlu belajar perintah dasar Linux secara lebih mendalam.",
      feedback_guru: "Masih belum memahami perintah dasar Linux. Harap praktik lebih sering.",
      soal_review: makeSoalReview(10, correct, participant),
      created_at: "2026-07-20T11:20:00Z",
      updated_at: "2026-07-20T11:45:00Z",
    }
  })(),

  // 8. Putri Wulandari - CBT Pemrograman Web
  (() => {
    const { correct, participant } = randomAnswers(15, 14)
    return {
      id: 8,
      siswa_id: 5,
      siswa_nama: "Putri Wulandari",
      siswa_nis: "2023005",
      siswa_kelas: "XI TBSM 1",
      mata_pelajaran: "Pemrograman Web",
      guru_nama: "Rina Wulandari",
      nama_ujian: "CBT Pemrograman Web: JavaScript Dasar",
      jenis_ujian: "CBT" as const,
      durasi: 60,
      waktu_mulai: "2026-07-22T13:00:00Z",
      waktu_selesai: "2026-07-22T14:00:00Z",
      tanggal: "2026-07-22",
      nilai: 93,
      jumlah_soal: 15,
      jumlah_benar: 14,
      jumlah_salah: 1,
      jumlah_kosong: 0,
      status: "Lulus" as const,
      catatan_evaluasi: "",
      feedback_guru: "Luar biasa! Penguasaan JavaScript sudah sangat baik. Pertahankan!",
      soal_review: makeSoalReview(15, correct, participant),
      created_at: "2026-07-22T14:00:00Z",
      updated_at: "2026-07-22T14:30:00Z",
    }
  })(),

  // 9. Budi Santoso - Ulangan Harian Basis Data
  (() => {
    const { correct, participant } = randomAnswers(10, 6)
    return {
      id: 9,
      siswa_id: 8,
      siswa_nama: "Budi Santoso",
      siswa_nis: "2024008",
      siswa_kelas: "X TKJ 2",
      mata_pelajaran: "Basis Data",
      guru_nama: "Budi Santoso",
      nama_ujian: "Ulangan Harian Basis Data: SQL Dasar",
      jenis_ujian: "Ulangan Harian" as const,
      durasi: 40,
      waktu_mulai: "2026-07-21T10:00:00Z",
      waktu_selesai: "2026-07-21T10:40:00Z",
      tanggal: "2026-07-21",
      nilai: 60,
      jumlah_soal: 10,
      jumlah_benar: 6,
      jumlah_salah: 3,
      jumlah_kosong: 1,
      status: "Tidak Lulus" as const,
      catatan_evaluasi: "Perlu memahami JOIN dan subquery lebih baik.",
      feedback_guru: "Nilai belum mencapai KKM. Silakan perbaikan dengan mengerjakan soal remedial.",
      soal_review: makeSoalReview(10, correct, participant),
      created_at: "2026-07-21T10:40:00Z",
      updated_at: "2026-07-21T11:00:00Z",
    }
  })(),

  // 10. Rizki Pratama - Try Out UTBK
  (() => {
    const { correct, participant } = randomAnswers(15, 12)
    return {
      id: 10,
      siswa_id: 1,
      siswa_nama: "Rizki Pratama",
      siswa_nis: "2024001",
      siswa_kelas: "XI TKJ 1",
      mata_pelajaran: "Dasar Jaringan",
      guru_nama: "Asep Nugraha",
      nama_ujian: "Try Out: Simulasi Ujian Kompetensi Jaringan",
      jenis_ujian: "Try Out" as const,
      durasi: 75,
      waktu_mulai: "2026-07-25T08:00:00Z",
      waktu_selesai: "2026-07-25T09:15:00Z",
      tanggal: "2026-07-25",
      nilai: 80,
      jumlah_soal: 15,
      jumlah_benar: 12,
      jumlah_salah: 3,
      jumlah_kosong: 0,
      status: "Lulus" as const,
      catatan_evaluasi: "",
      feedback_guru: "Hasil try out sangat baik. Siap menghadapi ujian kompetensi sesungguhnya.",
      soal_review: makeSoalReview(15, correct, participant),
      created_at: "2026-07-25T09:15:00Z",
      updated_at: "2026-07-25T10:00:00Z",
    }
  })(),

  // 11. Dewi Lestari - PTS TBSM
  (() => {
    const { correct, participant } = randomAnswers(10, 7)
    return {
      id: 11,
      siswa_id: 2,
      siswa_nama: "Dewi Lestari",
      siswa_nis: "2024002",
      siswa_kelas: "XI TBSM 1",
      mata_pelajaran: "Sistem Operasi",
      guru_nama: "Siti Rahayu",
      nama_ujian: "PTS Sistem Operasi: Manajemen Proses",
      jenis_ujian: "PTS" as const,
      durasi: 45,
      waktu_mulai: "2026-07-24T08:00:00Z",
      waktu_selesai: "2026-07-24T08:45:00Z",
      tanggal: "2026-07-24",
      nilai: 70,
      jumlah_soal: 10,
      jumlah_benar: 7,
      jumlah_salah: 2,
      jumlah_kosong: 1,
      status: "Lulus" as const,
      catatan_evaluasi: "",
      feedback_guru: "Nilai tepat di KKM. Tingkatkan pemahaman tentang scheduling algorithms.",
      soal_review: makeSoalReview(10, correct, participant),
      created_at: "2026-07-24T08:45:00Z",
      updated_at: "2026-07-24T09:30:00Z",
    }
  })(),

  // 12. Putri Wulandari - Quiz Jaringan
  (() => {
    const { correct, participant } = randomAnswers(10, 8)
    return {
      id: 12,
      siswa_id: 5,
      siswa_nama: "Putri Wulandari",
      siswa_nis: "2023005",
      siswa_kelas: "XI TBSM 1",
      mata_pelajaran: "Dasar Jaringan",
      guru_nama: "Asep Nugraha",
      nama_ujian: "Quiz Jaringan Dasar: Topologi dan Protokol",
      jenis_ujian: "Quiz" as const,
      durasi: 30,
      waktu_mulai: "2026-07-20T08:00:00Z",
      waktu_selesai: "2026-07-20T08:30:00Z",
      tanggal: "2026-07-20",
      nilai: 80,
      jumlah_soal: 10,
      jumlah_benar: 8,
      jumlah_salah: 2,
      jumlah_kosong: 0,
      status: "Lulus" as const,
      catatan_evaluasi: "",
      feedback_guru: "Pemahaman topologi jaringan sudah baik.",
      soal_review: makeSoalReview(10, correct, participant),
      created_at: "2026-07-20T08:30:00Z",
      updated_at: "2026-07-20T09:00:00Z",
    }
  })(),

  // 13. Ahmad Rizky - CBT Administrasi Jaringan
  (() => {
    const { correct, participant } = randomAnswers(15, 5)
    return {
      id: 13,
      siswa_id: 4,
      siswa_nama: "Ahmad Rizky",
      siswa_nis: "2023004",
      siswa_kelas: "XI TKJ 1",
      mata_pelajaran: "Administrasi Sistem Jaringan",
      guru_nama: "Rina Wulandari",
      nama_ujian: "CBT Konfigurasi Router: Static Routing",
      jenis_ujian: "CBT" as const,
      durasi: 60,
      waktu_mulai: "2026-07-22T09:00:00Z",
      waktu_selesai: "2026-07-22T10:00:00Z",
      tanggal: "2026-07-22",
      nilai: 33,
      jumlah_soal: 15,
      jumlah_benar: 5,
      jumlah_salah: 8,
      jumlah_kosong: 2,
      status: "Tidak Lulus" as const,
      catatan_evaluasi: "Perlu mengulang materi konfigurasi router dari awal.",
      feedback_guru: "Perlu remedial dan bimbingan intensif. Silakan datang ke lab jaringan untuk praktik tambahan.",
      soal_review: makeSoalReview(15, correct, participant),
      created_at: "2026-07-22T10:00:00Z",
      updated_at: "2026-07-22T10:30:00Z",
    }
  })(),

  // 14. Budi Santoso - PAS Dasar Jaringan
  (() => {
    const { correct, participant } = randomAnswers(15, 11)
    return {
      id: 14,
      siswa_id: 8,
      siswa_nama: "Budi Santoso",
      siswa_nis: "2024008",
      siswa_kelas: "X TKJ 2",
      mata_pelajaran: "Dasar Jaringan",
      guru_nama: "Asep Nugraha",
      nama_ujian: "PAS Semester Genap: Dasar Jaringan Komputer",
      jenis_ujian: "PAS" as const,
      durasi: 90,
      waktu_mulai: "2026-07-23T08:00:00Z",
      waktu_selesai: "2026-07-23T09:30:00Z",
      tanggal: "2026-07-23",
      nilai: 73,
      jumlah_soal: 15,
      jumlah_benar: 11,
      jumlah_salah: 3,
      jumlah_kosong: 1,
      status: "Lulus" as const,
      catatan_evaluasi: "",
      feedback_guru: "Lulus dengan nilai cukup. Perlu diperkuat di materi TCP/IP dan subnetting.",
      soal_review: makeSoalReview(15, correct, participant),
      created_at: "2026-07-23T09:30:00Z",
      updated_at: "2026-07-23T10:00:00Z",
    }
  })(),

  // 15. Fajar Nugroho - Try Out
  (() => {
    const { correct, participant } = randomAnswers(15, 15)
    return {
      id: 15,
      siswa_id: 3,
      siswa_nama: "Fajar Nugroho",
      siswa_nis: "2022003",
      siswa_kelas: "XII TKJ 1",
      mata_pelajaran: "Administrasi Sistem Jaringan",
      guru_nama: "Rina Wulandari",
      nama_ujian: "Try Out: Simulasi Ujian Kompetensi Administrasi Jaringan",
      jenis_ujian: "Try Out" as const,
      durasi: 75,
      waktu_mulai: "2026-07-25T09:00:00Z",
      waktu_selesai: "2026-07-25T10:15:00Z",
      tanggal: "2026-07-25",
      nilai: 100,
      jumlah_soal: 15,
      jumlah_benar: 15,
      jumlah_salah: 0,
      jumlah_kosong: 0,
      status: "Lulus" as const,
      catatan_evaluasi: "",
      feedback_guru: "Skor sempurna! Prestasi luar biasa. Sangat siap untuk ujian kompetensi.",
      soal_review: makeSoalReview(15, correct, participant),
      created_at: "2026-07-25T10:15:00Z",
      updated_at: "2026-07-25T11:00:00Z",
    }
  })(),

  // 16. Rizki Pratama - Ulangan Harian Basis Data (Menunggu Penilaian)
  (() => {
    return {
      id: 16,
      siswa_id: 1,
      siswa_nama: "Rizki Pratama",
      siswa_nis: "2024001",
      siswa_kelas: "XI TKJ 1",
      mata_pelajaran: "Basis Data",
      guru_nama: "Budi Santoso",
      nama_ujian: "Ulangan Harian Basis Data: SQL Intermediate",
      jenis_ujian: "Ulangan Harian" as const,
      durasi: 40,
      waktu_mulai: "2026-07-26T08:00:00Z",
      waktu_selesai: "2026-07-26T08:40:00Z",
      tanggal: "2026-07-26",
      nilai: null,
      jumlah_soal: 10,
      jumlah_benar: 0,
      jumlah_salah: 0,
      jumlah_kosong: 0,
      status: "Menunggu Penilaian" as const,
      catatan_evaluasi: "",
      feedback_guru: "",
      soal_review: [],
      created_at: "2026-07-26T08:40:00Z",
      updated_at: "2026-07-26T08:40:00Z",
    }
  })(),
]
