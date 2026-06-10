-- Migration 002 added recursive policies on profiles that cause infinite recursion.
-- The self-referencing EXISTS subquery inside a profiles RLS policy triggers a loop.
-- The original `using (true)` from migration 001 is sufficient.
-- Admin checks in application code use service role (bypasses RLS entirely).

drop policy if exists "Only admins can view admin flag of others" on public.profiles;
drop policy if exists "Nobody can set own admin flag" on public.profiles;
