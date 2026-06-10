import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_PASSWORD = 'Alteriux2026!';

const TEST_USERS = [
  {
    email: 'pietro@alteriux.com',
    full_name: 'Pietro Rossi',
    username: 'pietro',
    looking_for: 'team_for_my_project' as const,
    is_admin: false,
  },
  {
    email: 'valerio@alteriux.com',
    full_name: 'Valerio Marzulli',
    username: 'valerio',
    looking_for: 'both' as const,
    is_admin: true,
  },
  {
    email: 'mario@alteriux.com',
    full_name: 'Mario Bianchi',
    username: 'mario',
    looking_for: 'project_to_join' as const,
    is_admin: false,
  },
];

async function seed() {
  for (const user of TEST_USERS) {
    const { email, full_name, username, looking_for, is_admin } = user;

    // Try create, fall back to update if user exists
    let userId: string;

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name, user_name: username },
    });

    if (authError?.message.includes('already been registered')) {
      // User exists — fetch id and reset password
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = list?.users.find((u) => u.email === email);
      if (!existing) { console.error(`Cannot find existing user ${email}`); continue; }
      userId = existing.id;

      const { error: updateErr } = await supabase.auth.admin.updateUserById(userId, {
        password: TEST_PASSWORD,
        email_confirm: true,
      });
      if (updateErr) { console.error(`Failed to reset password for ${email}:`, updateErr.message); continue; }
      console.log(`Reset password: ${email} (${userId})`);
    } else if (authError) {
      console.error(`Failed to create auth user ${email}:`, authError.message);
      continue;
    } else {
      userId = authData!.user.id;
      console.log(`Created auth user: ${email} (${userId})`);
    }

    // Upsert profile
    const { error: profileError, count } = await supabase
      .from('profiles')
      .update({ full_name, username, looking_for, is_admin })
      .eq('id', userId);

    if (profileError) {
      console.error(`Failed to update profile for ${email}:`, profileError.message);
    } else if (count === 0) {
      // Profile not yet created by trigger — insert it
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, full_name, username, looking_for, is_admin });
      if (insertError) console.error(`Failed to insert profile for ${email}:`, insertError.message);
      else console.log(`Profile inserted: ${username} | admin: ${is_admin}`);
    } else {
      console.log(`Profile updated: ${username} | admin: ${is_admin}`);
    }
  }

  console.log(`\nDone. All users password: ${TEST_PASSWORD}`);
}

seed();
