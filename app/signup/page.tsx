"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { brand } from "@/config/brand";
// SocialAuthButtons removed until Google/Apple providers are enabled in Supabase

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
      });
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-8">
          <h1 className="text-2xl font-bold">
            {brand.nav.dashboardLogoPrefix} <span className="text-gold">{brand.nav.dashboardLogoAccent}</span>
          </h1>
        </Link>

        <div className="bg-card border border-card-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 text-center">Create Account</h2>

          {/* Email / password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-muted mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition"
                placeholder="John Doe"
              />
            </div>

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
                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted mb-1.5">
                Password
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

            {error && <p className="text-rose text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black py-3 rounded-xl font-semibold hover:bg-gold-dark transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-gold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
}
