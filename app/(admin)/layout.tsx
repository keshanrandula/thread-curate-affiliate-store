import type { Metadata } from "next";
import { headers } from "next/headers";
import { getAdminSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Merchant Admin Console | Thread & Curate",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-invoke-path") || headerList.get("x-pathname") || "";

  const session = await getAdminSession();

  // If user is on the login page or unauthenticated, render standalone login view
  if (!session) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-[#09090b] text-stone-900 dark:text-[#f4f4f5] transition-colors">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        {children}
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-stone-100 text-stone-900 dark:bg-[#09090b] dark:text-[#f4f4f5] transition-colors">
      <AdminSidebar userEmail={session.email} userRole={session.role} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Admin Top Header */}
        <header className="hidden lg:flex h-16 border-b border-stone-200 dark:border-zinc-800/80 px-8 items-center justify-between bg-white/80 dark:bg-zinc-950/60 backdrop-blur-md sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span className="text-xs text-stone-500 dark:text-zinc-400 font-medium">
              Merchant session active: <strong className="text-stone-900 dark:text-white font-semibold">{session.email}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
              {session.role}
            </span>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
      
      <Toaster position="top-right" richColors />
    </div>
  );
}
