"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Eye, EyeOff, Loader2, Mail, CheckCircle2 } from "lucide-react";

interface ClaimFormProps {
  sessionId: string;
  email: string;
  planName: string;
}

export function ClaimForm({ sessionId, email, planName }: ClaimFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  // Fire magic link email in the background on mount
  useEffect(() => {
    setEmailSending(true);
    fetch("/api/send-access-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setEmailSent(true);
      })
      .catch(() => {})
      .finally(() => setEmailSending(false));
  }, [sessionId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/claim-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      // Hard redirect so server reads the new session cookie (not the old one)
      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* Email status banner */}
      <div className={`flex items-start gap-3 px-4 py-3 border ${emailSent ? "bg-army/5 border-army/20" : "bg-card border-card-border"}`}>
        {emailSending ? (
          <Loader2 className="w-4 h-4 text-muted animate-spin shrink-0 mt-0.5" />
        ) : (
          <Mail className={`w-4 h-4 shrink-0 mt-0.5 ${emailSent ? "text-army" : "text-muted"}`} />
        )}
        <div>
          {emailSent ? (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-army">Access link sent</p>
              <p className="text-xs text-muted mt-0.5">
                We emailed a login link to <strong className="text-foreground">{email}</strong>. Click it to jump straight to your dashboard — no password needed.
              </p>
            </>
          ) : (
            <p className="text-xs text-muted">Sending your access link to <strong className="text-foreground">{email}</strong>…</p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-card-border" />
        <span className="text-xs text-muted tracking-widest uppercase">or set a password now</span>
        <div className="flex-1 h-px bg-card-border" />
      </div>

      {/* Password form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email — read-only */}
        <div>
          <label className="block text-xs font-bold tracking-widest uppercase text-muted mb-2">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full border border-card-border bg-card px-4 py-3 text-sm text-muted cursor-not-allowed"
          />
        </div>

        {/* Password */}
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
