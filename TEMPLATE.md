# Influencer Fitness Platform — Template

A white-label fitness platform for influencers. Clone this repo, edit one config file, swap assets, and deploy.

Built with **Next.js 16**, **Supabase**, **Stripe**, **Tailwind CSS 4**, and **Resend**.

---

## Quick Start

```bash
git clone <this-repo> my-fitness-brand
cd my-fitness-brand
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

---

## 1. Edit `config/brand.ts`

This single file controls **every brand-specific string** in the app. Open it and update:

| Section | What to change |
|---|---|
| **Site Identity** | `name`, `shortName`, `tagline`, `description`, `domain`, `supportEmail`, `fromEmail` |
| **Navigation / Logo** | `nav.logoPrefix`, `nav.logoAccent` (e.g. "YBF" + "FITNESS") — also admin & dashboard variants |
| **Hero Section** | `hero.trainerALabel` / `trainerBLabel` (e.g. "His" / "Hers"), centre badge text, CTA labels, featured quote |
| **Trainers** | For each of `trainerA`, `trainerB`, and `couples`: `name`, `firstName`, `specialty`, `handle`, `photo` path, `bio`, `quotes[]`, `gradient` |
| **Programs** | Each program key (`trainerA-30`, `trainerB-30`, `couples-ab`, etc.): `name`, `price`, `description`, `features[]` |
| **Subscriptions** | `monthly` and `vip`: `displayName`, `price`, `features[]` |
| **Testimonials** | Landing page testimonials and per-program checkout testimonials |
| **Reels** | Video sources and labels for the training reels section |
| **Social** | `instagramHandle` |
| **Colors** | Email accent colors (CSS colors are in `app/globals.css`) |
| **Legal** | `entityName` for Terms/Privacy pages |

### Trainer Slugs

The internal trainer identifiers are `trainerA`, `trainerB`, and `couples`. These appear in:
- URL query params (`?t=trainerA`, `?trainer=trainerB`)
- Database `trainer` column values
- Stripe env var names (`NEXT_PUBLIC_STRIPE_PRICE_TRAINER_A_30`)

You can rename these slugs project-wide if you prefer (e.g. `?t=alex`), but you'll need to update:
- The `Trainer` type in `config/brand.ts`
- All URL references
- Stripe env var names in `.env.local`
- Database seed data

---

## 2. Swap Images & Assets

Replace these files in `public/`:

| Path | Purpose | Recommended Size |
|---|---|---|
| `public/images/trainerA.jpg` | Trainer A hero & avatar | 1200×1600 portrait |
| `public/images/trainerB.jpg` | Trainer B hero & avatar | 1200×1600 portrait |
| `public/images/trainerA-bio.jpg` | Trainer A bio section | 1200×800 landscape |
| `public/images/trainerB-bio.jpg` | Trainer B bio section | 1200×800 landscape |
| `public/images/og-cover.jpg` | Social share image | 1200×630 |
| `public/videos/trainerA-workout.mp4` | Trainer A reel | 9:16 vertical, <10MB |
| `public/videos/trainerB-workout.mp4` | Trainer B reel | 9:16 vertical, <10MB |
| `public/videos/workout3.mp4` | Couples/joint reel | 9:16 vertical, <10MB |
| `public/icons/icon-192.png` | PWA icon | 192×192 |
| `public/icons/icon-512.png` | PWA icon | 512×512 |
| `public/icons/apple-touch-icon.png` | iOS icon | 180×180 |
| `public/icons/favicon-32.png` | Favicon | 32×32 |

Also update `public/manifest.json` with your app name and description.

---

## 3. Brand Colors

Update CSS custom properties in `app/globals.css`:

```css
@theme inline {
  --color-gold: #C8A800;       /* Primary accent */
  --color-gold-dark: #a88c00;  /* Accent hover */
  --color-army: #2e3a1e;       /* CTA / button colour */
  --color-army-light: #3d4d28; /* CTA hover */
}
```

Also update the matching email colours in `config/brand.ts` → `colors` section.

---

## 4. Environment Variables

Create `.env.local` with:

```env
# ── Supabase ──
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ── Stripe ──
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# One-time program price IDs
NEXT_PUBLIC_STRIPE_PRICE_TRAINER_A_30=price_...
NEXT_PUBLIC_STRIPE_PRICE_TRAINER_A_60=price_...
NEXT_PUBLIC_STRIPE_PRICE_TRAINER_A_90=price_...
NEXT_PUBLIC_STRIPE_PRICE_TRAINER_B_30=price_...
NEXT_PUBLIC_STRIPE_PRICE_TRAINER_B_60=price_...
NEXT_PUBLIC_STRIPE_PRICE_TRAINER_B_90=price_...
NEXT_PUBLIC_STRIPE_PRICE_COUPLES_AB=price_...

# Subscription price IDs
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_VIP=price_...

# ── Email (Resend) ──
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Your Brand <noreply@yourdomain.com>

# ── Admin ──
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# ── VIP (optional) ──
NEXT_PUBLIC_DISCORD_INVITE_URL=https://discord.gg/...
VIP_TRAINER_A_NEXT_SESSION=2026-03-15T18:00:00Z
VIP_TRAINER_B_NEXT_SESSION=2026-03-22T18:00:00Z

# ── App URL ──
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 5. Supabase Setup

1. Create a new Supabase project
2. Run the migrations in `supabase/migrations/` (or use `supabase db push`)
3. Enable Email auth in Supabase Auth settings
4. (Optional) Enable Google/Apple OAuth for social login
5. Seed workout data into the `workouts` and `exercises` tables with trainer values matching your slugs (`trainerA`, `trainerB`, `couples`)

---

## 6. Stripe Setup

1. Create products and prices in your Stripe dashboard matching the programs in `config/brand.ts`
2. Copy each price ID into the corresponding env var
3. Set up the Stripe webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
4. Subscribe to events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

---

## 7. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# ... repeat for all env vars above

# Deploy to production
vercel --prod
```

Or connect the GitHub repo to Vercel for automatic deployments.

---

## Project Structure

```
config/
  brand.ts          ← ALL brand-specific configuration
app/
  page.tsx           ← Landing page
  layout.tsx         ← Root layout + metadata
  checkout/          ← Purchase flow
  dashboard/         ← User dashboard + workout views
  admin/             ← Admin panel
  api/               ← API routes (Stripe, auth, etc.)
  components/        ← Shared UI components
lib/
  stripe-products.ts ← Stripe product mappings (reads from config)
  email.ts           ← Email templates (reads from config)
  supabase/          ← Supabase client helpers
public/
  images/            ← Trainer photos, OG image
  videos/            ← Training reel videos
  icons/             ← PWA + favicon icons
  manifest.json      ← PWA manifest
```

---

## License

This is a template for commercial use. Replace this section with your own license.
