'use client'

import { createCrudHooks } from '@/hooks/use-api-crud'
import { announcementService, type AnnouncementFormData } from '@/lib/services/announcement.service'
import type { Pengumuman } from '@/features/pengumuman/types/pengumuman'

export const announcementHooks = createCrudHooks<
  Pengumuman,
  AnnouncementFormData,
  AnnouncementFormData
>(
  'announcements',
  {
    getAll: announcementService.getAll,
    getById: announcementService.getById,
    create: announcementService.create,
    update: (id, data) => announcementService.update(id, data),
    remove: announcementService.remove,
  },
  {
    create: 'Pengumuman berhasil dibuat',
    update: 'Pengumuman berhasil diperbarui',
    remove: 'Pengumuman berhasil dihapus',
  }
)

export const useAnnouncements = announcementHooks.useList
export const useAnnouncement = announcementHooks.useDetail
export const useCreateAnnouncement = announcementHooks.useCreate
export const useUpdateAnnouncement = announcementHooks.useUpdate
export const useRemoveAnnouncement = announcementHooks.useRemove
