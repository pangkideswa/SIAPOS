import { z } from "zod"

export const subjectSchema = z.object({
  name: z
    .string({ required_error: "Nama mata pelajaran wajib diisi" })
    .min(1, "Nama mata pelajaran wajib diisi")
    .max(255, "Nama mata pelajaran maksimal 255 karakter"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .nullable()
    .optional(),
  is_active: z.boolean().optional(),
})
export type SubjectInput = z.infer<typeof subjectSchema>
