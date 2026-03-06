-- Migration 006: admin_credentials table

CREATE TABLE IF NOT EXISTS admin_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'Service role only' AND tablename = 'admin_credentials') THEN
    CREATE POLICY "Service role only"
      ON admin_credentials FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Insert admin user (password hashed with SHA-256)
INSERT INTO admin_credentials (username, password_hash)
VALUES ('hnh_admin', 'b6175a764c2bff40c01fc2dcbd01be0ec6d0546fa7d31ced3156513b1b8e98da')
ON CONFLICT (username) DO UPDATE
  SET password_hash = EXCLUDED.password_hash,
      created_at = NOW();
