# Contributing

> Panduan berkontribusi untuk pengembangan SIAPOS.

---

## Branch Convention

| Branch | Kegunaan | Base Branch |
|--------|----------|-------------|
| `main` | Production | — |
| `develop` | Development | `main` |
| `feature/{nama-fitur}` | Fitur baru | `develop` |
| `fix/{nama-fix}` | Perbaikan bug | `develop` |
| `docs/{nama-docs}` | Dokumentasi | `develop` |
| `release/{version}` | Persiapan rilis | `develop` |

### Contoh Nama Branch

```
feature/nilai-akademik
fix/sidebar-navigation-error
docs/update-readme
release/v0.4.0
```

---

## Commit Convention

Gunakan format:

```
{type}({scope}): {message}
```

### Type

| Type | Kegunaan |
|------|----------|
| `feat` | Fitur baru |
| `fix` | Perbaikan bug |
| `docs` | Dokumentasi |
| `refactor` | Refaktor kode |
| `style` | Perubahan formatting |
| `chore` | Maintenance |
| `perf` | Optimasi performa |
| `test` | Penambahan test |

### Scope

Scope adalah modul atau area yang diubah:

| Scope | Area |
|-------|------|
| `auth` | Autentikasi |
| `users` | Manajemen pengguna |
| `academic` | Modul akademik (nilai, absensi, jadwal) |
| `learning` | Modul pembelajaran (materi, tugas) |
| `assessment` | Modul penilaian (quiz, cbt, bank soal) |
| `dashboard` | Halaman dashboard |
| `ui` | Komponen UI |
| `docs` | Dokumentasi |
| `backend` | Backend Laravel |

### Contoh Commit

```
feat(academic): implement Sprint 4.5 Academic Grade Management
docs: add official SIAPOS project documentation
fix(auth): handle null role in sidebar navigation
refactor(users): extract form to reusable component
style: format all files with prettier
chore: update dependencies
```

### Aturan Commit

1. Gunakan **Bahasa Inggris** untuk message.
2. Awali dengan huruf kecil.
3. Maksimal 72 karakter untuk subject.
4. Jangan gunakan titik di akhir subject.
5. Gunakan imperative mood ("add" bukan "added" atau "adds").

---

## Pull Request Process

### Checklist Sebelum PR

- [ ] Branch sudah sesuai konvensi.
- [ ] Tidak ada error TypeScript (`npm run build`).
- [ ] Tidak ada warning ESLint (`npm run lint`).
- [ ] Fitur sudah diuji manual.
- [ ] Tidak ada kode yang di-comment.
- [ ] Tidak ada `console.log` tersisa.

### Template PR

```markdown
## Deskripsi

Jelaskan perubahan yang dilakukan.

## Type

- [ ] feat
- [ ] fix
- [ ] docs
- [ ] refactor
- [ ] style
- [ ] chore

## Checklist

- [ ] Build berhasil
- [ ] Tidak ada error baru
- [ ] UI responsive
- [ ] Komponen reusable

## Screenshot (jika ada)
```

### Review Process

1. Buat PR dari `feature/*` ke `develop`.
2. Tunggu review dari minimal 1 contributor.
3. Diskusikan perubahan jika diperlukan.
4. Setelah disetujui, merge ke `develop`.
5. Saat rilis, merge `develop` ke `main`.

---

## Code Review Guidelines

### Untuk Reviewer

1. **Functionality** — Apakah kode berfungsi sesuai spesifikasi?
2. **Readability** — Apakah kode mudah dipahami?
3. **TypeScript** — Apakah tipe sudah benar? Tidak ada `any`?
4. **Reusability** — Apakah ada kode duplikat yang bisa diekstrak?
5. **Performance** — Apakah ada operasi berat yang tidak perlu?
6. **Security** — Apakah ada celah keamanan?

### Untuk Author

1. Berikan deskripsi jelas di PR.
2. Jelaskan keputusan teknis yang diambil.
3. Responsif terhadap feedback.
4. Jangan gabungkan multiple fitur dalam satu PR.
5. PR yang baik: < 500 baris perubahan.

---

## Development Workflow

1. Clone repository.
2. Checkout branch `develop`.
3. Buat branch fitur: `feature/nama-fitur`.
4. Implementasi fitur.
5. Commit sesuai konvensi.
6. Push branch.
7. Buat Pull Request ke `develop`.
8. Tunggu review.
9. Merge setelah disetujui.

```
git clone https://github.com/your-org/siapos.git
git checkout develop
git pull origin develop
git checkout -b feature/nilai-akademik
# ... implementasi
git add .
git commit -m "feat(academic): add grade management module"
git push origin feature/nilai-akademik
# Buat PR di GitHub
```
