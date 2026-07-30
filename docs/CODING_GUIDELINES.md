# Coding Guidelines

> Standar penulisan kode untuk pengembangan SIAPOS.

---

## Prinsip

1. **Clean Code** — Kode mudah dibaca dan dipahami.
2. **SOLID** — Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion.
3. **DRY** — Don't Repeat Yourself. Gunakan komponen reusable.
4. **KISS** — Keep It Simple, Stupid. Jangan over-engineer.
5. **Strict TypeScript** — Hindari `any`, manfaatkan type system.

---

## Folder Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── (auth)/            # Route group untuk halaman auth
│   ├── (dashboard)/       # Route group untuk halaman dashboard
│   │   ├── admin/         # Halaman role admin
│   │   ├── guru/          # Halaman role guru
│   │   └── siswa/         # Halaman role siswa
├── components/            # Shared components
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Layout components
├── features/              # Fitur modules
│   ├── {nama-fitur}/
│   │   ├── types/         # TypeScript interfaces
│   │   ├── constants/     # Constants & options
│   │   ├── dummy/         # Dummy data
│   │   └── components/    # Halaman & komponen
├── contexts/              # React Context
├── hooks/                 # Custom hooks
├── lib/                   # Utility & helpers
├── providers/             # React providers
└── types/                 # Global TypeScript types
```

---

## Naming Convention

### File & Folder

| Entitas | Convention | Contoh |
|---------|-----------|--------|
| Component file | `kebab-case` | `nilai-akademik-admin-page.tsx` |
| Type file | `kebab-case` | `nilai-akademik.ts` |
| Constant file | `kebab-case` | `nilai-akademik.constants.ts` |
| Data file | `kebab-case` | `nilai-akademik.data.ts` |
| Feature folder | `kebab-case` | `nilai-akademik/` |
| Page route folder | `kebab-case` | `nilai-akademik/` |

### Component

| Entitas | Convention | Contoh |
|---------|-----------|--------|
| React component | `PascalCase` | `NilaiAkademikAdminPage` |
| Function component | `PascalCase` | `function PageHeader()` |
| Props interface | `PascalCase` | `interface PageHeaderProps` |
| Type | `PascalCase` | `type StatusNilai = ...` |
| Interface | `PascalCase` | `interface NilaiAkademik` |

### Variable

| Entitas | Convention | Contoh |
|---------|-----------|--------|
| Variable | `camelCase` | `filteredData` |
| Function | `camelCase` | `handleSubmit()` |
| Constant | `UPPER_SNAKE_CASE` | `PER_PAGE` |
| Exported constant | `PascalCase` atau `UPPER_SNAKE_CASE` | `DUMMY_NILAI_AKADEMIK`, `STATUS_NILAI_COLORS` |
| Boolean | `is` / `has` prefix | `isLoading`, `hasRole` |

---

## Component Naming

### Page Component

Gunakan suffix `Page` untuk komponen halaman:

- `NilaiAkademikAdminPage` — Halaman admin
- `NilaiAkademikGuruPage` — Halaman guru
- `NilaiAkademikSiswaPage` — Halaman siswa

### Dialog / Modal

Gunakan suffix `Dialog` untuk komponen dialog:

- `NilaiAkademikDetailDialog`
- `NilaiAkademikFormDialog`
- `ConfirmDialog`

### Sheet

Gunakan suffix `Sheet` untuk side panel:

- `GuruFormSheet`
- `MateriFormSheet`

---

## Import Order

```typescript
// 1. External libraries
import { useState, useMemo } from "react"
import { Search, Pencil } from "lucide-react"

// 2. UI Components
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"

// 3. Feature types & constants
import type { NilaiAkademik } from "../types/nilai-akademik"
import { STATUS_NILAI_COLORS } from "../constants/nilai-akademik.constants"

// 4. Dummy data
import { DUMMY_NILAI_AKADEMIK } from "../dummy/nilai-akademik.data"

// 5. Internal components
import { NilaiAkademikDetailDialog } from "./nilai-akademik-detail-dialog"
```

---

## Commit Convention

Gunakan format: `{type}({scope}): {message}`

| Type | Kegunaan |
|------|----------|
| `feat` | Fitur baru |
| `fix` | Perbaikan bug |
| `docs` | Dokumentasi |
| `refactor` | Refaktor kode |
| `style` | Perubahan style (formatting, spacing) |
| `chore` | Tugas maintenance |
| `perf` | Optimasi performa |

Contoh:

```
feat(academic): implement Sprint 4.5 Academic Grade Management
docs: add official SIAPOS project documentation
fix(auth): handle null role in navigation filter
refactor(users): extract user form to reusable component
```

---

## Reusable Components

### DataTable

Gunakan `DataTable<T>` dari `@/components/ui/data-table` untuk semua tampilan tabel:

```typescript
import { DataTable, type Column } from "@/components/ui/data-table"

type Row = Record<string, unknown> & {
  id: number
  nama: string
  status: string
}

const columns: Column<Row>[] = [
  { key: "nama", header: "Nama" },
  {
    key: "status",
    header: "Status",
    render: (item) => <Badge>{item.status}</Badge>,
  },
]

<DataTable<Row>
  columns={columns}
  data={paginatedData}
  emptyMessage="Tidak ada data"
  onRowClick={handleDetail}
/>
```

### PageHeader

Gunakan `PageHeader` untuk judul dan aksi halaman:

```typescript
<PageHeader
  title="Nilai Akademik"
  description="Kelola seluruh nilai akademik siswa"
  action={<Button onClick={handleCreate}><Plus /> Tambah</Button>}
/>
```

### ConfirmDialog

Gunakan `ConfirmDialog` untuk konfirmasi hapus:

```typescript
<ConfirmDialog
  open={deleteOpen}
  onOpenChange={setDeleteOpen}
  title="Hapus Data"
  description="Apakah Anda yakin?"
  onConfirm={confirmDelete}
/>
```

---

## Code Style Rules

1. **Gunakan `"use client"`** untuk komponen yang menggunakan state, hooks, atau event handlers.
2. **Hindari komentar** — Kode harus self-documenting.
3. **Gunakan `useMemo`** untuk data yang difilter.
4. **Gunakan `useState`** dengan type inference.
5. **Hindari `any`** — Gunakan type yang tepat.
6. **Jangan hardcode** — Gunakan constants.
7. **UI dalam Bahasa Indonesia** — Judul, label, placeholder, tombol, pesan.
8. **Kode dalam Bahasa Inggris** — Variable, function, type, file name.
