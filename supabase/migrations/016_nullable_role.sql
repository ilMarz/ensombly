-- Allow role to be NULL for OAuth users who haven't completed onboarding yet
alter table public.profiles
  alter column role drop not null,
  alter column role drop default;

-- Update trigger: no longer default role to 'user' — OAuth users get NULL until onboarding
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username, bio, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'bio',
    new.raw_user_meta_data->>'role'
  );
  return new;
end;
$$ language plpgsql security definer;
