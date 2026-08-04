import { z } from "zod"

export const teachingClassSchema = z.object({
  guru_nama: z
    .string({ required_error: "Nama guru wajib diisi" })
    .min(1, "Nama guru wajib diisi")
    .max(255, "Nama guru maksimal 255 karakter"),
  mata_pelajaran: z
    .string({ required_error: "Mata pelajaran wajib diisi" })
    .min(1, "Mata pelajaran wajib diisi")
    .max(255, "Mata pelajaran maksimal 255 karakter"),
  kelas: z
    .string({ required_error: "Kelas wajib diisi" })
    .min(1, "Kelas wajib diisi")
    .max(50, "Kelas maksimal 50 karakter"),
  tahun_ajaran: z
    .string({ required_error: "Tahun ajaran wajib diisi" })
    .regex(/^\d{4}\/\d{4}$/, "Format tahun ajaran harus YYYY/YYYY"),
  semester: z.enum(["Ganjil", "Genap"], {
    errorMap: () => ({ message: "Semester tidak valid" }),
  }),
  status: z.enum(["Aktif", "Tidak Aktif"], {
    errorMap: () => ({ message: "Status tidak valid" }),
  }),
})
export type TeachingClassInput = z.infer<typeof teachingClassSchema>

export const teacherSubjectAssignmentSchema = z.object({
  teacher_id: z
    .number({ required_error: "Guru wajib dipilih" })
    .int("Guru tidak valid")
    .positive("Guru tidak valid"),
  subject_id: z
    .number({ required_error: "Mata pelajaran wajib dipilih" })
    .int("Mata pelajaran tidak valid")
    .positive("Mata pelajaran tidak valid"),
  class_id: z
    .number({ required_error: "Kelas wajib dipilih" })
    .int("Kelas tidak valid")
    .positive("Kelas tidak valid"),
})
export type TeacherSubjectAssignmentInput = z.infer<
  typeof teacherSubjectAssignmentSchema
>
