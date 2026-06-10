import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function GET() {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, username, is_admin")
    .in("username", ["valerio", "pietro", "mario"]);

  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const relevantEmails = ["valerio@alteriux.com", "pietro@alteriux.com", "mario@alteriux.com"];
  const filteredUsers = authUsers?.users
    .filter((u) => relevantEmails.includes(u.email ?? ""))
    .map((u) => ({ id: u.id, email: u.email }));

  return Response.json({ profiles, filteredUsers, error });
}
