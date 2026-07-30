# SIAPOS Blueprint

---

## Visi

Menjadi Operating System Pendidikan berbasis web yang mempermudah proses belajar mengajar dan pengelolaan akademik di SMK Wahana Bakti.

## Misi

1. Menyediakan platform belajar yang modern, cepat, dan ramah bagi guru dan siswa.
2. Mengintegrasikan seluruh aspek akademik dalam satu sistem terpadu.
3. Meningkatkan efisiensi pengelolaan nilai, absensi, dan administrasi sekolah.
4. Mendorong transformasi digital di lingkungan SMK.

## Filosofi SIAPOS

SIAPOS bukan website sekolah.

SIAPOS adalah Education Operating System.

Prinsip:

- **Mobile First** — Setiap fitur dirancang untuk perangkat mobile terlebih dahulu.
- **Sederhana** — UI bersih, tidak berlebihan, fokus pada pengguna.
- **Cepat** — Performa adalah prioritas, animasi maksimal 300ms.
- **Ramah** — Mudah digunakan oleh guru dan siswa.
- **Profesional** — Tampilan modern sesuai standar aplikasi masa kini.

## Target Pengguna

| Pengguna | Deskripsi |
|----------|-----------|
| Administrator | Mengelola master data, pengaturan sistem, dan seluruh data |
| Guru | Mengelola kelas, materi, tugas, penilaian, dan nilai akademik |
| Siswa | Mengakses materi, tugas, quiz, ujian, dan melihat nilai |
| Wali Kelas | Memantau perkembangan siswa dan laporan akademik |
| Kepala Sekolah | Melihat laporan dan statistik akademik (coming soon) |

## User Role

Sistem menggunakan 5 role:

| Role | Kode |
|------|------|
| Super Admin | `super_admin` |
| Admin | `admin` |
| Guru | `guru` |
| Siswa | `siswa` |
| Wali Kelas | `wali` |

## Core Modules

| Modul | Fitur Utama | Status |
|-------|-------------|--------|
| Authentication | Login (Email/NIP/NISN), Register, Logout | ✅ Selesai |
| Manajemen Pengguna | CRUD User, Role Management | ✅ Selesai |
| Master Data Jurusan | CRUD Jurusan (TKJ, TBSM, BDP) | ✅ Selesai |
| Data Guru | CRUD Guru, NIP, NUPTK, Mapel | ✅ Selesai |
| Data Siswa | CRUD Siswa, NIS, NISN, Kelas | ✅ Selesai |
| Pengaturan Sekolah | Info, Kontak, Logo, Tahun Akademik | ✅ Selesai |
| Kelas Mengajar | Penugasan Guru ke Kelas | ✅ Selesai |
| Materi Pembelajaran | Buat/Terbitkan Materi, Lampiran, Video | ✅ Selesai |
| Tugas | Buat/Kelola Tugas, Deadline | ✅ Selesai |
| Pengumpulan Tugas | Upload Jawaban, Penilaian | ✅ Selesai |
| Penilaian | Input Nilai, Feedback Guru | ✅ Selesai |
| Bank Soal | Soal PG, Essay, Benar/Salah | ✅ Selesai |
| Paket Soal | Kumpulan Soal untuk Quiz/CBT | ✅ Selesai |
| Quiz | Quiz Online, Timer, Hasil Otomatis | ✅ Selesai |
| CBT | Ujian CBT, Timer, Anti-Cheating | ✅ Selesai |
| Hasil Ujian | Review Jawaban, Evaluasi | ✅ Selesai |
| Analitik | Grafik, Insight, Rekomendasi | ✅ Selesai |
| Dashboard | Admin, Guru, Siswa | ✅ Selesai |
| Jadwal Pelajaran | Jadwal per Hari, Kelas, Guru | ✅ Selesai |
| Absensi | Input, Riwayat, Rekap Absensi | ✅ Selesai |
| Kalender Akademik | Event, Bulan/Minggu/Agenda View | ✅ Selesai |
| Pengumuman | Buat/Terbitkan, Target Audiens | ✅ Selesai |
| Nilai Akademik | Input Nilai Tugas/Praktik/UTS/UAS | ✅ Selesai |

## Arsitektur Frontend

```
src/
├── app/                   # Next.js App Router
│   ├── (auth)/            # Halaman auth (login, register)
│   ├── (dashboard)/       # Halaman dashboard (admin, guru, siswa, wali)
│   │   ├── admin/         # Manajemen, master data
│   │   ├── guru/          # Pembelajaran, penilaian
│   │   ├── siswa/         # Belajar, tugas, ujian
│   │   └── wali/          # Monitoring
│   └── layout.tsx         # Root layout
├── components/            # Komponen shared
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Sidebar, TopBar, BottomNav
│   └── dashboard/         # Dashboard widgets
├── features/              # Feature-based modules
│   ├── users/
│   ├── guru/
│   ├── siswa/
│   ├── nilai-akademik/
│   └── ... (22 modules)
├── contexts/              # React Context
├── hooks/                 # Custom hooks
├── lib/                   # Utility functions
├── providers/             # Provider components
└── types/                 # Shared TypeScript types
```

## Roadmap Produk

| Epic | Fase | Target Rilis |
|------|------|-------------|
| EPIC 1 — Foundation | Selesai | v0.1.0 - v0.2.0 |
| EPIC 2 — Learning | Selesai | v0.2.0 |
| EPIC 3 — Assessment | Selesai | v0.3.0 |
| EPIC 4 — Academic | Hampir Selesai | v0.4.0 |
| EPIC 5 — PKL | Coming Soon | v0.5.0 |
| EPIC 6 — Communication | Coming Soon | v0.5.0 |
| EPIC 7 — AI Assistant | Coming Soon | v1.0.0 |
| EPIC 8 — Production Ready | Coming Soon | v1.0.0 |

---

## Tech Stack

### Frontend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Next.js | 15 | App Router, SSR/SSG |
| TypeScript | 5 | Strict type safety |
| Tailwind CSS | 4 | Utility-first styling |
| shadcn/ui | — | UI component library |
| TanStack Query | 5 | Server state management |
| Axios | 1 | HTTP client |
| React Hook Form | 7 | Form management |
| Zod | 3 | Form validation |
| Lucide React | 1 | Icon library |
| Framer Motion | 12 | Animasi |
| Sonner | 2 | Toast notifications |
| Recharts | 3 | Charting library |

### Backend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Laravel | 12 | REST API backend |
| Sanctum | — | API token authentication |
| Spatie Permission | — | Role-based access control |
| PostgreSQL | 16 | Database |
