"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react"
import { UserFormDialog } from "./user-form-dialog"
import { UserDeleteDialog } from "./user-delete-dialog"
import { ROLE_LABELS, ROLE_COLORS, ADMIN_MANAGEABLE_ROLES, EMPTY_USER_FORM } from "@/features/users/constants/user.constants"
import { userService } from "@/lib/services/user.service"
import type { User, UserRole } from "@/types/auth"

export function UserListPage() {
  const router = useRouter()
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])

  const perPage = 10

  const loadUsers = useCallback(async () => {
    const result = await userService.getAll({ per_page: 1000 })
    setUsers(result.data)
  }, [])

  useEffect(() => {
    loadUsers().finally(() => setIsTableLoading(false))
  }, [loadUsers])

  const filteredUsers = users.filter((user) => {
    if (roleFilter !== "all" && user.role !== roleFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.username?.toLowerCase().includes(q) ?? false) ||
        (user.nip?.toLowerCase().includes(q) ?? false) ||
        (user.nisn?.toLowerCase().includes(q) ?? false)
      )
    }
    return true
  })

  const totalPages = Math.ceil(filteredUsers.length / perPage)
  const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage)

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "name",
      header: "Nama",
      render: (item) => (
        <div>
          <p className="font-medium">{String(item.name)}</p>
          <p className="text-xs text-muted-foreground">@{String(item.username)}</p>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "role",
      header: "Role",
      render: (item) => {
        const role = item.role as UserRole
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[role] ?? "bg-gray-100 text-gray-800"}`}
          >
            {ROLE_LABELS[role] ?? role}
          </span>
        )
      },
    },
    {
      key: "identifier",
      header: "NIP / NISN",
      render: (item) => {
        const user = item as unknown as User
        return (
          <span className="text-sm text-muted-foreground">
            {user.nip ?? user.nisn ?? "-"}
          </span>
        )
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-[120px]",
      render: (item) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Lihat Detail"
            onClick={() => router.push(`/admin/users/${item.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Edit"
            onClick={() => openEdit(item as unknown as User)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            title="Hapus"
            onClick={() => {
              setDeletingUser(item as unknown as User)
              setDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  function openCreate() {
    setEditingUser(null)
    setFormDialogOpen(true)
  }

  function openEdit(user: User) {
    setEditingUser(user)
    setFormDialogOpen(true)
  }

  const handleFormSubmit = useCallback(
    async (formData: typeof EMPTY_USER_FORM) => {
      setIsLoading(true)
      try {
        if (editingUser) {
          await userService.update(editingUser.id, {
            name: formData.name,
            username: formData.username,
            email: formData.email,
            role: formData.role as UserRole,
            nip: formData.nip || null,
            nisn: formData.nisn || null,
            password: formData.password || undefined,
          })
        } else {
          await userService.create({
            name: formData.name,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role as UserRole,
            nip: formData.nip || null,
            nisn: formData.nisn || null,
          })
        }
        setFormDialogOpen(false)
        await loadUsers()
      } finally {
        setIsLoading(false)
      }
    },
    [editingUser, loadUsers]
  )

  const handleDelete = useCallback(async () => {
    if (!deletingUser) return
    setIsLoading(true)
    try {
      await userService.delete(deletingUser.id)
      setDeleteDialogOpen(false)
      setDeletingUser(null)
      await loadUsers()
    } finally {
      setIsLoading(false)
    }
  }, [deletingUser, loadUsers])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Pengguna"
        description="Kelola semua pengguna dalam sistem"
        action={
          <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, email, NIP, atau NISN..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(value) => {
            setRoleFilter(value ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Semua Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Role</SelectItem>
            {ADMIN_MANAGEABLE_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_LABELS[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={paginatedUsers as unknown as Record<string, unknown>[]}
        loading={isTableLoading}
        emptyMessage="Tidak ada pengguna ditemukan"
        onRowClick={(item) => router.push(`/admin/users/${item.id}`)}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages} ({filteredUsers.length} data)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}

      <UserFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingUser={editingUser}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />

      <UserDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={deletingUser}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
