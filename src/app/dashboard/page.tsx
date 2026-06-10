import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: myProjects }, { data: applications }] = await Promise.all([
    supabase
      .from("projects")
      .select(`*, project_roles(id, is_open), project_members(role)`)
      .eq("founder_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("applications")
      .select(`*, project_roles(title, project_id, projects(title))`)
      .eq("applicant_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* My projects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My projects</h2>
          <Link href="/projects/new">
            <Button size="sm">+ New</Button>
          </Link>
        </div>
        {!myProjects?.length ? (
          <p className="text-muted-foreground text-sm">No projects yet.</p>
        ) : (
          <div className="space-y-3">
            {myProjects.map((p) => {
              const openRoles = p.project_roles?.filter((r: { is_open: boolean | null }) => r.is_open === true).length ?? 0;
              return (
                <Link key={p.id} href={`/projects/${p.id}`}>
                  <div className="border rounded-lg p-4 hover:border-foreground transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{p.title}</span>
                      <span className="text-xs text-muted-foreground">{openRoles} open role{openRoles !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* My applications */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My applications</h2>
        {!applications?.length ? (
          <p className="text-muted-foreground text-sm">No applications yet.</p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{(app.project_roles as { projects?: { title?: string } })?.projects?.title}</p>
                  <p className="text-xs text-muted-foreground">{(app.project_roles as { title?: string })?.title}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  app.status === "accepted" ? "bg-green-100 text-green-700" :
                  app.status === "rejected" ? "bg-red-100 text-red-700" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
