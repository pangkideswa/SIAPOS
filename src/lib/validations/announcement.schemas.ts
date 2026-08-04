import { z } from "zod"

export const announcementStatusSchema = z.enum(
  ["Draft", "Dipublikasikan", "Diarsipkan"],
  { errorMap: () => ({ message: "Status pengumuman tidak valid" }) }
)

export const announcementSchema = z.object({
  judul: z
    .string({ required_error: "Judul pengumuman wajib diisi" })
    .min(2, "Judul pengumuman minimal 2 karakter")
    .max(255, "Judul pengumuman maksimal 255 karakter"),
  ringkasan: z.string().max(500, "Ringkasan maksimal 500 karakter").optional(),
  isi: z.string().max(50000, "Isi pengumuman terlalu panjang").optional(),
  kategori: z
    .enum(
      [
        "Akademik",
        "Pembelajaran",
        "Assessment",
        "PKL",
        "Kegiatan Sekolah",
        "Libur",
        "Informasi Umum",
        "Lainnya",
      ],
      { errorMap: () => ({ message: "Kategori pengumuman tidak valid" }) }
    )
    .optional(),
  target: z
    .enum(
      [
        "Semua Pengguna",
        "Guru",
        "Siswa",
        "Kelas Tertentu",
        "Jurusan Tertentu",
        "TKJ",
        "TBSM",
        "BDP",
      ],
      { errorMap: () => ({ message: "Target pengumuman tidak valid" }) }
    )
    .optional(),
  kelas: z.string().max(50, "Kelas maksimal 50 karakter").nullable().optional(),
  status: announcementStatusSchema,
  penulis: z.string().max(255, "Nama penulis maksimal 255 karakter").optional(),
  pinned: z.boolean().default(false),
  lampiran: z.array(z.record(z.string(), z.unknown())).default([]),
  tanggal_publish: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Format tanggal publish tidak valid",
    })
    .nullable()
    .optional(),
})
export type AnnouncementInput = z.infer<typeof announcementSchema>

export const announcementStatusUpdateSchema = z.object({
  status: announcementStatusSchema,
})
