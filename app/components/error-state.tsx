"use client";

import React, { useState } from "react";
import Link from "next/link";

function ErrorAlertIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 9v4M12 17h.01M10.3 3.86 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.86a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

function ErrorRefreshIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.5 2v6h-6M2.5 22v-6h6" />
      <path d="M2.5 11.5a10 10 0 0 1 16.36-5.86L21.5 8M21.5 12.5a10 10 0 0 1-16.36 5.86L2.5 16" />
    </svg>
  );
}

function ErrorXCircleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

export interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | string | null;
  onRetry?: () => void;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  compact?: boolean;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We ran into an unexpected error loading this data. Please try again.",
  error,
  onRetry,
  action,
  compact = false,
  className = "",
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false);
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : null;

  return (
    <div
      className={`flex w-full flex-col items-center justify-center text-center ${
        compact ? "py-8 px-4" : "py-14 px-6"
      } ${className}`}
    >
      <div className="relative mb-4 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--status-critical)/10 text-(--status-critical)">
          <ErrorAlertIcon size={32} />
        </div>
      </div>

      <h3
        className={`font-semibold text-(--ink-primary) ${
          compact ? "text-base" : "text-lg"
        }`}
      >
        {title}
      </h3>

      <p className="mt-1.5 max-w-md text-sm text-(--ink-muted) leading-relaxed">
        {message}
      </p>

      {/* Optional technical error details disclosure */}
      {errorMessage && (
        <div className="mt-3 max-w-md">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="text-xs font-medium text-(--ink-muted) hover:text-(--ink-secondary) underline decoration-dotted"
          >
            {showDetails ? "Hide technical details" : "Show technical details"}
          </button>
          {showDetails && (
            <pre className="mt-2 overflow-x-auto rounded-lg bg-(--surface-muted) p-3 text-left font-mono text-xs text-(--status-critical) border border-(--chart-grid)">
              {errorMessage}
            </pre>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-(--brand-600) px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-(--brand-700) active:scale-[0.98]"
          >
            <ErrorRefreshIcon size={16} />
            Try again
          </button>
        )}

        {action &&
          (action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 rounded-full border border-(--chart-grid) bg-(--surface-card) px-4 py-2 text-sm font-semibold text-(--ink-secondary) transition-colors hover:bg-(--surface-muted) active:scale-[0.98]"
            >
              {action.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center gap-2 rounded-full border border-(--chart-grid) bg-(--surface-card) px-4 py-2 text-sm font-semibold text-(--ink-secondary) transition-colors hover:bg-(--surface-muted) active:scale-[0.98]"
            >
              {action.label}
            </button>
          ))}

        {!action && !onRetry && (
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-(--brand-600) px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-(--brand-700)"
          >
            Back to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}

export function ErrorAlert({
  title,
  message,
  onRetry,
  className = "",
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border border-(--status-critical)/20 bg-(--status-critical)/10 p-3.5 text-sm text-(--status-critical) ${className}`}
    >
      <ErrorXCircleIcon size={18} />
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <p className="text-xs sm:text-sm text-(--status-critical)/90">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold hover:bg-(--status-critical)/15 transition-colors"
        >
          <ErrorRefreshIcon size={14} />
          Retry
        </button>
      )}
    </div>
  );
}
