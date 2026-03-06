import Link from "next/link";
import { brand } from "@/config/brand";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-white/10" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center">
          <Link href="/" className="font-display text-2xl tracking-widest text-white">
            {brand.nav.logoPrefix} <span className="text-gold">{brand.nav.logoAccent}</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16 space-y-8">
        <div>
          <p className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-3">Legal</p>
          <h1 className="font-display text-4xl uppercase leading-none mb-2">Privacy Policy</h1>
          <p className="text-muted text-sm">Last updated: February 2026</p>
        </div>

        {[
          {
            title: "1. Information We Collect",
            body: "We collect your email address and name when you create an account or make a purchase. Payment processing is handled entirely by Stripe — we never store your card details.",
          },
          {
            title: "2. How We Use Your Information",
            body: "Your information is used solely to provide access to your purchased program, send account-related emails (access links, receipts), and improve the platform experience. We do not sell your data.",
          },
          {
            title: "3. Cookies & Analytics",
            body: "We may use basic analytics to understand site usage. No personally identifiable data is shared with third-party advertisers.",
          },
          {
            title: "4. Data Storage",
            body: "Your account data is stored securely via Supabase (PostgreSQL). Payment data is stored by Stripe under their PCI-compliant infrastructure. We retain your data for as long as your account is active.",
          },
          {
            title: "5. Your Rights",
            body: `You may request access to, correction of, or deletion of your personal data at any time. To do so, email ${brand.supportEmail}.`,
          },
          {
            title: "6. Security",
            body: "We take reasonable measures to protect your data, including HTTPS encryption on all transmissions and secure authentication via Supabase Auth.",
          },
          {
            title: "7. Children",
            body: "Our services are not directed at children under 13. We do not knowingly collect data from minors.",
          },
          {
            title: "8. Contact",
            body: `Questions about this policy? Email us at ${brand.supportEmail}.`,
          },
        ].map(({ title, body }) => (
          <div key={title} className="border-t border-card-border pt-6">
            <h2 className="font-bold text-sm mb-3">{title}</h2>
            <p className="text-muted text-sm leading-relaxed">{body}</p>
          </div>
        ))}

        <div className="border-t border-card-border pt-6">
          <Link href="/terms" className="text-gold text-sm hover:underline">View Terms of Service →</Link>
        </div>
      </div>
    </main>
  );
}
