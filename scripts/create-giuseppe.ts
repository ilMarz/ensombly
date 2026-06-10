import { createClient } from '@supabase/supabase-js';

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { autoRefreshToken: false, persistSession: false } });

async function main() {
  const { data: authUser, error: authError } = await s.auth.admin.createUser({
    email: 'giuseppe@alteriux.com',
    password: 'Alteriux2026!',
    email_confirm: true,
    user_metadata: { full_name: 'Giuseppe Verdi' },
  });

  if (authError) { console.error('Auth error:', authError.message); return; }
  console.log('Auth user created:', authUser.user.id);

  const { error: profileError } = await s.from('profiles').upsert({
    id: authUser.user.id,
    username: 'giuseppe',
    full_name: 'Giuseppe Verdi',
    looking_for: 'project_to_join',
    bio: 'Angel investor and startup enthusiast.',
  });

  if (profileError) { console.error('Profile error:', profileError.message); return; }
  console.log('Done — giuseppe@alteriux.com / Alteriux2026!');
}

main().catch(console.error);
