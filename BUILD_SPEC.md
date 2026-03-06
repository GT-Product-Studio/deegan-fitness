# Deegan Fitness — Build Spec

## Overview
Transform the existing influencer fitness template into **Deegan Fitness** — a connected MX training platform built around Haiden Deegan's actual weekly regiment. Single subscription ($19.99/mo), 3 training levels, heart rate zone training, and benchmark comparison against Haiden's real stats.

## Who is Haiden Deegan?
- 19 years old, from Temecula, CA
- Monster Energy Yamaha Star Racing rider
- 2× 250cc SuperMotocross Champion
- 2× AMA Motocross 250cc Champion  
- 2025 AMA Supercross 250cc West Champion
- ~1.5M Instagram, ~1.4M TikTok followers
- Known as "Danger Boy"

## Product Model
**Single subscription: $19.99/mo** — all content unlocked. Users choose their training level:

### Training Levels
1. **🟢 Rookie** — 15mi ride / 45min moto / 45min gym
2. **🟡 Pro Am** — 30mi ride / 1.5hr moto / 1hr gym  
3. **🔴 Factory** — 50mi ride / 2hr moto / 1.5hr gym (Haiden's actual numbers)

### Weekly Structure (all levels follow this)
- Mon–Wed: FULL SEND (all 3 pillars)
- Thu: Travel/Train (race weeks = travel, otherwise train)
- Fri: Travel/Prep (race weeks = prep, otherwise light)
- Sat: RACE DAY (or full training on off-weeks)
- Sun: RECOVER

### Three Training Pillars
1. **Road Cycling** — endurance base, HR Zone 2-3
2. **Moto Practice** — sport-specific, HR Zone 3-5
3. **Gym** — strength & conditioning, HR Zone 2-4

## Design Direction

### Colors
- **Background:** #0A0A0A (near-black)
- **Primary accent:** #00D26A (Monster Energy green)
- **Cards/elevated:** #111111 / #1A1A1A
- **Text:** white + #A0A0A0 secondary
- **HR Zone colors:** gray → green → gold → orange → red

### Typography
- Use a bold, industrial heading font — NOT Bebas Neue, Poppins, or Inter
- Suggested: Oswald, Barlow Condensed, or similar condensed sans-serif
- Body: clean sans-serif (Geist, Inter OK for body)

### Vibe
Dark, aggressive, motorsport. Think Monster Energy meets Strava. Not soft, not wellness — this is an athlete's training platform.

## Assets Available
All in `public/images/deegan/` (67 images):
- `deegan-hero-poster.jpg` — mid-air whip shot, dramatic action → **HERO**
- `deegan-portrait.jpg` — stadium shot on bike, full gear → **ABOUT SECTION**
- `deegan-1.jpg` — shirtless portrait showing fitness → **PROFILE/CTA**
- `deegan-2.jpg` through `deegan-10.jpg` — various action/lifestyle shots
- `deegan-sx-1.jpg` through `deegan-sx-10.jpg` — supercross action
- `deegan-hero.mp4` / `deegan-hero-reel.mp4` — video clips
- `deegan-section.mp4` / `deegan-reel3.mp4` — additional video
- Various poster images for video thumbnails

Video: `public/videos/braap_hero.mp4`

**Image quality rule:** Use `quality={100}` on every Next.js Image component. No exceptions.

## Pages to Build

### 1. Landing Page (`/`)
Complete redesign from the dual-trainer template. Single-page scroll:

**HERO:** Full-bleed background image (`deegan-hero-poster.jpg`), dark overlay. Left-aligned:
- "TRAIN LIKE DEEGAN" headline (huge, condensed font)
- "The exact regiment that built a two-time champion." subheadline
- Green CTA button: "Start Training — $19.99/mo"
- Secondary link: "See the Program ↓"

**PROOF BAR:** 4 stats in a row on dark background:
- 2× SMX Champion | 1.5M Instagram | 210 Avg Peak BPM | 200+ Miles/Week

**THE REGIMENT:** Visual weekly schedule showing Mon-Sun structure. Each day is a card:
- Training days: green accent, show all 3 pillars
- Travel days: muted
- Race day: red/highlighted
- Recovery: subtle
Include the 3 training level selector (Rookie/Pro Am/Factory) that updates the daily volumes shown.

**THREE PILLARS:** Section showing the 3 training pillars with icons/stats:
- 🚴 Road Cycling — "50 miles before most people wake up"
- 🏍️ Moto Practice — "2 hours on the track, every day"
- 🏋️ Gym — "1.5 hours of strength & conditioning"

**HR ZONES:** Visual section showing the 5 heart rate zones with colored bars:
- Zone 1-5 with colors (gray → green → gold → orange → red)
- Show which zone maps to which activity
- "210 BPM avg peak" callout for Haiden

**ABOUT HAIDEN:** Editorial section with `deegan-portrait.jpg`:
- Bio text from brand.ts
- Titles/achievements listed
- "Monster Energy Yamaha Star Racing" team callout

**BENCHMARK:** Preview of the comparison feature:
- Mock comparison: "Your week vs. Haiden's week"
- Show miles, moto hours, gym hours side by side
- "Connect your Garmin or Polar to race the champ"
- Garmin + Polar logos

**FINAL CTA:** Full-width section with `deegan-1.jpg` background:
- "THE REGIMENT IS THE EDGE" headline
- "$19.99/mo · All levels · Cancel anytime"
- Green CTA button

**FOOTER:** Minimal — social links (IG, TikTok, YouTube), legal links, copyright

### 2. Checkout (`/checkout`)
Adapt existing checkout for single subscription:
- Show subscription card with features
- Stripe checkout integration
- No program/tier selection needed — subscription unlocks everything

### 3. Dashboard (`/dashboard`)
After login, the training dashboard:
- **Level selector** at top (Rookie / Pro Am / Factory) — saved to user profile
- **Weekly view** showing today's training with the 3 pillars
- **HR Zone targets** for today's workouts
- **Progress ring** or streak counter
- **Benchmark sidebar**: your weekly totals vs. Haiden's
- **Race calendar** strip showing upcoming race weekends

### 4. Auth Pages
Keep existing auth (Supabase): `/login`, `/signup`, `/reset-password`, `/auth/callback`

### 5. Admin (`/admin`)
Keep existing admin dashboard structure.

### 6. Legal
Update `/terms` and `/privacy` for "Deegan Fitness" entity.

## What to Remove
- All dual-trainer logic (trainerA/trainerB/couples)
- Program purchase flow (no one-time programs)
- VIP subscription tier
- Plans drawer / program selector components
- Any reference to "His & Hers" or "YBF"

## Database Schema Changes
The existing schema has programs/trainers/tiers. We need to adapt for:
- Single subscription model
- Training levels (rookie/pro-am/factory) stored per user
- Weekly activity tracking (future: Garmin/Polar data)
- Benchmark comparison data

For MVP, keep it simple:
- `profiles` table: add `training_level` column (default: 'rookie')
- `subscriptions` table: keep as-is (Stripe subscription tracking)
- Remove program-purchase tables if they exist

## Environment Variables Needed
```
NEXT_PUBLIC_SUPABASE_URL=https://tmziujmbhxgivgsecyrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase dashboard>
SUPABASE_SERVICE_ROLE_KEY=<from supabase dashboard>
STRIPE_SECRET_KEY=<TBD>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<TBD>
STRIPE_WEBHOOK_SECRET=<TBD>
NEXT_PUBLIC_STRIPE_PRICE_SUBSCRIPTION=<TBD>
RESEND_API_KEY=<TBD>
```

## Tech Stack
- Next.js 16 (App Router)
- Tailwind CSS 4
- TypeScript (strict)
- Supabase (auth + DB)
- Stripe (subscriptions)
- Framer Motion (animations)

## Phase 2 (NOT in this build)
- Garmin Connect API OAuth integration
- Polar AccessLink API OAuth integration
- Live benchmark comparison with real watch data
- Community leaderboard
- Push notifications for race-week schedule changes
- Mobile app (React Native / Expo)

## Key Rules
- `quality={100}` on every `<Image>` component
- No hallucinated testimonials — leave placeholder sections if needed
- Responsive: mobile-first, must look great on phone
- Dark theme only — no light mode
- All copy must be verifiable (Haiden's stats, titles, etc.)
- Keep `config/brand.ts` as the single source of truth for all brand strings
