"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  AddIcon,
  BudgetsIcon,
  DashboardIcon,
  HelpIcon,
  LogoutIcon,
  MenuIcon,
  ReportsIcon,
  SettingsIcon,
  TransactionsIcon,
  XIcon,
} from "./icons";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: DashboardIcon },
  { href: "/transactions", label: "Transactions", icon: TransactionsIcon },
  { href: "/inputs", label: "Add transaction", icon: AddIcon },
  { href: "/budgets", label: "Budgets", icon: BudgetsIcon },
  { href: "/reports", label: "Reports", icon: ReportsIcon },
];

const SECONDARY_NAV_ITEMS = [
  { href: "/help", label: "Help & Support", icon: HelpIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

const linkBase =
  "flex items-center rounded-xl text-sm font-medium transition-colors";
const linkInactive = "text-white/70 hover:bg-white/10 hover:text-white";
const linkActive = "bg-white text-(--brand-700) shadow-sm";

function initialsFor(name: string | undefined) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-close mobile drawer on route change
  useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    onMobileClose?.();
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/login"),
      },
    });
  };

  const isItemActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const renderLink = (
    item: {
      href: string;
      label: string;
      icon: typeof DashboardIcon;
    },
    isMobile = false
  ) => {
    const isActive = isItemActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        title={item.label}
        onClick={() => {
          if (isMobile) onMobileClose?.();
        }}
        className={`${linkBase} ${isActive ? linkActive : linkInactive} ${
          !isMobile && isCollapsed
            ? "h-10 w-10 justify-center"
            : "gap-3 px-3 py-2.5 min-h-[44px]"
        }`}
      >
        <Icon size={18} className="shrink-0" />
        {(isMobile || !isCollapsed) && <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* -------------------------------------------------------------
       * Mobile Off-Canvas Drawer (Slide-in overlay)
       * ------------------------------------------------------------- */}
      {mobileOpen && (
        <div
          role="presentation"
          onClick={onMobileClose}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity md:hidden animate-in fade-in duration-200"
        />
      )}

      <aside
        aria-label="Mobile menu"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col gap-1 p-5 text-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--brand-gradient)" }}
      >
        {/* Mobile drawer header */}
        <div className="mb-5 flex items-center justify-between border-b border-white/15 pb-4">
          <Link
            href="/"
            onClick={onMobileClose}
            className="flex items-center gap-2.5 overflow-hidden"
          >
            <Image
              src="/icon.png"
              alt=""
              width={32}
              height={32}
              className="rounded-lg shrink-0"
            />
            <span className="font-display text-2xl tracking-wide">Finance</span>
          </Link>
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* User preview snippet in mobile drawer */}
        {session && (
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/10 p-3">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-semibold text-white">
                {initialsFor(session.user.name)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {session.user.name}
              </p>
              <p className="truncate text-[11px] text-white/70">
                {session.user.email}
              </p>
            </div>
          </div>
        )}

        <span className="mb-1 px-3 text-xs font-semibold tracking-wider text-white/50 uppercase">
          Menu
        </span>
        <nav className="flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => renderLink(item, true))}
        </nav>

        <nav className="mt-auto flex flex-col gap-1 border-t border-white/15 pt-3">
          {SECONDARY_NAV_ITEMS.map((item) => renderLink(item, true))}

          {!isPending &&
            (session ? (
              <button
                type="button"
                onClick={handleLogout}
                className={`${linkBase} ${linkInactive} min-h-[44px] cursor-pointer gap-3 px-3 py-2.5`}
              >
                <LogoutIcon size={18} className="shrink-0" />
                <span>Log out</span>
              </button>
            ) : (
              renderLink({ href: "/login", label: "Login", icon: LogoutIcon }, true)
            ))}
        </nav>
      </aside>

      {/* -------------------------------------------------------------
       * Desktop Collapsible Sidebar
       * ------------------------------------------------------------- */}
      <aside
        className={`hidden md:flex shrink-0 flex-col gap-1 p-5 text-white transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20 items-center px-3" : "w-64"
        }`}
        style={{ background: "var(--brand-gradient)" }}
      >
        <div
          className={`mb-6 flex items-center ${
            isCollapsed ? "flex-col gap-3 px-0" : "gap-2.5 px-2"
          }`}
        >
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <MenuIcon size={20} />
          </button>
          {isCollapsed ? (
            <Link href="/" title="Finance Tracker">
              <Image
                src="/icon.png"
                alt=""
                width={28}
                height={28}
                className="rounded-lg shrink-0"
              />
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
              <Image
                src="/icon.png"
                alt=""
                width={28}
                height={28}
                className="rounded-lg shrink-0"
              />
              <span className="font-display text-2xl tracking-wide truncate">
                Finance
              </span>
            </Link>
          )}
        </div>

        {!isCollapsed && (
          <span className="mb-1 px-3 text-xs font-semibold tracking-wider text-white/50 uppercase">
            Menu
          </span>
        )}
        <nav
          className={`flex flex-col gap-1 ${isCollapsed ? "items-center" : ""}`}
        >
          {NAV_ITEMS.map((item) => renderLink(item, false))}
        </nav>

        <nav
          className={`mt-auto flex flex-col gap-1 border-t border-white/15 pt-3 ${
            isCollapsed ? "items-center" : ""
          }`}
        >
          {SECONDARY_NAV_ITEMS.map((item) => renderLink(item, false))}

          {!isPending &&
            (session ? (
              <button
                type="button"
                onClick={handleLogout}
                title="Log out"
                className={`${linkBase} ${linkInactive} cursor-pointer ${
                  isCollapsed ? "h-10 w-10 justify-center" : "gap-3 px-3 py-2.5"
                }`}
              >
                <LogoutIcon size={18} className="shrink-0" />
                {!isCollapsed && <span>Log out</span>}
              </button>
            ) : (
              renderLink({ href: "/login", label: "Login", icon: LogoutIcon }, false)
            ))}
        </nav>
      </aside>
    </>
  );
}
