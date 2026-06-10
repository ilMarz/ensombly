-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  full_name text,
  bio text,
  avatar_url text,
  skills text[] default '{}',
  interests text[] default '{}',
  availability_hours int default 0,
  looking_for text check (looking_for in ('project_to_join', 'team_for_my_project', 'both')) default 'both',
  github_url text,
  linkedin_url text,
  website_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Projects
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  founder_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  tagline text,
  description text,
  stage text check (stage in ('idea', 'prototype', 'mvp', 'growth')) default 'idea',
  sector text,
  stack text[] default '{}',
  looking_for_roles boolean default true,
  looking_for_investors boolean default true,
  website_url text,
  github_url text,
  cover_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Roles that projects are looking for
create table public.project_roles (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  description text,
  skills text[] default '{}',
  commitment_hours int,
  compensation_type text check (compensation_type in ('equity', 'revenue_share', 'voluntary', 'paid')) default 'voluntary',
  is_open boolean default true,
  created_at timestamptz default now()
);

-- Project members (founder, collaborator, investor, follower)
create table public.project_members (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text check (role in ('founder', 'collaborator', 'investor', 'follower')) not null,
  joined_at timestamptz default now(),
  unique(project_id, user_id)
);

-- Applications to project roles
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  project_role_id uuid references public.project_roles(id) on delete cascade not null,
  applicant_id uuid references public.profiles(id) on delete cascade not null,
  message text,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(project_role_id, applicant_id)
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_roles enable row level security;
alter table public.project_members enable row level security;
alter table public.applications enable row level security;

-- Profiles: public read, own write
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Projects: public read, founder write
create policy "Projects are viewable by everyone" on public.projects for select using (true);
create policy "Authenticated users can create projects" on public.projects for insert with check (auth.uid() = founder_id);
create policy "Founders can update own projects" on public.projects for update using (auth.uid() = founder_id);
create policy "Founders can delete own projects" on public.projects for delete using (auth.uid() = founder_id);

-- Project roles: public read, founder write
create policy "Roles are viewable by everyone" on public.project_roles for select using (true);
create policy "Founders can manage roles" on public.project_roles for all using (
  auth.uid() = (select founder_id from public.projects where id = project_id)
);

-- Project members: public read, controlled insert
create policy "Members are viewable by everyone" on public.project_members for select using (true);
create policy "Users can follow/join projects" on public.project_members for insert with check (auth.uid() = user_id);
create policy "Users can leave projects" on public.project_members for delete using (auth.uid() = user_id);

-- Applications: applicant and founder can read, applicant can create
create policy "Applicants can view own applications" on public.applications for select using (
  auth.uid() = applicant_id or
  auth.uid() = (select p.founder_id from public.projects p join public.project_roles pr on pr.project_id = p.id where pr.id = project_role_id)
);
create policy "Authenticated users can apply" on public.applications for insert with check (auth.uid() = applicant_id);
create policy "Founders can update application status" on public.applications for update using (
  auth.uid() = (select p.founder_id from public.projects p join public.project_roles pr on pr.project_id = p.id where pr.id = project_role_id)
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
