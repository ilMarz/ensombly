import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { EditProjectForm } from "./edit-project-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: { user } }, { data: project }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("projects")
      .select("id, title, tagline, description, stage, sector, stack, website_url, github_url, founder_id, accent_color, accent_color_2, hero_pattern, roles_style")
      .eq("id", id)
      .single(),
  ]);

  if (!user) redirect("/login");
  if (!project) notFound();
  if (project.founder_id !== user.id) redirect(`/projects/${id}`);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Edit project</h1>
        <p className="text-muted-foreground">Update the details of your project</p>
      </div>
      <EditProjectForm project={project} />
    </div>
  );
}
