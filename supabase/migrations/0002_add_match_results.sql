-- Cached results for the candidate "Matches" feature: computed once when
-- the candidate requests it (a single batched Gemini call scored against
-- every currently published job), then reused on future visits instead of
-- recomputing on every page load. No new table needed — RLS already
-- protects profiles via the existing "update own profile" policy.

alter table public.profiles
  add column resume_match_results jsonb,
  add column resume_match_computed_at timestamptz;
