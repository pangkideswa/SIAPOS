import { z } from "zod"

export const loginSchema = z.object({
  identifier: z
    .string({ required_error: "Email/NIP/NISN wajib diisi" })
    .min(1, "Email/NIP/NISN wajib diisi"),
  password: z
    .string({ required_error: "Kata sandi wajib diisi" })
    .min(1, "Kata sandi wajib diisi"),
})
export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: "Nama lengkap wajib diisi" })
      .min(2, "Nama lengkap minimal 2 karakter")
      .max(255, "Nama lengkap maksimal 255 karakter"),
    email: z
      .string({ required_error: "Email wajib diisi" })
      .email("Format email tidak valid")
      .max(255, "Email maksimal 255 karakter"),
    password: z
      .string({ required_error: "Kata sandi wajib diisi" })
      .min(6, "Kata sandi minimal 6 karakter")
      .max(100, "Kata sandi maksimal 100 karakter"),
    password_confirmation: z
      .string({ required_error: "Konfirmasi kata sandi wajib diisi" }),
    role: z.enum(["guru", "siswa", "wali"], {
      errorMap: () => ({ message: "Peran yang dipilih tidak valid" }),
    }),
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .max(50, "Username maksimal 50 karakter")
      .optional()
      .or(z.literal("")),
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
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi kata sandi tidak sesuai",
    path: ["password_confirmation"],
  })
export type RegisterInput = z.infer<typeof registerSchema>
