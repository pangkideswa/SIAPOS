import { z } from "zod"

export const studentSchema = z.object({
  foto: z.string().nullable().optional(),
  nis: z
    .string({ required_error: "NIS wajib diisi" })
    .min(1, "NIS wajib diisi")
    .max(20, "NIS maksimal 20 karakter"),
  nisn: z
    .string({ required_error: "NISN wajib diisi" })
    .regex(/^\d{10}$/, "NISN harus 10 digit angka"),
  nama_lengkap: z
    .string({ required_error: "Nama lengkap wajib diisi" })
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(255, "Nama lengkap maksimal 255 karakter"),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], {
    errorMap: () => ({ message: "Jenis kelamin tidak valid" }),
  }),
  tempat_lahir: z
    .string()
    .max(255, "Tempat lahir maksimal 255 karakter")
    .nullable()
    .optional(),
  tanggal_lahir: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Format tanggal lahir tidak valid",
    })
    .nullable()
    .optional(),
  agama: z
    .string()
    .max(50, "Agama maksimal 50 karakter")
    .nullable()
    .optional(),
  alamat: z.string().max(500, "Alamat maksimal 500 karakter").nullable().optional(),
  jurusan_id: z.number().int("Jurusan tidak valid").nullable().optional(),
  classroom_id: z
    .number()
    .int("Kelas tidak valid")
    .nullable()
    .optional(),
  kelas: z
    .string()
    .max(20, "Kelas maksimal 20 karakter")
    .nullable()
    .optional(),
  tahun_masuk: z
    .string()
    .regex(/^\d{4}$/, "Tahun masuk harus 4 digit angka")
    .nullable()
    .optional(),
  tahun_ajaran: z
    .string()
    .regex(/^\d{4}\/\d{4}$/, "Format tahun ajaran harus YYYY/YYYY")
    .nullable()
    .optional(),
  status: z.enum(["Aktif", "Alumni", "Pindah", "Keluar"], {
    errorMap: () => ({ message: "Status siswa tidak valid" }),
  }),
  nama_ayah: z
    .string()
    .max(255, "Nama ayah maksimal 255 karakter")
    .nullable()
    .optional(),
  nama_ibu: z
    .string()
    .max(255, "Nama ibu maksimal 255 karakter")
    .nullable()
    .optional(),
  no_hp_ortu: z
    .string()
    .max(15, "No. HP orang tua maksimal 15 karakter")
    .nullable()
    .optional(),
  alamat_ortu: z.string().max(500, "Alamat orang tua maksimal 500 karakter").nullable().optional(),
})
export type StudentInput = z.infer<typeof studentSchema>
