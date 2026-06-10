alter table public.profiles add column if not exists is_admin boolean default false not null;

-- Solo admin può leggere il flag altrui
create policy "Only admins can view admin flag of others" on public.profiles
  for select using (
    auth.uid() = id or
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Nessuno può auto-promuoversi admin via API
create policy "Nobody can set own admin flag" on public.profiles
  for update using (auth.uid() = id)
  with check (
    is_admin = (select is_admin from public.profiles where id = auth.uid())
  );
