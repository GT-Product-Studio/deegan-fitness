import Link from "next/link";
import { brand } from "@/config/brand";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center">
          <Link href="/" className="font-display text-xl font-bold tracking-wider uppercase text-white">
            {brand.nav.logoPrefix} <span className="text-primary">{brand.nav.logoAccent}</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16 space-y-8">
        <div>
          <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3">Legal</p>
          <h1 className="font-display text-4xl font-bold uppercase leading-none mb-2">Terms of Service</h1>
          <p className="text-muted text-sm">Last updated: March 2026</p>
        </div>

        {[
          {
            title: "1. Acceptance of Terms",
            body: `By subscribing to or accessing any ${brand.legal.entityName} content, you agree to these Terms of Service. If you do not agree, do not use our services.`,
          },
          {
            title: "2. Subscription & Access",
            body: `${brand.legal.entityName} offers a monthly subscription at ${brand.subscription.priceFormatted}/month that grants access to all training content, levels, and features. Subscriptions auto-renew monthly until cancelled. You may cancel at any time through your account settings or Stripe billing portal.`,
          },
          {
            title: "3. Health & Safety Disclaimer",
            body: `${brand.legal.entityName} programs are for informational and fitness purposes only. Consult a physician before beginning any exercise program. You exercise at your own risk. ${brand.legal.entityName} is not liable for any injury or health complications arising from program use.`,
          },
          {
            title: "4. Refund Policy",
            body: "You may cancel your subscription at any time. No refunds are issued for partial billing periods. If you experience a technical issue preventing access to content, contact us and we will resolve it promptly.",
          },
          {
            title: "5. Intellectual Property",
            body: `All workout content, training programs, images, and materials are the intellectual property of ${brand.legal.entityName}. Reproduction, resale, or redistribution is strictly prohibited.`,
          },
          {
            title: "6. Account Security",
            body: "You are responsible for maintaining the confidentiality of your account credentials. Do not share your login information. Notify us immediately of any unauthorized account access.",
          },
          {
            title: "7. Modifications",
            body: "We reserve the right to modify these Terms at any time. Continued use of the platform following any changes constitutes acceptance of the updated Terms.",
          },
          {
            title: "8. Contact",
            body: `Questions about these Terms? Email us at ${brand.supportEmail}.`,
          },
        ].map(({ title, body }) => (
          <div key={title} className="border-t border-white/10 pt-6">
            <h2 className="font-bold text-sm mb-3 text-white">{title}</h2>
            <p className="text-muted text-sm leading-relaxed">{body}</p>
          </div>
        ))}

        <div className="border-t border-white/10 pt-6">
          <Link href="/privacy" className="text-primary text-sm hover:underline">View Privacy Policy &rarr;</Link>
        </div>
      </div>
    </main>
  );
}
