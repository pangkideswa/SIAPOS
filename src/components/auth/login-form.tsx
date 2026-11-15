"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/contexts/auth-context"
import { useSettings } from "@/contexts/settings-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  MessageCircle,
  Mail,
} from "lucide-react"
import { motion } from "framer-motion"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
} from "@/components/ui/responsive-dialog"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

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

export function LoginForm() {
  const { login } = useAuth()
  const { settings } = useSettings()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState("")
  const [googleError, setGoogleError] = useState(false)
  const [googleErrorLoading, setGoogleErrorLoading] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams?.get("error") === "AccessDenied") {
      setGoogleError(true)
    }
  }, [searchParams])

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

  const handleGoogleLogin = async () => {
    setServerError("")
    setGoogleErrorLoading(true)
    try {
      await signIn("google", {
        callbackUrl: "/masuk",
      })
    } catch {
      setGoogleError(true)
      setGoogleErrorLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      {/* Mobile Back Link (Visible only on smaller screens where showcase is hidden) */}
      <div className="lg:hidden mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border/80 text-xs font-semibold text-foreground hover:bg-muted active:scale-95 transition-all shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
          SIAPOS v2.0
        </span>
      </div>

      {/* Brand & Greeting Header */}
      <div className="mb-6 text-center">
        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-card border border-primary/20 shadow-md shadow-primary/10 overflow-hidden p-2 mb-3"
          >
            <img src="/favicon.png" alt="Logo SIAPOS" className="w-full h-full object-contain" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Selamat Datang di <span className="text-primary">{settings.pengaturan_sistem?.nama_aplikasi || "SIAPOS"}</span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
            <span className="inline-block">Sistem Integrasi Akademik</span>{" "}
            <span className="inline-block">dan Pembelajaran Online Sekolah</span>
          </p>
        </div>

        {/* Role Login Guide Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium whitespace-nowrap">
            👨‍🏫 <strong>Guru:</strong> NIP / Email
          </span>
          <span className="px-2.5 py-1 rounded-full bg-orange/10 text-orange border border-orange/20 font-medium whitespace-nowrap">
            🎓 <strong>Siswa:</strong> NISN
          </span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="rounded-3xl border border-border/80 bg-card/90 dark:bg-card/95 p-6 sm:p-8 shadow-xl shadow-primary/5 backdrop-blur-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm font-medium"
            >
              {serverError}
            </motion.div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="identifier" className="text-xs font-bold text-foreground">
              Email / NIP / NISN
            </Label>
            <Input
              id="identifier"
              type="text"
              placeholder="Masukkan email, NIP, atau NISN"
              autoComplete="username"
              disabled={isSubmitting}
              className="h-11 rounded-xl bg-background/50 border-border/80 text-sm focus-visible:ring-primary/30"
              {...register("identifier")}
            />
            {errors.identifier && (
              <p className="text-xs text-destructive font-medium">{errors.identifier.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-bold text-foreground">
                Kata Sandi
              </Label>
              <Link
                href="/lupa-password"
                className="text-xs text-primary hover:underline font-semibold"
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
                className="h-11 rounded-xl bg-background/50 border-border/80 pr-10 text-sm focus-visible:ring-primary/30"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                tabIndex={-1}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center pt-1">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) => setValue("rememberMe", checked)}
              label={
                <span className="text-xs sm:text-sm text-muted-foreground select-none">
                  Ingat saya di perangkat ini
                </span>
              }
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-sm font-bold bg-primary hover:bg-primary/90 active:bg-blue-700 active:scale-[0.98] transition-all rounded-xl shadow-md shadow-primary/20"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses Masuk...
              </>
            ) : (
              "Masuk ke Akun"
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/80" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-3 text-muted-foreground font-medium">
              Atau masuk dengan
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full h-11 text-sm font-semibold gap-3 rounded-xl border-border/80 hover:bg-muted/60 active:scale-[0.98] transition-all"
          disabled={googleErrorLoading}
        >
          {googleErrorLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Masuk dengan Google
        </Button>
      </div>

      {/* Support & Contact Admin Links */}
      <div className="mt-6 text-center text-xs text-muted-foreground space-y-1.5">
        <p>Belum memiliki akun terdaftar?</p>
        <div className="flex items-center justify-center gap-3 font-semibold">
          <a
            href="https://wa.me/6281233436196?text=Halo%20Admin%20SIAPOS,%20saya%20ingin%20membuat%20atau%20mendaftarkan%20akun."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp Admin</span>
          </a>
          <span className="text-border">•</span>
          <a
            href="mailto:pangkiajaa@gmail.com?subject=Permohonan%20Pembuatan%20Akun%20SIAPOS"
            className="inline-flex items-center gap-1 text-primary hover:text-primary/90 hover:underline"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Email Admin</span>
          </a>
        </div>
      </div>

      {/* Google Error Dialog */}
      <ResponsiveDialog open={googleError} onOpenChange={setGoogleError}>
        <ResponsiveDialogContent showCloseButton>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Login Gagal</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <ResponsiveDialogBody>
            <div className="text-center py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                Akun Anda belum terdaftar di SIAPOS. Silakan hubungi Administrator.
              </p>
            </div>
          </ResponsiveDialogBody>
          <ResponsiveDialogFooter>
            <Button onClick={() => setGoogleError(false)} className="bg-primary hover:bg-primary/90">
              Mengerti
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </motion.div>
  )
}
