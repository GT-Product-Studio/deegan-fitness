-- Deegan Fitness — Production Schema
-- Single regiment (no tiers), monthly challenge system
-- Last updated: 2026-03-06

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  started_at timestamptz,
  stripe_session_id text,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- WORKOUTS (30-day regiment, no tiers)
-- ============================================================
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number integer NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  day_type text NOT NULL DEFAULT 'training', -- training, travel, race, recovery
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read workouts" ON workouts FOR SELECT TO authenticated USING (true);

-- ============================================================
-- EXERCISES
-- ============================================================
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES workouts ON DELETE CASCADE,
  block text NOT NULL, -- 'cycling', 'moto', 'gym', 'recovery', 'race'
  name text NOT NULL,
  sets text,
  reps text,
  duration text,
  notes text,
  hr_zone text, -- e.g. 'Z2', 'Z3-Z4', 'Z5'
  video_url text,
  order_index integer DEFAULT 0
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read exercises" ON exercises FOR SELECT TO authenticated USING (true);

-- ============================================================
-- PROGRESS (workout completion tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  workout_id uuid NOT NULL REFERENCES workouts ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  UNIQUE (user_id, workout_id)
);

ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON progress FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  plan_type text NOT NULL DEFAULT 'regiment',
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  status text DEFAULT 'active',
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- CHALLENGES (monthly)
-- ============================================================
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month integer NOT NULL CHECK (month BETWEEN 1 AND 12),
  year integer NOT NULL,
  title text NOT NULL,
  description text,
  -- Haiden's monthly benchmarks (based on ~13 training days/month)
  benchmark_cycling_miles numeric NOT NULL DEFAULT 650,
  benchmark_moto_hours numeric NOT NULL DEFAULT 26,
  benchmark_gym_hours numeric NOT NULL DEFAULT 19.5,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE (month, year)
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read challenges" ON challenges FOR SELECT TO authenticated USING (true);

-- ============================================================
-- ACTIVITY LOGS (manual or wearable-synced)
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  challenge_id uuid REFERENCES challenges ON DELETE SET NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('cycling', 'moto', 'gym')),
  value numeric NOT NULL, -- miles for cycling, hours for moto/gym
  date date NOT NULL,
  source text DEFAULT 'manual', -- 'manual', 'garmin', 'polar'
  hr_avg integer,
  hr_max integer,
  hr_zone_minutes jsonb, -- {"z1": 5, "z2": 30, "z3": 20, "z4": 10, "z5": 2}
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activities" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activities" ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activities" ON activity_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own activities" ON activity_logs FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- CHALLENGE LEADERBOARD (materialized view)
-- ============================================================
CREATE OR REPLACE VIEW challenge_leaderboard AS
SELECT
  c.id AS challenge_id,
  c.month,
  c.year,
  c.title AS challenge_title,
  al.user_id,
  p.full_name,
  p.avatar_url,
  COALESCE(SUM(CASE WHEN al.activity_type = 'cycling' THEN al.value ELSE 0 END), 0) AS total_cycling_miles,
  COALESCE(SUM(CASE WHEN al.activity_type = 'moto' THEN al.value ELSE 0 END), 0) AS total_moto_hours,
  COALESCE(SUM(CASE WHEN al.activity_type = 'gym' THEN al.value ELSE 0 END), 0) AS total_gym_hours,
  -- Composite score: cycling miles + moto hours×25 + gym hours×20
  ROUND(
    COALESCE(SUM(CASE WHEN al.activity_type = 'cycling' THEN al.value ELSE 0 END), 0) +
    COALESCE(SUM(CASE WHEN al.activity_type = 'moto' THEN al.value ELSE 0 END), 0) * 25 +
    COALESCE(SUM(CASE WHEN al.activity_type = 'gym' THEN al.value ELSE 0 END), 0) * 20,
    1
  ) AS total_score,
  COUNT(DISTINCT al.date) AS active_days
FROM challenges c
JOIN activity_logs al ON al.challenge_id = c.id
JOIN profiles p ON p.id = al.user_id
GROUP BY c.id, c.month, c.year, c.title, al.user_id, p.full_name, p.avatar_url
ORDER BY total_score DESC;

-- ============================================================
-- ADMIN CREDENTIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_credentials (
  id serial PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- WAITLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS: Leaderboard readable by authenticated users
-- ============================================================
-- Views inherit from base table policies, but we need activity_logs
-- to be readable for the leaderboard. Add a read policy for leaderboard:
CREATE POLICY "Authenticated can read all activities for leaderboard"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (true);

-- Drop the user-only select policy since the leaderboard one is broader
DROP POLICY IF EXISTS "Users can view own activities" ON activity_logs;
