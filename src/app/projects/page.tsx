import { createClient } from "@/lib/supabase/server";
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
        <p className="text-muted-foreground mt-1.5 text-sm">Find your next venture to join</p>
      </div>

      {!projects?.length ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-border rounded">
          <div className="w-12 h-12 rounded border border-border flex items-center justify-center mb-4 text-muted-foreground">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.5]">
              <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-semibold text-base mb-1">No projects yet</p>
          <p className="text-muted-foreground text-sm">Be the first to publish your project</p>
        </div>
      ) : (
        <ProjectsList projects={projects} initialQuery={q ?? ""} />
      )}
    </div>
  );
}
