import { z } from "zod"

export const userRoleSchema = z.enum(
  ["super_admin", "admin", "guru", "siswa", "wali"],
  { errorMap: () => ({ message: "Peran tidak valid" }) }
)

export const createUserSchema = z.object({
  name: z
    .string({ required_error: "Nama lengkap wajib diisi" })
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(255, "Nama lengkap maksimal 255 karakter"),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .nullable()
    .optional(),
  email: z
    .string({ required_error: "Email wajib diisi" })
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter"),
  password: z
    .string({ required_error: "Kata sandi wajib diisi" })
    .min(6, "Kata sandi minimal 6 karakter")
    .max(100, "Kata sandi maksimal 100 karakter"),
  role: userRoleSchema,
  nip: z
    .string()
    .min(3, "NIP minimal 3 karakter")
    .max(18, "NIP maksimal 18 karakter")
    .nullable()
    .optional(),
  nisn: z
    .string()
    .min(10, "NISN harus 10 digit angka")
    .max(10, "NISN harus 10 digit angka")
    .regex(/^\d{10}$/, "NISN harus 10 digit angka")
    .nullable()
    .optional(),
})
export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(255, "Nama lengkap maksimal 255 karakter")
    .optional(),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .nullable()
    .optional(),
  email: z.string().email("Format email tidak valid").optional(),
  password: z
    .string()
    .min(6, "Kata sandi minimal 6 karakter")
    .max(100, "Kata sandi maksimal 100 karakter")
    .nullable()
    .optional(),
  role: userRoleSchema.optional(),
  nip: z
    .string()
    .min(3, "NIP minimal 3 karakter")
    .max(18, "NIP maksimal 18 karakter")
    .nullable()
    .optional(),
  nisn: z
    .string()
    .min(10, "NISN harus 10 digit angka")
    .max(10, "NISN harus 10 digit angka")
    .regex(/^\d{10}$/, "NISN harus 10 digit angka")
    .nullable()
    .optional(),
})
export type UpdateUserInput = z.infer<typeof updateUserSchema>
