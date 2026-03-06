"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { brand } from "@/config/brand";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error ?? "Invalid credentials");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-display text-3xl tracking-widest text-white mb-1">
            {brand.nav.adminLogoPrefix} <span className="text-gold">{brand.nav.adminLogoAccent}</span>
          </p>
          <p className="text-white/20 text-xs tracking-[0.3em] uppercase">Restricted Access</p>
        </div>

        {/* Card */}
        <div className="border border-white/10 bg-white/3 p-8">
          <div className="flex items-center justify-center w-10 h-10 bg-gold/10 border border-gold/20 mx-auto mb-6">
            <Lock className="w-4 h-4 text-gold" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition placeholder:text-white/20"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition placeholder:text-white/20"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center py-2 bg-red-500/10 border border-red-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-gold/90 transition disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/15 text-xs mt-6 tracking-widest uppercase">
          {brand.name} — Internal Use Only
        </p>
      </div>
    </div>
  );
}
