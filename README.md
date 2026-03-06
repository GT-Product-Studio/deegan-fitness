# His & Hers Fitness

Premium fitness membership platform for influencers Mark Estes and Sommer Ray featuring 30, 60 & 90-day workout challenges.

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Supabase** (Auth + Database)
- **Stripe** (Payments + Webhooks)
- **Lucide React** (Icons)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for webhooks) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | App URL (e.g. `http://localhost:3000`) |

### 3. Set up Supabase database

Run the schema and seed files in your Supabase SQL editor:

1. Execute `supabase/schema.sql` — creates tables and RLS policies
2. Execute `supabase/seed.sql` — inserts sample workouts for Mark (days 1-7) and Sommer (days 1-7)

### 4. Set up Stripe

1. Create products/prices in Stripe Dashboard
2. Set up a webhook endpoint pointing to `https://your-domain.com/api/webhooks/stripe`
3. Listen for the `checkout.session.completed` event

For local development:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with hero, trainers, pricing, testimonials |
| `/programs` | 6 program cards (Mark & Sommer, 30/60/90 days) |
| `/login` | Email/password login |
| `/signup` | Account creation |
| `/checkout?trainer=mark&tier=30` | Checkout page with Stripe redirect |
| `/checkout/success` | Post-payment success page |
| `/dashboard` | Protected dashboard with today's workout, stats, calendar |
| `/dashboard/day/[day]` | Day detail with exercises and mark-complete button |

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/checkout` | POST | Creates a Stripe Checkout session |
| `/api/webhooks/stripe` | POST | Handles Stripe webhook events |

## Database Schema

- **profiles** — User profiles linked to auth.users (trainer, tier, subscription info)
- **workouts** — Day-by-day workout plans per trainer/tier
- **exercises** — Individual exercises within each workout
- **progress** — Tracks which workouts each user has completed
