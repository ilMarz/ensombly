import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { EditForm } from "./edit-form";
import { TemplatesPanel } from "./templates-panel";

const STATUS_STYLES: Record<string, string> = {
  pending: "text-amber-300 bg-amber-900/25 ring-1 ring-amber-700/40",
  accepted: "text-emerald-300 bg-emerald-900/25 ring-1 ring-emerald-700/40",
  rejected: "text-red-300 bg-red-900/25 ring-1 ring-red-700/40",
};

const STAGE_LABELS: Record<string, string> = {
  idea: "Idea", prototype: "Prototype", mvp: "MVP", growth: "Growth",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: myProjects }, { data: applications }, { data: templates }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("projects")
      .select("id, title, stage, created_at")
      .eq("founder_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("applications")
      .select("id, status, created_at, project_roles(title, projects(id, title))")
      .eq("applicant_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("application_templates")
      .select("id, title, body, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (!profile) redirect("/login");

  const displayName = profile.full_name ?? profile.username;
  const initials = displayName
    .split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center shrink-0 select-none">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
          {profile.bio && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-md">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* Edit form */}
      <EditForm profile={profile} />

      {/* Founded projects */}
      {(myProjects?.length ?? 0) > 0 && (
        <section>
          <h2 className="font-semibold text-base mb-3">
            Projects you founded{" "}
            <span className="text-xs font-normal text-muted-foreground ml-1">({myProjects!.length})</span>
          </h2>
          <div className="space-y-2">
            {myProjects!.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/40 hover:shadow-sm hover:shadow-black/20 transition-colors"
              >
                <span className="text-sm font-medium">{p.title}</span>
                <span className="text-xs text-muted-foreground">{STAGE_LABELS[p.stage ?? "idea"] ?? p.stage}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Application templates */}
      <TemplatesPanel templates={templates ?? []} />

      {/* Applications */}
      {(applications?.length ?? 0) > 0 && (
        <section>
          <h2 className="font-semibold text-base mb-3">
            Your applications{" "}
            <span className="text-xs font-normal text-muted-foreground ml-1">({applications!.length})</span>
          </h2>
          <div className="space-y-2">
            {applications!.map((a) => {
              type RoleJoin = { title: string | null; projects: { id: string; title: string } | null } | null;
              const role = a.project_roles as RoleJoin;
              return (
                <div key={a.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 shadow-sm shadow-black/20">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{role?.title ?? "Role"}</p>
                    {role?.projects && (
                      <Link href={`/projects/${role.projects.id}`} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                        {role.projects.title}
                      </Link>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ml-3 ${STATUS_STYLES[a.status ?? "pending"]}`}>
                    {a.status ?? "pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
