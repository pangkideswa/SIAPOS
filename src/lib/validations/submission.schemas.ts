import { z } from "zod"

export const submissionStatusSchema = z.enum(
  ["Menunggu Penilaian", "Sudah Dinilai"],
  { errorMap: () => ({ message: "Status pengumpulan tidak valid" }) }
)

export const submissionSchema = z.object({
  file_jawaban: z
    .record(z.string(), z.unknown())
    .nullable()
    .optional(),
  catatan: z.string().max(2000, "Catatan maksimal 2000 karakter").nullable().optional(),
})

export const submissionCreateSchema = z.object({
  assignment_id: z
    .number({ required_error: "ID tugas wajib diisi" })
    .int("ID tugas tidak valid")
    .positive("ID tugas tidak valid"),
  student_id: z
    .number({ required_error: "ID siswa wajib diisi" })
    .int("ID siswa tidak valid")
    .positive("ID siswa tidak valid"),
  data: submissionSchema.default({}),
})

export const gradeSubmissionSchema = z.object({
  nilai: z
    .number()
    .min(0, "Nilai minimal 0")
    .max(1000, "Nilai maksimal 1000")
    .nullable()
    .optional(),
  feedback: z
    .string()
    .max(2000, "Feedback maksimal 2000 karakter")
    .nullable()
    .optional(),
})
