alter table public.projects
  add column if not exists archived_at timestamptz;

create table public.project_updates (
  id         uuid        default gen_random_uuid() primary key,
  project_id uuid        references public.projects(id) on delete cascade not null,
  author_id  uuid        references public.profiles(id) on delete cascade not null,
  title      text        not null,
  body       text,
  created_at timestamptz default now()
);

alter table public.project_updates enable row level security;

create policy "Project updates viewable by everyone"
  on public.project_updates for select using (true);

create policy "Founders can post project updates"
  on public.project_updates for insert
  with check (
    auth.uid() = author_id
    and auth.uid() = (select founder_id from public.projects where id = project_id)
  );

create policy "Founders can delete project updates"
  on public.project_updates for delete
  using (
    auth.uid() = (select founder_id from public.projects where id = project_id)
  );
