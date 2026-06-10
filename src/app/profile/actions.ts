"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const full_name = (formData.get("full_name") as string).trim() || null;
  const username = (formData.get("username") as string).trim();
  const bio = (formData.get("bio") as string).trim() || null;
  const github_url = (formData.get("github_url") as string).trim() || null;
  const linkedin_url = (formData.get("linkedin_url") as string).trim() || null;
  const website_url = (formData.get("website_url") as string).trim() || null;
  const availability_hours = parseInt(formData.get("availability_hours") as string) || 0;
  const looking_for = (formData.get("looking_for") as string) as "project_to_join" | "team_for_my_project" | "both";
  const skills = ((formData.get("skills") as string) ?? "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const role = (formData.get("role") as string) as "user" | "founder" | "investor";

  if (!username) return { error: "Username is required" };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, username, bio, github_url, linkedin_url, website_url, availability_hours, looking_for, skills, role, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/profile");
  return { success: true };
}
