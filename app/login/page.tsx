"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { SocialAuthButtons } from "@/app/components/social-auth-buttons";
import { brand } from "@/config/brand";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/dashboard");
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email above first.");
      return;
    }
    setForgotLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setForgotSent(true);
    setForgotLoading(false);
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-8">
          <h1 className="font-display text-2xl font-bold tracking-wider uppercase">
            {brand.nav.dashboardLogoPrefix} <span className="text-primary">{brand.nav.dashboardLogoAccent}</span>
          </h1>
        </Link>

        <div className="bg-card border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 text-center text-white">Welcome Back</h2>

          <SocialAuthButtons redirectTo="/dashboard" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-muted">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="text-xs text-primary hover:underline disabled:opacity-50"
                >
                  {forgotLoading ? "Sending..." : "Forgot password?"}
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition"
                placeholder="••••••••"
              />
            </div>

            {forgotSent && (
              <p className="text-primary text-xs text-center bg-primary/10 border border-primary/20 rounded-xl px-3 py-2">
                Reset link sent — check your inbox.
              </p>
            )}

            {error && <p className="text-zone-redline text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black py-3 rounded-xl font-semibold hover:bg-primary-dark transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Log In
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/checkout" className="text-primary hover:underline">
            Subscribe
          </Link>
        </p>
      </div>
    </main>
  );
}
