-- Optional GitHub repo metadata captured when a founder connects a repo via OAuth.
-- github_url already exists (migration 001). All nullable so the manual-paste flow still works.
-- RLS: existing "Founders can update own projects" UPDATE policy (using auth.uid() = founder_id)
-- already governs these new columns, so no new policy is needed.

alter table public.projects
  add column if not exists github_repo_full_name text,
  add column if not exists github_stars int,
  add column if not exists github_description text,
  add column if not exists github_default_branch text,
  add column if not exists github_connected_at timestamptz;

comment on column public.projects.github_repo_full_name is 'owner/name of the connected GitHub repo';
comment on column public.projects.github_stars is 'star count at time of connection';
comment on column public.projects.github_connected_at is 'when the founder linked the repo via OAuth';
