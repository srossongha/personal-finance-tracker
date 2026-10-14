"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useCategoryBudgets, useTransactions } from "@/lib/hooks";
import { formatCurrency } from "@/lib/format";
import { AlertIcon, BellIcon, MenuIcon, SearchIcon, XIcon } from "./icons";

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const onOutsideRef = useRef(onOutside);

  useEffect(() => {
    onOutsideRef.current = onOutside;
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutsideRef.current();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return ref;
}

function initialsFor(name: string | undefined) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

interface TopbarProps {
  onOpenMobileDrawer?: () => void;
}

export default function Topbar({ onOpenMobileDrawer }: TopbarProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: transactions } = useTransactions();
  const { data: budgets } = useCategoryBudgets();

  const [query, setQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useClickOutside(() => setIsNotifOpen(false));

  const overBudget = useMemo(() => {
    return budgets
      .map((budget) => {
        const spent = transactions
          .filter((t) => t.type === "expense" && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);
        return { ...budget, spent, over: spent - budget.limit };
      })
      .filter((b) => b.over > 0)
      .sort((a, b) => b.over - a.over);
  }, [budgets, transactions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    setIsMobileSearchOpen(false);
    router.push(trimmed ? `/transactions?q=${encodeURIComponent(trimmed)}` : "/transactions");
  };

  return (
    <header className="relative flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-5 border-b border-(--chart-grid) md:border-b-0">
      {/* Left: Mobile hamburger + Brand / Greeting */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--surface-muted) text-(--ink-secondary) transition-colors hover:bg-(--chart-grid) md:hidden active:scale-95 cursor-pointer"
        >
          <MenuIcon size={20} />
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0 md:hidden">
          <Image
            src="/icon.png"
            alt=""
            width={28}
            height={28}
            className="rounded-lg shrink-0"
          />
        </Link>

        <h1 className="text-lg sm:text-2xl font-semibold text-(--ink-primary) truncate">
          <span className="hidden sm:inline">Welcome</span>
          {session?.user.name ? (
            <>
              <span className="sm:hidden">Hi, {session.user.name.split(" ")[0]}</span>
              <span className="hidden sm:inline">, {session.user.name.split(" ")[0]}!</span>
            </>
          ) : (
            <span className="sm:hidden">Finance</span>
          )}
        </h1>
      </div>

      {/* Middle: Desktop Search Bar */}
      <form onSubmit={handleSearch} className="hidden md:flex mx-auto w-full max-w-md">
        <label className="flex w-full items-center gap-2 rounded-full bg-(--surface-muted) px-4 py-2.5 text-sm text-(--ink-secondary) focus-within:ring-2 focus-within:ring-(--brand-500)">
          <SearchIcon size={16} className="shrink-0 text-(--ink-muted)" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your transactions"
            className="w-full bg-transparent text-sm outline-none placeholder:text-(--ink-muted)"
          />
        </label>
      </form>

      {/* Right actions: Mobile search trigger + Notification bell + Profile avatar */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Mobile Search Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          aria-label="Search transactions"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-(--surface-muted) text-(--ink-secondary) transition-colors hover:bg-(--chart-grid) md:hidden active:scale-95 cursor-pointer"
        >
          {isMobileSearchOpen ? <XIcon size={18} /> : <SearchIcon size={18} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative shrink-0">
          <button
            onClick={() => setIsNotifOpen((open) => !open)}
            aria-label="Budget notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-(--surface-muted) text-(--ink-secondary) transition-colors hover:bg-(--chart-grid) active:scale-95 cursor-pointer"
          >
            <BellIcon size={18} />
            {overBudget.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-(--status-critical)" />
            )}
          </button>

          {isNotifOpen && (
            <div className="fixed sm:absolute right-3 sm:right-0 top-14 sm:top-auto sm:mt-2 z-50 w-[calc(100vw-1.5rem)] sm:w-80 max-w-sm rounded-2xl border border-(--chart-grid) bg-(--surface-card) p-3.5 shadow-xl shadow-black/10 animate-in fade-in zoom-in-95 duration-150">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-sm font-semibold text-(--ink-primary)">
                  Budget alerts
                </p>
                <span className="rounded-full bg-(--surface-muted) px-2 py-0.5 text-[11px] font-medium text-(--ink-muted)">
                  {overBudget.length} {overBudget.length === 1 ? "alert" : "alerts"}
                </span>
              </div>

              {overBudget.length === 0 ? (
                <p className="px-1 py-3 text-center text-sm text-(--ink-muted)">
                  Nothing over budget — you&apos;re on track this month.
                </p>
              ) : (
                <ul className="flex max-h-64 flex-col gap-1.5 overflow-y-auto">
                  {overBudget.map((b) => (
                    <li
                      key={b.category}
                      className="flex items-start gap-2.5 rounded-xl bg-(--surface-muted)/60 p-2.5 hover:bg-(--surface-muted)"
                    >
                      <AlertIcon
                        size={16}
                        className="mt-0.5 shrink-0 text-(--status-critical)"
                      />
                      <span className="text-xs text-(--ink-secondary) leading-relaxed">
                        <span className="font-semibold text-(--ink-primary)">
                          {b.category}
                        </span>{" "}
                        is over budget by{" "}
                        <span className="font-semibold text-(--status-critical)">
                          {formatCurrency(b.over)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <Link
          href="/settings"
          className="flex shrink-0 items-center gap-2 rounded-full active:scale-95 transition-transform"
          title="Account settings"
        >
          {session?.user.image ? (
            <Image
              src={session.user.image}
              alt=""
              width={38}
              height={38}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover ring-2 ring-(--chart-grid)"
            />
          ) : (
            <span
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold text-white shadow-xs"
              style={{ background: "var(--brand-gradient)" }}
            >
              {initialsFor(session?.user.name)}
            </span>
          )}
        </Link>
      </div>

      {/* Collapsible Mobile Search Bar Bar */}
      {isMobileSearchOpen && (
        <div className="absolute top-full left-0 right-0 z-30 border-b border-(--chart-grid) bg-(--surface-card) p-3 shadow-md md:hidden animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearch} className="w-full">
            <label className="flex w-full items-center gap-2 rounded-xl bg-(--surface-muted) px-3 py-2 text-sm text-(--ink-secondary)">
              <SearchIcon size={16} className="shrink-0 text-(--ink-muted)" />
              <input
                type="search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search transactions..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-(--ink-muted)"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-xs text-(--ink-muted) hover:text-(--ink-primary)"
                >
                  Clear
                </button>
              )}
            </label>
          </form>
        </div>
      )}
    </header>
  );
}
