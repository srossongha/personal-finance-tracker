"use client";

// Real account info instead of a placeholder — pulled straight from the
// Better Auth session, the same source the sidebar and topbar already use
// to know who's logged in.

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LogoutIcon } from "../components/icons";

function initialsFor(name: string | undefined) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const Settings = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/login") },
    });
  };

  if (isPending) {
    return <p className="p-6 text-sm text-(--ink-muted)">Loading…</p>;
  }

  if (!session) {
    // The sidebar/AppShell don't force a redirect on their own — pages
    // that need a session ask for one themselves, same pattern as the
    // 401-redirect in useTransactions/useCategoryBudgets.
    router.push("/login");
    return null;
  }

  const memberSince = new Date(session.user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-(--ink-primary)">Settings</h1>

      <div className="w-full max-w-xl rounded-2xl border border-(--chart-grid) bg-(--surface-card) p-5 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <span
            className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full text-lg sm:text-xl font-semibold text-white shadow-xs"
            style={{ background: "var(--brand-gradient)" }}
          >
            {initialsFor(session.user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base sm:text-lg font-semibold text-(--ink-primary)">{session.user.name}</p>
            <p className="truncate text-xs sm:text-sm text-(--ink-muted)">{session.user.email}</p>
          </div>
        </div>

        <dl className="mt-5 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4 border-t border-(--chart-grid) pt-4 text-xs sm:text-sm">
          <div>
            <dt className="text-(--ink-muted)">Member since</dt>
            <dd className="mt-0.5 font-medium text-(--ink-primary)">{memberSince}</dd>
          </div>
          <div>
            <dt className="text-(--ink-muted)">Email verified</dt>
            <dd className="mt-0.5 font-medium text-(--ink-primary)">
              {session.user.emailVerified ? "Yes" : "No"}
            </dd>
          </div>
        </dl>

        <button
          onClick={handleLogout}
          className="mt-6 flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-(--status-critical) px-5 text-sm font-semibold text-white shadow-xs hover:opacity-95 active:scale-95 transition-all cursor-pointer"
        >
          <LogoutIcon size={16} />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Settings;
