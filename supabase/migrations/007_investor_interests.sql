-- Investor interest submissions
create table public.investor_interests (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  investor_id uuid references public.profiles(id) on delete cascade not null,
  contact_info text not null,
  message text,
  created_at timestamptz default now(),
  unique(project_id, investor_id)
);

alter table public.investor_interests enable row level security;

create policy "Investors can submit interest" on public.investor_interests
  for insert with check (auth.uid() = investor_id);

create policy "Investors can view own interests" on public.investor_interests
  for select using (auth.uid() = investor_id);

create policy "Founders can view interests for their projects" on public.investor_interests
  for select using (
    auth.uid() = (select founder_id from public.projects where id = project_id)
  );

-- Extend notifications type constraint to include investor_interest
alter table public.notifications
  drop constraint notifications_type_check;

alter table public.notifications
  add constraint notifications_type_check
  check (type in ('application_received', 'application_accepted', 'application_rejected', 'investor_interest'));

-- Trigger: notify founder when investor expresses interest
create or replace function public.handle_new_investor_interest()
returns trigger as $$
declare
  v_founder_id uuid;
  v_investor_name text;
  v_project_title text;
begin
  select p.founder_id, p.title into v_founder_id, v_project_title
  from public.projects p where p.id = new.project_id;

  select coalesce(full_name, username) into v_investor_name
  from public.profiles where id = new.investor_id;

  insert into public.notifications (user_id, type, title, body, data)
  values (
    v_founder_id,
    'investor_interest',
    v_investor_name || ' is interested in investing',
    'New investor interest for ' || v_project_title,
    jsonb_build_object('project_id', new.project_id, 'investor_id', new.investor_id)
  );

  return new;
end;
$$ language plpgsql security definer;

create trigger on_investor_interest_created
  after insert on public.investor_interests
  for each row execute procedure public.handle_new_investor_interest();
