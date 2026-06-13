alter table public.profiles
  add column if not exists referred_by text;

-- Update handle_new_user trigger to capture referred_by from signup metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username, bio, role, referred_by)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'bio',
    coalesce(new.raw_user_meta_data->>'role', 'user'),
    new.raw_user_meta_data->>'referred_by'
  );
  return new;
end;
$$ language plpgsql security definer;
