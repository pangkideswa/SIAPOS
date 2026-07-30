# Changelog

Semua perubahan signifikan pada SIAPOS akan didokumentasikan di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id/1.1.0/).

---

## [0.3.0] - 2026-07-28

### Sprint 4 — Assessment Module

**Added**
- **Sprint 4.1: Bank Soal**
  - BankSoalListPage — search, 4 filters, DataTable, CRUD actions, pagination
  - BankSoalFormSheet — 7 fields (kode soal, tipe soal, pertanyaan, pilihan, jawaban benar, bobot, mapel)
  - BankSoalDetailPage — soal info, pilihan jawaban, jawaban benar highlight
  - 16 dummy records across 6 mata pelajaran

- **Sprint 4.2: Paket Soal**
  - PaketSoalListPage — search, 3 filters, DataTable, CRUD actions, pagination
  - PaketSoalFormSheet — soal picker dengan multi-select, auto-fill info
  - PaketSoalDetailPage — paket info, daftar soal terpilih
  - 8 dummy records across 4 kelas

- **Sprint 4.3: Quiz**
  - QuizListPage — search, 4 filters, DataTable, CRUD actions
  - QuizFormSheet — 10 fields dengan toggle switches (acak soal, acak jawaban, tampilkan nilai)
  - QuizDetailPage — quiz info, pengaturan, aksi
  - QuizTakePage — timer, navigasi soal, submit dialog
  - QuizResultPage — hasil, skor, review jawaban
  - 4 dummy quizzes, 8 quiz participants

- **Sprint 4.4: CBT**
  - CBTListPage — search, 3 filters, DataTable, CRUD actions
  - CBTFormSheet — 14 fields dengan toggle switches (acak soal, auto-submit, izinkan kembali)
  - CBTDetailPage — CBT info, pengaturan, aksi
  - CBTExamPage — timer, navigasi soal, tandai soal, submit dialog
  - CBTResultPage — hasil, skor, status kelulusan
  - 3 dummy CBT exams, 6 CBT results

- **Sprint 4.5: Hasil Ujian**
  - HasilUjianListPage — 5 summary cards, search, 5 filters, DataTable, pagination
  - HasilUjianDetailPage — detail info, review jawaban accordion, catatan evaluasi form
  - 16 dummy records across 6 siswa, 6 jenis ujian

- **Sprint 4.6: Analitik**
  - Recharts installed as charting library
  - AnalyticsPage — dashboard dengan 8 summary cards, 5 charts, 3 analysis tables, insight panel
  - Charts: Bar per Mapel, Pie Status Kelulusan, Line Tren Nilai, Horizontal Bar Kelas, Grouped Bar per Jenis Ujian
  - Filter bar (Kelas, Mapel, Jenis Ujian, Rentang Tanggal)
  - Analisis per Jenis Ujian, Top Siswa Berprestasi, Siswa Perlu Perhatian
  - Insight & Rekomendasi panel (peringatan/informasi/rekomendasi)

- **Sprint 4.7: QA & Stabilization**
  - Navigation: added missing `/siswa/quiz` sidebar link
  - Navigation: added `React` import to `data-table.tsx` for type safety
  - CBT: fixed timer dead-end when `auto_submit=false` — now allows manual submit
  - CBT: removed unused `totalTidakDijawab` variable
  - Hasil Ujian: fixed state-setting-during-render anti-pattern (now uses `useEffect`)
  - Hasil Ujian: removed redundant `/ 100 * 100` calculation
  - Detail pages: replaced misleading "Edit" buttons with "Kembali" (Back) buttons
  - Accessibility: added `aria-label` to 15+ icon-only buttons across all 6 modules
  - Dead code: removed unused exports (`NILAI_MINIMUM_LULUS`, `GURU_CBT_OPTIONS`, 10 unused `CHART_COLORS`)
  - Build: zero errors, zero warnings (except pre-existing CBT eslint suppression)

### Sprint 5 — Module Integration

**Added**
- **Sprint 5.1: Shared Data Layer**
  - Created `src/lib/demo-data/` — centralized dummy data directory (24 files)
  - Unified `DEMO_ACTIVITIES` (14 entries across all roles) and `DEMO_ANNOUNCEMENTS` (6 entries with `targetRole` filtering)
  - 20 bridge files re-exporting from feature dummies (`users.ts`, `siswa.ts`, `guru.ts`, `jurusan.ts`, `kelas-mengajar.ts`, `jadwal-pelajaran.ts`, `materi.ts`, `tugas.ts`, `pengumpulan.ts`, `penilaian.ts`, `nilai-akademik.ts`, `quiz.ts`, `cbt.ts`, `hasil-ujian.ts`, `pengumuman.ts`, `absensi.ts`, `bank-soal.ts`, `paket-soal.ts`, `kalender-akademik.ts`, `analitik.ts`, `pengaturan-sekolah.ts`)
  - Removed duplicate/redundant bridge files for non-existent feature directories

- **Sprint 5.2: Dashboard Integration**
  - Refactored `features/dashboard/dummy/dashboard.data.ts` to re-export activity/announcement types from `@/lib/demo-data/`
  - All three dashboards (admin, guru, siswa) now import from shared data layer
  - `getAdminCounters()`, `getGuruCounters()`, `getSiswaCounters()` computed from unified data
  - `getAnnouncementsByRole()` filtering announcements by `targetRole`
  - Empty states: "Belum ada data" displayed when arrays are empty

---

## [0.2.0] - 2026-07-28

### Sprint 1 — Foundation

**Added**
- Setup project Laravel 12 (Backend)
- Setup project Next.js 15 (Frontend)
- Setup PostgreSQL database
- Install Sanctum untuk autentikasi
- Install Spatie Permission untuk role-based access
- Install shadcn/ui sebagai UI component library
- Landing page — modern, mobile-first, responsive, animasi Framer Motion
- Halaman Login (`/masuk`) — Email/NIP/NISN, password, ingat saya
- Halaman Register (`/daftar`) — role Guru/Siswa/Wali, form dinamis
- Dashboard layout — Sidebar (desktop), BottomNav (mobile), TopBar
- Backend authentication — Login, Register, User model
- Role-based navigation untuk Admin, Guru, Siswa, Wali

### Sprint 2 — Master Data

**Added**
- **Sprint 2.1: Manajemen Pengguna**
  - UserListPage — search, role filter, DataTable, pagination
  - UserDetailPage — profile card, info rows, edit/delete
  - UserFormDialog — create/edit dengan dynamic NIP/NISN fields
  - UserDeleteDialog — konfirmasi dengan loading state
  - 12 dummy users across all roles

- **Sprint 2.2: Master Data Jurusan**
  - Backend: Migration, Model, Repository, Service, Controller
  - JurusanListPage — search by name/code, status filter
  - JurusanDetailPage — code badge, status, description
  - JurusanFormDialog — name, code (auto-uppercase), is_active
  - 3 dummy jurusan (TKJ, TBSM, BDP)

- **Sprint 2.3: Data Guru**
  - Backend: Migration (14 fields), Model, Repository, Service, Controller
  - GuruListPage — search by 5 fields, 2 filters, avatar initials
  - GuruDetailPage — profile card, 14 fields, mata pelajaran badges
  - GuruFormSheet — 4 sections, full-page slide-over
  - 3 dummy guru (Budi, Siti, Andi)

- **Sprint 2.4: Data Siswa**
  - Backend: Migration (18 fields), Model with Jurusan relation
  - SiswaListPage — search by 4 fields, 3 filters, Import/Export
  - SiswaDetailPage — profile card, 3 info sections, 18 fields
  - SiswaFormSheet — 3 sections (Identitas, Akademik, Orang Tua)
  - 5 dummy siswa across 2 jurusan

- **Sprint 2.5: Pengaturan Sekolah**
  - PengaturanSekolahPage — 6 sections (Informasi, Kontak, Logo, Tahun Akademik, Sistem, Sosial Media)
  - ImageUpload component — preview, 2MB validation
  - SectionHeader component — icon + title
  - 1 dummy settings (SMK Wahana Bakti)

### Sprint 3 — Learning Module

**Added**
- **Sprint 3.1: Kelas Mengajar**
  - KelasMengajarListPage — search, 3 filters, DataTable
  - KelasMengajarFormSheet — 6 fields (Select components)
  - KelasMengajarDeleteDialog
  - 9 dummy records

- **Sprint 3.2: Materi Pembelajaran**
  - MateriListPage — search, 3 filters, status badges
  - MateriFormSheet — 5 sections with HTML preview
  - MateriDetailPage — 3-column layout, rendered HTML content
  - 6 dummy records with realistic HTML content

- **Sprint 3.3: Tugas**
  - Installed `sonner` untuk toast notifications
  - TugasListPage — search, 4 filters, status badges
  - TugasFormSheet — 5 sections with validation
  - TugasDetailPage — 3-column layout, "Lihat Pengumpulan" button
  - 6 dummy records across 3 guru

- **Sprint 3.4: Pengumpulan Tugas**
  - PengumpulanListPage — guru view dengan submission counts
  - PengumpulanDetailPage — submissions DataTable
  - JawabanDetailDialog — file jawaban + Beri Nilai form
  - SimulasiSiswaPage — siswa simulation dengan upload validation
  - 9 dummy submissions

- **Sprint 3.5: Penilaian**
  - PenilaianListPage — 4 summary cards, DataTable, 4 filters
  - PenilaianDetailPage — form penilaian dengan validasi
  - 9 dummy records across 6 tugas

- **Sprint 3.6: Dashboard Admin**
  - AdminDashboardPage — 6 sections (Welcome, Statistik, Aktivitas, Status Akademik, Pengumuman, Quick Action)
  - 8 dummy activities, 4 announcements

- **Sprint 3.7: Dashboard Guru**
  - GuruDashboardPage — 7 sections (Ringkasan, Kelas Mengajar, Tugas Dinilai, Aktivitas, Jadwal, Quick Action, Pengumuman)
  - 10 jadwal records, 12 activity records

- **Sprint 3.8: Dashboard Siswa**
  - SiswaDashboardPage — 7 sections (Ringkasan, Tugas Dikerjakan, Materi, Nilai, Jadwal, Pengumuman, Quick Action)
  - 6 jadwal records, 2 tugas status records

- **Sprint 3.9: QA & Stabilization**
  - Removed 7 unused imports/warnings
  - Created SIAPOS favicon SVG
  - Fixed manifest.json (removed broken PNG refs)
  - Added missing `/admin/assignments` to bottom-nav
  - Normalized all DataTable empty messages
  - Removed default Next.js starter files
  - Full audit: 13 modules verified

---

## [0.1.0] - 2026-07-01

### Initial Setup

**Added**
- Project initialization
- Repository setup
- Development environment configuration
