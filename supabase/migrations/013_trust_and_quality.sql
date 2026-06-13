alter table public.profiles
  add column if not exists is_verified boolean not null default false;

alter table public.projects
  add column if not exists is_flagged  boolean not null default false,
  add column if not exists flag_reason text;

-- Any authenticated user can flag a project (set is_flagged = true)
-- Clearing flags and deleting projects is done via service role in admin actions
create policy "Authenticated users can flag projects"
  on public.projects for update
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
