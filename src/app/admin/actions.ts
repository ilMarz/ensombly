"use server";

import { createClient as createSupabase } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";

function serviceClient() {
  return createSupabase<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function toggleVerified(userId: string, verified: boolean) {
  await requireAdmin();
  const supabase = serviceClient();
  await supabase.from("profiles").update({ is_verified: verified }).eq("id", userId);
  revalidatePath("/admin");
}

export async function clearProjectFlag(projectId: string) {
  await requireAdmin();
  const supabase = serviceClient();
  await supabase.from("projects").update({ is_flagged: false, flag_reason: null }).eq("id", projectId);
  revalidatePath("/admin");
}

export async function deleteProject(projectId: string) {
  await requireAdmin();
  const supabase = serviceClient();
  await supabase.from("projects").delete().eq("id", projectId);
  revalidatePath("/admin");
}
