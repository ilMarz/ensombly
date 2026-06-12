import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STATUS_STYLES: Record<string, string> = {
  pending: "text-amber-300 bg-amber-900/25 ring-1 ring-amber-700/40",
  accepted: "text-emerald-300 bg-emerald-900/25 ring-1 ring-emerald-700/40",
  rejected: "text-red-300 bg-red-900/25 ring-1 ring-red-700/40",
};

const STAGE_LABELS: Record<string, string> = {
  idea: "Idea", prototype: "Prototype", mvp: "MVP", growth: "Growth",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "user";

  // Investor: only their sent interests
  if (role === "investor") {
    const { data: interests } = await supabase
      .from("investor_interests")
      .select("id, contact_info, message, created_at, projects(id, title, stage, profiles(full_name, username))")
      .eq("investor_id", user.id)
      .order("created_at", { ascending: false });

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Your investor interest requests</p>
        </div>

        {!interests?.length ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-14 text-center">
            <div className="text-4xl mb-3">💼</div>
            <p className="font-medium mb-1">No interest requests yet</p>
            <p className="text-muted-foreground text-sm mb-5">Browse projects and express your interest as an investor</p>
            <Link href="/projects">
              <Button size="sm" variant="outline" className="rounded-full">Browse projects</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {interests.map((interest) => {
              type ProjectJoin = { id: string; title: string; stage: string | null; profiles: { full_name: string | null; username: string } | null } | null;
              const project = interest.projects as ProjectJoin;
              const founderName = project?.profiles?.full_name ?? project?.profiles?.username ?? "—";
              return (
                <div key={interest.id} className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm shadow-black/20">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link href={`/projects/${project?.id}`} className="font-semibold hover:text-primary transition-colors">
                        {project?.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">by {founderName}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {project?.stage && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {STAGE_LABELS[project.stage] ?? project.stage}
                        </span>
                      )}
                      <span className="text-[9px] font-bold px-2 py-0.5 text-emerald-300 bg-emerald-900/25 ring-1 ring-emerald-700/40 rounded-full tracking-wider uppercase">
                        Sent ✓
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1 border-t border-border/50 pt-3">
                    <p><span className="font-medium text-foreground">Contact:</span> {interest.contact_info}</p>
                    {interest.message && (
                      <p><span className="font-medium text-foreground">Message:</span> {interest.message}</p>
                    )}
                    <p className="text-muted-foreground/70">
                      {new Date(interest.created_at!).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // User dashboard
  if (role === "user") {
    const { data: applications } = await supabase
      .from("applications")
      .select("*, project_roles(title, project_id, projects(title, id))")
      .eq("applicant_id", user.id)
      .order("created_at", { ascending: false });

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Your applications</p>
        </div>
        <section>
          <h2 className="text-xl font-semibold mb-4">My applications</h2>
          {!applications?.length ? (
            <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center">
              <div className="text-3xl mb-3">📬</div>
              <p className="font-medium mb-1">No applications yet</p>
              <p className="text-muted-foreground text-sm mb-4">Browse projects and apply to open roles</p>
              <Link href="/projects"><Button size="sm" variant="outline" className="rounded-full">Browse projects</Button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const r = app.project_roles as { title?: string; projects?: { title?: string; id?: string } } | null;
                return (
                  <Link key={app.id} href={`/projects/${r?.projects?.id ?? ""}`}>
                    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm hover:shadow-black/20 transition-all flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-sm">{r?.projects?.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{r?.title}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[app.status ?? "pending"] ?? STATUS_STYLES.pending}`}>{app.status}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  }

  // Founder dashboard
  const { data: myProjects } = await supabase
    .from("projects")
    .select("id, title, tagline, project_roles(id, is_open)")
    .eq("founder_id", user.id)
    .order("created_at", { ascending: false });

  const projectIds = (myProjects ?? []).map((p) => p.id);
  const roleIds = (myProjects ?? []).flatMap((p) => (p.project_roles ?? []).map((r: { id: string }) => r.id));

  const [{ data: investorInterests }, { data: receivedApps }] = await Promise.all([
    projectIds.length > 0
      ? supabase
          .from("investor_interests")
          .select("id, contact_info, message, created_at, project_id, investor_id, profiles(full_name, username), projects(id, title)")
          .in("project_id", projectIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    roleIds.length > 0
      ? supabase
          .from("applications")
          .select("id, status, created_at, profiles(full_name, username), project_roles(title, projects(id, title))")
          .in("project_role_id", roleIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  type InvestorRow = { id: string; contact_info: string; message: string | null; created_at: string | null; profiles: { full_name: string | null; username: string } | null; projects: { id: string; title: string } | null };
  type AppRow = { id: string; status: string | null; created_at: string | null; profiles: { full_name: string | null; username: string } | null; project_roles: { title: string | null; projects: { id: string; title: string } | null } | null };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">Your projects, investor interests and applications</p>
      </div>

      {/* My projects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My projects</h2>
          <Link href="/projects/new">
            <Button size="sm" className="rounded-full px-4">+ New</Button>
          </Link>
        </div>
        {!myProjects?.length ? (
          <div className="border border-dashed border-border rounded p-10 text-center">
            <div className="text-3xl mb-3">🚀</div>
            <p className="font-medium mb-1">No projects yet</p>
            <p className="text-muted-foreground text-sm mb-4">Publish your first project and find your team</p>
            <Link href="/projects/new"><Button size="sm" className="rounded-full">Publish project</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myProjects.map((p) => {
              const openRoles = (p.project_roles ?? []).filter((r: { is_open: boolean | null }) => r.is_open === true).length;
              return (
                <Link key={p.id} href={`/projects/${p.id}`}>
                  <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm hover:shadow-black/20 transition-all flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{p.title}</p>
                      {p.tagline && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{p.tagline}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 bg-muted rounded-full px-2.5 py-1">
                      {openRoles} open role{openRoles !== 1 ? "s" : ""}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Investor inbox */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold">Investor inbox</h2>
          {(investorInterests?.length ?? 0) > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-900/25 text-violet-300 ring-1 ring-violet-700/40">
              {investorInterests!.length}
            </span>
          )}
        </div>
        {!investorInterests?.length ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center">
            <div className="w-10 h-10 rounded-full bg-violet-900/30 ring-1 ring-violet-700/40 flex items-center justify-center mx-auto mb-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.7] text-violet-300">
                <path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" strokeLinecap="round" />
                <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" strokeLinecap="round" />
              </svg>
            </div>
            <p className="font-medium text-sm mb-1">No investor messages yet</p>
            <p className="text-muted-foreground text-xs">When investors express interest in your projects, their messages will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(investorInterests as unknown as InvestorRow[]).map((interest) => {
              const investorName = interest.profiles?.full_name ?? interest.profiles?.username ?? "Investor";
              const initials = investorName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
              return (
                <div key={interest.id} className="border border-border rounded-xl p-5 bg-card hover:border-violet-700/50 hover:shadow-sm transition-all duration-150">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-violet-900/35 text-violet-300 text-xs font-bold flex items-center justify-center shrink-0 select-none">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div>
                          <p className="font-semibold text-sm leading-snug">{investorName}</p>
                          <Link href={`/projects/${interest.projects?.id}`} className="text-xs text-primary hover:underline font-medium">
                            re: {interest.projects?.title}
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-900/25 text-violet-300 ring-1 ring-violet-700/40">
                            Investor
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(interest.created_at!).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
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

      {/* Applications received */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Applications received
          {(receivedApps?.length ?? 0) > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">({receivedApps!.length})</span>
          )}
        </h2>
        {!receivedApps?.length ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center">
            <div className="text-2xl mb-2">📬</div>
            <p className="text-muted-foreground text-sm">No applications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(receivedApps as unknown as AppRow[]).map((app) => {
              const projectId = app.project_roles?.projects?.id;
              return (
                <Link key={app.id} href={`/projects/${projectId}`}>
                  <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm hover:shadow-black/20 transition-all flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">{app.profiles?.full_name ?? app.profiles?.username}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {app.project_roles?.title} · {app.project_roles?.projects?.title}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[app.status ?? "pending"] ?? STATUS_STYLES.pending}`}>
                      {app.status ?? "pending"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
