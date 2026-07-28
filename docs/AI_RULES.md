# SIAPOS AI Rules

Version: 1.0

---

# Tentang Project

SIAPOS adalah Education Operating System berbasis Progressive Web App (PWA) untuk SMK Wahana Bakti.

Target utama:

- Guru
- Siswa
- Admin
- Super Admin

Bahasa UI menggunakan Bahasa Indonesia.

Code menggunakan Bahasa Inggris.

---

# Filosofi

SIAPOS bukan website sekolah.

SIAPOS adalah Education Operating System.

UI harus modern.

UI harus sederhana.

UI harus ramah.

UI harus cepat.

Semua keputusan harus mengutamakan pengalaman pengguna.

---

# Target

Project ini harus:

- Mobile First
- Responsive
- Mudah digunakan siswa
- Mudah digunakan guru
- Clean UI
- Professional

---

# Tech Stack

Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Axios
- React Hook Form
- Zod
- Lucide React
- Framer Motion
- next-pwa

Backend

- Laravel 12
- Sanctum
- Spatie Permission

Database

- PostgreSQL

---

# Arsitektur

Gunakan:

Repository Pattern

Service Layer

Form Request

API Resource

REST API

Jangan menggunakan logic di Controller.

Controller hanya memanggil Service.

---

# Coding Style

Gunakan:

Clean Code

SOLID

DRY

KISS

Reusable Component

Strict TypeScript

Tidak boleh hardcode.

---

# Penamaan

Controller

UserController

SubjectController

ClassController

MaterialController

AssignmentController

Service

UserService

SubjectService

Repository

UserRepository

SubjectRepository

Model

User

Subject

SchoolClass

Assignment

Material

---

# Struktur Folder

Frontend

app/

components/

hooks/

services/

lib/

types/

styles/

public/

Backend

app/

Http/

Models/

Repositories/

Services/

Policies/

Traits/

database/

routes/

---

# UI Rules

Semua UI menggunakan Bahasa Indonesia.

Jangan menggunakan bahasa Inggris pada menu.

Contoh:

Benar

Beranda

Kelas

Materi

Tugas

Pengumuman

Profil

Salah

Dashboard

Course

Assignment

Profile

---

# Warna

Primary

#2563EB

Secondary

#F97316

Background

#F8FAFC

Success

#22C55E

Danger

#EF4444

Warning

#F59E0B

---

# Font

Plus Jakarta Sans

---

# Radius

Button

12px

Input

12px

Card

18px

Modal

20px

---

# Shadow

Gunakan shadow ringan.

Jangan berlebihan.

---

# Responsive

Desktop

Sidebar

Mobile

Bottom Navigation

Tablet

Responsive

---

# Role

Super Admin

Admin

Guru

Siswa

---

# Bahasa

Code

English

UI

Bahasa Indonesia

---

# Form

Gunakan:

React Hook Form

+

Zod

---

# API

Semua API menggunakan format:

success

message

data

errors

---

# Database

Gunakan migration.

Gunakan foreign key.

Gunakan soft delete bila diperlukan.

Gunakan timestamp.

---

# Security

Gunakan:

Sanctum

Authorization

Validation

Role Permission

Mass Assignment Protection

---

# Jangan Pernah

Jangan membuat project baru.

Jangan menghapus kode yang sudah berjalan.

Jangan mengubah struktur folder tanpa alasan.

Jangan mengganti tech stack.

Jangan menggunakan library tambahan jika tidak benar-benar dibutuhkan.

---

# Sprint

Jika diminta Sprint baru:

Lanjutkan project yang sudah ada.

Jangan mengulang dari awal.

Jangan mengubah fitur sprint sebelumnya.

---

# Definition of Done

Sebuah sprint dianggap selesai jika:

✓ Tidak ada error.

✓ Responsive.

✓ Mobile berjalan.

✓ Desktop berjalan.

✓ Clean Code.

✓ UI konsisten.

✓ Database berjalan.

✓ API berjalan.

✓ Build berhasil.

---

# Prioritas

1. Functionality

2. Stability

3. UI

4. Animation

Jangan mengorbankan functionality demi animasi.

---

# Prinsip SIAPOS

Belajar Lebih Mudah,
Berkembang Lebih Cepat.
