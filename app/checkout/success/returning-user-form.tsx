"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Eye, EyeOff, Loader2, CheckCircle2, KeyRound } from "lucide-react";

interface ReturningUserFormProps {
  email: string;
  planName: string;
}

export function ReturningUserForm({ email, planName }: ReturningUserFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Wrong password. Try again or use the reset link below.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  async function handleForgotPassword() {
    setResetSent(false);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
    });
    if (!resetError) setResetSent(true);
  }

  return (
    <div className="space-y-6">
      {/* Plan added banner */}
      <div className="flex items-start gap-3 px-4 py-3 bg-army/5 border border-army/20">
        <CheckCircle2 className="w-4 h-4 text-army shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-army">Plan added to your account</p>
          <p className="text-xs text-muted mt-0.5">
            <strong className="text-foreground">{planName}</strong> has been added to{" "}
            <strong className="text-foreground">{email}</strong>. Log in below to access it.
          </p>
        </div>
      </div>

      {/* Login form */}
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
              placeholder="Your existing password"
              required
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
            <><Loader2 className="w-4 h-4 animate-spin" /> Logging in…</>
          ) : (
            "Log In & Go to Dashboard →"
          )}
        </button>
      </form>

      {/* Forgot password */}
      <div className="text-center">
        {resetSent ? (
          <p className="text-xs text-army font-semibold">✓ Reset link sent — check your email.</p>
        ) : (
          <button
            onClick={handleForgotPassword}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition"
          >
            <KeyRound className="w-3 h-3" />
            Forgot your password? Send reset link
          </button>
        )}
      </div>
    </div>
  );
}
