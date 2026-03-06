"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle } from "lucide-react";
import { brand } from "@/config/brand";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm text-center">
          <Link href="/" className="block text-center mb-8">
            <h1 className="text-2xl font-bold">
              {brand.nav.logoPrefix} <span className="text-gold">{brand.nav.logoAccent}</span>
            </h1>
          </Link>

          <div className="bg-card border border-card-border rounded-2xl p-6">
            <div className="w-14 h-14 bg-army/10 flex items-center justify-center mx-auto mb-5 rounded-full">
              <CheckCircle className="w-7 h-7 text-army" />
            </div>
            <h2 className="text-xl font-bold mb-3">Password Updated</h2>
            <p className="text-muted text-sm mb-6">
              Your password has been reset successfully.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-gold text-black py-3 rounded-xl font-semibold hover:bg-gold-dark transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-8">
          <h1 className="text-2xl font-bold">
            {brand.nav.logoPrefix} <span className="text-gold">{brand.nav.logoAccent}</span>
          </h1>
        </Link>

        <div className="bg-card border border-card-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-2 text-center">Reset Password</h2>
          <p className="text-muted text-sm text-center mb-6">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-muted mb-1.5"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-muted mb-1.5"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-rose text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black py-3 rounded-xl font-semibold hover:bg-gold-dark transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Password
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-4">
          <Link href="/login" className="text-gold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}
