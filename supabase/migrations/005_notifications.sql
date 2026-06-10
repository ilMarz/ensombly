create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('application_received', 'application_accepted', 'application_rejected')),
  title text not null,
  body text,
  data jsonb default '{}' not null,
  read boolean default false not null,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "Users view own notifications" on public.notifications
  for select using (auth.uid() = user_id);

create policy "Users mark own notifications read" on public.notifications
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Notify founder when someone applies
create or replace function public.handle_new_application()
returns trigger as $$
declare
  v_founder_id uuid;
  v_applicant_name text;
  v_project_title text;
  v_role_title text;
  v_project_id uuid;
begin
  select p.founder_id, p.id, p.title, pr.title
  into v_founder_id, v_project_id, v_project_title, v_role_title
  from public.project_roles pr
  join public.projects p on p.id = pr.project_id
  where pr.id = new.project_role_id;

  if v_founder_id = new.applicant_id then return new; end if;

  select coalesce(full_name, username) into v_applicant_name
  from public.profiles where id = new.applicant_id;

  insert into public.notifications (user_id, type, title, body, data)
  values (
    v_founder_id,
    'application_received',
    v_applicant_name || ' applied to ' || v_role_title,
    'New application for ' || v_project_title,
    jsonb_build_object('application_id', new.id, 'project_id', v_project_id)
  );

  return new;
end;
$$ language plpgsql security definer;

create trigger on_application_created
  after insert on public.applications
  for each row execute procedure public.handle_new_application();

-- Notify applicant when founder accepts or rejects
create or replace function public.handle_application_status_change()
returns trigger as $$
declare
  v_project_title text;
  v_role_title text;
  v_project_id uuid;
begin
  if new.status = old.status then return new; end if;
  if new.status not in ('accepted', 'rejected') then return new; end if;

  select p.id, p.title, pr.title
  into v_project_id, v_project_title, v_role_title
  from public.project_roles pr
  join public.projects p on p.id = pr.project_id
  where pr.id = new.project_role_id;

  insert into public.notifications (user_id, type, title, body, data)
  values (
    new.applicant_id,
    'application_' || new.status,
    case new.status
      when 'accepted' then 'Application accepted!'
      when 'rejected' then 'Application not selected'
    end,
    case new.status
      when 'accepted' then 'You have been accepted for ' || v_role_title || ' at ' || v_project_title
      when 'rejected' then 'Your application for ' || v_role_title || ' at ' || v_project_title || ' was not selected'
    end,
    jsonb_build_object('application_id', new.id, 'project_id', v_project_id)
  );

  return new;
end;
$$ language plpgsql security definer;

create trigger on_application_status_changed
  after update on public.applications
  for each row execute procedure public.handle_application_status_change();

-- Backfill notifications for existing applications
do $$
declare
  app record;
  v_founder_id uuid;
  v_applicant_name text;
  v_project_title text;
  v_role_title text;
  v_project_id uuid;
begin
  for app in select * from public.applications order by created_at loop
    select p.founder_id, p.id, p.title, pr.title
    into v_founder_id, v_project_id, v_project_title, v_role_title
    from public.project_roles pr
    join public.projects p on p.id = pr.project_id
    where pr.id = app.project_role_id;

    select coalesce(full_name, username) into v_applicant_name
    from public.profiles where id = app.applicant_id;

    if v_founder_id != app.applicant_id then
      insert into public.notifications (user_id, type, title, body, data, created_at)
      values (
        v_founder_id,
        'application_received',
        v_applicant_name || ' applied to ' || v_role_title,
        'New application for ' || v_project_title,
        jsonb_build_object('application_id', app.id, 'project_id', v_project_id),
        app.created_at
      );
    end if;

    if app.status in ('accepted', 'rejected') then
      insert into public.notifications (user_id, type, title, body, data, created_at)
      values (
        app.applicant_id,
        'application_' || app.status,
        case app.status
          when 'accepted' then 'Application accepted!'
          when 'rejected' then 'Application not selected'
        end,
        case app.status
          when 'accepted' then 'You have been accepted for ' || v_role_title || ' at ' || v_project_title
          when 'rejected' then 'Your application for ' || v_role_title || ' at ' || v_project_title || ' was not selected'
        end,
        jsonb_build_object('application_id', app.id, 'project_id', v_project_id),
        app.created_at
      );
    end if;
  end loop;
end;
$$;
