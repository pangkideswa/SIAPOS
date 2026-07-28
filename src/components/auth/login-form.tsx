"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, Shield, GraduationCap, BookOpen, User } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { DEMO_ACCOUNTS } from "@/lib/demo-users"
import type { UserRole } from "@/types/auth"

const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email / NIP / NISN wajib diisi"),
  password: z
    .string()
    .min(1, "Kata sandi wajib diisi"),
  rememberMe: z.boolean(),
})

type LoginValues = z.infer<typeof loginSchema>

const roleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  admin: Shield,
  guru: BookOpen,
  siswa: GraduationCap,
}

const roleLabels: Record<string, string> = {
  admin: "Admin",
  guru: "Guru",
  siswa: "Siswa",
}

const roleColors: Record<string, string> = {
  admin: "border-primary/30 bg-primary/5 hover:border-primary/50",
  guru: "border-orange/30 bg-orange/5 hover:border-orange/50",
  siswa: "border-emerald-300 bg-emerald-50 hover:border-emerald-400",
}

const roleIconColors: Record<string, string> = {
  admin: "text-primary",
  guru: "text-orange",
  siswa: "text-emerald-600",
}

export function LoginForm() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  })

  const rememberMe = watch("rememberMe")

  const onSubmit = async (data: LoginValues) => {
    setServerError("")
    try {
      await login(data.identifier, data.password)
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      setServerError(apiErr.message ?? "Email atau kata sandi salah")
    }
  }

  const handleDemoLogin = async (role: UserRole) => {
    setServerError("")
    const account = DEMO_ACCOUNTS.find((a) => a.role === role)
    if (!account) return
    setValue("identifier", account.email)
    setValue("password", account.password)
    try {
      await login(account.email, account.password)
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      setServerError(apiErr.message ?? "Gagal login demo")
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
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/25">
            SI
          </div>
          <span className="font-bold text-2xl tracking-tight text-foreground">
            SIAPOS
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Masuk</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Masukkan email atau NIP/NISN dan kata sandi Anda
        </p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-white p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm"
            >
              {serverError}
            </motion.div>
          )}

          <div className="space-y-2">
            <Label htmlFor="identifier">Email / NIP / NISN</Label>
            <Input
              id="identifier"
              type="text"
              placeholder="Masukkan email, NIP, atau NISN"
              autoComplete="username"
              disabled={isSubmitting}
              {...register("identifier")}
            />
            {errors.identifier && (
              <p className="text-xs text-destructive">{errors.identifier.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Kata Sandi</Label>
              <Link
                href="/lupa-password"
                className="text-xs text-primary hover:underline font-medium"
              >
                Lupa sandi?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi"
                autoComplete="current-password"
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

          <div className="flex items-center">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) => setValue("rememberMe", checked)}
              label={
                <span className="text-sm text-muted-foreground">Ingat saya</span>
              }
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </Button>
        </form>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-gradient-to-br from-primary/5 via-white to-orange/5 px-3 text-muted-foreground">
              Atau masuk dengan akun demo
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {DEMO_ACCOUNTS.map((account) => {
            const Icon = roleIcons[account.role] ?? User
            return (
              <button
                key={account.role}
                type="button"
                onClick={() => handleDemoLogin(account.role)}
                disabled={isSubmitting}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
                  roleColors[account.role],
                  isSubmitting && "opacity-50 pointer-events-none"
                )}
              >
                <Icon className={cn("h-5 w-5", roleIconColors[account.role])} />
                <span className="text-xs font-semibold text-foreground">
                  {roleLabels[account.role]}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight text-center">
                  {account.email}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link
          href="/daftar"
          className="text-primary hover:underline font-semibold"
        >
          Daftar sekarang
        </Link>
      </p>
    </motion.div>
  )
}
