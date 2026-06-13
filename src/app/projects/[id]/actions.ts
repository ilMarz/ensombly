"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addProjectRole(
  projectId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: project } = await supabase
    .from("projects").select("founder_id").eq("id", projectId).single();
  if (project?.founder_id !== user.id) return { error: "Forbidden" };

  const title = (formData.get("title") as string).trim();
  if (!title) return { error: "Title is required" };

  const skills = ((formData.get("skills") as string) ?? "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const commitment_hours = parseInt(formData.get("commitment_hours") as string) || null;
  const compensation_type = (formData.get("compensation_type") as string) || null;
  const description = (formData.get("description") as string).trim() || null;

  const { error } = await supabase.from("project_roles").insert({
    project_id: projectId,
    title,
    description,
    skills,
    commitment_hours,
    compensation_type,
    is_open: true,
  });

  if (error) return { error: error.message };
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function submitInvestorInterest(
  projectId: string,
  contactInfo: string,
  message: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("investor_interests")
    .insert({ project_id: projectId, investor_id: user.id, contact_info: contactInfo, message: message || null });

  if (error) return { error: error.message };
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function connectGithubRepo(
  projectId: string,
  repo: {
    full_name: string;
    html_url: string;
    stargazers_count: number;
    description: string | null;
    default_branch: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: project } = await supabase
    .from("projects").select("founder_id").eq("id", projectId).single();
  if (project?.founder_id !== user.id) return { error: "Forbidden" };

  if (!repo.html_url.startsWith("https://github.com/")) {
    return { error: "Invalid repository URL" };
  }

  const { error } = await supabase
    .from("projects")
    .update({
      github_url: repo.html_url,
      github_repo_full_name: repo.full_name,
      github_stars: repo.stargazers_count,
      github_description: repo.description,
      github_default_branch: repo.default_branch,
      github_connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId);

  if (error) return { error: error.message };
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "accepted" | "rejected",
  projectId: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify caller is founder of the project this application belongs to
  const { data: project } = await supabase
    .from("projects")
    .select("founder_id")
    .eq("id", projectId)
    .single();

  if (project?.founder_id !== user.id) throw new Error("Forbidden");

  const { error } = await supabase
    .from("applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", applicationId);

  if (error) throw new Error(error.message);

  revalidatePath(`/projects/${projectId}`);
}
