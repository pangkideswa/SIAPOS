# TASK

## Sprint 1

Status : Done

### Todo

- [x] Setup Laravel
- [x] Setup Next.js
- [x] Setup PostgreSQL
- [x] Install Sanctum
- [x] Install Spatie Permission
- [x] Install shadcn/ui
- [x] Landing Page
- [x] Login (/masuk)
- [x] Register (/daftar)
- [x] Dashboard Layout (Sidebar, TopBar, BottomNav)
- [x] Backend Foundation & Frontend Auth Connection

---

### Done

- [x] Setup Laravel (Backend)
- [x] Setup Next.js (Frontend)
- [x] Setup PostgreSQL (Database)
- [x] Install Sanctum (Auth)
- [x] Install Spatie Permission (RBAC)
- [x] Install shadcn/ui (UI Components)
- [x] Landing Page - Modern, Mobile First, Responsive, SIAPOS Colors, shadcn/ui, Framer Motion, Bahasa Indonesia
- [x] Login (/masuk) - Email/NIP/NISN, Password, Ingat Saya, Lupa Password, RHF+Zod, Framer Motion
- [x] Register (/daftar) - Role Guru/Siswa/Wali, Form Dinamis, Validasi Frontend, RHF+Zod, Framer Motion
- [x] Dashboard Layout - Sidebar (Desktop), BottomNav (Mobile), TopBar (Search, Notifikasi, Profil), Role-based navigation (Admin, Guru, Siswa, Wali), Framer Motion page transitions
- [x] Backend Foundation & Frontend Auth Connection
  - [x] PostgreSQL configuration in backend .env
  - [x] Migration: nip/nisn columns on users table
  - [x] RoleSeeder (idempotent, delete-then-create) with all 5 roles
  - [x] SuperAdminSeeder (idempotent, updateOrCreate)
  - [x] DatabaseSeeder refactored: idempotent (updateOrCreate/firstOrCreate), wali role, NIP/NISN data
  - [x] LoginRequest updated: accepts `identifier` (email/NIP/NISN) instead of `email`
  - [x] AuthController::login() updated: finds user by email, nip, or nisn
  - [x] StoreUserRequest updated: accepts `wali` role + nip/nisn fields
  - [x] User model + UserResource: added nip/nisn to fillable/output
  - [x] Frontend types updated: User includes nip/nisn, LoginRequest uses `identifier`, RegisterRequest includes role+nip+nisn
  - [x] apiClient fixed: unwraps backend `{message, data}` response format, sends `identifier`
  - [x] auth-context updated: passes `identifier` to login, unwrapped getUser response
  - [x] Register form wired to backend API

---

### Blocked

Belum ada.

---

## Sprint 2

Status : In Progress

### Todo

- [x] Manajemen Pengguna (Frontend + Backend)
- [x] Master Data Jurusan (Frontend + Backend)
- [x] Data Guru (Frontend + Backend)
- [x] Data Siswa (Frontend + Backend)
- [x] Pengaturan Sekolah (Frontend)
- [ ] CRUD Kelas
- [ ] CRUD Mata Pelajaran
- [ ] Penugasan Guru
- [ ] Manajemen Materi
- [ ] Manajemen Tugas
- [ ] Penilaian
- [ ] Pengaturan Sekolah

---

### Done - Sprint 2.1: Manajemen Pengguna

- [x] Backend: UserRepository + UserRepositoryInterface (Repository Pattern)
- [x] Backend: UserService refactored to use UserRepository via DI
- [x] Backend: AppServiceProvider binds UserRepositoryInterface → UserRepository
- [x] Backend: UpdateUserRequest added wali role + nip/nisn unique validation
- [x] Frontend: Feature-based architecture `features/users/` structure
  - [x] constants/user.constants.ts (ROLE_LABELS, ROLE_COLORS, ALL_ROLES, etc.)
  - [x] dummy/users.data.ts (12 dummy users across all roles)
- [x] Frontend: UserListPage — search by name/email/NIP/NISN, role filter, DataTable with pagination, row click → detail
- [x] Frontend: UserDetailPage — avatar, profile card, info rows (NIP/NISN conditional), edit/delete actions, back navigation
- [x] Frontend: UserFormDialog — create/edit with dynamic NIP (guru/wali) / NISN (siswa) fields, role select (admin/guru/siswa/wali)
- [x] Frontend: UserDeleteDialog — confirmation dialog with loading state
- [x] Frontend: Page routes wired up — `/admin/users` (list), `/admin/users/[id]` (detail)
- [x] Frontend: TopBar updated with detail page title routing
- [x] All dummy data operations work client-side (ready for backend integration)
- [x] TypeScript check passed — no errors
- [x] Backend PHP syntax check passed — no errors

### Done - Sprint 2.2: Master Data Jurusan

- [x] Backend: Migration `create_jurusans_table` (name, code, is_active, description, timestamps)
- [x] Backend: Jurusan Model with fillable, casts (is_active → boolean)
- [x] Backend: JurusanRepositoryInterface + JurusanRepository (search by name/code/description, filter by is_active, getActive)
- [x] Backend: JurusanService (DI with JurusanRepositoryInterface)
- [x] Backend: JurusanController (index, active, store, show, update, destroy)
- [x] Backend: StoreJurusanRequest (name required, code unique, is_active boolean, description nullable)
- [x] Backend: JurusanResource (id, name, code, is_active, description, timestamps)
- [x] Backend: JurusanSeeder (idempotent updateOrCreate — TKJ, TBSM, BDP)
- [x] Backend: Routes — `GET /api/jurusans/active` + `apiResource('jurusans')`
- [x] Backend: AppServiceProvider binds JurusanRepositoryInterface → JurusanRepository
- [x] Backend: DatabaseSeeder calls JurusanSeeder
- [x] Frontend: Feature-based `features/jurusan/` (types, constants, dummy data, components)
- [x] Frontend: Dummy data — 3 jurusan sesuai data nyata SMK Wahana Bakti (TKJ aktif, TBSM aktif, BDP tidak aktif)
- [x] Frontend: JurusanListPage — search by name/code, status filter, DataTable, row click → detail
- [x] Frontend: JurusanDetailPage — code badge, name, status, description, timestamps, edit/delete actions
- [x] Frontend: JurusanFormDialog — name, code (auto-uppercase), is_active select, description textarea
- [x] Frontend: JurusanDeleteDialog — confirmation with jurusan name and code
- [x] Frontend: Page routes — `/admin/jurusan` (list), `/admin/jurusan/[id]` (detail)
- [x] Frontend: Sidebar + BottomNav + TopBar updated with Jurusan navigation (Layers icon)
- [x] TypeScript check passed — no errors
- [x] Backend PHP syntax check passed — no errors

### Done - Sprint 2.3: Data Guru

- [x] Backend: Migration `create_teachers_table` (foto, nama_lengkap, nip unique, nuptk nullable, jenis_kelamin enum, tempat_lahir, tanggal_lahir, no_hp nullable, email unique, alamat nullable, pendidikan_terakhir, status_kepegawaian enum, mata_pelajaran json, timestamps, soft deletes)
- [x] Backend: Teacher Model with fillable, casts (tanggal_lahir → date, mata_pelajaran → array), soft deletes
- [x] Backend: TeacherRepositoryInterface + TeacherRepository (search by nama/nip/nuptk/email/no_hp, filter by jenis_kelamin/status_kepegawaian/pendidikan_terakhir)
- [x] Backend: TeacherService (DI with TeacherRepositoryInterface)
- [x] Backend: TeacherController (index, store, show, update, destroy)
- [x] Backend: StoreTeacherRequest (all fields validated, nip/email unique, mata_pelajaran required array min 1, Bahasa Indonesia messages)
- [x] Backend: TeacherResource (all fields output)
- [x] Backend: TeacherSeeder (idempotent updateOrCreate — 3 guru: Budi, Siti, Andi)
- [x] Backend: Routes — `apiResource('teachers')`
- [x] Backend: AppServiceProvider binds TeacherRepositoryInterface → TeacherRepository
- [x] Backend: DatabaseSeeder calls TeacherSeeder
- [x] Frontend: Feature-based `features/guru/` (types, constants, dummy data, components)
- [x] Frontend: Types — Guru interface with all fields, GuruFormData type
- [x] Frontend: Constants — JENIS_KELAMIN_OPTIONS, STATUS_KEPEGAWAIAN_OPTIONS, PENDIDIKAN_OPTIONS, MATA_PELAJARAN_OPTIONS, STATUS_KEPEGAWAIAN_COLORS, EMPTY_GURU_FORM
- [x] Frontend: Dummy data — 3 guru sesuai data nyata (Budi S2/PNS, Siti S1/PPPK, Andi S1/Honorer)
- [x] Frontend: GuruListPage — search by name/NIP/NUPTK/email/mapel, filter by jenis kelamin & status kepegawaian, DataTable with avatar initials, badge, pagination
- [x] Frontend: GuruDetailPage — avatar, profile card, info rows (all 14 fields), mata pelajaran badges, age calculator, edit/delete actions
- [x] Frontend: GuruFormSheet — full-page slide-over, 4 sections (Data Diri, Kontak, Kepegawaian & Pendidikan, Mata Pelajaran checkboxes), all fields, validation
- [x] Frontend: GuruDeleteDialog — confirmation with nama and NIP
- [x] Frontend: Page routes — `/admin/guru` (list), `/admin/guru/[id]` (detail)
- [x] Frontend: Sidebar + BottomNav + TopBar updated with Guru navigation (GraduationCap icon)
- [x] TypeScript check passed — no errors
- [x] Backend PHP syntax check passed — no errors

### Done - Sprint 2.4: Data Siswa

- [x] Backend: Migration `create_students_table` (foto, nis unique, nisn unique, nama_lengkap, jenis_kelamin enum, tempat_lahir, tanggal_lahir, agama, alamat, jurusan_id FK, kelas, tahun_masuk, tahun_ajaran, status enum, nama_ayah, nama_ibu, no_hp_ortu, alamat_ortu, timestamps, soft deletes)
- [x] Backend: Student Model with fillable, casts (tanggal_lahir → date), BelongsTo Jurusan relation
- [x] Backend: StudentRepositoryInterface + StudentRepository (search by nama/nis/nisn/kelas, filter by jurusan_id/kelas/status, eager load jurusan)
- [x] Backend: StudentService (DI with StudentRepositoryInterface)
- [x] Backend: StudentController (index, store, show, update, destroy)
- [x] Backend: StoreStudentRequest (all fields validated, nis/nisn unique, jurusan_id exists, Bahasa Indonesia messages)
- [x] Backend: StudentResource (all fields output with jurusan relation)
- [x] Backend: StudentSeeder (idempotent updateOrCreate — 5 siswa: Rizki, Dewi, Fajar, Ahmad, Putri)
- [x] Backend: Routes — `apiResource('students')`
- [x] Backend: AppServiceProvider binds StudentRepositoryInterface → StudentRepository
- [x] Backend: DatabaseSeeder calls StudentSeeder
- [x] Frontend: Feature-based `features/siswa/` (types, constants, dummy data, components)
- [x] Frontend: Types — Siswa interface (18 fields), SiswaFormData type
- [x] Frontend: Constants — JENIS_KELAMIN_OPTIONS, AGAMA_OPTIONS, STATUS_SISWA_OPTIONS, KELAS_OPTIONS (18 kelas), TAHUN_AJARAN_OPTIONS, JURUSAN_OPTIONS (3 jurusan), STATUS_SISWA_COLORS, EMPTY_SISWA_FORM
- [x] Frontend: Dummy data — 5 siswa across 2 jurusan, 3 kelas, all Aktif status
- [x] Frontend: SiswaListPage — search by name/NIS/NISN/kelas, filter by jurusan/kelas/status, avatar initials, badge, pagination, Import Excel button, Export CSV button (responsive)
- [x] Frontend: SiswaDetailPage — profile card, 3 info sections (Identitas, Akademik, Orang Tua), all 18 fields, timestamps, edit/delete actions
- [x] Frontend: SiswaFormSheet — full-page slide-over, 3 sections (Identitas, Akademik, Orang Tua), all fields, validation, Jurusan select with code+name
- [x] Frontend: SiswaDeleteDialog — confirmation with nama and NIS
- [x] Frontend: Page routes — `/admin/siswa` (list), `/admin/siswa/[id]` (detail)
- [x] Frontend: Sidebar + BottomNav + TopBar updated with Siswa navigation (Users icon)
- [x] TypeScript check passed — no errors
- [x] Backend PHP syntax check passed — no errors

### Done - Sprint 2.5: Pengaturan Sekolah

- [x] Frontend: Feature-based `features/pengaturan-sekolah/` (types, constants, dummy data, components)
- [x] Frontend: Types — SekolahSettings interface (6 groups: informasi_sekolah, kontak, logo, tahun_akademik, pengaturan_sistem, sosial_media) + SekolahFormData type alias
- [x] Frontend: Constants — JENJANG_OPTIONS, STATUS_SEKOLAH_OPTIONS, AKREDITASI_OPTIONS, SEMESTER_OPTIONS, BAHASA_OPTIONS, ZONA_WAKTU_OPTIONS, TAHUN_AJARAN_OPTIONS, EMPTY_SEKOLAH_FORM
- [x] Frontend: Dummy data — DUMMY_SEKOLAH_SETTINGS (SMK Wahana Bakti with realistic data)
- [x] Frontend: PengaturanSekolahPage — 6 sections with Cards, responsive grid layout, all fields with save button
  - [x] Section 1: Informasi Sekolah — Nama, NPSN, NSS, Jenjang/Status/Akreditasi selects
  - [x] Section 2: Kontak — Email, Telepon, Website, Alamat textarea
  - [x] Section 3: Logo — ImageUpload with preview for Logo Sekolah, Logo SIAPOS, Favicon (2MB limit, remove button)
  - [x] Section 4: Tahun Akademik — Tahun Ajaran Aktif select, Semester Aktif select
  - [x] Section 5: Pengaturan Sistem — Nama Aplikasi, Bahasa, Zona Waktu selects
  - [x] Section 6: Sosial Media — Facebook, Instagram, YouTube inputs
- [x] Frontend: ImageUpload component — file input with preview, 2MB validation, remove button
- [x] Frontend: SectionHeader component — icon + title + description with primary background
- [x] Frontend: Page route — `/admin/pengaturan` (settings page)
- [x] Frontend: TopBar updated — getPageTitle returns "Pengaturan Sekolah" for `/admin/pengaturan`
- [x] Sidebar already had "Pengaturan" link to `/admin/pengaturan` — no change needed
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 3.7: Dashboard Guru

- [x] Frontend: Feature-based `features/dashboard/` extended with guru-specific data and component
- [x] Frontend: Dummy data — DUMMY_GURU_JADWAL (10 records across 3 guru, 2 hari), DUMMY_GURU_ACTIVITIES (12 records across 3 guru with action icons and timestamps)
- [x] Frontend: GuruDashboardPage — 7 sections:
  - [x] Section 1: Header — "Halo, [Guru Name] 👋" + "Selamat datang kembali di SIAPOS" + tanggal Indonesia
  - [x] Section 2: Ringkasan — 6 stat cards (Kelas Mengajar, Mata Pelajaran, Materi Dibuat, Tugas Aktif, Belum Dinilai, Total Siswa) with dynamic counts from dummy data
  - [x] Section 3: Kelas Mengajar — clickable cards showing kelas and mata_pelajaran, links to `/guru/kelas`
  - [x] Section 4: Tugas yang Perlu Dinilai — table with judul, kelas, jumlah pengumpulan, deadline, Nilai button → `/guru/pengumpulan/[id]`
  - [x] Section 5: Aktivitas Terbaru — timeline with action text, relative time, icons per activity type
  - [x] Section 6: Jadwal Hari Ini — time-based cards showing kelas, mata_pelajaran, waktu_mulai/selesai, filtered by day
  - [x] Section 7: Quick Action + Pengumuman — 4 shortcut buttons (Tambah Materi, Buat Tugas, Lihat Penilaian, Lihat Kelas Mengajar) + announcements with type badges
- [x] Frontend: Page route — `/guru` now delegates to GuruDashboardPage via thin wrapper
- [x] Frontend: Responsive layout — grid adapts: 2 cols mobile, 3 cols tablet, 6 cols desktop for stats; 3-col grid for middle/bottom sections
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

---

### Blocked

Belum ada.

---

## Sprint 3

Status : In Progress

### Todo

- [x] Kelas Mengajar (Frontend)
- [x] Materi (Frontend)
- [x] Tugas (Frontend)
- [x] Pengumpulan Tugas (Frontend)
- [x] Penilaian (Frontend)
- [x] Dashboard Admin (Frontend)
- [x] Dashboard Guru (Frontend)
- [x] Dashboard Siswa (Frontend)
- [ ] Quiz (Frontend)
- [ ] Pengumuman (Frontend)
- [x] Absensi (Frontend)
- [ ] Nilai (Frontend)

---

### Done - Sprint 3.1: Kelas Mengajar

- [x] Frontend: Feature-based `features/kelas-mengajar/` (types, constants, dummy data, components)
- [x] Frontend: Types — KelasMengajar interface (guru_nama, mata_pelajaran, kelas, tahun_ajaran, semester, status) + KelasMengajarFormData type
- [x] Frontend: Constants — GURU_OPTIONS, MATA_PELAJARAN_OPTIONS, KELAS_OPTIONS, TAHUN_AJARAN_OPTIONS, SEMESTER_OPTIONS, STATUS_OPTIONS, SEMESTER_COLORS, STATUS_COLORS, EMPTY_KELAS_MENGAJAR_FORM
- [x] Frontend: Dummy data — 6 records (3 guru, 4 mata pelajaran, 4 kelas, 2 tahun ajaran, 2 semester)
- [x] Frontend: KelasMengajarListPage — search by guru/mapel/kelas, filter by guru/kelas/tahun, DataTable with avatar initials, badges, pagination, edit/delete actions
- [x] Frontend: KelasMengajarFormSheet — 6 fields (Guru, Mata Pelajaran, Kelas, Tahun Ajaran, Semester, Status), all Select components
- [x] Frontend: KelasMengajarDeleteDialog — confirmation with mata pelajaran and kelas name
- [x] Frontend: Page route — `/admin/kelas-mengajar`
- [x] Frontend: Sidebar updated — "Kelas Mengajar" nav item with BookOpenCheck icon (after Penugasan Guru)
- [x] Frontend: TopBar updated — getPageTitle returns "Kelas Mengajar" for `/admin/kelas-mengajar`
- [x] Frontend: BottomNav updated — "Kls Mengajar" item for mobile
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 3.2: Materi Pembelajaran

- [x] Frontend: Feature-based `features/materi/` (types, constants, dummy data, components)
- [x] Frontend: Types — Materi interface (judul, deskripsi, kelas_mengajar_id, guru_nama, mata_pelajaran, kelas, thumbnail_url, lampiran[], video_url, isi_materi, status) + Lampiran interface + MateriFormData type
- [x] Frontend: Constants — STATUS_MATERI_OPTIONS (Draft/Publish), STATUS_MATERI_COLORS, ALLOWED_FILE_TYPES, EMPTY_MATERI_FORM
- [x] Frontend: Dummy data — 6 records referencing kelas-mengajar data, with realistic HTML content, lampiran, and video URLs
- [x] Frontend: MateriListPage — search by judul/guru/mapel, filter by guru/kelas/status, DataTable with judul+deskripsi, guru, mapel, kelas badge, status badge, date, actions (view/edit/delete), pagination, row click → detail
- [x] Frontend: MateriFormSheet — 5 sections: Informasi Umum (judul, deskripsi), Kelas Mengajar (select with auto-fill), Media & Lampiran (thumbnail upload, multi-file upload, YouTube URL), Isi Materi (HTML textarea with live preview), Pengaturan (status select)
- [x] Frontend: MateriDeleteDialog — confirmation with judul
- [x] Frontend: MateriDetailPage — 3-column layout: info sidebar (guru, mapel, kelas, dates, status) + main content (deskripsi, rendered HTML isi materi, embedded YouTube iframe, lampiran list with download)
- [x] Frontend: Page routes — `/guru/materi` (list), `/guru/materi/[id]` (detail)
- [x] Frontend: Sidebar updated — "Materi Pembelajaran" nav item for guru role
- [x] Frontend: BottomNav updated — "Materi" item for guru mobile
- [x] Frontend: TopBar updated — getPageTitle for `/guru/materi` routes
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 3.3: Tugas

- [x] Installed `sonner` for toast notifications
- [x] Added `<Toaster />` to dashboard layout
- [x] Frontend: Feature-based `features/tugas/` (types, constants, dummy data, components)
- [x] Frontend: Types — Tugas interface (judul, deskripsi, kelas_mengajar_id, guru_nama, mata_pelajaran, kelas, lampiran[], tanggal_dibuka, tenggat_waktu, nilai_maksimal, status) + TugasLampiran interface + TugasFormData type
- [x] Frontend: Constants — STATUS_TUGAS_OPTIONS (Draft/Dipublikasikan/Ditutup), STATUS_TUGAS_COLORS, ALLOWED_TUGAS_FILE_TYPES, ALLOWED_TUGAS_FILE_EXTENSIONS, EMPTY_TUGAS_FORM
- [x] Frontend: Dummy data — 6 records across 3 guru, 4 mata pelajaran, 3 kelas, all 3 statuses
- [x] Frontend: TugasListPage — search by judul/guru/mapel/kelas, filter by guru/mapel/kelas/status, DataTable with judul+subtitle, mapel, kelas badge, guru, tenggat date, status badge, actions, pagination, row click → detail, toast on CRUD
- [x] Frontend: TugasFormSheet — 5 sections: Informasi Umum (judul wajib, deskripsi), Kelas Mengajar (select wajib with auto-fill), Lampiran (multi-file upload), Jadwal & Penilaian (tanggal dibuka date picker, tenggat waktu date picker with min, nilai maksimal number input), Pengaturan (status select)
- [x] Frontend: Validation — judul wajib, kelas wajib, tenggat >= tanggal dibuka, nilai maksimal >= 1, error messages with red border + toast
- [x] Frontend: TugasDeleteDialog — confirmation with judul and AlertTriangle icon
- [x] Frontend: TugasDetailPage — 3-column layout: info sidebar (guru, mapel, kelas, tanggal dibuka, tenggat, created, updated, status, nilai maksimal) + main content (deskripsi, lampiran list with download), action buttons (Back, Edit, Hapus, Lihat Pengumpulan)
- [x] Frontend: "Lihat Pengumpulan" button — navigates to `/guru/pengumpulan/[tugasId]`
- [x] Frontend: Page routes — `/guru/tugas` (list), `/guru/tugas/[id]` (detail)
- [x] Frontend: Sidebar updated — "Tugas" nav item with ClipboardList icon for guru role
- [x] Frontend: BottomNav updated — "Tugas" item for guru mobile
- [x] Frontend: TopBar updated — getPageTitle for `/guru/tugas` routes
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 3.4: Pengumpulan Tugas

- [x] Frontend: Feature-based `features/pengumpulan/` (types, constants, dummy data, components)
- [x] Frontend: Types — PengumpulanTugas interface (tugas_id, siswa_id, siswa_nama, siswa_kelas, file_jawaban, catatan, waktu_pengumpulan, status, nilai) + PengumpulanFile interface + PengumpulanTugasFormData type
- [x] Frontend: Constants — STATUS_PENGUMPULAN_OPTIONS (Belum Mengumpulkan/Sudah Mengumpulkan/Terlambat), STATUS_PENGUMPULAN_COLORS, ALLOWED_PENGUMPULAN_EXTENSIONS, EMPTY_PENGUMPULAN_FORM
- [x] Frontend: Dummy data — 9 submissions across 4 tugas, 4 siswa, all 3 statuses
- [x] Frontend: PengumpulanListPage — guru view showing all tugas with jumlah_pengumpul counts, search, filter by guru/kelas/status, DataTable, row click → detail
- [x] Frontend: PengumpulanDetailPage — 3-column layout: tugas info sidebar + submissions DataTable (nama siswa with avatar, waktu kirim, status badge, nilai, actions), JawabanDetailDialog
- [x] Frontend: JawabanDetailDialog — shows siswa info, file jawaban with download, catatan, waktu upload, status badge, Beri Nilai form with input + save button, validation (0-nilaiMaksimal), toast on save
- [x] Frontend: SimulasiSiswaPage — siswa simulation: list Dipublikasikan tugas with submission status, click to open upload form, file upload (dummy, 5MB limit, format validation), catatan textarea, Kirim Tugas button with toast "Tugas berhasil dikirim."
- [x] Frontend: Upload validation — file wajib, max 5MB, format PDF/DOCX/PPTX/ZIP, tidak boleh upload setelah deadline
- [x] Frontend: Page routes — `/guru/pengumpulan` (list), `/guru/pengumpulan/[id]` (detail), `/siswa/simulasi` (student simulation)
- [x] Frontend: Sidebar updated — "Pengumpulan" nav item for guru role, "Simulasi" for siswa role
- [x] Frontend: BottomNav updated — "Kumpul" for guru mobile, "Simulasi" for siswa mobile
- [x] Frontend: TopBar updated — getPageTitle for `/guru/pengumpulan` and `/siswa/simulasi` routes
- [x] Frontend: TugasDetailPage updated — "Lihat Pengumpulan" button now navigates to pengumpulan detail
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 3.5: Penilaian

- [x] Frontend: Feature-based `features/penilaian/` (types, constants, dummy data, components)
- [x] Frontend: Types — Penilaian interface (pengumpulan_id, tugas_id, siswa_nama, siswa_kelas, mata_pelajaran, guru_nama, tugas_judul, tenggat_waktu, nilai, feedback_guru, status_penilaian) + PenilaianFormData type
- [x] Frontend: Constants — STATUS_PENILAIAN_OPTIONS (Belum Dinilai/Sudah Dinilai/Revisi), STATUS_PENILAIAN_COLORS, EMPTY_PENILAIAN_FORM
- [x] Frontend: Dummy data — 9 penilaian records across 6 tugas, 4 siswa, 3 mapel, 3 guru, mix of graded/ungraded
- [x] Frontend: PenilaianListPage — 4 summary cards (Total Penilaian, Sudah Dinilai, Belum Dinilai, Rata-rata Nilai), DataTable (siswa with avatar, mapel+guru, tugas+deadline, nilai, status badge, aksi), search + 4 filters (guru/kelas/mapel/status), pagination
- [x] Frontend: PenilaianDetailPage — 3-column layout: info siswa sidebar + info tugas + jawaban siswa + form penilaian (nilai, status select, feedback textarea, simpan button), validation, toast on save
- [x] Frontend: Page routes — `/guru/penilaian` (list), `/guru/penilaian/[id]` (detail)
- [x] Frontend: Sidebar updated — "Penilaian" nav item for guru role with Award icon
- [x] Frontend: BottomNav updated — "Nilai" for guru mobile with Award icon
- [x] Frontend: TopBar updated — getPageTitle for `/guru/penilaian` and `/guru/penilaian/[id]` routes
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 3.6: Dashboard Admin

- [x] Frontend: Feature-based `features/dashboard/` (dummy data, components)
- [x] Frontend: Dummy data — DUMMY_ACTIVITIES (8 activities across 3 guru, 3 siswa, 1 admin, with timestamps and icons), DUMMY_ANNOUNCEMENTS (4 announcements with info/warning/urgent types)
- [x] Frontend: AdminDashboardPage — 6 sections:
  - [x] Section 1: Welcome — "Halo, [User] 👋" + "Selamat datang di SIAPOS" + system tagline
  - [x] Section 2: Statistik — 6 summary cards (Total Guru, Total Siswa, Total Kelas, Mata Pelajaran, Total Materi, Total Tugas) with dynamic counts from dummy data, Lucide icons
  - [x] Section 3: Aktivitas Terbaru — timeline with user name, action, relative time, icon per activity type
  - [x] Section 4: Status Akademik — 3 info cards (Tahun Ajaran Aktif, Semester Aktif, Jumlah Kelas Aktif) with badges
  - [x] Section 5: Pengumuman — announcement list with type-based icons and badges (Info/Peringatan/Penting), date
  - [x] Section 6: Quick Action — 5 shortcut buttons (Guru, Siswa, Kelas, Materi, Tugas) linking to admin routes
- [x] Frontend: Page route — `/admin` now delegates to AdminDashboardPage via thin wrapper
- [x] Responsive layout — grid adapts: 2 cols mobile, 3 cols tablet, 6 cols desktop for stats; 3-col grid for middle/bottom sections
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 3.7: Dashboard Guru

- [x] Frontend: Feature-based `features/dashboard/` extended with guru-specific data and component
- [x] Frontend: Dummy data — DUMMY_GURU_JADWAL (10 records across 3 guru, 2 hari), DUMMY_GURU_ACTIVITIES (12 records across 3 guru with action icons and timestamps)
- [x] Frontend: GuruDashboardPage — 7 sections:
  - [x] Section 1: Header — "Halo, [Guru Name] 👋" + "Selamat datang kembali di SIAPOS" + tanggal Indonesia
  - [x] Section 2: Ringkasan — 6 stat cards (Kelas Mengajar, Mata Pelajaran, Materi Dibuat, Tugas Aktif, Belum Dinilai, Total Siswa) with dynamic counts from dummy data
  - [x] Section 3: Kelas Mengajar — clickable cards showing kelas and mata_pelajaran, links to `/guru/kelas`
  - [x] Section 4: Tugas yang Perlu Dinilai — table with judul, kelas, jumlah pengumpulan, deadline, Nilai button → `/guru/pengumpulan/[id]`
  - [x] Section 5: Aktivitas Terbaru — timeline with action text, relative time, icons per activity type
  - [x] Section 6: Jadwal Hari Ini — time-based cards showing kelas, mata_pelajaran, waktu_mulai/selesai, filtered by day
  - [x] Section 7: Quick Action + Pengumuman — 4 shortcut buttons (Tambah Materi, Buat Tugas, Lihat Penilaian, Lihat Kelas Mengajar) + announcements with type badges
- [x] Frontend: Page route — `/guru` now delegates to GuruDashboardPage via thin wrapper
- [x] Frontend: Responsive layout — grid adapts: 2 cols mobile, 3 cols tablet, 6 cols desktop for stats; 3-col grid for middle/bottom sections
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 3.8: Dashboard Siswa

- [x] Frontend: Feature-based `features/dashboard/` extended with siswa-specific data and component
- [x] Frontend: Dummy data — DUMMY_SISWA_JADWAL (6 records for kelas XI TKJ 1, 2 hari), DUMMY_SISWA_TUGAS_STATUS (2 records)
- [x] Frontend: SiswaDashboardPage — 7 sections:
  - [x] Section 1: Header — "Halo, [Nama Siswa] 👋" + "Selamat datang kembali di SIAPOS" + tanggal Indonesia + kelas badge
  - [x] Section 2: Ringkasan — 5 stat cards (Materi Baru, Tugas Aktif, Tugas Selesai, Nilai Terbaru, Pengumuman Baru) with dynamic counts from dummy data
  - [x] Section 3: Tugas yang Harus Dikerjakan — DataTable with judul, mata pelajaran, guru, deadline, status badge (Belum Dikerjakan/Sudah Dikerjakan/Terlambat), aksi button (Kerjakan/Lihat)
  - [x] Section 4: Materi Terbaru — Card list with thumbnail icon, judul, mata pelajaran, guru, tanggal publish, "Lihat Materi" button → detail
  - [x] Section 5: Nilai Terbaru — DataTable with mata pelajaran, tugas, nilai (highlighted), feedback guru
  - [x] Section 6: Jadwal Hari Ini — Time-based cards with waktu, mata pelajaran, guru, filtered by day
  - [x] Section 7: Pengumuman + Quick Action — Announcements with type badges (Info/Peringatan/Penting) + 4 shortcuts (Lihat Materi, Kerjakan Tugas, Lihat Nilai, Profil Saya)
- [x] Frontend: Page route — `/siswa` now delegates to SiswaDashboardPage via thin wrapper
- [x] Frontend: Responsive layout — grid adapts: 2 cols mobile, 3 cols tablet, 5 cols desktop for stats; 3-col grid for middle/bottom sections
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 3.9: QA & Stabilization

- [x] Error checking — removed 7 unused imports/warnings across codebase:
  - [x] `guru-detail-page.tsx` — removed unused `EMPTY_GURU_FORM`, `Guru` type
  - [x] `guru-list-page.tsx` — removed unused `EMPTY_GURU_FORM`
  - [x] `jurusan-detail-page.tsx` — removed unused `Jurusan` type
  - [x] `user-detail-page.tsx` — removed unused `UserType` alias
  - [x] `user-form-dialog.tsx` — removed unused `DUMMY_USERS` import
  - [x] `client.ts` — removed unused `ApiResponse` type
  - [x] `materi-form-sheet.tsx` — suppressed `<img>` ESLint warning (blob preview URL)
- [x] Branding fixes:
  - [x] Created SIAPOS favicon SVG (`public/favicon.svg`) — blue rounded square with "S" lettermark
  - [x] Added `icons` metadata to root layout
  - [x] Fixed `manifest.json` — removed broken PNG icon refs, uses SVG icon
  - [x] Removed default Next.js starter files from `public/` (file.svg, globe.svg, next.svg, vercel.svg, window.svg, empty icons/)
- [x] Navigation fixes:
  - [x] Added missing `/admin/assignments` (Penugasan Guru) route to bottom-nav
  - [x] Added `UserCog` icon import to bottom-nav
- [x] Empty state normalization — standardized all DataTable `emptyMessage` props:
  - [x] Format: "Tidak ada [item] ditemukan" (no "data" prefix, no trailing period)
  - [x] Fixed pengumpulan empty message (was "tugas", now "pengumpulan")
- [x] Full audit: all 13 modules verified (Auth, 3 Dashboards, 5 Master Data, 4 Learning)
- [x] TypeScript check passed — no errors
- [x] Build passed — no warnings, no errors

---

## Sprint 4

Status : Done

### Todo

- [x] Bank Soal (Frontend)
- [x] Paket Soal (Frontend)
- [x] Quiz (Frontend)
- [x] CBT (Frontend)
- [x] Hasil Ujian (Frontend)
- [x] Analitik (Frontend)
- [x] QA & Stabilization

---

### Done - Sprint 4.1: Bank Soal

- [x] Frontend: Feature-based `features/bank-soal/` (types, constants, dummy data, components)
- [x] Frontend: BankSoalListPage — search, 4 filters, DataTable, CRUD actions
- [x] Frontend: BankSoalFormSheet — 7 fields dengan tipe soal dynamic form
- [x] Frontend: BankSoalDetailPage — soal info, pilihan jawaban, jawaban benar highlight
- [x] Frontend: Page routes — `/admin/bank-soal` (list), `/admin/bank-soal/[id]` (detail)
- [x] Frontend: Sidebar + BottomNav + TopBar updated
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 4.2: Paket Soal

- [x] Frontend: Feature-based `features/paket-soal/` (types, constants, dummy data, components)
- [x] Frontend: PaketSoalListPage — search, 3 filters, DataTable, CRUD actions
- [x] Frontend: PaketSoalFormSheet — soal picker dengan multi-select, auto-fill
- [x] Frontend: PaketSoalDetailPage — paket info, daftar soal terpilih
- [x] Frontend: Page routes — `/admin/paket-soal` (list), `/admin/paket-soal/[id]` (detail)
- [x] Frontend: Sidebar + BottomNav + TopBar updated
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 4.3: Quiz

- [x] Frontend: Feature-based `features/quiz/` (types, constants, dummy data, components)
- [x] Frontend: QuizListPage — search, 4 filters, DataTable, CRUD actions
- [x] Frontend: QuizFormSheet — 10 fields dengan toggle switches
- [x] Frontend: QuizDetailPage — quiz info, pengaturan, aksi
- [x] Frontend: QuizTakePage — timer, navigasi soal, submit dialog
- [x] Frontend: QuizResultPage — hasil, skor, review jawaban
- [x] Frontend: Page routes — `/guru/quiz/*`, `/siswa/quiz/*`
- [x] Frontend: Sidebar + BottomNav + TopBar updated
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 4.4: CBT

- [x] Frontend: Feature-based `features/cbt/` (types, constants, dummy data, components)
- [x] Frontend: CBTListPage — search, 3 filters, DataTable, CRUD actions
- [x] Frontend: CBTFormSheet — 14 fields dengan toggle switches
- [x] Frontend: CBTDetailPage — CBT info, pengaturan, aksi
- [x] Frontend: CBTExamPage — timer, navigasi soal, tandai soal, submit dialog
- [x] Frontend: CBTResultPage — hasil, skor, status kelulusan
- [x] Frontend: Page routes — `/guru/cbt/*`, `/siswa/cbt/*`
- [x] Frontend: Sidebar + BottomNav + TopBar updated
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 4.5: Hasil Ujian

- [x] Frontend: Feature-based `features/hasil-ujian/` (types, constants, dummy data, components)
- [x] Frontend: HasilUjianListPage — 5 summary cards, search, 5 filters, DataTable, pagination
- [x] Frontend: HasilUjianDetailPage — detail info, review jawaban accordion, catatan evaluasi form
- [x] Frontend: Custom Accordion component created
- [x] Frontend: Page routes — `/guru/hasil-ujian/*`, `/siswa/hasil-ujian/*`
- [x] Frontend: Sidebar + BottomNav + TopBar updated
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 4.6: Analitik

- [x] Installed Recharts for charting library
- [x] Frontend: Feature-based `features/analitik/` (types, constants, dummy data, components)
- [x] Frontend: 5 Recharts visualizations — Bar, Pie, Line, Horizontal Bar, Grouped Bar
- [x] Frontend: Filter bar — Kelas, Mapel, Jenis Ujian, Rentang Tanggal
- [x] Frontend: Insight & Rekomendasi panel
- [x] Frontend: Page route — `/guru/analitik`
- [x] Frontend: Sidebar + BottomNav + TopBar updated
- [x] TypeScript check passed — no errors
- [x] Build passed — no errors

### Done - Sprint 4.7: QA & Stabilization

- [x] Navigation fixes:
  - [x] Added missing `/siswa/quiz` sidebar nav item
  - [x] Added `React` import to `data-table.tsx`
- [x] CBT fixes:
  - [x] Fixed timer dead-end when `auto_submit=false`
  - [x] Removed unused `totalTidakDijawab` variable
- [x] Hasil Ujian fixes:
  - [x] Fixed state-setting-during-render anti-pattern
  - [x] Removed redundant calculation
- [x] Detail page fixes:
  - [x] Replaced misleading "Edit" buttons with "Kembali" buttons
- [x] Accessibility:
  - [x] Added `aria-label` to 15+ icon-only buttons
- [x] Dead code cleanup:
  - [x] Removed unused exports across modules
- [x] Build: zero errors, zero new warnings
- [x] Full audit: 6 assessment modules verified

### Done - Sprint 4.8: Modul Absensi & Jadwal Pelajaran

- [x] Created Jadwal Pelajaran feature module:
  - [x] `features/jadwal-pelajaran/types/` — JadwalPelajaran interface
  - [x] `features/jadwal-pelajaran/constants/` — HARI_OPTIONS, JAM_OPTIONS, colors
  - [x] `features/jadwal-pelajaran/dummy/` — 36 schedule records for 6 teachers, 4 classes, 6 days
  - [x] `features/jadwal-pelajaran/components/jadwal-pelajaran-list-page.tsx` — grouped by day, search + 3 filters
- [x] Page routes: `/admin/jadwal-pelajaran`, `/guru/jadwal-pelajaran`
- [x] Updated absensi data:
  - [x] Added 6th teacher "Dewi Sartika" to GURU_OPTIONS
  - [x] Added 3 sesi absensi for Dewi Sartika (sessions 28-30)
  - [x] Added corresponding student attendance records
- [x] Updated navigation:
  - [x] Sidebar: Added "Academic" section with Jadwal Pelajaran + Absensi for admin/guru/siswa
  - [x] BottomNav: Added "Jadwal" item for admin and guru
- [x] Fixed DataTable Column render interface — now passes `index` parameter for row numbering
- [x] Build: zero errors, zero warnings
- [x] Integration: Absensi terhubung dengan Jadwal Pelajaran via guru_nama, kelas, mata_pelajaran

---

### Blocked

Belum ada.
