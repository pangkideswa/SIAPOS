# Dokumentasi Revisi & Peningkatan Fitur CBT SIAPOS V2

Dokumen ini mencatat seluruh perbaikan, peningkatan logika, dan penyesuaian fungsional pada modul Computer Based Test (CBT), Bank Soal, dan Paket Soal SIAPOS sesuai arahan pengujian dan masukan pengguna.

---

## Ringkasan Perubahan Berdasarkan Poin Revisi

| No | Poin Revisi & Fitur | Status | File Utama Terkait |
|:---|:---|:---:|:---|
| 1 | **Live Monitor Otomatis Aktif & Token Otomatis Terbuat** | ✅ Selesai | `cbt-detail-page.tsx`, `exam.service.ts` |
| 2 | **Privasi Bank Soal & Paket Soal (Guru Pembuat & Super Admin)** | ✅ Selesai | `bank/route.ts`, `bank/[id]/route.ts`, `packages/route.ts`, `packages/[id]/route.ts`, `bank-soal-list-page.tsx`, `paket-soal-list-page.tsx` |
| 3 | **Penampilan Nama Guru & Mapel pada Pembuatan Paket Soal** | ✅ Selesai | `paket-soal-form-dialog.tsx`, `bank/route.ts`, `exam.service.ts` |
| 4 | **Kustomisasi Bobot Mandiri di Dialog & Detail Paket** | ✅ Selesai | `paket-soal-form-dialog.tsx`, `paket-soal-detail-page.tsx`, `packages/[id]/route.ts` |
| 5 | **Hak Akses Super Admin & Guru Pembuat untuk Bobot Soal** | ✅ Selesai | `packages/[id]/route.ts`, `paket-soal-form-dialog.tsx`, `paket-soal-detail-page.tsx`, `auth/profile/route.ts` |
| 6 | **Re-engagement Layar Penuh (Fullscreen Enforcer Barrier)** | ✅ Selesai | `cbt-exam-page.tsx` |
| 7 | **Bobot Soal Proporsional (Total = 100, Esai > PG)** | ✅ Selesai | `cbt-scoring.ts`, `packages/generate/route.ts`, `paket-soal.service.ts` |
| 8 | **Label Nilai Sementara & Status Koreksi Esai Siswa** | ✅ Selesai | `result/route.ts`, `cbt-result-page.tsx`, `siswa-cbt-list-page.tsx` |
| 9 | **Identitas Guru Pembuat pada Dropdown Paket CBT** | ✅ Selesai | `cbt-form-dialog.tsx`, `packages/route.ts` |
| 10 | **Strict Anti-Cheat Lock & Quick Re-check Buka Kunci** | ✅ Selesai | `cbt-exam-page.tsx`, `cbt-detail-page.tsx`, `submit/route.ts` |
| 11 | **Fitur Cetak Naskah Soal & Master Kunci (Print / PDF)** | ✅ Selesai | `paket-soal-print-dialog.tsx`, `paket-soal-detail-page.tsx` |

---

## Detail Rinci Perubahan & Implementasi

### 1. Live Monitor Otomatis Aktif & Pembuatan Token Otomatis
- **Masalah:** Guru harus menekan tombol *"Aktifkan Live Monitor"* manual setiap kali membuka halaman pengawas. Selain itu, saat CBT baru dibuat, kolom token kosong dan guru harus menekan tombol *"Rilis Token"*, yang berisiko terlupakan sebelum ujian dimulai.
- **Solusi & Implementasi:**
  - Pada [`cbt-detail-page.tsx`](file:///d:/SIAPOS/src/features/cbt/components/cbt-detail-page.tsx), state `autoRefresh` sekarang default ke `true` dengan interval polling optimal (10 detik). Guru langsung melihat status koneksi live hijau berkedip (*Live Monitor Aktif*) seketika saat halaman dibuka.
  - Pada [`exam.service.ts`](file:///d:/SIAPOS/src/services/exam.service.ts) fungsi `create()`, sistem secara otomatis men-generate token acak 6 karakter alfanumerik (contoh: `E9M7EZ`, `PAS987`) apabila tipe ujian adalah `CBT` dan token belum disediakan.
  - Tombol *"Perbarui Token"* di sisi guru kini berfungsi sebagai sarana regenerasi/ganti token baru jika dibutuhkan, tanpa mengharuskan rilis manual awal.

### 2. Privasi Bank Soal & Paket Soal
- **Masalah:** Guru lain tidak boleh melihat atau mengedit bank soal dan paket soal yang dibuat oleh guru lain demi privasi, sementara Super Admin harus dapat memantau dan mengelola seluruhnya.
- **Solusi & Implementasi:**
  - Pada API handler `GET /api/exams/bank`, `GET /api/exams/packages`, serta endpoint per ID (`[id]/route.ts`), ditambahkan verifikasi hak akses:
    - **Guru:** Hanya dapat melihat, mengubah, dan menghapus bank soal dan paket soal yang dibuat oleh dirinya sendiri (`guru_id === teacher.id`). Guru lain yang mencoba mengakses akan menerima respons `403 Forbidden`.
    - **Super Admin:** Memiliki otoritas penuh untuk melihat dan mengelola seluruh bank soal dan paket soal dari semua guru demi keperluan supervisi sekolah.

### 3. Penampilan Nama Guru Pembuat & Mapel pada Pemilihan Soal Paket
- **Masalah:** Pada modal dialog pembuatan/edit paket soal (`Edit Paket Soal`), tabel pemilihan soal hanya menampilkan kolom *Pertanyaan*, *Tipe*, dan *Kesulitan*. Guru tidak dapat mengetahui siapa guru pembuat butir soal tersebut dan apa mata pelajarannya, sehingga berisiko salah memilih soal guru lain.
- **Solusi & Implementasi:**
  - Modal dialog [`paket-soal-form-dialog.tsx`](file:///d:/SIAPOS/src/features/paket-soal/components/paket-soal-form-dialog.tsx) diperlebar menjadi `sm:max-w-5xl` dan tabel butir soal diperkaya dengan kolom:
    1. **Pertanyaan & Kode Soal**
    2. **Mata Pelajaran** (dengan badge kontras)
    3. **Guru Pembuat** (dilengkapi badge khusus **"Saya"** jika soal tersebut dibuat oleh guru yang sedang login)
    4. **Tipe Soal** (Pilihan Ganda / Essay)
    5. **Tingkat Kesulitan** (Mudah / Sedang / Sulit)
    6. **Bobot (Poin)** (Input angka mandiri untuk setiap butir yang dicentang)
  - Dilengkapi **Toolbar Filter Interaktif**:
    - Input pencarian teks (pencarian pertanyaan, kode soal, mapel, atau nama guru).
    - Dropdown filter berdasarkan **Mata Pelajaran**.
    - Dropdown filter berdasarkan **Guru Pembuat**.

### 4. Kustomisasi Bobot Soal Mandiri Langsung di Dialog & Halaman Detail
- **Solusi & Implementasi:**
  - **Di Modal Dialog (`Edit Paket Soal`):**
    - Setiap butir soal yang dicentang langsung memiliki kolom input **Bobot (Poin)** di sebelah kanan tabel.
    - Terdapat badge indikator **"Total Bobot: X / 100 pt"** (berwarna hijau ketika tepat 100 pt, dan oranye jika belum 100 pt).
    - Tersedia tombol **"Hitung Bobot Proporsional (100)"** dengan ikon *Sparkles* yang secara otomatis menghitung bobot proporsional (PG 5 poin, Esai 10 poin, atau rasio seimbang) dengan total akumulasi tepat 100 pt.
    - Bobot kustom langsung tersimpan ke database saat menekan tombol *"Simpan Perubahan Paket & Bobot"*.
  - **Di Halaman Detail Paket Soal (`/guru/paket-soal/[id]` atau `/admin/paket-soal/[id]`):**
    - Setiap butir soal memiliki input bobot mandiri yang dapat diubah kapan saja.
    - Dilengkapi tombol *Hitung Bobot Proporsional (100)* dan tombol *Simpan Bobot Soal*.

### 5. Pengaturan Hak Akses Edit Bobot (Super Admin & Guru Pembuat)
- **Aturan Akses:**
  - **Super Admin:** Memiliki hak penuh untuk melihat seluruh menu pengaturan bobot dan dapat mengubah nilai bobot pada semua paket soal guru manapun (misalnya jika ada guru yang kesulitan atau membutuhkan bantuan admin).
  - **Guru Pembuat:** Dapat mengubah nilai bobot butir soal pada paket soal miliknya sendiri.
  - **Guru Lain:** Jika membuka paket soal milik guru lain, form pengaturan bobot akan berada dalam mode *Read-Only* (input bobot dan tombol hitung dinonaktifkan) dengan keterangan: *"Hanya Pembuat & Super Admin yang dapat mengubah bobot"*. Pada level backend API, permintaan `PUT` dari guru non-pembuat langsung ditolak dengan `403 Forbidden`.

### 6. Re-engagement Layar Penuh (Fullscreen Enforcer Barrier)
- **Solusi & Implementasi:**
  - Ditambahkan **Fullscreen Enforcer Barrier Overlay** pada [`cbt-exam-page.tsx`](file:///d:/SIAPOS/src/features/cbt/components/cbt-exam-page.tsx). Jika siswa sedang dalam status aktif ujian (`MENGERJAKAN`) dan tidak berada dalam mode fullscreen (`!document.fullscreenElement`), tampilan soal langsung diblokir secara aman.
  - Siswa diwajibkan menekan tombol **"Masuk Layar Penuh & Lanjutkan Ujian"** untuk kembali fullscreen sebelum soal dapat dikerjakan.

### 7. Pembobotan Soal Proporsional (Total 100 & Esai Lebih Tinggi)
- **Solusi & Implementasi:**
  - Helper [`src/lib/cbt-scoring.ts`](file:///d:/SIAPOS/src/lib/cbt-scoring.ts) menggunakan formula pembobotan proporsional:
    - Soal Esai memiliki bobot lebih tinggi ($\approx 2\times$ bobot PG), dengan total akumulasi bobot tepat **100**.
    - Sisa desimal dialokasikan secara presisi ke butir terakhir agar jumlah selalu bulat 100.
    - Generator Paket Soal AI dan pembuatan manual otomatis menerapkan algoritma ini saat paket dibuat.

### 8. Penanganan Nilai Sementara & Status Koreksi Esai Siswa
- **Masalah:** Saat ujian selesai dan memiliki butir Esai, siswa berpotensi cemas karena nilai akhir yang muncul hanya berasal dari PG yang dinilai otomatis, sehingga terkesan nilainya anjlok sebelum guru sempat mengoreksi esai.
- **Solusi & Implementasi:**
  - Endpoint `GET /api/exams/[id]/result` kini mengevaluasi keberadaan butir esai dan status penilaiannya (`has_pending_essay`, `pending_essay_count`).
  - Halaman [`cbt-result-page.tsx`](file:///d:/SIAPOS/src/features/cbt/components/cbt-result-page.tsx) menampilkan **Banner Pemberitahuan Nilai Sementara** dan badge status `Nilai Sementara (Esai Belum Dikoreksi)`.
  - Pada rincian butir soal esai yang belum dinilai, ditampilkan badge `Menunggu Koreksi Guru` (bukan nilai 0 atau label salah).
  - Ketika guru/AI telah menyimpan skor esai melalui menu monitor, halaman hasil siswa otomatis menampilkan badge `Nilai Akhir Definitif`.

### 9. Informasi Lengkap Guru Pembuat di Dropdown Paket CBT
- **Solusi & Implementasi:**
  - Pada modal dialog pembuatan CBT ([`cbt-form-dialog.tsx`](file:///d:/SIAPOS/src/features/cbt/components/cbt-form-dialog.tsx)), opsi dropdown paket soal kini mencantumkan: `Judul Paket (Mata Pelajaran • Guru: Nama Guru)`.
  - Saat memilih paket soal, alokasi waktu durasi ujian otomatis diisi sesuai durasi bawaan paket soal tersebut.

### 10. Strict Anti-Cheat Lock & Tombol Cek Buka Kunci Siswa
- **Solusi & Implementasi:**
  - Jika siswa melebihi batas toleransi pelanggaran keluar layar/pindah tab, lembar ujian otomatis dibekukan (`status: CURANG`).
  - Pada layar siswa yang dibekukan, ditambahkan tombol **"Cek Status Buka Kunci"** yang memungkinkan siswa memverifikasi status secara real-time seketika setelah guru pengawas membuka kunci.
  - Pada halaman monitor guru ([`cbt-detail-page.tsx`](file:///d:/SIAPOS/src/features/cbt/components/cbt-detail-page.tsx)), siswa yang terkena sanksi dilengkapi tombol cepat **"Buka Kunci"** langsung pada baris tabel peserta untuk penanganan cepat pengawas ruangan.

### 11. Cetak Naskah Soal & Arsip Kurikulum (Print / PDF)
- **Masalah Awal:** Pada pratinjau naskah soal, pilihan A/B/C/D dan kunci jawaban tidak muncul karena relasi Prisma `bank_soal.options` belum di-include pada `paketSoalService.getById()`.
- **Solusi & Implementasi:**
  - Query Prisma pada [`src/services/paket-soal.service.ts`](file:///d:/SIAPOS/src/services/paket-soal.service.ts) diperbarui dengan meng-include `bank_soal: { include: { options: true } }`.
  - Komponen cetak [`paket-soal-print-dialog.tsx`](file:///d:/SIAPOS/src/features/paket-soal/components/paket-soal-print-dialog.tsx) kini menampilkan seluruh pilihan ganda A/B/C/D/E secara rapi dan menyoroti opsi yang benar dengan badge hijau serta baris ringkasan `✓ Kunci Jawaban: [Huruf]. [Teks Jawaban]` pada mode Master Guru.
  - Mendukung cetak naskah siswa (tanpa kunci) dan master guru (dengan kunci, bobot, dan kolom tanda tangan pengesahan kurikulum).

### 12. Standardisasi Warna Badge Tingkat Kesulitan & Status Publikasi
- **Masalah Awal:** Badge tingkat kesulitan (*Mudah*, *Sedang*, *Sulit*) dan status publikasi (*PUBLISH*, *DRAFT*) pada kartu butir soal dan sidebar tampil dengan warna putih/abu-abu pudar sehingga teks tidak kontras dan sulit terbaca.
- **Solusi & Implementasi:**
  - Standardisasi warna diterapkan di [`src/features/bank-soal/constants/bank-soal.constants.ts`](file:///d:/SIAPOS/src/features/bank-soal/constants/bank-soal.constants.ts) dan [`src/features/paket-soal/constants/paket-soal.constants.ts`](file:///d:/SIAPOS/src/features/paket-soal/constants/paket-soal.constants.ts):
    - **Mudah / MUDAH:** Hijau Emerald (`bg-emerald-100 text-emerald-800 border-emerald-300`)
    - **Sedang / SEDANG:** Kuning Amber (`bg-amber-100 text-amber-800 border-amber-300`)
    - **Sulit / SULIT:** Merah Rose (`bg-rose-100 text-rose-800 border-rose-300`)
    - **Status PUBLISH / Aktif:** Hijau Emerald (`bg-emerald-100 text-emerald-800 border-emerald-300`)
    - **Status DRAFT / Draft:** Kuning Amber (`bg-amber-100 text-amber-800 border-amber-300`)
  - Pada [`paket-soal-detail-page.tsx`](file:///d:/SIAPOS/src/features/paket-soal/components/paket-soal-detail-page.tsx), badge kini menampilkan teks yang diformat ramah (*Mudah*, *Sedang*, *Sulit*, dan *Aktif / Terbit*) dengan warna latar dan teks yang kontras tinggi.

---

## Verifikasi & Pengujian Sistem

1. **Uji Kompilasi TypeScript:**
   - Perintah: `npx tsc -p tsconfig.json --noEmit`
   - Hasil: **Lolos 100% tanpa error**.
2. **Uji Integrasi End-to-End:**
   - Alur pembuatan paket soal, filter guru pembuat, pengaturan bobot mandiri di modal dan detail.
   - Pembuatan CBT dengan pilihan paket soal beridentitas guru pengampu.
   - Pengerjaan CBT siswa, proteksi fullscreen, auto-submit, dan notifikasi nilai sementara untuk butir esai.
   - Proctoring guru: buka kunci instan dan cetak naskah soal arsip kurikulum.
