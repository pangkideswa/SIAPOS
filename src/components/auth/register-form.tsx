"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/contexts/auth-context"
import { useSettings } from "@/contexts/settings-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, GraduationCap, BookOpen, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const registerSchema = z
  .object({
    role: z.enum(["guru", "siswa", "wali"], {
      required_error: "Pilih peran Anda",
    }),
    name: z.string().min(2, "Nama wajib diisi minimal 2 karakter"),
    email: z.string().email("Format email tidak valid"),
    nip: z.string().optional(),
    nisn: z.string().optional(),
    major: z.string().optional(),
    className: z.string().optional(),
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    password_confirmation: z.string(),
  })
  .refine(
    (data) => data.password === data.password_confirmation,
    {
      message: "Konfirmasi kata sandi tidak cocok",
      path: ["password_confirmation"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "guru") return !!data.nip && data.nip.length > 0
      return true
    },
    { message: "NIP wajib diisi untuk Guru", path: ["nip"] }
  )
  .refine(
    (data) => {
      if (data.role === "siswa") return !!data.nisn && data.nisn.length > 0
      return true
    },
    { message: "NISN wajib diisi untuk Siswa", path: ["nisn"] }
  )
  .refine(
    (data) => {
      if (data.role === "siswa") return !!data.className && data.className.length > 0
      return true
    },
    { message: "Kelas wajib diisi untuk Siswa", path: ["className"] }
  )

type RegisterValues = z.infer<typeof registerSchema>

const roles = [
  {
    value: "guru" as const,
    label: "Guru",
    icon: BookOpen,
    description: "Mengajar & mengelola materi",
    color: "border-primary bg-primary/5 text-primary",
    activeColor: "border-primary bg-primary text-white",
  },
  {
    value: "siswa" as const,
    label: "Siswa",
    icon: GraduationCap,
    description: "Belajar & mengerjakan tugas",
    color: "border-orange bg-orange/5 text-orange",
    activeColor: "border-orange bg-orange text-white",
  },
  {
    value: "wali" as const,
    label: "Wali",
    icon: Users,
    description: "Memantau perkembangan siswa",
    color: "border-emerald-500 bg-emerald-50 text-emerald-600",
    activeColor: "border-emerald-500 bg-emerald-500 text-white",
  },
]

export function RegisterForm() {
  const { register: authRegister } = useAuth()
  const { settings } = useSettings()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: undefined,
      name: "",
      email: "",
      nip: "",
      nisn: "",
      major: "",
      className: "",
      password: "",
      password_confirmation: "",
    },
  })

  const selectedRole = watch("role")

  const onSubmit = async (data: RegisterValues) => {
    setServerError("")
    try {
      await authRegister(
        data.name,
        data.email,
        data.password,
        data.password_confirmation,
        data.role,
        data.nip,
        data.nisn
      )
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      setServerError(apiErr.message ?? "Terjadi kesalahan saat mendaftar")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="mb-8 text-center lg:text-left">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            {settings.logo?.logo_siapos ? (
              <img src={settings.logo.logo_siapos} alt="Logo" className="w-12 h-12 object-contain rounded-xl" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Daftar Akun {settings.pengaturan_sistem?.nama_aplikasi || "SIAPOS"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Buat akun untuk mulai menggunakan {settings.pengaturan_sistem?.nama_aplikasi || "SIAPOS"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm"
            >
              {serverError}
            </motion.div>
          )}

          <div className="space-y-3">
            <Label>Pilih Peran Anda</Label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => {
                const isActive = selectedRole === role.value
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setValue("role", role.value, { shouldValidate: true })}
                    className={cn(
                      "relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200",
                      isActive
                        ? role.activeColor
                        : "border-border hover:border-muted-foreground/30 bg-card"
                    )}
                  >
                    <role.icon
                      className={cn(
                        "h-5 w-5",
                        isActive ? "text-white" : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isActive ? "text-white" : "text-foreground"
                      )}
                    >
                      {role.label}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] leading-tight text-center",
                        isActive ? "text-white/80" : "text-muted-foreground"
                      )}
                    >
                      {role.description}
                    </span>
                  </button>
                )
              })}
            </div>
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {selectedRole && (
              <motion.div
                key={selectedRole}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    autoComplete="name"
                    disabled={isSubmitting}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      selectedRole === "guru"
                        ? "nama@guru.sch.id"
                        : "nama@sekolah.sch.id"
                    }
                    autoComplete="email"
                    disabled={isSubmitting}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {selectedRole === "guru" && (
                  <div className="space-y-2">
                    <Label htmlFor="nip">NIP</Label>
                    <Input
                      id="nip"
                      type="text"
                      placeholder="Masukkan NIP"
                      disabled={isSubmitting}
                      {...register("nip")}
                    />
                    {errors.nip && (
                      <p className="text-xs text-destructive">{errors.nip.message}</p>
                    )}
                  </div>
                )}

                {selectedRole === "siswa" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nisn">NISN</Label>
                      <Input
                        id="nisn"
                        type="text"
                        placeholder="Masukkan NISN"
                        disabled={isSubmitting}
                        {...register("nisn")}
                      />
                      {errors.nisn && (
                        <p className="text-xs text-destructive">{errors.nisn.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="className">Kelas</Label>
                      <Input
                        id="className"
                        type="text"
                        placeholder="Contoh: X RPL 1"
                        disabled={isSubmitting}
                        {...register("className")}
                      />
                      {errors.className && (
                        <p className="text-xs text-destructive">{errors.className.message}</p>
                      )}
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Kata Sandi</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                  <Input
                    id="password_confirmation"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ulangi kata sandi"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    {...register("password_confirmation")}
                  />
                  {errors.password_confirmation && (
                    <p className="text-xs text-destructive">
                      {errors.password_confirmation.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold"
            disabled={isSubmitting || !selectedRole}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Daftar"
            )}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link
          href="/masuk"
          className="text-primary hover:underline font-semibold"
        >
          Masuk
        </Link>
      </p>
    </motion.div>
  )
}
