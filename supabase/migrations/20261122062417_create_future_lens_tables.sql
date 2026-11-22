/*
# FUTURE LENS: Create user_responses table

1. New Tables
- `user_responses`: Saves each user's 3 selections from the home page.
  - id (uuid, pk)
  - session_id (text, not null) — a browser-generated unique ID to group a user's responses across visits without requiring sign-in
  - studying (text, not null) — what the user is studying now (e.g., "10th", "Inter", "BTech")
  - gender (text, not null) — "Boy", "Girl", or "Prefer not to say"
  - interest (text, not null) — career interest (e.g., "Medical", "Engineering", "Computer")
  - created_at (timestamptz, default now())
2. Security
- Enable RLS on `user_responses`.
- Grant SELECT, INSERT, UPDATE, DELETE to anon + authenticated (no-auth app; data is intentionally shared per session).
- 4 policies per CRUD verb, all USING/WITH CHECK (true) since the app is single-tenant with no sign-in.
3. Notes
- No user_id or auth.users reference — the app does not have sign-in.
- session_id allows future features like recalling a user's saved selections.
*/
CREATE TABLE IF NOT EXISTS user_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  studying text NOT NULL,
  gender text NOT NULL,
  interest text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON user_responses TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_user_responses" ON user_responses;
CREATE POLICY "anon_select_user_responses" ON user_responses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_user_responses" ON user_responses;
CREATE POLICY "anon_insert_user_responses" ON user_responses FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_user_responses" ON user_responses;
CREATE POLICY "anon_update_user_responses" ON user_responses FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_user_responses" ON user_responses;
CREATE POLICY "anon_delete_user_responses" ON user_responses FOR DELETE
  TO anon, authenticated USING (true);
