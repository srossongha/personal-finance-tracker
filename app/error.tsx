"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-semibold text-(--ink-primary)">
        Something went wrong!
      </h2>
      <p className="mt-2 text-sm text-(--ink-muted)">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-xl bg-(--brand-600) px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-(--brand-700)"
      >
        Try again
      </button>
    </div>
  );
}
