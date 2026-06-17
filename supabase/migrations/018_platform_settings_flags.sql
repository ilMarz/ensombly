alter table public.platform_settings
  add column if not exists beta_mode boolean not null default false,
  add column if not exists disable_sub boolean not null default false;
