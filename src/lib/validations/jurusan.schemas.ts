import { z } from "zod"

export const jurusanSchema = z.object({
  code: z
    .string({ required_error: "Kode jurusan wajib diisi" })
    .min(1, "Kode jurusan wajib diisi")
    .max(20, "Kode jurusan maksimal 20 karakter"),
  name: z
    .string({ required_error: "Nama jurusan wajib diisi" })
    .min(2, "Nama jurusan minimal 2 karakter")
    .max(255, "Nama jurusan maksimal 255 karakter"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .nullable()
    .optional(),
  is_active: z.boolean().optional(),
})
export type JurusanInput = z.infer<typeof jurusanSchema>
