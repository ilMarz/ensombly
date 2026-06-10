alter table public.profiles
  add column if not exists role text not null default 'user'
  check (role in ('user', 'founder', 'investor'));

update public.profiles set role = 'founder' where username in ('pietro', 'mario');
update public.profiles set role = 'investor' where username = 'giuseppe';
