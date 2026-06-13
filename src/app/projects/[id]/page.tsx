import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { FollowButton } from "./follow-button";
import { ApplyButton } from "./apply-button";
import { ApplicationsPanel } from "./applications-panel";
import { InvestorInterestButton } from "./investor-interest-button";
import { AddRoleForm } from "./add-role-form";
import { ConnectGithubButton } from "./connect-github-button";
import { ShareButton } from "./share-button";
import { ProjectUpdatesSection } from "./project-updates-section";
import { ArchiveButton } from "./archive-button";
import { RefreshGithubButton } from "./refresh-github-button";
import Link from "next/link";
import type { Metadata } from "next";

const STAGES: Record<string, string> = { idea: "Idea", prototype: "Prototype", mvp: "MVP", growth: "Growth" };
const STAGE_COLORS: Record<string, string> = {
  idea: "text-amber-300 bg-amber-900/25 ring-1 ring-amber-700/40",
  prototype: "text-sky-300 bg-sky-900/25 ring-1 ring-sky-700/40",
  mvp: "text-violet-300 bg-violet-900/25 ring-1 ring-violet-700/40",
  growth: "text-emerald-300 bg-emerald-900/25 ring-1 ring-emerald-700/40",
};
const COMP: Record<string, string> = { equity: "Equity", revenue_share: "Revenue share", voluntary: "Voluntary", paid: "Paid" };

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("title, tagline, description, cover_image_url")
    .eq("id", id)
    .single();

  if (!project) return { title: "Project not found — Ensombly" };

  const title = `${project.title} — Ensombly`;
  const description = project.tagline ?? project.description?.slice(0, 160) ?? undefined;
  const images = project.cover_image_url ? [project.cover_image_url] : undefined;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: { user } }] = await Promise.all([
    supabase
      .from("projects")
      .select("*, profiles(username, full_name, avatar_url), project_roles(*), project_members(user_id, role)")
      .eq("id", id)
      .single(),
    supabase.auth.getUser(),
  ]);

  const { data: projectUpdates } = await supabase
    .from("project_updates")
    .select("id, title, body, created_at")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  const { data: userProfile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null };
  const userRole = userProfile?.role ?? "user";

  if (!project) notFound();

  const isFounder = user?.id === project.founder_id;
  const membership = project.project_members?.find((m: { user_id: string; role: string }) => m.user_id === user?.id);
  const openRoles = project.project_roles?.filter((r: { is_open: boolean | null }) => r.is_open === true) ?? [];
  const stageColor = STAGE_COLORS[project.stage ?? "idea"] ?? STAGE_COLORS.idea;

  // Founder fetches all applications + investor interests
  const roleIds = (project.project_roles ?? []).map((r: { id: string }) => r.id);
  const [{ data: applications }, { data: existingInterest }, { data: investorInterests }, { data: applicationTemplates }] = await Promise.all([
    (isFounder && roleIds.length > 0)
      ? supabase
          .from("applications")
          .select("id, status, message, created_at, profiles(username, full_name), project_roles(title)")
          .in("project_role_id", roleIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: null }),
    user && !isFounder
      ? supabase
          .from("investor_interests")
          .select("id")
          .eq("project_id", project.id)
          .eq("investor_id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    isFounder
      ? supabase
          .from("investor_interests")
          .select("id, contact_info, message, created_at, profiles(full_name, username)")
          .eq("project_id", project.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: null }),
    user && !isFounder
      ? supabase
          .from("application_templates")
          .select("id, title, body")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: null }),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm shadow-black/20 space-y-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
            {project.archived_at && (
              <span className="text-xs font-medium px-3 py-1 rounded-full text-muted-foreground bg-muted ring-1 ring-border">
                Archived
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${stageColor}`}>
              {STAGES[project.stage as keyof typeof STAGES]}
            </span>
            {isFounder && (
              <Link
                href={`/projects/${project.id}/edit`}
                className="text-xs font-medium px-3 py-1.5 border border-border rounded-full hover:border-primary/40 hover:text-primary transition-colors"
              >
                Edit
              </Link>
            )}
            <ShareButton projectId={project.id} title={project.title} tagline={project.tagline} />
          </div>
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
        <div className="flex items-center justify-between gap-3 border border-border rounded-xl px-5 py-4 bg-card shadow-sm shadow-black/20">
          <p className="text-sm text-muted-foreground">Sign in to follow this project or apply to open roles.</p>
          <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0">
            Sign in →
          </Link>
        </div>
      ) : !isFounder && (
        <div className="flex flex-wrap gap-3">
          <FollowButton
            projectId={project.id}
            userId={user.id}
            currentRole={membership?.role as "follower" | "investor" | "collaborator" | "founder" | undefined}
          />
          {userRole === "investor" && (
            <InvestorInterestButton
              projectId={project.id}
              alreadySent={!!existingInterest}
            />
          )}
        </div>
      )}

      {/* Description */}
      {project.description && (
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm shadow-black/20">
          <h2 className="font-semibold text-base mb-3">About</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">{project.description}</p>
        </section>
      )}

      {/* Stack */}
      {(project.stack ?? []).length > 0 && (
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm shadow-black/20">
          <h2 className="font-semibold text-base mb-3">Tech stack</h2>
          <div className="flex flex-wrap gap-2">
            {(project.stack ?? []).map((s: string) => (
              <span key={s} className="text-xs border border-border rounded-md px-3 py-1 bg-secondary/50 font-mono text-[10px] text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Open roles */}
      {(openRoles.length > 0 || isFounder) && (
        <section>
          <h2 className="font-semibold text-base mb-3">
            Open roles{" "}
            {openRoles.length > 0 && <span className="text-xs font-normal text-muted-foreground ml-1">({openRoles.length})</span>}
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
              <div key={role.id} className="bg-card border border-border rounded-xl p-5 shadow-sm shadow-black/20 hover:border-primary/40 hover:bg-primary/5 transition-colors duration-150">
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
                    ) : !isFounder && userRole !== "investor" && (
                      <ApplyButton
                        roleId={role.id}
                        userId={user.id}
                        templates={applicationTemplates ?? []}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {isFounder && (
            <div className="mt-3">
              <AddRoleForm projectId={project.id} />
            </div>
          )}
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
              className="inline-flex items-center gap-1.5 text-sm border border-border px-4 py-1.5 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors duration-150 uppercase tracking-wider text-[10px] font-semibold"
            >
              🌐 Website
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm border border-border px-4 py-1.5 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors duration-150 uppercase tracking-wider text-[10px] font-semibold"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
              {project.github_repo_full_name ?? "GitHub"}
              {project.github_stars != null && (
                <span className="inline-flex items-center gap-0.5 normal-case tracking-normal text-muted-foreground">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-[2]">
                    <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6L12 2z" strokeLinejoin="round" />
                  </svg>
                  {project.github_stars}
                </span>
              )}
            </a>
          )}
        </section>
      )}

      {/* Connect GitHub — founder only */}
      {isFounder && (
        <section className="flex items-center gap-3 flex-wrap">
          <ConnectGithubButton
            projectId={project.id}
            currentRepoFullName={project.github_repo_full_name ?? null}
          />
          {project.github_repo_full_name && (
            <RefreshGithubButton
              projectId={project.id}
              lastRefreshed={project.github_connected_at ?? null}
            />
          )}
        </section>
      )}

      {/* Project updates */}
      <ProjectUpdatesSection
        projectId={project.id}
        updates={projectUpdates ?? []}
        isFounder={isFounder}
      />

      {/* Applications panel — founder only */}
      {isFounder && applications && (
        <ApplicationsPanel
          applications={applications as Parameters<typeof ApplicationsPanel>[0]["applications"]}
          projectId={project.id}
        />
      )}

      {/* Investor inbox — founder only */}
      {isFounder && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-semibold text-base">Investor inbox</h2>
            {(investorInterests?.length ?? 0) > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-900/25 text-violet-300 ring-1 ring-violet-700/40">
                {investorInterests!.length}
              </span>
            )}
          </div>
          {!investorInterests?.length ? (
            <div className="border border-dashed border-border rounded-xl p-8 text-center">
              <div className="w-9 h-9 rounded-full bg-violet-900/30 ring-1 ring-violet-700/40 flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.7] text-violet-300">
                  <path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" strokeLinecap="round" />
                  <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" strokeLinecap="round" />
                </svg>
              </div>
              <p className="font-medium text-sm mb-1">No investor messages yet</p>
              <p className="text-muted-foreground text-xs">Investors who express interest will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(investorInterests as { id: string; contact_info: string; message: string | null; created_at: string | null; profiles: { full_name: string | null; username: string } | null }[]).map((interest) => {
                const investorName = interest.profiles?.full_name ?? interest.profiles?.username ?? "Investor";
                const initials = investorName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
                return (
                  <div key={interest.id} className="border border-border rounded-xl p-5 bg-card shadow-sm shadow-black/20 hover:border-violet-700/50 hover:shadow-sm transition-all duration-150">
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-full bg-violet-900/35 text-violet-300 text-xs font-bold flex items-center justify-center shrink-0 select-none">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div>
                            <p className="font-semibold text-sm leading-snug">{investorName}</p>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-900/25 text-violet-300 ring-1 ring-violet-700/40">
                              Investor
                            </span>
                          </div>
                          <span className="text-[11px] text-muted-foreground shrink-0">
                            {new Date(interest.created_at!).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        {interest.message && (
                          <p className="text-sm text-foreground leading-relaxed mt-2 mb-3 bg-secondary/40 rounded-lg px-3 py-2.5">
                            &ldquo;{interest.message}&rdquo;
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 mt-2">
                          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-[2] text-muted-foreground shrink-0">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.72 16z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-xs text-muted-foreground font-mono">{interest.contact_info}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
      {/* Archive / Unarchive — founder only */}
      {isFounder && (
        <div className="flex justify-end pt-2">
          <ArchiveButton projectId={project.id} isArchived={!!project.archived_at} />
        </div>
      )}
    </div>
  );
}
