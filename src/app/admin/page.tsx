import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin";
import type { Database } from "@/lib/supabase/database.types";
import Link from "next/link";
import { VerifyToggle } from "./verify-toggle";
import { ClearFlagButton, DeleteProjectButton } from "./moderation-buttons";

export default async function AdminPage() {
  await requireAdmin();
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const [
    { count: usersCount },
    { count: projectsCount },
    { count: applicationsCount },
    { data: users },
    { data: projects },
    { data: applications },
    { data: flaggedProjects },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("applications").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id, username, full_name, is_admin, is_verified, looking_for, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("projects")
      .select("id, title, stage, sector, created_at, profiles(username, full_name)")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("applications")
      .select("id, status, created_at, profiles(username), project_roles(title, projects(title))")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("projects")
      .select("id, title, flag_reason, created_at, profiles(username, full_name)")
      .eq("is_flagged", true)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">System overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Users", value: usersCount ?? 0 },
          { label: "Projects", value: projectsCount ?? 0 },
          { label: "Applications", value: applicationsCount ?? 0 },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-2xl p-6 bg-card shadow-sm shadow-black/20">
            <p className="text-4xl font-bold text-primary">{s.value}</p>
            <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Users */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm shadow-black/20">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border/60">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Looking for</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Verified</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {users?.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.full_name ?? u.username}</p>
                    <p className="text-muted-foreground text-xs">@{u.username}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.looking_for ?? "—"}</td>
                  <td className="px-4 py-3">
                    {u.is_admin ? (
                      <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">Admin</span>
                    ) : (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">User</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <VerifyToggle userId={u.id} isVerified={u.is_verified ?? false} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(u.created_at!).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Projects */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm shadow-black/20">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border/60">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Founder</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stage</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Sector</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {projects?.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/projects/${p.id}`} className="font-medium hover:text-primary transition-colors">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {(p.profiles as { full_name?: string; username?: string } | null)?.full_name ??
                      (p.profiles as { username?: string } | null)?.username}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{p.stage}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.sector ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(p.created_at!).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Applications */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Applications</h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm shadow-black/20">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border/60">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Applicant</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {applications?.map((a) => {
                const role = a.project_roles as { title?: string; projects?: { title?: string } } | null;
                const applicant = a.profiles as { username?: string } | null;
                return (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">@{applicant?.username}</td>
                    <td className="px-4 py-3 text-muted-foreground">{role?.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{role?.projects?.title}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        a.status === "accepted" ? "bg-emerald-900/25 text-emerald-300 ring-1 ring-emerald-700/40" :
                        a.status === "rejected" ? "bg-red-900/25 text-red-300 ring-1 ring-red-700/40" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(a.created_at!).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      {/* Flagged Projects */}
      {(flaggedProjects?.length ?? 0) > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-red-400">
            Flagged Projects{" "}
            <span className="text-sm font-normal text-muted-foreground">({flaggedProjects!.length})</span>
          </h2>
          <div className="bg-card border border-red-900/30 rounded-2xl overflow-hidden shadow-sm shadow-black/20">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border/60">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Founder</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Reason</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {flaggedProjects!.map((p) => {
                  const founder = p.profiles as { full_name?: string | null; username?: string } | null;
                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/projects/${p.id}`} className="font-medium hover:text-primary transition-colors">
                          {p.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {founder?.full_name ?? founder?.username ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">
                        {p.flag_reason ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <ClearFlagButton projectId={p.id} />
                          <DeleteProjectButton projectId={p.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
