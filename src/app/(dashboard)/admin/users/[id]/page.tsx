"use client"

import { UserDetailPage } from "@/features/users/components/user-detail-page"

export default function UserDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <UserDetailPage params={params} />
}
