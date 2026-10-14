"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AddIcon,
  BudgetsIcon,
  DashboardIcon,
  ReportsIcon,
  TransactionsIcon,
} from "./icons";

const BOTTOM_ITEMS = [
  { href: "/", label: "Home", icon: DashboardIcon },
  { href: "/transactions", label: "Transactions", icon: TransactionsIcon },
  { href: "/inputs", label: "Add", icon: AddIcon, isPrimary: true },
  { href: "/budgets", label: "Budgets", icon: BudgetsIcon },
  { href: "/reports", label: "Reports", icon: ReportsIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isItemActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-(--chart-grid) bg-(--surface-card)/95 px-3 py-1.5 backdrop-blur-md pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <div className="grid grid-cols-5 items-center">
        {BOTTOM_ITEMS.map((item) => {
          const isActive = isItemActive(item.href);
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
                title="Add transaction"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg shadow-(--brand-500)/30 transition-transform active:scale-90"
                  style={{ background: "var(--brand-gradient)" }}
                  aria-label="Add transaction"
                >
                  <Icon size={24} />
                </div>
                <span className="mt-0.5 text-[10px] font-semibold text-(--brand-600)">
                  Add
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                isActive
                  ? "font-semibold text-(--brand-600)"
                  : "text-(--ink-muted) hover:text-(--ink-primary)"
              }`}
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={isActive ? "text-(--brand-600)" : "text-(--ink-muted)"}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-(--brand-600)" />
                )}
              </div>
              <span className="mt-1 max-w-[60px] truncate text-center text-[10px] leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

