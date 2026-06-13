import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const STAGE_LABELS: Record<string, string> = {
  idea: "Idea", prototype: "Prototype", mvp: "MVP", growth: "Growth",
};
const STAGE_COLORS: Record<string, string> = {
  idea: "text-amber-300 bg-amber-900/25 ring-1 ring-amber-700/40",
  prototype: "text-sky-300 bg-sky-900/25 ring-1 ring-sky-700/40",
  mvp: "text-violet-300 bg-violet-900/25 ring-1 ring-violet-700/40",
  growth: "text-emerald-300 bg-emerald-900/25 ring-1 ring-emerald-700/40",
};

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio")
    .eq("username", username)
    .single();
  if (!profile) return { title: "User not found — Ensombly" };
  const name = profile.full_name ?? username;
  const description = profile.bio ?? `Projects and profile of @${username} on Ensombly.`;
  return {
    title: `${name} (@${username})`,
    description,
    openGraph: {
      title: `${name} (@${username}) — Ensombly`,
      description,
      url: `/u/${username}`,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${name} (@${username})`,
      description,
    },
    alternates: { canonical: `/u/${username}` },
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, bio, avatar_url, is_verified, skills, github_url, linkedin_url, website_url")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, tagline, stage, sector, archived_at")
    .eq("founder_id", profile.id)
    .order("created_at", { ascending: false });

  const displayName = profile.full_name ?? profile.username;
  const initials = displayName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Profile header */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center shrink-0 select-none">
          {initials}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            {profile.is_verified && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-sky-300 bg-sky-900/25 ring-1 ring-sky-700/40">
                ✓ Verified
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
          {profile.bio && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-md">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* Skills */}
      {(profile.skills ?? []).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(profile.skills as string[]).map((s) => (
            <span key={s} className="text-xs border border-border rounded-full px-3 py-1 bg-secondary/50 text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      {(profile.github_url || profile.linkedin_url || profile.website_url) && (
        <div className="flex flex-wrap gap-3 text-sm">
          {profile.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
              GitHub
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
              LinkedIn
            </a>
          )}
          {profile.website_url && (
            <a href={profile.website_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              🌐 Website
            </a>
          )}
        </div>
      )}

      {/* Founded projects */}
      {(projects?.length ?? 0) > 0 && (
        <section>
          <h2 className="font-semibold text-base mb-3">
            Projects{" "}
            <span className="text-xs font-normal text-muted-foreground ml-1">({projects!.length})</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {projects!.map((p) => {
              const stageColor = STAGE_COLORS[p.stage ?? "idea"] ?? STAGE_COLORS.idea;
              return (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="border border-border rounded-xl p-4 bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-px transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm">{p.title}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      {p.archived_at && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full text-muted-foreground bg-muted">Archived</span>
                      )}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stageColor}`}>
                        {STAGE_LABELS[p.stage ?? "idea"]}
                      </span>
                    </div>
                  </div>
                  {p.tagline && <p className="text-xs text-muted-foreground line-clamp-2">{p.tagline}</p>}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
