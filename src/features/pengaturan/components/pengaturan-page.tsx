"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
} from "@/components/ui/responsive-dialog"
import {
  Lock,
  Moon,
  Sun,
  Bell,
  Shield,
  Monitor,
  LogOut,
  Save,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react"
import { toast } from "sonner"

export function PengaturanPage() {
  const { logout } = useAuth()
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [notifications, setNotifications] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  async function handleSaveTheme() {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 300))
    setIsSaving(false)
    toast.success("Pengaturan tema berhasil disimpan")
  }

  async function handleChangePassword() {
    if (!passwords.oldPassword || !passwords.newPassword) {
      toast.error("Semua kolom password wajib diisi")
      return
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Password baru tidak cocok")
      return
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter")
      return
    }
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setIsSaving(false)
    setPasswordOpen(false)
    setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" })
    toast.success("Password berhasil diubah")
  }

  async function handleLogoutAll() {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setIsSaving(false)
    logout()
    toast.success("Berhasil logout dari semua perangkat")
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola pengaturan akun Anda.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Keamanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Ganti Password</p>
              <p className="text-xs text-muted-foreground">
                Ubah password akun Anda secara berkala.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setPasswordOpen(true)}
            >
              <Lock className="mr-2 h-4 w-4" />
              Ganti Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === "light" ? (
              <Sun className="h-4 w-4 text-primary" />
            ) : (
              <Moon className="h-4 w-4 text-primary" />
            )}
            Tampilan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Mode Terang/Gelap</p>
              <p className="text-xs text-muted-foreground">
                Pilih tema tampilan yang nyaman.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => {
                  setTheme(checked ? "dark" : "light")
                  handleSaveTheme()
                }}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Notifikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notifikasi Push</p>
              <p className="text-xs text-muted-foreground">
                Terima notifikasi untuk tugas, pengumuman, dan nilai.
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Perangkat & Sesi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Perangkat yang Login</p>
              <p className="text-xs text-muted-foreground">
                Lihat dan kelola sesi login aktif.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">1 sesi aktif</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <p className="text-sm font-medium">Logout Semua Perangkat</p>
              <p className="text-xs text-muted-foreground">
                Akhiri semua sesi login di semua perangkat.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogoutAll}
              disabled={isSaving}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout Semua
            </Button>
          </div>
        </CardContent>
      </Card>

      <ResponsiveDialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <ResponsiveDialogContent showCloseButton>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Ganti Password</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <ResponsiveDialogBody>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="old-password">Password Lama</Label>
                <div className="relative">
                  <Input
                    id="old-password"
                    type={showOldPassword ? "text" : "password"}
                    value={passwords.oldPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, oldPassword: e.target.value })
                    }
                    placeholder="Masukkan password lama"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, newPassword: e.target.value })
                    }
                    placeholder="Masukkan password baru (min. 6 karakter)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Ulangi password baru"
                />
              </div>
            </div>
          </ResponsiveDialogBody>
          <ResponsiveDialogFooter>
            <Button variant="outline" onClick={() => setPasswordOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Simpan
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </div>
  )
}
