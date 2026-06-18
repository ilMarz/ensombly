import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const ADMIN_EMAIL = 'marzullivalerio@gmail.com';
const ADMIN_PASSWORD = 'Ensombly2026!';

async function seed() {
  let userId: string;

  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'Valerio Marzulli', user_name: 'valerio' },
  });

  if (error?.message.includes('already been registered')) {
    const { data: list } = await supabase.auth.admin.listUsers();
    const existing = list?.users.find((u) => u.email === ADMIN_EMAIL);
    if (!existing) { console.error('User not found'); process.exit(1); }
    userId = existing.id;
    console.log(`User exists: ${ADMIN_EMAIL} (${userId})`);
  } else if (error) {
    console.error('Failed to create auth user:', error.message);
    process.exit(1);
  } else {
    userId = data!.user.id;
    console.log(`Created auth user: ${ADMIN_EMAIL} (${userId})`);
  }

  const { error: profileError, count } = await supabase
    .from('profiles')
    .update({ full_name: 'Valerio Marzulli', username: 'valerio', is_admin: true, role: 'founder' })
    .eq('id', userId);

  if (profileError) {
    console.error('Failed to update profile:', profileError.message);
    process.exit(1);
  }

  if (count === 0) {
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({ id: userId, full_name: 'Valerio Marzulli', username: 'valerio', is_admin: true, role: 'founder' });
    if (insertError) { console.error('Failed to insert profile:', insertError.message); process.exit(1); }
    console.log('Profile inserted: valerio | admin: true');
  } else {
    console.log('Profile updated: valerio | admin: true');
  }

  console.log(`\nDone. Password: ${ADMIN_PASSWORD}`);
}

seed();
