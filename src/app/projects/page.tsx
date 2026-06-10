import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ProjectsList } from "./projects-list";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, tagline, stage, sector, stack, profiles(username, full_name), project_roles(id, is_open)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-1.5">Find your next venture to join</p>
      </div>

      {!projects?.length ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-2xl">🚀</div>
          <p className="font-semibold text-lg mb-1">No projects yet</p>
          <p className="text-muted-foreground text-sm">Be the first to publish your project</p>
        </div>
      ) : (
        <ProjectsList projects={projects} initialQuery={q ?? ""} />
      )}
    </div>
  );
}
