import React from "react";
import Link from "next/link";

function EmptyBoxIcon({ size = 32 }: { size?: number }) {
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
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  );
}

export interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  compact?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  className = "",
  children,
}: EmptyStateProps) {
  const renderAction = (act: EmptyStateAction, isPrimary = true) => {
    const baseStyle =
      "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors";
    const primaryStyle =
      "bg-(--brand-600) text-white shadow-sm hover:bg-(--brand-700) active:scale-[0.98]";
    const secondaryStyle =
      "border border-(--chart-grid) bg-(--surface-card) text-(--ink-secondary) hover:bg-(--surface-muted) active:scale-[0.98]";
    const buttonClasses = `${baseStyle} ${
      isPrimary ? primaryStyle : secondaryStyle
    }`;

    if (act.href) {
      return (
        <Link href={act.href} className={buttonClasses}>
          {act.icon}
          {act.label}
        </Link>
      );
    }

    return (
      <button type="button" onClick={act.onClick} className={buttonClasses}>
        {act.icon}
        {act.label}
      </button>
    );
  };

  return (
    <div
      className={`flex w-full flex-col items-center justify-center text-center ${
        compact ? "py-8 px-4" : "py-14 px-6"
      } ${className}`}
    >
      <div className="relative mb-4 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--surface-muted) text-(--brand-600) shadow-inner">
          {icon ?? <EmptyBoxIcon size={32} />}
        </div>
      </div>

      <h3
        className={`font-semibold text-(--ink-primary) ${
          compact ? "text-base" : "text-lg"
        }`}
      >
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-(--ink-muted) leading-relaxed">
          {description}
        </p>
      )}

      {children && <div className="mt-4">{children}</div>}

      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {action && renderAction(action, true)}
          {secondaryAction && renderAction(secondaryAction, false)}
        </div>
      )}
    </div>
  );
}
