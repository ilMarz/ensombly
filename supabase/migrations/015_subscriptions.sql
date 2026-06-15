create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  ls_subscription_id text unique,
  ls_customer_id text,
  variant_id text,
  status text check (status in ('on_trial', 'active', 'paused', 'past_due', 'unpaid', 'cancelled', 'expired')) not null default 'active',
  plan text check (plan in ('free', 'gold', 'platinum')) not null default 'free',
  renews_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);
