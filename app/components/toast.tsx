"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastItem extends ToastOptions {
  id: string;
  type: ToastType;
  message: React.ReactNode;
  createdAt: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  show: (
    type: ToastType,
    message: React.ReactNode,
    options?: ToastOptions,
  ) => string;
  dismiss: (id: string) => void;
  clear: () => void;
  success: (message: React.ReactNode, options?: ToastOptions) => string;
  error: (message: React.ReactNode, options?: ToastOptions) => string;
  info: (message: React.ReactNode, options?: ToastOptions) => string;
  warning: (message: React.ReactNode, options?: ToastOptions) => string;
}

const ToastContext = createContext<ToastContextType | null>(null);

const DEFAULT_DURATION = 4000;

// Self-contained icons so toast never breaks regardless of external icon exports
function ToastCheckIcon({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m22 4-10 10.01-3-3" />
    </svg>
  );
}

function ToastXCircleIcon({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

function ToastInfoIcon({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function ToastAlertIcon({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 9v4M12 17h.01M10.3 3.86 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.86a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

function ToastCloseIcon({
  size = 14,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

const typeStyles: Record<
  ToastType,
  {
    icon: React.ReactNode;
    badgeBg: string;
    border: string;
  }
> = {
  success: {
    icon: <ToastCheckIcon className="text-(--status-good)" />,
    badgeBg: "bg-(--status-good)/15 text-(--status-good)",
    border: "border-(--status-good)/30",
  },
  error: {
    icon: <ToastXCircleIcon className="text-(--status-critical)" />,
    badgeBg: "bg-(--status-critical)/15 text-(--status-critical)",
    border: "border-(--status-critical)/30",
  },
  info: {
    icon: <ToastInfoIcon className="text-(--brand-600)" />,
    badgeBg: "bg-(--brand-500)/15 text-(--brand-600)",
    border: "border-(--brand-500)/30",
  },
  warning: {
    icon: <ToastAlertIcon className="text-(--data-yellow)" />,
    badgeBg: "bg-(--data-yellow)/15 text-(--data-yellow)",
    border: "border-(--data-yellow)/30",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();
    setToasts([]);
  }, []);

  const show = useCallback(
    (
      type: ToastType,
      message: React.ReactNode,
      options?: ToastOptions,
    ): string => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const duration = options?.duration ?? DEFAULT_DURATION;

      const newToast: ToastItem = {
        id,
        type,
        message,
        title: options?.title,
        duration,
        action: options?.action,
        createdAt: Date.now(),
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        const timeout = setTimeout(() => {
          dismiss(id);
        }, duration);
        timeoutsRef.current.set(id, timeout);
      }

      return id;
    },
    [dismiss],
  );

  const success = useCallback(
    (message: React.ReactNode, options?: ToastOptions) =>
      show("success", message, options),
    [show],
  );

  const error = useCallback(
    (message: React.ReactNode, options?: ToastOptions) =>
      show("error", message, options),
    [show],
  );

  const info = useCallback(
    (message: React.ReactNode, options?: ToastOptions) =>
      show("info", message, options),
    [show],
  );

  const warning = useCallback(
    (message: React.ReactNode, options?: ToastOptions) =>
      show("warning", message, options),
    [show],
  );

  return (
    <ToastContext.Provider
      value={{ toasts, show, dismiss, clear, success, error, info, warning }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2.5 px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const style = typeStyles[toast.type];

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto relative flex w-full items-start gap-3 rounded-2xl border ${style.border} bg-(--surface-card) p-3.5 shadow-lg shadow-black/8 transition-all animate-in fade-in slide-in-from-top-3`}
          >
            <div
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${style.badgeBg}`}
            >
              {style.icon}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              {toast.title && (
                <p className="text-xs font-semibold text-(--ink-primary)">
                  {toast.title}
                </p>
              )}
              <div className="text-xs text-(--ink-secondary) leading-relaxed">
                {toast.message}
              </div>

              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    onDismiss(toast.id);
                  }}
                  className="mt-2 text-xs font-semibold text-(--brand-600) hover:underline"
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Close notification"
              className="shrink-0 rounded-lg p-1 text-(--ink-muted) transition-colors hover:bg-(--surface-muted) hover:text-(--ink-primary)"
            >
              <ToastCloseIcon size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
