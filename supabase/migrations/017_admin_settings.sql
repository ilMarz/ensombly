-- Platform settings (single row)
create table if not exists public.platform_settings (
  id boolean primary key default true check (id),
  notification_email text,
  updated_at timestamptz default now()
);

insert into public.platform_settings (id) values (true) on conflict do nothing;

alter table public.platform_settings enable row level security;
create policy "Only admins can read settings" on public.platform_settings
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
create policy "Only admins can update settings" on public.platform_settings
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Admin invitations
create table if not exists public.admin_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token uuid not null default gen_random_uuid(),
  invited_by uuid references public.profiles(id) on delete set null,
  used_at timestamptz,
  expires_at timestamptz not null default (now() + interval '48 hours'),
  created_at timestamptz default now()
);

alter table public.admin_invitations enable row level security;
create policy "Only admins can manage invitations" on public.admin_invitations
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
