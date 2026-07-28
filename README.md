<div align="center">

# SIAPOS

**Sistem Integrasi Akademik dan Pembelajaran Online Sekolah**

> Education Operating System (EduOS) untuk SMK Wahana Bakti

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Laravel](https://img.shields.io/badge/Laravel-12-red?logo=laravel)](https://laravel.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

**v0.2.0** — Prototype

</div>

---

## Tentang

SIAPOS adalah platform pendidikan digital yang mengintegrasikan seluruh aktivitas pembelajaran, penilaian, administrasi akademik, dan komunikasi sekolah ke dalam satu platform yang modern, responsif, dan mudah digunakan.

**Belajar Lebih Mudah, Berkembang Lebih Cepat.**

---

## Fitur Utama

### Sudah Dibangun (v0.2.0)

| Modul | Fitur |
|-------|-------|
| **Authentication** | Login (Email/NIP/NISN), Register, Role-based Access |
| **Dashboard** | Admin, Guru, Siswa — ringkasan data, jadwal, pengumuman, quick action |
| **Manajemen Pengguna** | CRUD Pengguna, role management (Admin/Guru/Siswa/Wali) |
| **Master Data** | Jurusan, Guru, Siswa — lengkap dengan CRUD dan detail |
| **Pengaturan Sekolah** | Informasi sekolah, kontak, logo, tahun akademik, pengaturan sistem |
| **Kelas Mengajar** | Penugasan guru per kelas dan mata pelajaran |
| **Materi Pembelajaran** | CRUD materi dengan HTML content, lampiran, video |
| **Tugas** | CRUD tugas dengan deadline, lampiran, status |
| **Pengumpulan Tugas** | Siswa mengumpulkan tugas, guru melihat & menilai |
| **Penilaian** | Sistem penilaian dengan feedback guru |
| **Simulasi Siswa** | Simulasi pengumpulan tugas dari sisi siswa |

### Akan Datang

- Quiz & CBT
- Pengumuman
- Absensi
- Nilai & Rapor
- AI Assistant

---

## Screenshot

<div align="center">

| Landing Page | Dashboard Admin | Dashboard Guru | Dashboard Siswa |
|:---:|:---:|:---:|:---:|
| ![Landing](./docs/screenshots/landing.png) | ![Admin](./docs/screenshots/admin.png) | ![Guru](./docs/screenshots/guru.png) | ![Siswa](./docs/screenshots/siswa.png) |

</div>

> Screenshot akan ditambahkan setelah deployment.

---

## Instalasi

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [PostgreSQL](https://postgresql.org/) 14+
- [PHP](https://php.net/) 8.2+ (untuk backend)
- [Composer](https://getcomposer.org/)

### Frontend (Next.js)

```bash
# Clone repository
git clone https://github.com/your-username/siapos.git
cd siapos

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Backend (Laravel)

```bash
# Pindah ke folder backend
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Jalankan migrasi
php artisan migrate

# Jalankan seeder
php artisan db:seed

# Jalankan development server
php artisan serve
```

Backend tersedia di [http://localhost:8000](http://localhost:8000)

---

## Struktur Project

```
siapos/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Halaman auth (login, register)
│   │   ├── (dashboard)/        # Dashboard layout
│   │   │   ├── admin/          # Dashboard Admin
│   │   │   ├── guru/           # Dashboard Guru
│   │   │   ├── siswa/          # Dashboard Siswa
│   │   │   └── wali/           # Dashboard Wali
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Shared components
│   │   ├── layout/             # Sidebar, TopBar, BottomNav
│   │   └── ui/                 # shadcn/ui components
│   ├── features/               # Feature-based modules
│   │   ├── dashboard/          # Dashboard components
│   │   ├── guru/               # Data Guru
│   │   ├── siswa/              # Data Siswa
│   │   ├── jurusan/            # Master Jurusan
│   │   ├── users/              # Manajemen Pengguna
│   │   ├── kelas-mengajar/     # Kelas Mengajar
│   │   ├── materi/             # Materi Pembelajaran
│   │   ├── tugas/              # Tugas
│   │   ├── pengumpulan/        # Pengumpulan Tugas
│   │   ├── penilaian/          # Penilaian
│   │   └── pengaturan-sekolah/ # Pengaturan Sekolah
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utilities, API client
│   ├── providers/              # Providers
│   └── types/                  # TypeScript types
├── public/                     # Static assets
├── docs/                       # Documentation
├── backend/                    # Laravel backend
└── package.json
```

---

## Tech Stack

### Frontend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| [Next.js](https://nextjs.org) | 15 | React Framework |
| [TypeScript](https://typescriptlang.org) | 5 | Type Safety |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Styling |
| [shadcn/ui](https://ui.shadcn.com) | - | UI Components |
| [Lucide React](https://lucide.dev) | - | Icons |
| [React Hook Form](https://react-hook-form.com) | 7 | Form Management |
| [Zod](https://zod.dev) | - | Schema Validation |
| [Framer Motion](https://framer.com) | - | Animations |
| [Sonner](https://sonner.emilkowal.ski) | - | Toast Notifications |

### Backend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| [Laravel](https://laravel.com) | 12 | PHP Framework |
| [Sanctum](https://laravel.com/docs/sanctum) | - | API Authentication |
| [Spatie Permission](https://spatie.be/docs/laravel-permission) | - | Role & Permission |
| [PostgreSQL](https://postgresql.org) | 16 | Database |

---

## Routes

### Admin

| Route | Halaman |
|-------|---------|
| `/admin` | Dashboard Admin |
| `/admin/users` | Manajemen Pengguna |
| `/admin/jurusan` | Master Jurusan |
| `/admin/guru` | Data Guru |
| `/admin/siswa` | Data Siswa |
| `/admin/kelas-mengajar` | Kelas Mengajar |
| `/admin/pengaturan` | Pengaturan Sekolah |

### Guru

| Route | Halaman |
|-------|---------|
| `/guru` | Dashboard Guru |
| `/guru/materi` | Materi Pembelajaran |
| `/guru/tugas` | Tugas |
| `/guru/pengumpulan` | Pengumpulan Tugas |
| `/guru/penilaian` | Penilaian |

### Siswa

| Route | Halaman |
|-------|---------|
| `/siswa` | Dashboard Siswa |
| `/siswa/simulasi` | Simulasi Kirim Tugas |

---

## Roadmap

Lihat [ROADMAP.md](./ROADMAP.md) untuk detail lengkap.

- **v0.2.0** — Prototype (Sprint 1-3) ✅
- **v0.3.0** — Assessment Module
- **v0.4.0** — CBT & Quiz
- **v0.5.0** — Communication & Notifications
- **v1.0.0** — Production Release

---

## Contributing

Kontribusi diterima! Silakan buka issue atau pull request.

1. Fork repository
2. Buat branch baru (`git checkout -b feature/nama-fitur`)
3. Commit perubahan (`git commit -m 'Tambahkan fitur baru'`)
4. Push ke branch (`git push origin feature/nama-fitur`)
5. Buka Pull Request

---

## License

MIT License — Lihat [LICENSE](./LICENSE) untuk detail.

---

<div align="center">

**SIAPOS** — Education Operating System

SMK Wahana Bakti © 2026

</div>
