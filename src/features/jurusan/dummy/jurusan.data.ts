import type { Jurusan } from "../types/jurusan"

export const DUMMY_JURUSANS: Jurusan[] = [
  {
    id: 1,
    name: "Teknik Komputer dan Jaringan",
    code: "TKJ",
    is_active: true,
    description:
      "Jurusan yang mempelajari instalasi, konfigurasi, dan pemeliharaan jaringan komputer serta server.",
    created_at: "2026-01-10T08:00:00Z",
    updated_at: "2026-01-10T08:00:00Z",
  },
  {
    id: 2,
    name: "Teknik Bisnis Sepeda Motor",
    code: "TBSM",
    is_active: true,
    description:
      "Jurusan yang mempelajari perawatan, perbaikan, dan bisnis sepeda motor.",
    created_at: "2026-01-10T08:05:00Z",
    updated_at: "2026-01-10T08:05:00Z",
  },
  {
    id: 3,
    name: "Bisnis Daring dan Pemasaran",
    code: "BDP",
    is_active: false,
    description:
      "Jurusan yang mempelajari pemasaran digital, perdagangan daring, dan manajemen bisnis.",
    created_at: "2026-01-10T08:10:00Z",
    updated_at: "2026-03-15T12:00:00Z",
  },
]
