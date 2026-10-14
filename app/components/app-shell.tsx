"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import BottomNav from "./bottom-nav";
import PageTransition from "./page-transition";
import { ToastProvider } from "./toast";

// Auth pages get their own centered card and shouldn't show the app's
// nav — there's nothing to navigate to before you're signed in.
const CHROME_LESS_ROUTES = ["/login", "/signup"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChromeLess = CHROME_LESS_ROUTES.includes(pathname);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <ToastProvider>
      {isChromeLess ? (
        <div className="min-h-screen bg-(--page-bg)">
          <PageTransition>{children}</PageTransition>
        </div>
      ) : (
        // On mobile, edge-to-edge layout feels native and saves screen space;
        // on tablet & desktop, the rounded floating app card matches the
        // layered look of the design system.
        <div className="flex min-h-[100dvh] items-stretch bg-(--page-bg) p-0 sm:p-3 md:p-4">
          <div className="flex w-full overflow-hidden rounded-none sm:rounded-3xl bg-(--surface-card) shadow-none sm:shadow-xl sm:shadow-black/5">
            <Sidebar
              mobileOpen={mobileDrawerOpen}
              onMobileClose={() => setMobileDrawerOpen(false)}
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <Topbar onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />
              <main className="flex-1 overflow-y-auto border-t border-(--chart-grid) pb-20 md:pb-0">
                <PageTransition>{children}</PageTransition>
              </main>
              <BottomNav />
            </div>
          </div>
        </div>
      )}
    </ToastProvider>
  );
}
