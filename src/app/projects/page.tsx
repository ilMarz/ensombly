import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STAGES = { idea: "Idea", prototype: "Prototype", mvp: "MVP", growth: "Growth" };

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select(`*, profiles(username, full_name), project_roles(id, is_open)`)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Find a project to join</p>
        </div>
        <Link href="/projects/new">
          <Button>+ New Project</Button>
        </Link>
      </div>

      {!projects?.length ? (
        <p className="text-muted-foreground">No projects yet. Be the first!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => {
            const openRoles = project.project_roles?.filter((r: { is_open: boolean | null }) => r.is_open === true).length ?? 0;
            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="border rounded-lg p-5 hover:border-foreground transition-colors h-full">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="font-semibold text-lg">{project.title}</h2>
                    <span className="text-xs border rounded px-2 py-0.5 ml-2 shrink-0">
                      {STAGES[project.stage as keyof typeof STAGES] ?? project.stage}
                    </span>
                  </div>
                  {project.tagline && (
                    <p className="text-muted-foreground text-sm mb-3">{project.tagline}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                    {project.sector && <span>{project.sector}</span>}
                    {openRoles > 0 && (
                      <span className="text-green-600 font-medium">{openRoles} role{openRoles > 1 ? "s" : ""} open</span>
                    )}
                    <span className="ml-auto">by {project.profiles?.full_name ?? project.profiles?.username}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
