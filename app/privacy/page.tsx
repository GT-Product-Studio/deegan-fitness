import Link from "next/link";
import { brand } from "@/config/brand";

export const metadata = {
  title: "Privacy Policy — Danger Fitness",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/10 bg-card px-6 h-14 flex items-center">
        <Link href="/" className="font-display text-xl font-bold tracking-wider uppercase">
          {brand.nav.logoPrefix} <span className="text-primary">{brand.nav.logoAccent}</span>
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl font-bold uppercase mb-2">Privacy Policy</h1>
        <p className="text-muted text-sm mb-8">Last updated: March 7, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/80">
          <section>
            <h2 className="text-xl font-bold text-white mt-8 mb-3">1. Information We Collect</h2>
            <p><strong className="text-white">Account Information:</strong> When you create an account, we collect your name, email address, and password.</p>
            <p><strong className="text-white">Health &amp; Fitness Data:</strong> With your permission, we collect heart rate data from connected Bluetooth devices (Polar, Garmin, Wahoo, etc.), workout completion data, exercise timestamps, and activity logs. If you connect Apple Health or Google Health Connect, we access heart rate, workout, and activity data as described in the permission prompts.</p>
            <p><strong className="text-white">Payment Information:</strong> Payment is processed securely by Stripe. We do not store your credit card number. We receive your Stripe customer ID and subscription status.</p>
            <p><strong className="text-white">Usage Data:</strong> We collect basic usage analytics including pages visited, features used, and app session data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mt-8 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide and personalize the Danger Fitness training experience</li>
              <li>Track your workout progress and display performance metrics</li>
              <li>Calculate heart rate zones and training scores</li>
              <li>Power the monthly Danger Challenge leaderboard</li>
              <li>Process subscription payments</li>
              <li>Send account-related notifications</li>
              <li>Improve the app and fix bugs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mt-8 mb-3">3. Leaderboard &amp; Public Data</h2>
            <p>If you participate in the Danger Challenge, your display name and score may appear on the leaderboard visible to other subscribers. You can opt out of the leaderboard in Settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mt-8 mb-3">4. Data Sharing</h2>
            <p>We do <strong className="text-white">not</strong> sell your personal information. We share data only with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Stripe</strong> — for payment processing</li>
              <li><strong className="text-white">Supabase</strong> — for secure data storage (hosted in the US)</li>
              <li><strong className="text-white">Vercel</strong> — for web hosting</li>
            </ul>
            <p>We do not share your health or fitness data with any third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mt-8 mb-3">5. Bluetooth &amp; Health Data</h2>
            <p>Heart rate data collected via Bluetooth is stored on your device during workouts and synced to our servers only after you complete a workout. You can disconnect your heart rate monitor at any time in Settings. If you revoke Bluetooth or HealthKit permissions, we will no longer collect that data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mt-8 mb-3">6. Data Retention</h2>
            <p>We retain your account and workout data for as long as your account is active. If you cancel your subscription, your data is retained for 90 days in case you resubscribe. After 90 days, workout and health data is permanently deleted. You can request immediate deletion by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mt-8 mb-3">7. Your Rights</h2>
            <p>You can:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access your personal data at any time in the app</li>
              <li>Export your workout data</li>
              <li>Delete your account and all associated data</li>
              <li>Opt out of the leaderboard</li>
              <li>Revoke health data permissions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mt-8 mb-3">8. Children&apos;s Privacy</h2>
            <p>Danger Fitness is not intended for children under 13. We do not knowingly collect information from children under 13.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mt-8 mb-3">9. Changes</h2>
            <p>We may update this privacy policy from time to time. We will notify you of significant changes via email or in-app notification.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mt-8 mb-3">10. Contact</h2>
            <p>Questions about this privacy policy? Contact us at <a href="mailto:support@dangerfitness.com" className="text-primary hover:underline">support@dangerfitness.com</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
