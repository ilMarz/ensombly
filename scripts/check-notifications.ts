import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const { data: notifs } = await supabase
    .from('notifications')
    .select('id, type, title, data, user_id')
    .limit(20);

  console.log('\n=== NOTIFICATIONS ===');
  for (const n of notifs ?? []) {
    const data = n.data as Record<string, string> | null;
    console.log(`[${n.type}] project_id=${data?.project_id ?? 'NULL'} | ${n.title}`);
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title')
    .limit(15);

  console.log('\n=== PROJECTS ===');
  for (const p of projects ?? []) {
    console.log(`${p.id} | ${p.title}`);
  }

  // Cross-check
  const projectIds = new Set(projects?.map(p => p.id) ?? []);
  const brokenNotifs = (notifs ?? []).filter(n => {
    const pid = (n.data as Record<string, string> | null)?.project_id;
    return pid && !projectIds.has(pid);
  });

  console.log('\n=== BROKEN LINKS ===');
  if (brokenNotifs.length === 0) {
    console.log('All notification project_ids match existing projects ✓');
  } else {
    for (const n of brokenNotifs) {
      console.log(`BROKEN: ${n.title} → project_id=${(n.data as Record<string, string>)?.project_id}`);
    }
  }
}

main().catch(console.error);
