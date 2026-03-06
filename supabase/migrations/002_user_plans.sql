-- Migration: add user_plans table for multi-plan support

CREATE TABLE IF NOT EXISTS user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trainer TEXT NOT NULL CHECK (trainer IN ('mark', 'sommer')),
  tier TEXT NOT NULL CHECK (tier IN ('30', '60', '90')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, trainer, tier)
);

ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'Users can view own plans' AND tablename = 'user_plans') THEN
    CREATE POLICY "Users can view own plans"
      ON user_plans FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'Service role can manage plans' AND tablename = 'user_plans') THEN
    CREATE POLICY "Service role can manage plans"
      ON user_plans FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Backfill existing profiles into user_plans
INSERT INTO user_plans (user_id, trainer, tier, started_at, purchased_at)
SELECT
  id,
  trainer,
  tier,
  COALESCE(started_at, NOW()),
  COALESCE(created_at, NOW())
FROM profiles
WHERE trainer IS NOT NULL AND tier IS NOT NULL
ON CONFLICT (user_id, trainer, tier) DO NOTHING;
