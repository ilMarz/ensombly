import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('id, username, is_admin')
    .in('username', ['valerio', 'pietro', 'mario']);

  console.log('Profiles:', JSON.stringify(profiles, null, 2));
  if (pErr) console.error('Profile error:', pErr.message);

  const { data: authData } = await supabase.auth.admin.listUsers();
  const relevant = authData?.users.filter(u =>
    ['valerio@alteriux.com', 'pietro@alteriux.com', 'mario@alteriux.com'].includes(u.email ?? '')
  ).map(u => ({ id: u.id, email: u.email }));

  console.log('Auth users:', JSON.stringify(relevant, null, 2));
}

main();
