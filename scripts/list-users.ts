import { createClient } from '@supabase/supabase-js';

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { autoRefreshToken: false, persistSession: false } });

async function main() {
  const [{ data: profiles }, { data: members }, { data: authUsers }] = await Promise.all([
    s.from('profiles').select('id, username, full_name, is_admin'),
    s.from('project_members').select('user_id, role, projects(title)'),
    s.auth.admin.listUsers(),
  ]);

  console.log('\n=== USERS ===');
  for (const p of profiles ?? []) {
    const email = authUsers?.users?.find(u => u.id === p.id)?.email ?? '?';
    const roles = (members ?? []).filter(m => m.user_id === p.id).map(m => `${(m.projects as unknown as {title:string}|null)?.title}:${m.role}`);
    console.log(`[${p.is_admin ? 'ADMIN' : 'user '}] ${p.full_name ?? p.username} (@${p.username}) — ${email}`);
    if (roles.length) console.log(`         ${roles.join(', ')}`);
  }
}

main().catch(console.error);
