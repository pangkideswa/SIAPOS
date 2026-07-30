# Database Plan

> Rancangan struktur database untuk SIAPOS. Belum diimplementasikan seluruhnya — hanya sebagai acuan pengembangan backend.

---

## Entity Relationship

```
users ──┬── teachers
         ├── students
         ├── wali_kelas
         
jurusans ──── students

kelas_mengajar ──┬── materi
                 ├── tugas
                 ├── absensi
                 ├── nilai_akademik
                 ├── quiz
                 └── cbt

bank_soal ──── paket_soal ──── quiz / cbt

tugas ──── pengumpulan ──── penilaian
```

---

## Tabel

### users

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| name | varchar(255) | |
| email | varchar(255) | unique |
| password | varchar(255) | bcrypt hashed |
| role | enum | super_admin, admin, guru, siswa, wali |
| nip | varchar(18) | nullable, unique (guru/wali) |
| nisn | varchar(10) | nullable, unique (siswa) |
| username | varchar(50) | nullable |
| avatar | text | nullable |
| remember_token | varchar(100) | nullable |
| timestamps | | |

### roles

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| name | varchar(255) | |
| guard_name | varchar(255) | |
| timestamps | | |

### permissions

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| name | varchar(255) | format: `{action}-{resource}` |
| guard_name | varchar(255) | |
| timestamps | | |

### model_has_roles / model_has_permissions

Spatie Permission pivot tables.

### jurusans

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| name | varchar(255) | Nama jurusan |
| code | varchar(10) | unique, uppercase (TKJ, TBSM, BDP) |
| is_active | boolean | default true |
| description | text | nullable |
| timestamps | | |

### teachers

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| foto | text | nullable |
| nama_lengkap | varchar(255) | |
| nip | varchar(18) | unique |
| nuptk | varchar(16) | nullable |
| jenis_kelamin | enum | Laki-laki, Perempuan |
| tempat_lahir | varchar(255) | |
| tanggal_lahir | date | |
| no_hp | varchar(15) | nullable |
| email | varchar(255) | unique |
| alamat | text | nullable |
| pendidikan_terakhir | varchar(50) | |
| status_kepegawaian | enum | PNS, PPPK, Honorer |
| mata_pelajaran | json | Array mata pelajaran |
| timestamps | | |
| soft_deletes | | |

### students

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| foto | text | nullable |
| nis | varchar(20) | unique |
| nisn | varchar(10) | unique |
| nama_lengkap | varchar(255) | |
| jenis_kelamin | enum | Laki-laki, Perempuan |
| tempat_lahir | varchar(255) | |
| tanggal_lahir | date | |
| agama | enum | |
| alamat | text | |
| jurusan_id | bigint FK | references jurusans |
| kelas | varchar(20) | |
| tahun_masuk | varchar(4) | |
| tahun_ajaran | varchar(9) | format: 2026/2027 |
| status | enum | Aktif, Alumni, Pindah, Keluar |
| nama_ayah | varchar(255) | |
| nama_ibu | varchar(255) | |
| no_hp_ortu | varchar(15) | |
| alamat_ortu | text | nullable |
| timestamps | | |
| soft_deletes | | |

### kelas_mengajar

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| guru_nama | varchar(255) | |
| mata_pelajaran | varchar(255) | |
| kelas | varchar(20) | |
| tahun_ajaran | varchar(9) | |
| semester | varchar(10) | Ganjil / Genap |
| status | enum | Aktif, Tidak Aktif |
| timestamps | | |

### materi

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| judul | varchar(255) | |
| deskripsi | text | nullable |
| kelas_mengajar_id | bigint FK | |
| thumbnail_url | text | nullable |
| lampiran | json | nullable |
| video_url | text | nullable |
| isi_materi | longtext | HTML content |
| status | enum | Draft, Publish |
| timestamps | | |

### tugas

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| judul | varchar(255) | |
| deskripsi | text | nullable |
| kelas_mengajar_id | bigint FK | |
| lampiran | json | nullable |
| tanggal_dibuka | date | |
| tenggat_waktu | datetime | |
| nilai_maksimal | integer | |
| status | enum | Draft, Dipublikasikan, Ditutup |
| timestamps | | |

### pengumpulan_tugas

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| tugas_id | bigint FK | |
| siswa_id | bigint FK | |
| file_jawaban | json | |
| catatan | text | nullable |
| waktu_pengumpulan | datetime | |
| status | enum | Belum Mengumpulkan, Sudah Mengumpulkan, Terlambat |
| nilai | integer | nullable |
| timestamps | | |

### penilaian

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| pengumpulan_id | bigint FK | |
| nilai | integer | nullable |
| feedback_guru | text | nullable |
| status_penilaian | enum | Belum Dinilai, Sudah Dinilai, Revisi |
| timestamps | | |

### bank_soal

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| kode_soal | varchar(20) | |
| mata_pelajaran | varchar(255) | |
| tipe_soal | enum | Pilihan Ganda, Benar/Salah, Isian Singkat, Essay |
| pertanyaan | text | |
| pilihan_ganda | json | nullable |
| jawaban_benar | text | |
| bobot | integer | |
| kesulitan | enum | Mudah, Sedang, Sulit |
| status | enum | Draft, Publish, Diarsipkan |
| timestamps | | |

### paket_soal

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| nama_paket | varchar(255) | |
| deskripsi | text | nullable |
| mata_pelajaran | varchar(255) | |
| guru_nama | varchar(255) | |
| durasi | integer | menit |
| nilai_maksimal | integer | |
| status | enum | Draft, Aktif, Arsip |
| timestamps | | |

### paket_soal_items

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| paket_soal_id | bigint FK | |
| bank_soal_id | bigint FK | |
| urutan | integer | |

### quiz

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| judul | varchar(255) | |
| deskripsi | text | nullable |
| mata_pelajaran | varchar(255) | |
| guru_nama | varchar(255) | |
| kelas | varchar(20) | |
| paket_soal_id | bigint FK | nullable |
| durasi | integer | menit |
| nilai_maksimal | integer | |
| jumlah_soal | integer | |
| tanggal_mulai | datetime | |
| tanggal_selesai | datetime | |
| acak_soal | boolean | |
| acak_jawaban | boolean | |
| tampil_hasil | boolean | |
| batas_pengambilan | integer | |
| status | enum | Draft, Publish, Ditutup |
| timestamps | | |

### quiz_participants

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| quiz_id | bigint FK | |
| siswa_id | bigint FK | |
| skor | integer | nullable |
| jawaban | json | nullable |
| waktu_mulai | datetime | nullable |
| waktu_selesai | datetime | nullable |
| status | enum | Belum, Sedang, Selesai |
| timestamps | | |

### cbt

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| judul | varchar(255) | |
| deskripsi | text | nullable |
| mata_pelajaran | varchar(255) | |
| guru_nama | varchar(255) | |
| kelas | varchar(20) | |
| paket_soal_id | bigint FK | nullable |
| durasi | integer | menit |
| nilai_maksimal | integer | |
| jumlah_soal | integer | |
| tanggal_mulai | datetime | |
| tanggal_selesai | datetime | |
| acak_soal | boolean | |
| acak_jawaban | boolean | |
| tampil_hasil | boolean | |
| tampil_nilai | boolean | |
| auto_submit | boolean | |
| jumlah_sesi | integer | |
| status | enum | Draft, Publish, Selesai |
| timestamps | | |

### cbt_participants

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| cbt_id | bigint FK | |
| siswa_id | bigint FK | |
| skor | integer | nullable |
| jawaban | json | nullable |
| waktu_mulai | datetime | nullable |
| waktu_selesai | datetime | nullable |
| status | enum | Belum, Sedang, Selesai |
| timestamps | | |

### nilai_akademik

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| siswa_nama | varchar(255) | |
| siswa_kelas | varchar(20) | |
| mata_pelajaran | varchar(255) | |
| guru_nama | varchar(255) | |
| tugas | integer | nullable, 0-100 |
| praktik | integer | nullable, 0-100 |
| uts | integer | nullable, 0-100 |
| uas | integer | nullable, 0-100 |
| status | enum | Lengkap, Belum Lengkap |
| tahun_ajaran | varchar(9) | |
| semester | varchar(10) | |
| timestamps | | |

### absensi

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| jadwal_id | bigint FK | |
| guru_nama | varchar(255) | |
| mata_pelajaran | varchar(255) | |
| kelas | varchar(20) | |
| tanggal | date | |
| jam_mulai | time | |
| jam_selesai | time | |
| status | enum | Selesai, Berlangsung, Belum |
| created_by | bigint FK | users.id |
| timestamps | | |

### absensi_siswa

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| absensi_id | bigint FK | |
| siswa_nama | varchar(255) | |
| status_kehadiran | enum | Hadir, Izin, Sakit, Alpha, Terlambat |
| keterangan | text | nullable |
| timestamps | | |

### jadwal_pelajaran

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| hari | varchar(10) | |
| jam_mulai | time | |
| jam_selesai | time | |
| mata_pelajaran | varchar(255) | |
| guru_nama | varchar(255) | |
| kelas | varchar(20) | |
| tahun_ajaran | varchar(9) | |
| semester | varchar(10) | |
| ruang | varchar(50) | nullable |
| status | enum | Aktif, Tidak Aktif |
| timestamps | | |

### kalender_events

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| nama | varchar(255) | |
| deskripsi | text | nullable |
| kategori | varchar(50) | |
| tanggal_mulai | date | |
| tanggal_selesai | date | |
| tahun_ajaran | varchar(9) | |
| semester | varchar(10) | |
| status | enum | Aktif, Selesai, Akan Datang |
| timestamps | | |

### pengumuman

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigint PK | |
| judul | varchar(255) | |
| ringkasan | text | nullable |
| isi | longtext | |
| kategori | varchar(50) | |
| target | varchar(50) | |
| status | enum | Draft, Dipublikasikan, Diarsipkan |
| penulis | varchar(255) | |
| pinned | boolean | |
| tanggal_publish | date | nullable |
| timestamps | | |

---

## Index Strategy

| Tabel | Index |
|-------|-------|
| users | email (unique), nip (unique), nisn (unique) |
| teachers | nip (unique), email (unique) |
| students | nis (unique), nisn (unique), jurusan_id (FK) |
| kelas_mengajar | (guru_nama, mata_pelajaran, kelas) |
| nilai_akademik | (siswa_nama, mata_pelajaran, tahun_ajaran, semester) |
| absensi | (kelas, tanggal) |
| jadwal_pelajaran | (hari, kelas) |

---

## Catatan

1. Tabel di atas masih berupa **rancangan awal** dan dapat berubah.
2. Beberapa tabel belum memiliki migration di backend.
3. Relasi foreign key akan ditambahkan saat implementasi backend penuh.
4. Soft delete digunakan untuk data master (teachers, students, jurusans).
