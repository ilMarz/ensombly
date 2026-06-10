import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { FollowButton } from "./follow-button";
import { ApplyButton } from "./apply-button";
import { ApplicationsPanel } from "./applications-panel";
import Link from "next/link";

const STAGES: Record<string, string> = { idea: "Idea", prototype: "Prototype", mvp: "MVP", growth: "Growth" };
const STAGE_COLORS: Record<string, string> = {
  idea: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  prototype: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  mvp: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  growth: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};
const COMP: Record<string, string> = { equity: "Equity", revenue_share: "Revenue share", voluntary: "Voluntary", paid: "Paid" };

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project, error: projectError }, { data: { user } }] = await Promise.all([
    supabase
      .from("projects")
      .select("*, profiles(username, full_name, avatar_url), project_roles(*), project_members(user_id, role)")
      .eq("id", id)
      .single(),
    supabase.auth.getUser(),
  ]);

  if (projectError) throw new Error(`Failed to load project: ${projectError.message} (code: ${projectError.code})`);
  if (!project) notFound();

  const isFounder = user?.id === project.founder_id;
  const membership = project.project_members?.find((m: { user_id: string; role: string }) => m.user_id === user?.id);
  const openRoles = project.project_roles?.filter((r: { is_open: boolean | null }) => r.is_open === true) ?? [];
  const stageColor = STAGE_COLORS[project.stage ?? "idea"] ?? STAGE_COLORS.idea;

  // Founder fetches all applications
  const roleIds = (project.project_roles ?? []).map((r: { id: string }) => r.id);
  const { data: applications } = (isFounder && roleIds.length > 0)
    ? await supabase
        .from("applications")
        .select("id, status, message, created_at, profiles(username, full_name), project_roles(title)")
        .in("project_role_id", roleIds)
        .order("created_at", { ascending: false })
    : { data: null };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <span className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${stageColor}`}>
            {STAGES[project.stage as keyof typeof STAGES]}
          </span>
        </div>
        {project.tagline && (
          <p className="text-muted-foreground text-lg leading-relaxed">{project.tagline}</p>
        )}
        <p className="text-sm text-muted-foreground">
          by{" "}
          <span className="font-medium text-foreground">
            {project.profiles?.full_name ?? project.profiles?.username}
          </span>
        </p>
      </div>

      {/* Actions */}
      {!user ? (
        <div className="flex items-center justify-between gap-3 border border-border/60 rounded-xl px-5 py-4 bg-muted/30">
          <p className="text-sm text-muted-foreground">Sign in to follow this project or apply to open roles.</p>
          <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0">
            Sign in →
          </Link>
        </div>
      ) : !isFounder && (
        <div className="flex gap-3">
          <FollowButton
            projectId={project.id}
            userId={user.id}
            currentRole={membership?.role as "follower" | "investor" | "collaborator" | "founder" | undefined}
          />
        </div>
      )}

      {/* Description */}
      {project.description && (
        <section>
          <h2 className="font-semibold text-base mb-3">About</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">{project.description}</p>
        </section>
      )}

      {/* Stack */}
      {(project.stack ?? []).length > 0 && (
        <section>
          <h2 className="font-semibold text-base mb-3">Tech stack</h2>
          <div className="flex flex-wrap gap-2">
            {(project.stack ?? []).map((s: string) => (
              <span key={s} className="text-xs border border-border/60 rounded-full px-3 py-1 bg-muted/40 font-medium">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Open roles */}
      {openRoles.length > 0 && (
        <section>
          <h2 className="font-semibold text-base mb-3">
            Open roles{" "}
            <span className="text-xs font-normal text-muted-foreground ml-1">({openRoles.length})</span>
          </h2>
          <div className="space-y-3">
            {openRoles.map((role: {
              id: string;
              title: string;
              description: string | null;
              skills: string[] | null;
              commitment_hours: number | null;
              compensation_type: string | null;
            }) => (
              <div key={role.id} className="border border-border/60 rounded-xl p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{role.title}</h3>
                    {role.description && (
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{role.description}</p>
                    )}
                    {(role.skills ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(role.skills ?? []).map((s: string) => (
                          <span key={s} className="text-xs bg-muted rounded-full px-2.5 py-0.5">{s}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                      {role.commitment_hours && (
                        <span>⏱ {role.commitment_hours}h/week</span>
                      )}
                      {role.compensation_type && (
                        <span>💰 {COMP[role.compensation_type]}</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {!user ? (
                      <Link href="/login" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                        Sign in to apply →
                      </Link>
                    ) : !isFounder && (
                      <ApplyButton roleId={role.id} userId={user.id} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      {(project.website_url || project.github_url) && (
        <section className="flex gap-3 pt-2">
          {project.website_url && (
            <a
              href={project.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm border border-border/60 rounded-full px-4 py-1.5 hover:border-primary/40 hover:text-primary transition-colors"
            >
              🌐 Website
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm border border-border/60 rounded-full px-4 py-1.5 hover:border-primary/40 hover:text-primary transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
              GitHub
            </a>
          )}
        </section>
      )}

      {/* Applications panel — founder only */}
      {isFounder && applications && (
        <ApplicationsPanel
          applications={applications as Parameters<typeof ApplicationsPanel>[0]["applications"]}
          projectId={project.id}
        />
      )}
    </div>
  );
}
