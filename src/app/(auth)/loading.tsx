import { Skeleton } from "@/components/ui/skeleton"

export default function AuthLoading() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="mb-8 space-y-3 text-center lg:text-left">
        <div className="inline-flex items-center gap-2.5 mb-6">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-8 w-28" />
        </div>
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="rounded-2xl border border-border/60 bg-white p-6 sm:p-8 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-px flex-1" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-px flex-1" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  )
}
