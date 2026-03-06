"use client";

import Link from "next/link";
import { PlansDrawer } from "@/app/components/plans-drawer";
import { InstallPrompt } from "@/app/components/install-prompt";
import { User } from "lucide-react";
import { brand } from "@/config/brand";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-8">
      {/* Top bar — extra top padding for PWA/notch safe area */}
      <header
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-lg">
            {brand.nav.dashboardLogoPrefix} <span className="text-gold">{brand.nav.dashboardLogoAccent}</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/account"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-card-border hover:bg-card transition"
              aria-label="Account"
            >
              <User className="w-4 h-4 text-muted" />
            </Link>
            <PlansDrawer />
          </div>
        </div>
      </header>

      {/* Page content */}
      <div className="max-w-lg mx-auto px-4 py-6">{children}</div>

      {/* PWA install prompt */}
      <InstallPrompt />
    </div>
  );
}
