import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac } from "crypto";
import Link from "next/link";
import AdminLogoutButton from "./logout-button";
import { brand } from "@/config/brand";

function makeSessionToken(username: string) {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "hnh-admin-secret-change-me";
  return createHmac("sha256", secret).update(username).digest("hex");
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("hnh_admin")?.value;
  // Token is HMAC(secret, "hnh_admin") — must match what the login route sets
  const expectedToken = makeSessionToken("hnh_admin");

  if (!sessionCookie || sessionCookie !== expectedToken) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard">
              <span className="font-display text-xl tracking-widest text-white">
                {brand.nav.adminLogoPrefix} <span className="text-gold">{brand.nav.adminLogoAccent}</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/admin/dashboard"
                className="text-xs font-bold tracking-widest uppercase text-white/60 hover:text-white transition"
              >
                Dashboard
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-bold tracking-widest uppercase text-white/30 hover:text-white/60 transition"
            >
              ← Site
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
