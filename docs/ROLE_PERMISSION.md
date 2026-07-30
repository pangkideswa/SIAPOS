# Role & Permission

> Role-based access control menggunakan Spatie Permission di Laravel dan filtering di frontend.

---

## Daftar Role

| Role | Kode | Deskripsi |
|------|------|-----------|
| Super Admin | `super_admin` | Akses penuh ke seluruh sistem |
| Administrator | `admin` | Mengelola master data dan pengaturan |
| Guru | `guru` | Mengelola pembelajaran dan penilaian |
| Siswa | `siswa` | Mengakses materi dan tugas |
| Wali Kelas | `wali` | Memantau perkembangan siswa |

---

## Matriks Permission

### Manajemen Sistem

| Fitur | Super Admin | Admin | Guru | Siswa | Wali |
|-------|:-----------:|:-----:|:----:|:-----:|:----:|
| Manajemen Pengguna | ✅ | ✅ | ❌ | ❌ | ❌ |
| Pengaturan Sekolah | ✅ | ✅ | ❌ | ❌ | ❌ |

### Master Data

| Fitur | Super Admin | Admin | Guru | Siswa | Wali |
|-------|:-----------:|:-----:|:----:|:-----:|:----:|
| Data Jurusan | ✅ | ✅ | ❌ | ❌ | ❌ |
| Data Guru | ✅ | ✅ | ❌ | ❌ | ❌ |
| Data Siswa | ✅ | ✅ | ❌ | ❌ | ❌ |
| Data Kelas | ✅ | ✅ | ❌ | ❌ | ❌ |
| Mata Pelajaran | ✅ | ✅ | ❌ | ❌ | ❌ |
| Penugasan Guru | ✅ | ✅ | ❌ | ❌ | ❌ |

### Pembelajaran

| Fitur | Super Admin | Admin | Guru | Siswa | Wali |
|-------|:-----------:|:-----:|:----:|:-----:|:----:|
| Kelas Mengajar | ✅ | ✅ | ✅ (ampu) | ❌ | ❌ |
| Materi Pembelajaran | ✅ | ✅ | ✅ (buat) | ✅ (lihat) | ❌ |
| Tugas | ✅ | ✅ | ✅ (buat) | ✅ (kerjakan) | ❌ |
| Pengumpulan Tugas | ✅ | ✅ | ✅ (nilai) | ✅ (kirim) | ❌ |
| Penilaian | ✅ | ✅ | ✅ (ampu) | ❌ | ❌ |

### Assessment

| Fitur | Super Admin | Admin | Guru | Siswa | Wali |
|-------|:-----------:|:-----:|:----:|:-----:|:----:|
| Bank Soal | ✅ | ✅ | ✅ | ❌ | ❌ |
| Paket Soal | ✅ | ✅ | ✅ | ❌ | ❌ |
| Quiz | ✅ | ✅ | ✅ (buat) | ✅ (kerjakan) | ❌ |
| CBT | ✅ | ✅ | ✅ (buat) | ✅ (kerjakan) | ❌ |
| Hasil Ujian | ✅ | ✅ | ✅ (lihat) | ✅ (lihat) | ❌ |
| Analitik | ✅ | ✅ | ✅ | ❌ | ❌ |

### Academic

| Fitur | Super Admin | Admin | Guru | Siswa | Wali |
|-------|:-----------:|:-----:|:----:|:-----:|:----:|
| Jadwal Pelajaran | ✅ | ✅ | ✅ (lihat) | ✅ (lihat) | ❌ |
| Absensi | ✅ | ✅ | ✅ (input) | ✅ (lihat) | ❌ |
| Kalender Akademik | ✅ | ✅ | ✅ (lihat) | ✅ (lihat) | ❌ |
| Pengumuman | ✅ | ✅ | ✅ (buat) | ✅ (lihat) | ❌ |
| Nilai Akademik | ✅ | ✅ | ✅ (input) | ✅ (lihat) | ❌ |

### Dashboard

| Fitur | Super Admin | Admin | Guru | Siswa | Wali |
|-------|:-----------:|:-----:|:----:|:-----:|:----:|
| Dashboard Admin | ✅ | ✅ | ❌ | ❌ | ❌ |
| Dashboard Guru | ❌ | ❌ | ✅ | ❌ | ❌ |
| Dashboard Siswa | ❌ | ❌ | ❌ | ✅ | ❌ |
| Dashboard Wali | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Frontend Implementation

Filtering role di frontend dilakukan melalui:

- **Sidebar** — Setiap nav item memiliki properti `roles: UserRole[]`
- **BottomNav** — Setiap item bottom navigation memiliki properti `roles`
- **useAuth** — Hook `hasRole(...roles)` digunakan untuk conditional rendering

```typescript
// Contoh sidebar nav item
{ type: "item", label: "Nilai Akademik", href: "/guru/nilai-akademik", icon: FileSpreadsheet, roles: ["guru"] }
```

## Backend Implementation (Coming Soon)

Backend akan menggunakan Spatie Permission dengan struktur:

```php
// Permission naming convention
{action}-{resource}

// Contoh:
view-users
create-users
edit-users
delete-users
view-grades
input-grades
```
