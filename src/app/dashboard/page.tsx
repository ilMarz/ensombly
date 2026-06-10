import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
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
          <div className="border border-dashed border-border/80 rounded-2xl p-14 text-center">
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
                <div key={interest.id} className="border border-border/60 rounded-2xl p-5 space-y-3">
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
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
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

  // Founder / User dashboard
  const [{ data: myProjects }, { data: applications }] = await Promise.all([
    role === "founder"
      ? supabase
          .from("projects")
          .select("*, project_roles(id, is_open)")
          .eq("founder_id", user.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    supabase
      .from("applications")
      .select("*, project_roles(title, project_id, projects(title, id))")
      .eq("applicant_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {role === "founder" ? "Manage your projects and applications" : "Your applications"}
        </p>
      </div>

      {/* My projects — founder only */}
      {role === "founder" && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My projects</h2>
            <Link href="/projects/new">
              <Button size="sm" className="rounded-full px-4">+ New</Button>
            </Link>
          </div>
          {!myProjects?.length ? (
            <div className="border border-dashed border-border/80 rounded-2xl p-10 text-center">
              <div className="text-3xl mb-3">🚀</div>
              <p className="font-medium mb-1">No projects yet</p>
              <p className="text-muted-foreground text-sm mb-4">Publish your first project and find your team</p>
              <Link href="/projects/new">
                <Button size="sm" className="rounded-full">Publish project</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myProjects!.map((p) => {
                const openRoles = p.project_roles?.filter((r: { is_open: boolean | null }) => r.is_open === true).length ?? 0;
                return (
                  <Link key={p.id} href={`/projects/${p.id}`}>
                    <div className="border border-border/60 rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all duration-150 flex items-center justify-between gap-4">
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
      )}

      {/* My applications */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My applications</h2>
        {!applications?.length ? (
          <div className="border border-dashed border-border/80 rounded-2xl p-10 text-center">
            <div className="text-3xl mb-3">📬</div>
            <p className="font-medium mb-1">No applications yet</p>
            <p className="text-muted-foreground text-sm mb-4">Browse projects and apply to open roles</p>
            <Link href="/projects">
              <Button size="sm" variant="outline" className="rounded-full">Browse projects</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications!.map((app) => {
              const appRole = app.project_roles as { title?: string; projects?: { title?: string; id?: string } } | null;
              return (
                <Link key={app.id} href={`/projects/${appRole?.projects?.id ?? ""}`}>
                  <div className="border border-border/60 rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all duration-150 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">{appRole?.projects?.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{appRole?.title}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[app.status ?? "pending"] ?? STATUS_STYLES.pending}`}>
                      {app.status}
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
