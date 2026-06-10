import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { FollowButton } from "./follow-button";
import { ApplyButton } from "./apply-button";

const STAGES = { idea: "Idea", prototype: "Prototype", mvp: "MVP", growth: "Growth" };
const COMP = { equity: "Equity", revenue_share: "Revenue share", voluntary: "Voluntary", paid: "Paid" };

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: { user } }] = await Promise.all([
    supabase
      .from("projects")
      .select(`*, profiles(username, full_name, avatar_url), project_roles(*), project_members(user_id, role)`)
      .eq("id", id)
      .single(),
    supabase.auth.getUser(),
  ]);

  if (!project) notFound();

  const isFounder = user?.id === project.founder_id;
  const membership = project.project_members?.find((m: { user_id: string; role: string }) => m.user_id === user?.id);
  const openRoles = project.project_roles?.filter((r: { is_open: boolean | null }) => r.is_open === true) ?? [];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <span className="text-sm border rounded px-2 py-1 shrink-0">
            {STAGES[project.stage as keyof typeof STAGES]}
          </span>
        </div>
        {project.tagline && (
          <p className="text-muted-foreground text-lg mt-2">{project.tagline}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          by {project.profiles?.full_name ?? project.profiles?.username}
        </p>
      </div>

      {/* Actions */}
      {!isFounder && user && (
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
          <h2 className="font-semibold mb-2">About</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
        </section>
      )}

      {/* Stack */}
      {(project.stack ?? []).length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">Tech stack</h2>
          <div className="flex flex-wrap gap-2">
            {(project.stack ?? []).map((s: string) => (
              <span key={s} className="text-xs border rounded px-2 py-1">{s}</span>
            ))}
          </div>
        </section>
      )}

      {/* Open roles */}
      {openRoles.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">Open roles</h2>
          <div className="space-y-3">
            {openRoles.map((role: { id: string; title: string; description: string | null; skills: string[] | null; commitment_hours: number | null; compensation_type: string | null }) => (
              <div key={role.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{role.title}</h3>
                    {role.description && (
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(role.skills ?? []).map((s: string) => (
                        <span key={s} className="text-xs bg-muted rounded px-1.5 py-0.5">{s}</span>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      {role.commitment_hours && <span>{role.commitment_hours}h/week</span>}
                      {role.compensation_type && <span>{COMP[role.compensation_type as keyof typeof COMP]}</span>}
                    </div>
                  </div>
                  {user && !isFounder && (
                    <ApplyButton roleId={role.id} userId={user.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      {(project.website_url || project.github_url) && (
        <section className="flex gap-4 text-sm">
          {project.website_url && (
            <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground underline">
              Website
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground underline">
              GitHub
            </a>
          )}
        </section>
      )}
    </div>
  );
}
