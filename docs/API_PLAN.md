# API Plan

> Rancangan REST API untuk SIAPOS. Belum diimplementasikan seluruhnya — hanya sebagai acuan pengembangan backend.

---

## Base URL

```
http://localhost:8000/api
```

## Response Format

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {},
  "errors": {}
}
```

---

## Authentication

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/api/login` | Login (identifier: email/NIP/NISN, password) |
| POST | `/api/register` | Register user baru |
| POST | `/api/logout` | Logout (revoke token) |
| GET | `/api/user` | Get authenticated user |
| PUT | `/api/user` | Update profil |

---

## Users

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/users` | List users (search, filter by role) |
| POST | `/api/users` | Create user |
| GET | `/api/users/{id}` | Detail user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

---

## Jurusans

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/jurusans` | List jurusan (search, filter is_active) |
| POST | `/api/jurusans` | Create jurusan |
| GET | `/api/jurusans/{id}` | Detail jurusan |
| PUT | `/api/jurusans/{id}` | Update jurusan |
| DELETE | `/api/jurusans/{id}` | Delete jurusan |
| GET | `/api/jurusans/active` | List jurusan aktif |

---

## Teachers

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/teachers` | List guru (search, filter) |
| POST | `/api/teachers` | Create guru |
| GET | `/api/teachers/{id}` | Detail guru |
| PUT | `/api/teachers/{id}` | Update guru |
| DELETE | `/api/teachers/{id}` | Delete guru |

---

## Students

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/students` | List siswa (search, filter) |
| POST | `/api/students` | Create siswa |
| GET | `/api/students/{id}` | Detail siswa |
| PUT | `/api/students/{id}` | Update siswa |
| DELETE | `/api/students/{id}` | Delete siswa |

---

## Kelas Mengajar

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/kelas-mengajar` | List kelas mengajar |
| POST | `/api/kelas-mengajar` | Create |
| GET | `/api/kelas-mengajar/{id}` | Detail |
| PUT | `/api/kelas-mengajar/{id}` | Update |
| DELETE | `/api/kelas-mengajar/{id}` | Delete |

---

## Materi

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/materi` | List materi |
| POST | `/api/materi` | Create materi |
| GET | `/api/materi/{id}` | Detail materi |
| PUT | `/api/materi/{id}` | Update materi |
| DELETE | `/api/materi/{id}` | Delete materi |

---

## Tugas

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/tugas` | List tugas |
| POST | `/api/tugas` | Create tugas |
| GET | `/api/tugas/{id}` | Detail tugas |
| PUT | `/api/tugas/{id}` | Update tugas |
| DELETE | `/api/tugas/{id}` | Delete tugas |

---

## Pengumpulan

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/pengumpulan` | List pengumpulan |
| POST | `/api/pengumpulan` | Submit tugas |
| GET | `/api/pengumpulan/{id}` | Detail pengumpulan |
| PUT | `/api/pengumpulan/{id}` | Update (nilai, feedback) |

---

## Penilaian

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/penilaian` | List penilaian |
| GET | `/api/penilaian/{id}` | Detail penilaian |
| PUT | `/api/penilaian/{id}` | Update penilaian |

---

## Bank Soal

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/bank-soal` | List bank soal |
| POST | `/api/bank-soal` | Create soal |
| GET | `/api/bank-soal/{id}` | Detail soal |
| PUT | `/api/bank-soal/{id}` | Update soal |
| DELETE | `/api/bank-soal/{id}` | Delete soal |

---

## Paket Soal

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/paket-soal` | List paket soal |
| POST | `/api/paket-soal` | Create paket |
| GET | `/api/paket-soal/{id}` | Detail paket |
| PUT | `/api/paket-soal/{id}` | Update paket |
| DELETE | `/api/paket-soal/{id}` | Delete paket |

---

## Quiz

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/quiz` | List quiz |
| POST | `/api/quiz` | Create quiz |
| GET | `/api/quiz/{id}` | Detail quiz |
| PUT | `/api/quiz/{id}` | Update quiz |
| DELETE | `/api/quiz/{id}` | Delete quiz |
| POST | `/api/quiz/{id}/mulai` | Mulai quiz (siswa) |
| POST | `/api/quiz/{id}/kumpul` | Kumpul jawaban quiz |
| GET | `/api/quiz/{id}/hasil` | Hasil quiz |

---

## CBT

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/cbt` | List CBT |
| POST | `/api/cbt` | Create CBT |
| GET | `/api/cbt/{id}` | Detail CBT |
| PUT | `/api/cbt/{id}` | Update CBT |
| DELETE | `/api/cbt/{id}` | Delete CBT |
| POST | `/api/cbt/{id}/mulai` | Mulai ujian (siswa) |
| POST | `/api/cbt/{id}/kumpul` | Kumpul jawaban CBT |
| GET | `/api/cbt/{id}/hasil` | Hasil CBT |

---

## Hasil Ujian

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/hasil-ujian` | List hasil ujian |
| GET | `/api/hasil-ujian/{id}` | Detail hasil ujian |
| PUT | `/api/hasil-ujian/{id}` | Update evaluasi |

---

## Nilai Akademik

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/nilai-akademik` | List nilai akademik |
| POST | `/api/nilai-akademik` | Create nilai |
| GET | `/api/nilai-akademik/{id}` | Detail nilai |
| PUT | `/api/nilai-akademik/{id}` | Update nilai |
| DELETE | `/api/nilai-akademik/{id}` | Delete nilai |
| GET | `/api/nilai-akademik/siswa/{siswaId}` | Nilai per siswa |
| GET | `/api/nilai-akademik/guru/{guruId}` | Nilai per guru |
| GET | `/api/nilai-akademik/statistics` | Statistik nilai |

---

## Absensi

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/absensi` | List sesi absensi |
| POST | `/api/absensi` | Create sesi absensi |
| GET | `/api/absensi/{id}` | Detail sesi + siswa |
| PUT | `/api/absensi/{id}` | Update absensi siswa |
| GET | `/api/absensi/rekap` | Rekap absensi (filter by kelas/tanggal) |

---

## Jadwal Pelajaran

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/jadwal-pelajaran` | List jadwal |
| POST | `/api/jadwal-pelajaran` | Create jadwal |
| GET | `/api/jadwal-pelajaran/{id}` | Detail jadwal |
| PUT | `/api/jadwal-pelajaran/{id}` | Update jadwal |
| DELETE | `/api/jadwal-pelajaran/{id}` | Delete jadwal |

---

## Kalender Akademik

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/kalender-akademik` | List events |
| POST | `/api/kalender-akademik` | Create event |
| GET | `/api/kalender-akademik/{id}` | Detail event |
| PUT | `/api/kalender-akademik/{id}` | Update event |
| DELETE | `/api/kalender-akademik/{id}` | Delete event |

---

## Pengumuman

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/pengumuman` | List pengumuman |
| POST | `/api/pengumuman` | Create pengumuman |
| GET | `/api/pengumuman/{id}` | Detail pengumuman |
| PUT | `/api/pengumuman/{id}` | Update pengumuman |
| DELETE | `/api/pengumuman/{id}` | Delete pengumuman |

---

## Dashboard

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/dashboard/admin` | Statistik admin |
| GET | `/api/dashboard/guru` | Statistik guru |
| GET | `/api/dashboard/siswa` | Statistik siswa |

---

## Analitik

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/analitik/summary` | Summary data |
| GET | `/api/analitik/per-mapel` | Analitik per mapel |
| GET | `/api/analitik/per-kelas` | Analitik per kelas |
| GET | `/api/analitik/timeline` | Data timeline |
| GET | `/api/analitik/insights` | Insight & rekomendasi |

---

## Catatan

1. API di atas masih berupa **rancangan awal**.
2. Beberapa endpoint sudah diimplementasi di backend Laravel, sebagian belum.
3. Autentikasi menggunakan Laravel Sanctum (token-based).
4. Authorisasi menggunakan Spatie Permission.
5. Semua response mengikuti format `{ success, message, data, errors }`.
