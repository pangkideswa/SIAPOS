"use client"

import { useState, use, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  User,
  Shield,
  CreditCard,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react"
import { UserFormDialog } from "./user-form-dialog"
import { UserDeleteDialog } from "./user-delete-dialog"
import { ROLE_LABELS, ROLE_COLORS, EMPTY_USER_FORM } from "@/features/users/constants/user.constants"
import { userService } from "@/lib/services/user.service"
import type { UserRole } from "@/types/auth"
import type { User as UserType } from "@/types/auth"

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

interface InfoRowProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | null | undefined
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="p-2 rounded-lg bg-muted shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-medium mt-0.5">{value || "-"}</p>
      </div>
    </div>
  )
}

export function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const loadUser = useCallback(async () => {
    const data = await userService.getById(Number(resolvedParams.id))
    setUser(data)
    setIsLoaded(true)
  }, [resolvedParams.id])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail Pengguna"
          action={
            <Button variant="outline" onClick={() => router.push("/admin/users")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          }
        />
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail Pengguna"
          action={
            <Button variant="outline" onClick={() => router.push("/admin/users")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          }
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Pengguna tidak ditemukan</p>
            <p className="text-sm text-muted-foreground mt-1">
              Pengguna dengan ID {resolvedParams.id} tidak tersedia.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  async function handleEditSubmit(formData: typeof EMPTY_USER_FORM) {
    if (!user) return
    setIsLoading(true)
    try {
      await userService.update(user.id, {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        role: formData.role as UserRole,
        nip: formData.nip || null,
        nisn: formData.nisn || null,
        password: formData.password || undefined,
      })
      setFormDialogOpen(false)
      await loadUser()
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!user) return
    setIsLoading(true)
    try {
      await userService.delete(user.id)
      setDeleteDialogOpen(false)
      router.push("/admin/users")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail Pengguna"
        description={`Informasi lengkap tentang ${user.name}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/admin/users")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <Button
              variant="outline"
              onClick={() => setFormDialogOpen(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-3 ${ROLE_COLORS[user.role] ?? "bg-gray-100 text-gray-800"}`}
              >
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Informasi Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              <InfoRow icon={User} label="Nama Lengkap" value={user.name} />
              <InfoRow icon={User} label="Username" value={user.username} />
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow icon={Shield} label="Role" value={ROLE_LABELS[user.role]} />
              {user.nip && (
                <InfoRow icon={CreditCard} label="NIP" value={user.nip} />
              )}
              {user.nisn && (
                <InfoRow icon={CreditCard} label="NISN" value={user.nisn} />
              )}
              <Separator />
              <InfoRow
                icon={Calendar}
                label="Tanggal Dibuat"
                value={formatDate(user.created_at)}
              />
              <InfoRow
                icon={Clock}
                label="Terakhir Diperbarui"
                value={formatDate(user.updated_at)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <UserFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingUser={user}
        onSubmit={handleEditSubmit}
        isLoading={isLoading}
      />

      <UserDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={user}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
