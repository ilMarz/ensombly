-- Extend notifications type to include follower_milestone
alter table public.notifications drop constraint notifications_type_check;
alter table public.notifications add constraint notifications_type_check
  check (type in (
    'application_received',
    'application_accepted',
    'application_rejected',
    'investor_interest',
    'follower_milestone'
  ));

-- Trigger: notify founder at follower milestones (5, 10, 25, 50)
create or replace function public.handle_follower_milestone()
returns trigger as $$
declare
  v_count  bigint;
  v_founder_id uuid;
  v_title  text;
begin
  if new.role <> 'follower' then return new; end if;

  select count(*) into v_count
  from public.project_members
  where project_id = new.project_id and role = 'follower';

  if v_count not in (5, 10, 25, 50) then return new; end if;

  select founder_id, title into v_founder_id, v_title
  from public.projects where id = new.project_id;

  insert into public.notifications(user_id, type, title, body, data)
  values (
    v_founder_id,
    'follower_milestone',
    'Your project has ' || v_count || ' followers!',
    v_title || ' reached ' || v_count || ' followers.',
    jsonb_build_object('project_id', new.project_id, 'count', v_count)
  );

  return new;
end;
$$ language plpgsql security definer;

create trigger on_follower_milestone
  after insert on public.project_members
  for each row execute procedure public.handle_follower_milestone();

-- Application templates (per user, owned via RLS)
create table public.application_templates (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        references public.profiles(id) on delete cascade not null,
  title      text        not null,
  body       text        not null,
  created_at timestamptz default now()
);

alter table public.application_templates enable row level security;

create policy "Users manage own templates"
  on public.application_templates for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
