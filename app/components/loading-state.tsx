import React from "react";

type SpinnerSize = "sm" | "md" | "lg" | "xl";
type SpinnerColor = "brand" | "muted" | "white" | "current";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
  label?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

const colorMap: Record<SpinnerColor, string> = {
  brand: "text-(--brand-600)",
  muted: "text-(--ink-muted)",
  white: "text-white",
  current: "text-current",
};

export function LoadingSpinner({
  size = "md",
  color = "brand",
  className = "",
  label = "Loading",
}: LoadingSpinnerProps) {
  const pixelSize = sizeMap[size];
  const colorClass = colorMap[color];

  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 24 24"
        fill="none"
        className={`animate-spin ${colorClass}`}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-20"
        />
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          className="opacity-80"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

interface LoadingStateProps {
  title?: string;
  description?: string;
  spinnerSize?: SpinnerSize;
  spinnerColor?: SpinnerColor;
  minHeight?: string;
  className?: string;
}

export function LoadingState({
  title = "Loading...",
  description,
  spinnerSize = "lg",
  spinnerColor = "brand",
  minHeight = "min-h-[220px]",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center p-8 text-center ${minHeight} ${className}`}
    >
      <div className="relative mb-3 flex items-center justify-center">
        <div className="absolute h-14 w-14 rounded-full bg-(--brand-500)/10 blur-sm" />
        <LoadingSpinner size={spinnerSize} color={spinnerColor} />
      </div>
      {title && (
        <h3 className="text-sm font-semibold text-(--ink-primary)">{title}</h3>
      )}
      {description && (
        <p className="mt-1 max-w-sm text-xs text-(--ink-muted)">
          {description}
        </p>
      )}
    </div>
  );
}

export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-(--chart-grid)/70 ${className}`}
      {...props}
    />
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-(--chart-grid) last:border-0">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <Skeleton
            className={`h-4 ${
              i === 0 ? "w-32" : i === cols - 1 ? "w-16" : "w-20"
            }`}
          />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({
  rows = 5,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-(--chart-grid) bg-(--surface-card)">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-(--chart-grid) bg-(--surface-muted)/40">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} cols={cols} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-(--chart-grid) bg-(--surface-card) p-5"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-8 w-32" />
          <Skeleton className="mt-4 h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
