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

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name, user_name: username },
    });

    if (authError) {
      console.error(`Failed to create auth user ${email}:`, authError.message);
      continue;
    }

    const userId = authData.user.id;
    console.log(`Created auth user: ${email} (${userId})`);

    // Update profile (auto-created by trigger)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name, username, looking_for, is_admin })
      .eq('id', userId);

    if (profileError) {
      console.error(`Failed to update profile for ${email}:`, profileError.message);
    } else {
      console.log(`Profile updated: ${username} | admin: ${is_admin}`);
    }
  }

  console.log(`\nDone. All users password: ${TEST_PASSWORD}`);
}

seed();
