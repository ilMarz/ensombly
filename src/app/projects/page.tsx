import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STAGES = { idea: "Idea", prototype: "Prototype", mvp: "MVP", growth: "Growth" };
const STAGE_COLORS: Record<string, string> = {
  idea: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  prototype: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  mvp: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  growth: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select(`*, profiles(username, full_name), project_roles(id, is_open)`)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1.5">Find your next venture to join</p>
        </div>
        <Link href="/projects/new">
          <Button className="rounded-full px-5">+ New Project</Button>
        </Link>
      </div>

      {!projects?.length ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-2xl">🚀</div>
          <p className="font-semibold text-lg mb-1">No projects yet</p>
          <p className="text-muted-foreground text-sm mb-6">Be the first to publish your project</p>
          <Link href="/projects/new">
            <Button className="rounded-full">Publish a project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const openRoles = project.project_roles?.filter((r: { is_open: boolean | null }) => r.is_open === true).length ?? 0;
            const stageColor = STAGE_COLORS[project.stage ?? "idea"] ?? STAGE_COLORS.idea;
            return (
              <Link key={project.id} href={`/projects/${project.id}`} className="group">
                <div className="relative border border-border/60 rounded-2xl p-5 h-full flex flex-col bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h2 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors">
                      {project.title}
                    </h2>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${stageColor}`}>
                      {STAGES[project.stage as keyof typeof STAGES] ?? project.stage}
                    </span>
                  </div>

                  {project.tagline && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                      {project.tagline}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-3 border-t border-border/50">
                    {project.sector && (
                      <span className="bg-muted rounded-full px-2 py-0.5">{project.sector}</span>
                    )}
                    {openRoles > 0 && (
                      <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full px-2 py-0.5 font-medium">
                        {openRoles} open
                      </span>
                    )}
                    <span className="ml-auto truncate">
                      {project.profiles?.full_name ?? project.profiles?.username}
                    </span>
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
