do $$
declare
  v_user_id uuid;
begin
  select id into v_user_id from auth.users where email = 'valerio@alterio.com';

  if v_user_id is null then
    raise exception 'User valerio@alterio.com not found in auth.users';
  end if;

  insert into public.profiles (id, username, full_name, is_admin, looking_for)
  values (v_user_id, 'valerio', 'Valerio Marzulli', true, 'both')
  on conflict (id) do update set is_admin = true;

  raise notice 'Admin set for user %', v_user_id;
end;
$$;
