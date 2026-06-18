import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { checkInvestorInterestLimit } from "@/lib/billing/usage";
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
import { ReportButton } from "./report-button";
import { EmbedCodeSection } from "./embed-code-section";
import { ThemePickerInline } from "./theme-picker-inline";
import {
  HERO_PATTERNS,
  getRoleCardStyle,
  type HeroPattern,
  type RolesStyle,
} from "./theme-config";
import Link from "next/link";
import type { Metadata } from "next";

const STAGES: Record<string, string> = { idea: "Idea", prototype: "Prototype", mvp: "MVP", growth: "Growth" };
const STAGE_COLORS: Record<string, string> = {
  idea:      "text-amber-300 bg-amber-900/25 ring-1 ring-amber-700/40",
  prototype: "text-sky-300 bg-sky-900/25 ring-1 ring-sky-700/40",
  mvp:       "text-violet-300 bg-violet-900/25 ring-1 ring-violet-700/40",
  growth:    "text-emerald-300 bg-emerald-900/25 ring-1 ring-emerald-700/40",
};
const COMP: Record<string, string> = {
  equity: "Equity", revenue_share: "Revenue share", voluntary: "Voluntary", paid: "Paid",
};

const DEFAULT_ACCENT  = "#7c3aed";
const DEFAULT_ACCENT2 = "#4f46e5";

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
    alternates: { canonical: `/projects/${id}` },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: { user } }] = await Promise.all([
    supabase
      .from("projects")
      .select("*, profiles(username, full_name, avatar_url, is_verified), project_roles(*), project_members(user_id, role)")
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

  const isFounder  = user?.id === project.founder_id;
  const membership = project.project_members?.find((m: { user_id: string; role: string }) => m.user_id === user?.id);
  const openRoles  = project.project_roles?.filter((r: { is_open: boolean | null }) => r.is_open === true) ?? [];

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
      ? supabase.from("investor_interests").select("id").eq("project_id", project.id).eq("investor_id", user.id).maybeSingle()
      : Promise.resolve({ data: null }),
    isFounder
      ? supabase.from("investor_interests").select("id, contact_info, message, created_at, profiles(full_name, username)").eq("project_id", project.id).order("created_at", { ascending: false })
      : Promise.resolve({ data: null }),
    user && !isFounder
      ? supabase.from("application_templates").select("id, title, body").eq("user_id", user.id).order("created_at", { ascending: false })
      : Promise.resolve({ data: null }),
  ]);

  const investorLimitInfo = user && userRole === "investor" && !isFounder
    ? await checkInvestorInterestLimit(user.id)
    : null;

  const founder     = project.profiles as { username?: string; full_name?: string | null; is_verified?: boolean } | null;
  const siteUrl     = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ensombly.com";
  const accentColor  = project.accent_color  ?? DEFAULT_ACCENT;
  const accentColor2 = project.accent_color_2 ?? DEFAULT_ACCENT2;
  const heroPattern  = (project.hero_pattern  ?? "none")  as HeroPattern;
  const rolesStyle   = (project.roles_style   ?? "border_left") as RolesStyle;

  // Resolve hero pattern CSS
  const pattern = HERO_PATTERNS[heroPattern] ?? HERO_PATTERNS.none;
  const patternStyle: React.CSSProperties = pattern.bg !== "none"
    ? { backgroundImage: pattern.bg, backgroundSize: pattern.size, backgroundRepeat: "repeat" }
    : {};

  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-5"
      style={{ "--p-accent": accentColor, "--p-accent-2": accentColor2 } as React.CSSProperties}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.tagline ?? project.description ?? undefined,
            url: `${siteUrl}/projects/${project.id}`,
            ...(project.cover_image_url ? { image: project.cover_image_url } : {}),
            ...(project.website_url ? { sameAs: project.website_url } : {}),
            author: founder?.username
              ? { "@type": "Person", name: founder.full_name ?? founder.username, url: `${siteUrl}/u/${founder.username}` }
              : undefined,
            datePublished: project.created_at,
          }),
        }}
      />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] animate-fade-in">
        {/* Dark base */}
        <div className="absolute inset-0 bg-card" />

        {/* Hero pattern overlay */}
        {pattern.bg !== "none" && (
          <div className="absolute inset-0 pointer-events-none" style={patternStyle} />
        )}

        {/* Glow orb 1 — top-left — uses --p-accent */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            width: 560, height: 560, borderRadius: "50%",
            top: -180, left: -160,
            background: "var(--p-accent)",
            opacity: 0.13, filter: "blur(110px)",
            animation: "float-slow 9s ease-in-out infinite",
          }}
        />
        {/* Glow orb 2 — bottom-right — uses --p-accent-2 */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            width: 380, height: 380, borderRadius: "50%",
            bottom: -110, right: -80,
            background: "var(--p-accent-2)",
            opacity: 0.11, filter: "blur(90px)",
            animation: "float-slow 11s ease-in-out 3s infinite reverse",
          }}
        />
        {/* Gradient fade toward bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, oklch(0.205 0.020 262 / 0.5) 55%, oklch(0.205 0.020 262 / 0.97) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-6 sm:px-10 pt-10 pb-10 space-y-6">

          {/* Top row — badges + controls */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex flex-wrap gap-2">
              {project.stage && (
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${STAGE_COLORS[project.stage] ?? STAGE_COLORS.idea}`}>
                  {STAGES[project.stage]}
                </span>
              )}
              {project.sector && (
                <span className="text-xs font-medium px-3 py-1 rounded-full text-muted-foreground bg-white/5 ring-1 ring-white/10">
                  {project.sector}
                </span>
              )}
              {project.github_stars != null && (
                <span className="text-xs font-medium px-3 py-1 rounded-full text-muted-foreground bg-white/5 ring-1 ring-white/10 inline-flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-2"><path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6L12 2z" strokeLinejoin="round" /></svg>
                  {project.github_stars}
                </span>
              )}
              {project.archived_at && (
                <span className="text-xs font-medium px-3 py-1 rounded-full text-muted-foreground bg-muted ring-1 ring-border">
                  Archived
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isFounder && (
                <Link
                  href={`/projects/${project.id}/edit`}
                  className="text-xs font-medium px-3 py-1.5 border border-white/10 rounded-full hover:border-white/20 transition-colors"
                >
                  Edit
                </Link>
              )}
              {isFounder && (
                <a
                  href={`/api/projects/${project.id}/certificate`}
                  download
                  title="Scarica certificato di deposito"
                  className="text-xs font-medium px-3 py-1.5 border border-white/10 rounded-full hover:border-amber-500/40 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-[2]">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Certificato
                </a>
              )}
              <ShareButton projectId={project.id} title={project.title} tagline={project.tagline} />
            </div>
          </div>

          {/* Title + tagline */}
          <div className="animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <h1
              className="font-heading font-bold tracking-tight leading-[1.07] mb-4"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 3.75rem)" }}
            >
              {project.title}
            </h1>
            {project.tagline && (
              <p className="text-lg sm:text-xl text-muted-foreground/90 leading-relaxed max-w-2xl">
                {project.tagline}
              </p>
            )}
          </div>

          {/* Founder row */}
          <div className="flex items-center gap-2 flex-wrap animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <p className="text-sm text-muted-foreground">
              by{" "}
              <Link
                href={`/u/${founder?.username}`}
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                {founder?.full_name ?? founder?.username}
              </Link>
            </p>
            {founder?.is_verified && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-sky-300 bg-sky-900/25 ring-1 ring-sky-700/40">
                ✓ Verified
              </span>
            )}
            <span className="text-border/60 select-none">·</span>
            <span className="text-xs text-muted-foreground/60">
              {openRoles.length > 0
                ? `${openRoles.length} open role${openRoles.length > 1 ? "s" : ""}`
                : "No open roles"}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            {!user ? (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
              >
                Join the project →
              </Link>
            ) : !isFounder && (
              <>
                <FollowButton
                  projectId={project.id}
                  userId={user.id}
                  currentRole={membership?.role as "follower" | "investor" | "collaborator" | "founder" | undefined}
                />
                {userRole === "investor" && (
                  <InvestorInterestButton
                    projectId={project.id}
                    alreadySent={!!existingInterest}
                    limitInfo={investorLimitInfo ?? undefined}
                  />
                )}
                <ReportButton projectId={project.id} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── THEME PICKER (founder only) ───────────────────────── */}
      {isFounder && (
        <ThemePickerInline
          projectId={project.id}
          currentAccentColor={accentColor}
          currentAccentColor2={accentColor2}
          currentHeroPattern={heroPattern}
          currentRolesStyle={rolesStyle}
        />
      )}

      {/* ── MAIN GRID ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

        {/* LEFT — About, Stack, Updates */}
        <div className="space-y-5">

          {project.description && (
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm shadow-black/20 animate-fade-up" style={{ animationDelay: "0.25s" }}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">
                About
              </h2>
              <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap text-sm">
                {project.description}
              </p>
            </section>
          )}

          {(project.stack ?? []).length > 0 && (
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm shadow-black/20 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {(project.stack ?? []).map((s: string) => (
                  <span
                    key={s}
                    className="text-[11px] font-mono border border-border rounded-lg px-3 py-1.5 bg-secondary/40 text-muted-foreground hover:border-[var(--p-accent)]/30 hover:text-foreground/80 transition-colors"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          <div className="animate-fade-up" style={{ animationDelay: "0.35s" }}>
            <ProjectUpdatesSection
              projectId={project.id}
              updates={projectUpdates ?? []}
              isFounder={isFounder}
            />
          </div>
        </div>

        {/* RIGHT — Roles, Links, GitHub */}
        <div className="space-y-5">

          {(openRoles.length > 0 || isFounder) && (
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm shadow-black/20 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Open Roles
                </h2>
                {openRoles.length > 0 && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      color: "var(--p-accent)",
                      background: "color-mix(in srgb, var(--p-accent) 12%, transparent)",
                      boxShadow: "0 0 0 1px color-mix(in srgb, var(--p-accent) 22%, transparent)",
                    }}
                  >
                    {openRoles.length}
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                {openRoles.map((role: {
                  id: string;
                  title: string;
                  description: string | null;
                  skills: string[] | null;
                  commitment_hours: number | null;
                  compensation_type: string | null;
                }) => (
                  <div
                    key={role.id}
                    className="p-4 hover:bg-white/[0.02] transition-all overflow-hidden"
                    style={getRoleCardStyle(rolesStyle, accentColor)}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-snug">{role.title}</h3>
                        {role.description && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{role.description}</p>
                        )}
                        {(role.skills ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {(role.skills ?? []).map((s: string) => (
                              <span key={s} className="text-[10px] bg-secondary/80 rounded-full px-2 py-0.5 text-muted-foreground">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-3 mt-2 text-[11px] text-muted-foreground/70">
                          {role.commitment_hours && <span>{role.commitment_hours}h/wk</span>}
                          {role.compensation_type && <span>{COMP[role.compensation_type]}</span>}
                        </div>
                      </div>
                      <div className="shrink-0 mt-0.5">
                        {!user ? (
                          <Link href="/login" className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap">
                            Sign in →
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

              {openRoles.length === 0 && !isFounder && (
                <p className="text-xs text-muted-foreground/60 text-center py-3">No open roles at the moment</p>
              )}

              {isFounder && (
                <div className="mt-3">
                  <AddRoleForm projectId={project.id} />
                </div>
              )}
            </section>
          )}

          {(project.website_url || project.github_url) && (
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm shadow-black/20 animate-fade-up" style={{ animationDelay: "0.35s" }}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">
                Links
              </h2>
              <div className="space-y-2">
                {project.website_url && (
                  <a
                    href={project.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-[var(--p-accent)]/30 hover:bg-[var(--p-accent)]/[0.04] transition-all group"
                  >
                    <span className="text-base">🌐</span>
                    <span className="text-sm font-medium flex-1">Website</span>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
                      <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-[var(--p-accent)]/30 hover:bg-[var(--p-accent)]/[0.04] transition-all group"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span className="text-sm font-medium flex-1 truncate">
                      {project.github_repo_full_name ?? "GitHub"}
                    </span>
                    {project.github_stars != null && (
                      <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-2"><path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6L12 2z" strokeLinejoin="round" /></svg>
                        {project.github_stars}
                      </span>
                    )}
                  </a>
                )}
              </div>
            </section>
          )}

          {isFounder && (
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm shadow-black/20">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">
                GitHub Repo
              </h2>
              <div className="flex flex-col gap-2">
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
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ── FOUNDER-ONLY CONTROLS ─────────────────────────────── */}
      {isFounder && (
        <div className="space-y-5 pt-4 border-t border-dashed border-border/40">
          {applications && (
            <ApplicationsPanel
              applications={applications as Parameters<typeof ApplicationsPanel>[0]["applications"]}
              projectId={project.id}
            />
          )}

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
                    <div key={interest.id} className="border border-border rounded-xl p-5 bg-card shadow-sm shadow-black/20 hover:border-violet-700/50 transition-all duration-150">
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-full bg-violet-900/35 text-violet-300 text-xs font-bold flex items-center justify-center shrink-0 select-none">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <div>
                              <p className="font-semibold text-sm leading-snug">{investorName}</p>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-900/25 text-violet-300 ring-1 ring-violet-700/40">Investor</span>
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
                            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-2 text-muted-foreground shrink-0">
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

          <EmbedCodeSection projectId={project.id} />

          <div className="flex justify-end pt-2">
            <ArchiveButton projectId={project.id} isArchived={!!project.archived_at} />
          </div>
        </div>
      )}
    </div>
  );
}
