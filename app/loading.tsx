import {
  LoadingSpinner,
  Skeleton,
  StatCardSkeleton,
} from "./components/loading-state";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Top action / greeting placeholder */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" color="brand" />
          <span className="text-xs font-medium text-(--ink-muted)">
            Updating...
          </span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <StatCardSkeleton />

      {/* Analytics & Table Layout */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-(--chart-grid) bg-(--surface-card) p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-8 w-48 rounded-full" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>

        <div className="rounded-2xl border border-(--chart-grid) bg-(--surface-card) p-5">
          <Skeleton className="mb-4 h-5 w-32" />
          <div className="flex flex-col items-center justify-center py-6">
            <Skeleton className="h-40 w-40 rounded-full" />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
