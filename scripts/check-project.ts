import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const TARGET_ID = 'c499b6f8-516a-433b-956e-7f9741b473d3';

async function main() {
  const { data: project, error } = await supabase
    .from('projects')
    .select('id, title, founder_id')
    .eq('id', TARGET_ID)
    .single();

  if (error) {
    console.log('ERROR:', error.message, error.code);
  } else {
    console.log('PROJECT FOUND:', project);
  }

  // Also check all notifications for pietro
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('username', 'pietro');

  const pietroId = profiles?.[0]?.id;
  console.log('\nPietro profile:', profiles?.[0]);

  if (pietroId) {
    const { data: notifs } = await supabase
      .from('notifications')
      .select('id, type, title, data')
      .eq('user_id', pietroId)
      .limit(10);

    console.log('\nPietro notifications:');
    for (const n of notifs ?? []) {
      const d = n.data as Record<string, string> | null;
      console.log(`  [${n.type}] project_id=${d?.project_id} | ${n.title}`);
    }
  }
}

main().catch(console.error);
