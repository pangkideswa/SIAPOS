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
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogHeader, ResponsiveDialogTitle, ResponsiveDialogBody, ResponsiveDialogFooter } from "@/components/ui/responsive-dialog"
import { signIn, getSession } from "next-auth/react"

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
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      })
      if (result?.error) {
        setGoogleError(true)
        return
      }
      const session = await getSession()
      const role = session?.user?.role
      const dashboard =
        role === "admin" || role === "super_admin"
          ? "/admin"
          : role === "guru"
            ? "/guru"
            : role === "wali"
              ? "/wali"
              : role === "siswa"
                ? "/siswa"
                : "/"
      window.location.href = result.url ?? dashboard
    } catch {
      setGoogleError(true)
    } finally {
      setGoogleErrorLoading(false)
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
          <h1 className="text-2xl font-bold tracking-tight">Selamat Datang di {settings.pengaturan_sistem?.nama_aplikasi || "SIAPOS"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Masukkan email atau NIP/NISN dan kata sandi Anda
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm">
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-3 text-muted-foreground">
              Atau masuk dengan
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full h-11 text-sm font-semibold gap-3"
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

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link
          href="/daftar"
          className="text-primary hover:underline font-semibold"
        >
          Daftar sekarang
        </Link>
      </p>

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
