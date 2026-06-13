import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

const STAGES: Record<string, string> = {
  idea: "Idea", prototype: "Prototype", mvp: "MVP", growth: "Growth",
};
const STAGE_COLORS: Record<string, string> = {
  idea: "text-amber-300 bg-amber-900/25",
  prototype: "text-sky-300 bg-sky-900/25",
  mvp: "text-violet-300 bg-violet-900/25",
  growth: "text-emerald-300 bg-emerald-900/25",
};

export default async function EmbedProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, title, tagline, stage, sector, stack, github_stars, github_repo_full_name, profiles(username, full_name, is_verified)")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const stageColor = STAGE_COLORS[project.stage ?? "idea"] ?? STAGE_COLORS.idea;
  const openUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/projects/${project.id}`;

  return (
    <div className="min-h-0 p-3">
      <div className="border border-border rounded-xl bg-card p-4 text-sm shadow-sm shadow-black/20 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-heading font-bold text-sm leading-snug">
            <a href={openUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              {project.title}
            </a>
          </h2>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${stageColor}`}>
            {STAGES[project.stage ?? "idea"]}
          </span>
        </div>

        {project.tagline && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{project.tagline}</p>
        )}

        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
          <div className="flex items-center gap-2">
            {project.sector && (
              <span className="bg-secondary rounded-full px-2 py-0.5">{project.sector}</span>
            )}
            {project.github_stars != null && (
              <span className="inline-flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-[2]">
                  <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6L12 2z" strokeLinejoin="round" />
                </svg>
                {project.github_stars}
              </span>
            )}
          </div>
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View on Ensombly →
          </a>
        </div>
      </div>
    </div>
  );
}
