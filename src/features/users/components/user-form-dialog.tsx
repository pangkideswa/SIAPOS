"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { ADMIN_MANAGEABLE_ROLES, ROLE_LABELS, EMPTY_USER_FORM } from "@/features/users/constants/user.constants"
import type { User } from "@/types/auth"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingUser: User | null
  onSubmit: (data: typeof EMPTY_USER_FORM) => Promise<void>
  isLoading?: boolean
}

export function UserFormDialog({
  open,
  onOpenChange,
  editingUser,
  onSubmit,
  isLoading = false,
}: UserFormDialogProps) {
  const [form, setForm] = useState(EMPTY_USER_FORM)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name,
        username: editingUser.username ?? "",
        email: editingUser.email,
        password: "",
        password_confirmation: "",
        role: editingUser.role,
        nip: editingUser.nip ?? "",
        nisn: editingUser.nisn ?? "",
      })
    } else {
      setForm(EMPTY_USER_FORM)
    }
    setErrors({})
  }, [editingUser, open])

  function handleChange(field: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === "role") {
        if (value !== "guru") next.nip = ""
        if (value !== "siswa") next.nisn = ""
      }
      return next
    })
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    try {
      await onSubmit(form)
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { errors?: Record<string, string[]> } }
        errors?: Record<string, string[]>
      }
      if (apiErr.response?.data?.errors) {
        setErrors(apiErr.response.data.errors)
      } else if (apiErr.errors) {
        setErrors(apiErr.errors)
      }
    }
  }

  const showNip = form.role === "guru" || form.role === "wali"
  const showNisn = form.role === "siswa"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
          </DialogTitle>
          <DialogDescription>
            {editingUser
              ? "Perbarui informasi pengguna"
              : "Isi data untuk menambahkan pengguna baru"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Masukkan nama lengkap"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Masukkan username"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="nama@siapos.sch.id"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={form.role}
                onValueChange={(value) => handleChange("role", value ?? "siswa")}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_MANAGEABLE_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-xs text-destructive">{errors.role[0]}</p>
              )}
            </div>
            {showNip && (
              <div className="space-y-2">
                <Label htmlFor="nip">NIP *</Label>
                <Input
                  id="nip"
                  value={form.nip}
                  onChange={(e) => handleChange("nip", e.target.value)}
                  placeholder="Masukkan NIP"
                  disabled={isLoading}
                />
                {errors.nip && (
                  <p className="text-xs text-destructive">{errors.nip[0]}</p>
                )}
              </div>
            )}
            {showNisn && (
              <div className="space-y-2">
                <Label htmlFor="nisn">NISN *</Label>
                <Input
                  id="nisn"
                  value={form.nisn}
                  onChange={(e) => handleChange("nisn", e.target.value)}
                  placeholder="Masukkan NISN"
                  disabled={isLoading}
                />
                {errors.nisn && (
                  <p className="text-xs text-destructive">{errors.nisn[0]}</p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">
                {editingUser ? "Password Baru" : "Password *"}
              </Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required={!editingUser}
                placeholder={editingUser ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">
                {editingUser ? "Konfirmasi Password Baru" : "Konfirmasi Password *"}
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={(e) => handleChange("password_confirmation", e.target.value)}
                required={!editingUser}
                placeholder="Ulangi kata sandi"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingUser ? "Simpan Perubahan" : "Tambah Pengguna"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
