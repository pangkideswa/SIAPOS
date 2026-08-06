import { z } from "zod"

export const tahunAkademikSchema = z.object({
  nama: z
    .string({ required_error: "Nama tahun akademik wajib diisi" })
    .min(1, "Nama tahun akademik wajib diisi")
    .max(50, "Nama tahun akademik maksimal 50 karakter"),
  tanggal_mulai: z.string().nullable().optional(),
  tanggal_selesai: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  keterangan: z
    .string()
    .max(500, "Keterangan maksimal 500 karakter")
    .nullable()
    .optional(),
})
export type TahunAkademikInput = z.infer<typeof tahunAkademikSchema>
