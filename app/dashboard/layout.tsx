"use client";

import Link from "next/link";
import { InstallPrompt } from "@/app/components/install-prompt";
import { User } from "lucide-react";
import { brand } from "@/config/brand";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground pb-8">
      <header
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-display text-lg font-bold tracking-wider uppercase">
            {brand.nav.dashboardLogoPrefix} <span className="text-primary">{brand.nav.dashboardLogoAccent}</span>
          </Link>
          <Link
            href="/dashboard/account"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 hover:bg-card transition"
            aria-label="Account"
          >
            <User className="w-4 h-4 text-muted" />
          </Link>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">{children}</div>

      <InstallPrompt />
    </div>
  );
}
