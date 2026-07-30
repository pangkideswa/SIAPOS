# Changelog SIAPOS

> Semua perubahan penting pada proyek ini akan dicatat di sini.

---

## v0.4.0 (2026-07-30)

### Sprint 4.10 — Nilai Akademik

#### ✨ Added

- **Nilai Akademik Module**
  - Modul pusat pengelolaan nilai siswa dengan komponen: Tugas, Praktik, UTS, UAS
  - Status nilai: Lengkap / Belum Lengkap
  - Halaman Admin: DataTable + 5 filter (TA, Semester, Mapel, Guru, Kelas) + Search + Pagination
  - Halaman Guru: Input & Edit nilai untuk kelas yang diampu
  - Halaman Siswa: Melihat nilai milik sendiri
  - Detail Dialog: Informasi lengkap komponen nilai
  - Form Dialog: Input/Edit nilai dengan validasi 0-100
  - Summary Cards: Total Nilai, Mapel, Guru, Siswa, Data Lengkap, Belum Lengkap
  - Dummy data: 40+ siswa, 6 guru, 10 mapel, 2 TA, 2 semester

- **Dashboard Widgets**
  - Guru: Nilai yang belum diinput
  - Siswa: Nilai terbaru
  - Admin: Statistik input nilai

- **Navigation**
  - Sidebar: "Nilai Akademik" di Academic section untuk semua role
  - BottomNav: "Nilai" item untuk admin/guru/siswa
  - TopBar: Page title untuk route nilai-akademik

### Sprint 4.8 — Modul Absensi & Jadwal Pelajaran

#### ✨ Added

- **Jadwal Pelajaran Module**
  - `features/jadwal-pelajaran/` — 36 record, 6 guru, 4 kelas, 6 hari
  - Grouped by day, search + 3 filters
  - Routes: `/admin/jadwal-pelajaran`, `/guru/jadwal-pelajaran`

- **Absensi Enhancement**
  - 6th teacher "Dewi Sartika" added
  - 3 new sesi + corresponding attendance records

- **Navigation**
  - "Academic" section in sidebar for admin/guru/siswa

### Sprint 4.9 — Kalender Akademik & Pengumuman

#### ✨ Added

- **Kalender Akademik Module**
  - `features/kalender-akademik/` — 33 events, 13 kategori, 3 views (Month/Week/Agenda)
  - Summary cards, filter by kategori/semester/TA/bulan
  - Routes for admin/guru/siswa

- **Pengumuman Module**
  - `features/pengumuman/` — 25 records, 8 kategori, 3 status, 8 target
  - CRUD admin, own-CRUD guru, read-only siswa
  - Routes for admin/guru/siswa

### Sprint 4.1 — 4.7 — Assessment Module

#### ✨ Added

- **Bank Soal** — 16 soal, 6 mapel, 4 tipe soal (PG, Benar/Salah, Isian, Essay)
- **Paket Soal** — 8 paket, soal picker dengan multi-select
- **Quiz** — 4 quiz, timer, navigasi soal, submit dialog, hasil otomatis
- **CBT** — 3 ujian, timer, bookmark soal, result page
- **Hasil Ujian** — 16 record, review jawaban, evaluasi
- **Analitik** — 5 Recharts visualisasi, insight & rekomendasi
- **QA & Stabilization** — Aksesibilitas, navigasi, dead code removal

---

## v0.3.0 (2026-07-28)

### Sprint 3.9 — QA & Stabilization

#### 🐛 Fixed

- Removed 7 unused imports/warnings across codebase
- Created SIAPOS favicon SVG
- Fixed manifest.json (removed broken PNG refs)
- Removed default Next.js starter files
- Added missing `/admin/assignments` route to bottom-nav
- Normalized empty state messages in all DataTable components
- Full audit: 13 modules verified

### Sprint 3.8 — Dashboard Siswa

#### ✨ Added

- **SiswaDashboardPage** — 7 sections
  - Ringkasan (5 stat cards), Tugas, Materi, Nilai, Jadwal, Pengumuman, Quick Action
  - Route: `/siswa`

### Sprint 3.7 — Dashboard Guru

#### ✨ Added

- **GuruDashboardPage** — 7 sections
  - Ringkasan (6 stat cards), Kelas Mengajar, Tugas Perlu Dinilai, Aktivitas, Jadwal, Quick Action
  - Route: `/guru`

### Sprint 3.6 — Dashboard Admin

#### ✨ Added

- **AdminDashboardPage** — 6 sections
  - Statistik, Aktivitas, Status Akademik, Pengumuman, Quick Action
  - Route: `/admin`

### Sprint 3.5 — Penilaian

#### ✨ Added

- **Penilaian Module** — 9 records
  - Status: Belum Dinilai / Sudah Dinilai / Revisi
  - Summary cards, DataTable, detail 3-column
  - Routes: `/guru/penilaian`

### Sprint 3.4 — Pengumpulan Tugas

#### ✨ Added

- **Pengumpulan Tugas Module** — 9 submissions
  - Status: Belum Mengumpulkan / Sudah Mengumpulkan / Terlambat
  - Guru: list per tugas, detail per siswa, input nilai
  - Siswa: simulasi upload tugas
  - Routes: `/guru/pengumpulan`, `/siswa/simulasi`

### Sprint 3.3 — Tugas

#### ✨ Added

- **Tugas Module** — 6 records
  - Status: Draft / Dipublikasikan / Ditutup
  - Form 5 sections, validation, file upload, date picker
  - Routes: `/guru/tugas`

### Sprint 3.2 — Materi Pembelajaran

#### ✨ Added

- **Materi Pembelajaran Module** — 6 records
  - Status: Draft / Publish
  - Form 5 sections, HTML content, lampiran, video embed
  - Routes: `/guru/materi`

### Sprint 3.1 — Kelas Mengajar

#### ✨ Added

- **Kelas Mengajar Module** — 6 records
  - CRUD, search, 3 filters
  - Routes: `/admin/kelas-mengajar`

---

## v0.2.0 (2026-07-27)

### Sprint 2.5 — Pengaturan Sekolah

#### ✨ Added

- **Pengaturan Sekolah** — 6 sections
  - Informasi, Kontak, Logo, Tahun Akademik, Sistem, Sosial Media
  - ImageUpload component with 2MB validation

### Sprint 2.4 — Data Siswa

#### ✨ Added

- **Siswa Module** — 5 students
  - 18 fields, 18 kelas options, 3 jurusan
  - Import Excel & Export CSV buttons (UI only)

### Sprint 2.3 — Data Guru

#### ✨ Added

- **Guru Module** — 3 teachers
  - 15 fields, form 4 sections, status kepegawaian colors

### Sprint 2.2 — Master Data Jurusan

#### ✨ Added

- **Jurusan Module** — 3 jurusan (TKJ, TBSM, BDP)
  - Backend: migration, model, repository, controller

### Sprint 2.1 — Manajemen Pengguna

#### ✨ Added

- **Users Module** — 12 dummy users
  - CRUD, role-based, search by name/email/NIP/NISN

---

## v0.1.0 (2026-07-01)

### Sprint 1 — Foundation

#### ✨ Added

- Setup Laravel 12 + Next.js 15 + PostgreSQL
- Install Sanctum, Spatie Permission, shadcn/ui
- Landing Page (Framer Motion, responsive)
- Login (`/masuk`) — identifier (email/NIP/NISN)
- Register (`/daftar`) — role-based dynamic form
- Dashboard Layout (Sidebar, TopBar, BottomNav)
- Backend Auth Connection (API integration)
