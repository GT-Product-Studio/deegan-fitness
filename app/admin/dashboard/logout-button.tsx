"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/admin-logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-white/30 hover:text-white/70 transition"
    >
      <LogOut className="w-3.5 h-3.5" />
      {loading ? "…" : "Logout"}
    </button>
  );
}
