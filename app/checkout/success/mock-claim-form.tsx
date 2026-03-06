"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface MockClaimFormProps {
  email: string;
  planName: string;
  trainer: string;
  tier: string;
}

export function MockClaimForm({ email, planName, trainer, tier }: MockClaimFormProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/mock-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, trainer, tier }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      // Set the new session (replaces any existing one)
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      // Hard redirect so server reads fresh session cookie
      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* Email banner */}
      <div className="flex items-start gap-3 px-4 py-3 border bg-army/5 border-army/20">
        <Mail className="w-4 h-4 shrink-0 mt-0.5 text-army" />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-army">Almost there</p>
          <p className="text-xs text-muted mt-0.5">
            Set a password for <strong className="text-foreground">{email}</strong> to access your plan.
          </p>
        </div>
      </div>

      {/* Password form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold tracking-widest uppercase text-muted mb-2">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full border border-card-border bg-card px-4 py-3 text-sm text-muted cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold tracking-widest uppercase text-muted mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              className="w-full border border-card-border px-4 py-3 text-sm pr-11 focus:outline-none focus:border-army"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-army text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-army-light transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Setting up your account…</>
          ) : (
            `Access ${planName} →`
          )}
        </button>
      </form>

      <p className="text-center text-xs text-muted">
        Already have an account?{" "}
        <a href="/login" className="text-army font-bold hover:underline">Log in</a>
      </p>
    </div>
  );
}
