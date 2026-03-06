# Agent Task: Deegan Fitness — Polish & Feature Completion

## Overview
Multiple improvements to the Deegan Fitness app. Work through each task in order.
After ALL tasks, run `npx next build` and fix any errors. Commit with a descriptive message.

**CRITICAL RULES:**
- Primary color is `#29F000` (BRAAP neon green), dark variant `#22D400`
- Use Tailwind classes from globals.css (e.g., `text-primary`, `bg-primary`, `text-muted`, `bg-card`, etc.)
- `quality={100}` on all Next.js Image components
- No shadcn/ui — hand-styled Tailwind only
- Mobile-first (max-w-lg mx-auto is the standard in dashboard layout)
- All brand strings from `config/brand.ts` — never inline brand text
- Font: Oswald for headings (font-display class), Inter for body

---

## Task 1: Exercise Block Grouping on Day Pages

The `/dashboard/day/[day]/exercise-list.tsx` currently shows exercises as a flat list. The DB has a `block` column on exercises with values: `cycling`, `moto`, `gym`, `recovery`, `race`.

**Changes needed:**

### `app/dashboard/day/[day]/exercise-list.tsx`
- Add `block` and `hr_zone` to the Exercise interface
- Group exercises by `block` before rendering
- Render each block as a section with a header:
  - 🚴 **Road Ride** (cycling) — green accent
  - 🏍️ **Moto Practice** (moto) — orange accent  
  - 🏋️ **Gym Session** (gym) — gold accent
  - 🧘 **Recovery** (recovery) — gray accent
  - 🏁 **Race Day** (race) — red accent
- Show HR zone badge on exercises that have `hr_zone` set (e.g., "Zone 2" in the appropriate zone color from brand.ts HR_ZONES)
- Keep the exercise card click → modal behavior

### `app/dashboard/day/[day]/exercise-modal.tsx`
- Add `block` and `hr_zone` to the Exercise interface
- Show the block name above the exercise name (small colored label)
- If `hr_zone` exists, show a colored HR zone indicator bar

---

## Task 2: Day Navigation (Prev/Next)

On `/dashboard/day/[day]/page.tsx`, add Previous Day / Next Day navigation buttons:
- At the top (below back link) and/or bottom of the page
- Prev disabled on Day 1, Next disabled on Day 30
- Style: subtle border buttons with arrows, BRAAP green for active state
- Use `<Link>` to `/dashboard/day/{n}` (no client fetch needed)

Also on the dashboard page, make the weekly calendar days clickable:
- In `app/dashboard/page.tsx`, the "This Week" section shows M/T/W/T/F/S/S
- Make each day link to its workout page. Calculate which day_number each weekday maps to based on the user's start date (or just use today = day_number based on day of month, cycling 1-30).
- Simple approach: use `(dayOfMonth % 30) + 1` or `dayOfMonth` clamped to 1-30

---

## Task 3: OG Image

The current OG image is `deegan-hero-poster.jpg` which is 720x1280 (portrait). OG images should be 1200x630 (landscape).

- Use `sips` (macOS) to crop/resize `public/images/deegan/deegan-sx-11.jpg` (2000x1333) to 1200x630 and save as `public/images/og-image.jpg`
  - Command: `sips --resampleWidth 1200 --cropToHeightWidth 630 1200 public/images/deegan/deegan-sx-11.jpg --out public/images/og-image.jpg`
  - If sips doesn't work, use ffmpeg: `ffmpeg -i public/images/deegan/deegan-sx-11.jpg -vf "scale=1200:-1,crop=1200:630" public/images/og-image.jpg`
- Update `app/layout.tsx` to reference `/images/og-image.jpg` instead of `/images/deegan/deegan-hero-poster.jpg` in both openGraph and twitter metadata

---

## Task 4: Supabase Auth Email Redirect

Create/update `app/auth/confirm/route.ts` to handle email confirmation redirects from Supabase:

```typescript
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
```

Also create `app/auth/callback/route.ts` for OAuth/magic link callbacks:

```typescript
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
```

---

## Task 5: Password Reset Page

Check if `app/reset-password/page.tsx` exists and works. It should:
- Show two password fields (new password + confirm)
- Call `supabase.auth.updateUser({ password })` on submit
- Redirect to `/dashboard` on success
- Show errors on failure
- Dark theme, match the login page style

If it already exists and looks correct, skip this. If it's a placeholder, replace it.

---

## Task 6: Landing Page Content Sections

The landing page (`app/page.tsx`) has a hero + stats but the middle sections appear empty/dark. Review the page and ensure these sections render properly:

1. **Program Section** — show what "The Regiment" includes (cycling/moto/gym daily breakdown)
2. **About Section** — Haiden's bio, achievements, why this program
3. **CTA Section** — final call-to-action with subscribe button

Each section should use the high-res SX photos. Check if the sections exist but images aren't loading, or if they're actually missing.

Background images should use:
- `deegan-sx-9.jpg` for about section
- `deegan-sx-6.jpg` for CTA section
- Program cards: `deegan-sx-7.jpg`, `deegan-sx-12.jpg`, `deegan-sx-3.jpg`

Make sure these sections have enough contrast (dark overlay on images) and the text is readable.

---

## Task 7: Dashboard Day Links

The main dashboard currently shows day-of-week labels but doesn't link to workout pages. Add a "Today's Workout" card that links to the current day:

In `app/dashboard/page.tsx`:
- Below "Today's Schedule" card, add a "View Today's Workout →" button linking to `/dashboard/day/{dayNumber}`
- Calculate dayNumber: use day of month clamped 1-30 (simple approach)
- Style: full-width primary green button

---

## Task 8: 30-Day Program Overview Page

Create `app/dashboard/program/page.tsx` — a scrollable list of all 30 days:
- Fetch all workouts + user's progress (completed days)
- Each day = a card showing: day number, title, day_type badge, completed checkmark if done
- Click → navigate to `/dashboard/day/{n}`
- Completed days have a green checkmark
- Current day highlighted
- Group by weeks (Week 1: Foundation, Week 2: Build, Week 3: Intensity, Week 4: Peak & Taper)

Add navigation to this page in the dashboard header (`app/dashboard/layout.tsx`):
- Add a Calendar/List icon link between the logo and the Trophy icon
- Route: `/dashboard/program`

---

## File Reference

Key files to check/edit:
- `config/brand.ts` — all brand config, HR zones, week schedule, regiment stats
- `app/globals.css` — Tailwind theme (colors defined as CSS vars)
- `app/layout.tsx` — root metadata (OG tags here)
- `app/page.tsx` — landing page
- `app/dashboard/page.tsx` — main dashboard
- `app/dashboard/layout.tsx` — dashboard nav header
- `app/dashboard/day/[day]/` — day detail pages
- `app/dashboard/challenge/page.tsx` — challenge system

## Verification
After all tasks, run:
```
npx next build
```
Fix ANY build errors before committing. Zero errors required.
