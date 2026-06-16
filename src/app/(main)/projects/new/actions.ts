"use server";

import { createClient } from "@/lib/supabase/server";
import { checkProjectLimit } from "@/lib/billing/usage";
import type { UserRole } from "@/lib/billing/plans";

export async function createProject(form: {
  title: string;
  tagline: string;
  description: string;
  stage: string;
  sector: string;
  stack: string[];
  website_url: string;
  github_url: string;
}): Promise<{ error: string } | { projectId: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile?.role ?? "user") as UserRole;

  if (role === "founder") {
    const { allowed, limit, used } = await checkProjectLimit(user.id, role);
    if (!allowed) {
      return {
        error: `Plan limit reached: ${used}/${limit} projects this month. Upgrade to publish more.`,
      };
    }
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...form, founder_id: user.id })
    .select()
    .single();

  if (error) return { error: error.message };

  await supabase
    .from("project_members")
    .insert({ project_id: data.id, user_id: user.id, role: "founder" });

  return { projectId: data.id };
}
