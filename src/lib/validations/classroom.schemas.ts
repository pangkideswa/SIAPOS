import { z } from "zod"

export const classroomSchema = z.object({
  name: z
    .string({ required_error: "Nama kelas wajib diisi" })
    .min(1, "Nama kelas wajib diisi")
    .max(50, "Nama kelas maksimal 50 karakter"),
  major: z.string().max(50, "Jurusan maksimal 50 karakter").nullable().optional(),
  grade_level: z
    .string()
    .max(20, "Tingkat kelas maksimal 20 karakter")
    .nullable()
    .optional(),
  homeroom_teacher_id: z
    .number()
    .int("Wali kelas tidak valid")
    .nullable()
    .optional(),
})
export type ClassroomInput = z.infer<typeof classroomSchema>
