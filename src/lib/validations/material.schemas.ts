import { z } from "zod"

export const materialStatusSchema = z.enum(["Draft", "Publish"], {
  errorMap: () => ({ message: "Status materi tidak valid" }),
})

export const materialSchema = z.object({
  judul: z
    .string({ required_error: "Judul materi wajib diisi" })
    .min(2, "Judul materi minimal 2 karakter")
    .max(255, "Judul materi maksimal 255 karakter"),
  deskripsi: z.string().max(500, "Deskripsi maksimal 500 karakter").optional(),
  kelas_mengajar_id: z.number().int("Kelas mengajar tidak valid").optional(),
  guru_nama: z.string().max(255, "Nama guru maksimal 255 karakter").optional(),
  mata_pelajaran: z
    .string()
    .max(255, "Mata pelajaran maksimal 255 karakter")
    .optional(),
  kelas: z.string().max(50, "Kelas maksimal 50 karakter").optional(),
  pertemuan: z.number().int("Pertemuan harus bilangan bulat").min(1, "Pertemuan minimal 1").nullable().optional(),
  jenis_materi: z
    .enum(["PDF", "DOCX", "PPTX", "Gambar", "Video", "Drive", "URL", "Lainnya"], {
      errorMap: () => ({ message: "Jenis materi tidak valid" }),
    })
    .optional(),
  thumbnail_url: z.string().max(1000, "URL thumbnail maksimal 1000 karakter").nullable().optional(),
  lampiran: z.array(z.record(z.string(), z.unknown())).default([]),
  video_url: z.string().max(1000, "URL video maksimal 1000 karakter").nullable().optional(),
  link_drive: z.string().max(1000, "Link Drive maksimal 1000 karakter").nullable().optional(),
  link_eksternal: z.string().max(1000, "Link eksternal maksimal 1000 karakter").nullable().optional(),
  isi_materi: z.string().max(50000, "Isi materi terlalu panjang").optional(),
  status: materialStatusSchema,
})
export type MaterialInput = z.infer<typeof materialSchema>

export const materialStatusUpdateSchema = z.object({
  status: materialStatusSchema,
})
