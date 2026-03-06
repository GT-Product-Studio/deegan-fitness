-- HisAndHersFitness — Full production schema
-- Last updated: 2026-02-22
-- Run against a fresh Supabase project or use as reference.

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  full_name text,
  trainer text,
  tier text,
  started_at timestamptz,
  stripe_session_id text,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- WORKOUTS
-- ============================================================
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer text NOT NULL,
  tier text NOT NULL,
  day_number integer NOT NULL,
  title text,
  description text,
  UNIQUE (trainer, tier, day_number)
);

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read workouts"
  ON workouts FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- EXERCISES
-- ============================================================
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES workouts ON DELETE CASCADE,
  name text NOT NULL,
  sets text,
  reps text,
  notes text,
  video_url text,
  order_index integer DEFAULT 0
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  workout_id uuid NOT NULL REFERENCES workouts ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  UNIQUE (user_id, workout_id)
);

ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON progress FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- USER_PLANS (one-time purchases)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  trainer text NOT NULL,
  tier text NOT NULL,
  started_at timestamptz,
  purchased_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, trainer, tier)
);

ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plans"
  ON user_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans"
  ON user_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SUBSCRIPTIONS (monthly / VIP)
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  plan_type text NOT NULL,
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  status text DEFAULT 'active',
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- ADMIN_CREDENTIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_credentials (
  id serial PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;
-- No RLS policies — admin table is only accessed via service role key

-- ============================================================
-- WAITLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
-- No RLS policies — waitlist is only accessed via service role key (API route)
