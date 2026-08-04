import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { hash } from "bcryptjs"

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/siapos",
})

const prisma = new PrismaClient({ adapter })

interface SeedStudent {
  nama_lengkap: string
  jenis_kelamin: "Laki-laki" | "Perempuan"
  nis: string
  nisn: string
  kelas: string
  classroomKey: "X" | "XI" | "XII"
}

const STUDENTS: SeedStudent[] = [
  { nama_lengkap: "Rizki Pratama", jenis_kelamin: "Laki-laki", nis: "2425001", nisn: "0081234567", kelas: "X TKJ 1", classroomKey: "X" },
  { nama_lengkap: "Dewi Lestari", jenis_kelamin: "Perempuan", nis: "2425002", nisn: "0081234568", kelas: "X TKJ 1", classroomKey: "X" },
  { nama_lengkap: "Bima Saputra", jenis_kelamin: "Laki-laki", nis: "2425003", nisn: "0081234569", kelas: "X TKJ 1", classroomKey: "X" },
  { nama_lengkap: "Siti Nurhaliza", jenis_kelamin: "Perempuan", nis: "2425004", nisn: "0081234570", kelas: "X TKJ 1", classroomKey: "X" },
  { nama_lengkap: "Dimas Anggara", jenis_kelamin: "Laki-laki", nis: "2425005", nisn: "0081234571", kelas: "X TKJ 1", classroomKey: "X" },
  { nama_lengkap: "Ayu Lestari", jenis_kelamin: "Perempuan", nis: "2425006", nisn: "0081234572", kelas: "X TKJ 1", classroomKey: "X" },
  { nama_lengkap: "Fajar Ramadhan", jenis_kelamin: "Laki-laki", nis: "2425007", nisn: "0081234573", kelas: "X TKJ 1", classroomKey: "X" },
  { nama_lengkap: "Nadia Putri", jenis_kelamin: "Perempuan", nis: "2425008", nisn: "0081234574", kelas: "XI TKJ 1", classroomKey: "XI" },
  { nama_lengkap: "Bayu Pamungkas", jenis_kelamin: "Laki-laki", nis: "2425009", nisn: "0081234575", kelas: "XI TKJ 1", classroomKey: "XI" },
  { nama_lengkap: "Intan Permata", jenis_kelamin: "Perempuan", nis: "2425010", nisn: "0081234576", kelas: "XI TKJ 1", classroomKey: "XI" },
  { nama_lengkap: "Rizky Aditya", jenis_kelamin: "Laki-laki", nis: "2425011", nisn: "0081234577", kelas: "XI TKJ 1", classroomKey: "XI" },
  { nama_lengkap: "Putri Maharani", jenis_kelamin: "Perempuan", nis: "2425012", nisn: "0081234578", kelas: "XI TKJ 1", classroomKey: "XI" },
  { nama_lengkap: "Yoga Pratama", jenis_kelamin: "Laki-laki", nis: "2425013", nisn: "0081234579", kelas: "XI TKJ 1", classroomKey: "XI" },
  { nama_lengkap: "Wulan Sari", jenis_kelamin: "Perempuan", nis: "2425014", nisn: "0081234580", kelas: "XI TKJ 1", classroomKey: "XI" },
  { nama_lengkap: "Galih Prasetyo", jenis_kelamin: "Laki-laki", nis: "2425015", nisn: "0081234581", kelas: "XII TKJ 1", classroomKey: "XII" },
  { nama_lengkap: "Citra Kirana", jenis_kelamin: "Perempuan", nis: "2425016", nisn: "0081234582", kelas: "XII TKJ 1", classroomKey: "XII" },
  { nama_lengkap: "Agus Setiawan", jenis_kelamin: "Laki-laki", nis: "2425017", nisn: "0081234583", kelas: "XII TKJ 1", classroomKey: "XII" },
  { nama_lengkap: "Melati Sukma", jenis_kelamin: "Perempuan", nis: "2425018", nisn: "0081234584", kelas: "XII TKJ 1", classroomKey: "XII" },
  { nama_lengkap: "Rendra Kurniawan", jenis_kelamin: "Laki-laki", nis: "2425019", nisn: "0081234585", kelas: "XII TKJ 1", classroomKey: "XII" },
  { nama_lengkap: "Zahra Aulia", jenis_kelamin: "Perempuan", nis: "2425020", nisn: "0081234586", kelas: "XII TKJ 1", classroomKey: "XII" },
]

async function main() {
  console.log("Seeding database...")

  await prisma.submission.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.material.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.teachingClass.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.student.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.classroom.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.user.deleteMany()

  const adminPassword = await hash("Admin123!", 10)
  const guruPassword = await hash("Guru123!", 10)
  const siswaPassword = await hash("Siswa123!", 10)

  const admin = await prisma.user.create({
    data: {
      name: "Administrator SIAPOS",
      email: "admin@siapos.id",
      password: adminPassword,
      role: "ADMIN",
      username: "admin",
      nip: "198501012010011001",
    },
  })

  const guruSeeds = [
    {
      name: "Asep Nugraha",
      email: "guru@siapos.id",
      username: "guru",
      nip: "199005152015022001",
      nuptk: "2034756688120042",
      jenis_kelamin: "Laki-laki",
      tempat_lahir: "Bandung",
      tanggal_lahir: new Date("1990-05-15"),
      no_hp: "081234567890",
      alamat: "Jl. Merdeka No. 45, Bandung",
      pendidikan_terakhir: "S1",
      status_kepegawaian: "PNS",
      mata_pelajaran: ["Pemrograman Web", "Basis Data"],
    },
    {
      name: "Siti Aminah",
      email: "siti.aminah@siapos.id",
      username: "siti.aminah",
      nip: "198703122010012002",
      nuptk: "6046756688110033",
      jenis_kelamin: "Perempuan",
      tempat_lahir: "Cimahi",
      tanggal_lahir: new Date("1987-03-12"),
      no_hp: "081377889900",
      alamat: "Jl. Sudirman No. 8, Cimahi",
      pendidikan_terakhir: "S2",
      status_kepegawaian: "PNS",
      mata_pelajaran: ["Matematika", "Bahasa Indonesia"],
    },
    {
      name: "Andi Wijaya",
      email: "andi.wijaya@siapos.id",
      username: "andi.wijaya",
      nip: "199210142019032003",
      nuptk: "2046776688220044",
      jenis_kelamin: "Laki-laki",
      tempat_lahir: "Garut",
      tanggal_lahir: new Date("1992-10-14"),
      no_hp: "081312345678",
      alamat: "Jl. Asia Afrika No. 22, Bandung",
      pendidikan_terakhir: "S1",
      status_kepegawaian: "PPPK",
      mata_pelajaran: ["Jaringan Komputer", "PKK"],
    },
  ]

  const guruUsers: Record<string, typeof admin> = {}
  const guruRecords: Record<string, { id: number; nama_lengkap: string }> = {}

  for (let i = 0; i < guruSeeds.length; i++) {
    const g = guruSeeds[i]
    const user = await prisma.user.create({
      data: {
        name: g.name,
        email: g.email,
        password: guruPassword,
        role: "TEACHER",
        username: g.username,
        nip: g.nip,
      },
    })
    guruUsers[g.nip] = user
    const teacher = await prisma.teacher.create({
      data: {
        user_id: user.id,
        nama_lengkap: g.name,
        nip: g.nip,
        nuptk: g.nuptk,
        jenis_kelamin: g.jenis_kelamin,
        tempat_lahir: g.tempat_lahir,
        tanggal_lahir: g.tanggal_lahir,
        no_hp: g.no_hp,
        email: g.email,
        alamat: g.alamat,
        pendidikan_terakhir: g.pendidikan_terakhir,
        status_kepegawaian: g.status_kepegawaian,
        mata_pelajaran: g.mata_pelajaran,
      },
    })
    guruRecords[g.nip] = { id: teacher.id, nama_lengkap: g.name }
  }

  const classrooms = {
    X: await prisma.classroom.create({
      data: { name: "X TKJ 1", major: "TKJ", grade_level: "X" },
    }),
    XI: await prisma.classroom.create({
      data: { name: "XI TKJ 1", major: "TKJ", grade_level: "XI" },
    }),
    XII: await prisma.classroom.create({
      data: { name: "XII TKJ 1", major: "TKJ", grade_level: "XII" },
    }),
  }

  const studentRecords: Record<string, { id: number; nama_lengkap: string; nisn: string; kelas: string }> = {}

  for (let i = 0; i < STUDENTS.length; i++) {
    const s = STUDENTS[i]
    const studentUser = await prisma.user.create({
      data: {
        name: s.nama_lengkap,
        email: `siswa${i + 1}@siapos.id`,
        password: siswaPassword,
        role: "STUDENT",
        username: `siswa${i + 1}`,
        nisn: s.nisn,
      },
    })
    const classroom = classrooms[s.classroomKey]
    const student = await prisma.student.create({
      data: {
        user_id: studentUser.id,
        nis: s.nis,
        nisn: s.nisn,
        nama_lengkap: s.nama_lengkap,
        jenis_kelamin: s.jenis_kelamin,
        tempat_lahir: "Bandung",
        tanggal_lahir: new Date(2008, (i % 12), 1 + (i % 27)),
        agama: "Islam",
        alamat: `Jl. Cendana No. ${i + 1}, Bandung`,
        jurusan_id: 1,
        kelas: s.kelas,
        classroom_id: classroom.id,
        tahun_masuk: s.classroomKey === "X" ? "2024" : s.classroomKey === "XI" ? "2023" : "2022",
        tahun_ajaran: "2025/2026",
        status: "Aktif",
        nama_ayah: "Budi Santoso",
        nama_ibu: "Sri Rahayu",
        no_hp_ortu: `08129876${String(5432 + i)}`,
      },
    })
    studentRecords[s.nisn] = { id: student.id, nama_lengkap: s.nama_lengkap, nisn: s.nisn, kelas: s.kelas }
  }

  const subjects = {
    web: await prisma.subject.create({ data: { name: "Pemrograman Web", description: "Dasar-dasar pengembangan web" } }),
    db: await prisma.subject.create({ data: { name: "Basis Data", description: "Pengelolaan basis data relasional" } }),
    jar: await prisma.subject.create({ data: { name: "Jaringan Komputer", description: "Instalasi dan administrasi jaringan" } }),
    mat: await prisma.subject.create({ data: { name: "Matematika", description: "Matematika umum" } }),
    bindo: await prisma.subject.create({ data: { name: "Bahasa Indonesia", description: "Bahasa dan sastra Indonesia" } }),
  }

  const guruAsep = guruRecords["199005152015022001"]
  const guruSiti = guruRecords["198703122010012002"]
  const guruAndi = guruRecords["199210142019032003"]

  const teachingClasses: Record<string, { id: number }> = {}
  const tcPairs = [
    { key: "web", classroom: classrooms.X, subject: subjects.web, guru: guruAsep },
    { key: "db", classroom: classrooms.X, subject: subjects.db, guru: guruAsep },
    { key: "jar", classroom: classrooms.X, subject: subjects.jar, guru: guruAndi },
    { key: "mat", classroom: classrooms.X, subject: subjects.mat, guru: guruSiti },
    { key: "bindo", classroom: classrooms.X, subject: subjects.bindo, guru: guruSiti },
  ]

  for (const pair of tcPairs) {
    const tc = await prisma.teachingClass.create({
      data: {
        classroom_id: pair.classroom.id,
        subject_id: pair.subject.id,
        teacher_id: pair.guru.id,
        guru_nama: pair.guru.nama_lengkap,
        mata_pelajaran: pair.subject.name,
        kelas: pair.classroom.name,
        tahun_ajaran: "2025/2026",
        semester: "Ganjil",
        status: "Aktif",
      },
    })
    teachingClasses[pair.key] = tc
  }

  const createMaterial = (key: string, data: Record<string, unknown>) => {
    const tc = teachingClasses[key]
    if (!tc) return
    return prisma.material.create({
      data: { teaching_class_id: tc.id, status: "PUBLISH", ...data } as never,
    })
  }

  await createMaterial("web", {
    judul: "Pengenalan HTML & CSS",
    deskripsi: "Memahami struktur dasar HTML dan styling dengan CSS",
    guru_nama: "Asep Nugraha",
    mata_pelajaran: "Pemrograman Web",
    kelas: "X TKJ 1",
    pertemuan: 1,
    jenis_materi: "PDF",
    isi_materi: "<p>Materi pengenalan HTML dan CSS untuk kelas X TKJ.</p>",
  })
  await createMaterial("web", {
    judul: "JavaScript Dasar",
    deskripsi: "Dasar-dasar pemrograman JavaScript",
    guru_nama: "Asep Nugraha",
    mata_pelajaran: "Pemrograman Web",
    kelas: "X TKJ 1",
    pertemuan: 2,
    jenis_materi: "Video",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isi_materi: "<p>Materi JavaScript dasar beserta contoh kode.</p>",
  })
  await createMaterial("db", {
    judul: "Normalisasi Basis Data",
    deskripsi: "Konsep normalisasi 1NF sampai 3NF",
    guru_nama: "Asep Nugraha",
    mata_pelajaran: "Basis Data",
    kelas: "X TKJ 1",
    pertemuan: 3,
    jenis_materi: "PPTX",
    isi_materi: "<p>Materi normalisasi basis data.</p>",
  })
  await createMaterial("jar", {
    judul: "Pengkabelan Jaringan",
    deskripsi: "Praktik pengkabelan straight dan crossover",
    guru_nama: "Andi Wijaya",
    mata_pelajaran: "Jaringan Komputer",
    kelas: "X TKJ 1",
    pertemuan: 4,
    jenis_materi: "Gambar",
    isi_materi: "<p>Materi pengkabelan jaringan komputer.</p>",
  })

  const createAssignment = (key: string, data: Record<string, unknown>) => {
    const tc = teachingClasses[key]
    if (!tc) return
    return prisma.assignment.create({
      data: {
        teaching_class_id: tc.id,
        status: "PUBLISHED",
        ...data,
      } as never,
    })
  }

  const now = new Date()
  const daysFrom = (days: number) => new Date(now.getTime() + days * 86400000)

  await createAssignment("web", {
    judul: "Membuat Halaman Web Sederhana",
    deskripsi: "Buat halaman profil pribadi menggunakan HTML dan CSS",
    guru_nama: "Asep Nugraha",
    mata_pelajaran: "Pemrograman Web",
    kelas: "X TKJ 1",
    tanggal_dibuka: daysFrom(-5),
    tenggat_waktu: daysFrom(7),
    tenggat_jam: "23:59",
    nilai_maksimal: 100,
  })
  await createAssignment("db", {
    judul: "Latihan Normalisasi",
    deskripsi: "Kerjakan latihan normalisasi basis data",
    guru_nama: "Asep Nugraha",
    mata_pelajaran: "Basis Data",
    kelas: "X TKJ 1",
    tanggal_dibuka: daysFrom(-2),
    tenggat_waktu: daysFrom(10),
    tenggat_jam: "23:59",
    nilai_maksimal: 100,
  })
  await createAssignment("mat", {
    judul: "Soal Persamaan Kuadrat",
    deskripsi: "Selesaikan 10 soal persamaan kuadrat",
    guru_nama: "Siti Aminah",
    mata_pelajaran: "Matematika",
    kelas: "X TKJ 1",
    tanggal_dibuka: daysFrom(-1),
    tenggat_waktu: daysFrom(14),
    tenggat_jam: "23:59",
    nilai_maksimal: 100,
  })

  const assignmentWeb = await prisma.assignment.findFirst({
    where: { judul: "Membuat Halaman Web Sederhana" },
  })
  const siswaRizki = studentRecords["0081234567"]
  const siswaDewi = studentRecords["0081234568"]
  const siswaBima = studentRecords["0081234569"]
  const siswaFajar = studentRecords["0081234573"]

  if (assignmentWeb && siswaRizki) {
    await prisma.submission.create({
      data: {
        assignment_id: assignmentWeb.id,
        student_id: siswaRizki.id,
        catatan: "Sudah dikerjakan, mohon diperiksa",
        waktu_pengumpulan: daysFrom(-3),
        status: "SUBMITTED",
        nilai: 88,
        feedback: "Bagus, perhatikan penggunaan semantic HTML",
      },
    })
  }
  if (assignmentWeb && siswaDewi) {
    await prisma.submission.create({
      data: {
        assignment_id: assignmentWeb.id,
        student_id: siswaDewi.id,
        catatan: "Tugas terlambat dikumpulkan",
        waktu_pengumpulan: daysFrom(-1),
        status: "LATE",
        nilai: 75,
      },
    })
  }
  if (assignmentWeb && siswaBima) {
    await prisma.submission.create({
      data: {
        assignment_id: assignmentWeb.id,
        student_id: siswaBima.id,
        status: "NOT_SUBMITTED",
      },
    })
  }
  if (assignmentWeb && siswaFajar) {
    await prisma.submission.create({
      data: {
        assignment_id: assignmentWeb.id,
        student_id: siswaFajar.id,
        catatan: "Dikumpulkan tepat waktu",
        waktu_pengumpulan: daysFrom(-2),
        status: "SUBMITTED",
        nilai: 92,
      },
    })
  }

  const announcementTargets = ["Semua Pengguna", "Siswa", "Guru"] as const
  const announcements = [
    {
      judul: "Pembagian Rapor Semester Ganjil",
      ringkasan: "Pembagian rapor semester ganjil dilaksanakan pada tanggal 20 Desember",
      isi: "<p>Pembagian rapor semester ganjil akan dilaksanakan secara online. Siswa dapat mengunduh rapor melalui portal masing-masing.</p>",
      kategori: "Akademik",
      target: announcementTargets[0],
      status: "PUBLISHED",
      penulis: "Administrator SIAPOS",
      pinned: true,
      tanggal_publish: daysFrom(-3),
    },
    {
      judul: "Jadwal Penilaian Akhir Semester",
      ringkasan: "Penilaian akhir semester ganjil dimulai 8 Desember",
      isi: "<p>Penilaian akhir semester (PAS) ganjil akan dilaksanakan mulai tanggal 8 sampai 14 Desember. Pastikan siswa mempersiapkan diri.</p>",
      kategori: "Assessment",
      target: announcementTargets[1],
      status: "PUBLISHED",
      penulis: "Asep Nugraha",
      pinned: false,
      tanggal_publish: daysFrom(-6),
    },
    {
      judul: "Workshop Pembuatan Media Ajar Digital",
      ringkasan: "Workshop untuk seluruh guru pada bulan Januari",
      isi: "<p>Workshop pembuatan media ajar digital akan diselenggarakan untuk seluruh guru pada minggu kedua bulan Januari.</p>",
      kategori: "Kegiatan Sekolah",
      target: announcementTargets[2],
      status: "PUBLISHED",
      penulis: "Administrator SIAPOS",
      pinned: false,
      tanggal_publish: daysFrom(-10),
    },
    {
      judul: "Libur Nasional Hari Kemerdekaan",
      ringkasan: "Sekolah libur pada 17 Agustus",
      isi: "<p>Sehubungan dengan peringatan Hari Kemerdekaan RI, seluruh kegiatan belajar mengajar diliburkan.</p>",
      kategori: "Libur",
      target: announcementTargets[0],
      status: "DRAFT",
      penulis: "Administrator SIAPOS",
      pinned: false,
      tanggal_publish: null,
    },
  ]

  for (const a of announcements) {
    await prisma.announcement.create({
      data: {
        ...a,
        author_id: admin.id,
        lampiran: [],
        target: a.target,
        status: a.status as "PUBLISHED" | "DRAFT" | "ARCHIVED",
      },
    })
  }

  const scheduleData = [
    { day: "SENIN", key: "web", start: "07:00", end: "08:30", room: "Lab Komputer 1" },
    { day: "SENIN", key: "db", start: "08:30", end: "10:00", room: "Lab Komputer 1" },
    { day: "SELASA", key: "mat", start: "07:00", end: "08:30", room: "Ruang 1" },
    { day: "RABU", key: "jar", start: "10:00", end: "11:30", room: "Lab Komputer 2" },
    { day: "KAMIS", key: "bindo", start: "07:00", end: "08:30", room: "Ruang 1" },
    { day: "JUMAT", key: "web", start: "08:30", end: "10:00", room: "Lab Komputer 1" },
  ]

  for (const s of scheduleData) {
    const tc = teachingClasses[s.key]
    if (!tc) continue
    await prisma.schedule.create({
      data: {
        teaching_class_id: tc.id,
        hari: s.day as never,
        jam_mulai: s.start,
        jam_selesai: s.end,
        mata_pelajaran: s.key === "web" ? "Pemrograman Web" : s.key === "db" ? "Basis Data" : s.key === "jar" ? "Jaringan Komputer" : s.key === "mat" ? "Matematika" : "Bahasa Indonesia",
        guru_nama: s.key === "jar" ? "Andi Wijaya" : s.key === "mat" || s.key === "bindo" ? "Siti Aminah" : "Asep Nugraha",
        kelas: "X TKJ 1",
        tahun_ajaran: "2025/2026",
        semester: "Ganjil",
        ruang: s.room,
        status: "Aktif",
      },
    })
  }

  const teacherCount = await prisma.teacher.count()
  const studentCount = await prisma.student.count()
  const classroomCount = await prisma.classroom.count()
  const subjectCount = await prisma.subject.count()
  console.log(`Seed selesai. ${teacherCount} guru, ${studentCount} siswa, ${classroomCount} kelas, ${subjectCount} mapel.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
